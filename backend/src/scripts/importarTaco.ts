import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { connectMongo } from "../infrastructure/db/mongo";
import { CategoriaAlimentoRepository } from "../infrastructure/repositories/CategoriaAlimentoRepository";
import { AlimentoRepository } from "../infrastructure/repositories/AlimentoRepository";
import { CategoriaAlimento } from "../domain/entities/CategoriaAlimento";
import { Alimento } from "../domain/entities/Alimento";

interface TacoRow {
  numero: string;
  categoria: string;
  descricao: string;
  energiaKcal: string;
  energiaKJ: string;
  proteina: string;
  lipideos: string;
  carboidrato: string;
  fibraAlimentar: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ";" && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseNumber(value: string): number {
  // Substitui vírgula por ponto e converte para número
  const cleaned = value.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Importa dados do TACO para o MongoDB
 * @param db - Instância do banco de dados MongoDB (opcional, se não fornecido, conecta automaticamente)
 * @param silent - Se true, reduz a verbosidade dos logs (útil para execução automática)
 * @returns Promise<boolean> - true se importou dados, false se já existiam dados
 */
export async function importarTaco(db?: any, silent: boolean = false): Promise<boolean> {
  try {
    let dbInstance = db;
    
    if (!dbInstance) {
      if (!silent) console.log("Conectando ao MongoDB...");
      dbInstance = await connectMongo();
      if (!silent) console.log("Conectado com sucesso!");
    }

    const categoriaRepo = new CategoriaAlimentoRepository(dbInstance);
    const alimentoRepo = new AlimentoRepository(dbInstance);

    // Verifica se já existem dados
    const categoriasExistentes = await categoriaRepo.findAll();
    if (categoriasExistentes.length > 0) {
      if (!silent) {
        console.log("⚠️  Já existem categorias no banco de dados.");
        console.log("Deseja continuar mesmo assim? (Isso pode criar duplicatas)");
        console.log("Para limpar os dados primeiro, delete as coleções 'categorias_alimentos' e 'alimentos'");
      }
      return false;
    }

    // O arquivo CSV pode estar em diferentes locais dependendo do contexto:
    // - Em desenvolvimento: src/assets/
    // - Após compilação: dist/assets/ (copiado pelo build)
    // - Quando executado do Electron: pode estar em diferentes locais
    let csvPath = path.join(__dirname, "../assets/Taco-4a-Edicao-tratada.CSV"); // dist/assets (após build)
    
    // Se não encontrar, tenta caminhos alternativos
    if (!fs.existsSync(csvPath)) {
      // Tenta src/assets (desenvolvimento)
      csvPath = path.join(__dirname, "../../src/assets/Taco-4a-Edicao-tratada.CSV");
    }
    
    if (!fs.existsSync(csvPath)) {
      // Tenta a partir do diretório de trabalho atual
      csvPath = path.join(process.cwd(), "src/assets/Taco-4a-Edicao-tratada.CSV");
    }
    
    if (!fs.existsSync(csvPath)) {
      // Tenta a partir do diretório backend (caso esteja rodando do Electron)
      csvPath = path.join(process.cwd(), "backend/src/assets/Taco-4a-Edicao-tratada.CSV");
    }
    
    if (!fs.existsSync(csvPath)) {
      // Tenta dist/assets a partir do diretório de trabalho
      csvPath = path.join(process.cwd(), "backend/dist/assets/Taco-4a-Edicao-tratada.CSV");
    }
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`Arquivo CSV não encontrado. Tentou vários caminhos. Verifique se o arquivo Taco-4a-Edicao-tratada.CSV está em src/assets/`);
    }
    
    if (!silent) console.log(`Lendo arquivo CSV: ${csvPath}`);

    // Lê o arquivo com encoding latin1 para lidar com caracteres especiais
    const fileContent = fs.readFileSync(csvPath, "utf8");
    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      throw new Error("Arquivo CSV vazio ou inválido");
    }

    // Pula o cabeçalho
    const dataLines = lines.slice(1);

    if (!silent) console.log(`Processando ${dataLines.length} linhas...`);

    // Mapa para armazenar categorias únicas
    const categoriasMap = new Map<string, { id: string; nome: string; ordem: number }>();
    const alimentos: Alimento[] = [];

    let ordemCategoria = 1;

    for (const line of dataLines) {
      const columns = parseCSVLine(line);
      
      if (columns.length < 9) {
        console.warn(`Linha ignorada (colunas insuficientes): ${line.substring(0, 50)}...`);
        continue;
      }

      const row: TacoRow = {
        numero: columns[0] || "",
        categoria: columns[1] || "",
        descricao: columns[2] || "",
        energiaKcal: columns[3] || "0",
        energiaKJ: columns[4] || "0",
        proteina: columns[5] || "0",
        lipideos: columns[6] || "0",
        carboidrato: columns[7] || "0",
        fibraAlimentar: columns[8] || "0",
      };

      // Cria ou obtém categoria
      if (!categoriasMap.has(row.categoria)) {
        const categoriaId = uuidv4();
        categoriasMap.set(row.categoria, {
          id: categoriaId,
          nome: row.categoria,
          ordem: ordemCategoria++,
        });
      }

      const categoria = categoriasMap.get(row.categoria)!;

      // Cria alimento
      const alimento = new Alimento(
        uuidv4(),
        row.descricao,
        categoria.id,
        parseNumber(row.energiaKcal),
        parseNumber(row.carboidrato),
        parseNumber(row.proteina),
        parseNumber(row.lipideos),
        parseNumber(row.fibraAlimentar)
      );

      alimentos.push(alimento);
    }

    if (!silent) {
      console.log(`\nEncontradas ${categoriasMap.size} categorias únicas:`);
      Array.from(categoriasMap.values()).forEach((cat) => {
        console.log(`  - ${cat.nome}`);
      });
      console.log(`\nTotal de ${alimentos.length} alimentos para importar`);
    }

    // Insere categorias
    if (!silent) console.log("\nInserindo categorias no banco...");
    const categorias = Array.from(categoriasMap.values()).map(
      (cat) => new CategoriaAlimento(cat.id, cat.nome, cat.ordem)
    );
    await categoriaRepo.insertMany(categorias);
    if (!silent) console.log(`✅ ${categorias.length} categorias inseridas!`);

    // Insere alimentos em lotes para melhor performance
    if (!silent) console.log("\nInserindo alimentos no banco...");
    const batchSize = 100;
    for (let i = 0; i < alimentos.length; i += batchSize) {
      const batch = alimentos.slice(i, i + batchSize);
      await alimentoRepo.insertMany(batch);
      if (!silent && (i % 500 === 0 || i + batchSize >= alimentos.length)) {
        console.log(`  Processados ${Math.min(i + batchSize, alimentos.length)}/${alimentos.length} alimentos...`);
      }
    }

    if (!silent) {
      console.log(`\n✅ Importação concluída com sucesso!`);
      console.log(`   - ${categorias.length} categorias importadas`);
      console.log(`   - ${alimentos.length} alimentos importados`);
    } else {
      console.log(`✅ Dados TACO importados: ${categorias.length} categorias, ${alimentos.length} alimentos`);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Erro durante a importação:", error);
    if (!db) {
      // Só faz exit se foi chamado como script standalone
      process.exit(1);
    }
    throw error;
  }
}

// Função standalone para execução via CLI
async function importarTacoStandalone() {
  try {
    await importarTaco(undefined, false);
    console.log("\n✅ Script finalizado!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  }
}

// Executa a importação apenas se chamado diretamente (não quando importado como módulo)
if (require.main === module) {
  importarTacoStandalone();
}

