<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { loggedUser } from "../../services/UsuarioService";

const props = defineProps({ dieta: Object });
const emit = defineEmits(["close"]);

const pacientes = ref([]);
const loading = ref(false);
const dietaLocal = ref(null);

const DIAS_SEMANA = [
  { valor: 0, nome: "Domingo" },
  { valor: 1, nome: "Segunda-feira" },
  { valor: 2, nome: "Terça-feira" },
  { valor: 3, nome: "Quarta-feira" },
  { valor: 4, nome: "Quinta-feira" },
  { valor: 5, nome: "Sexta-feira" },
  { valor: 6, nome: "Sábado" },
];

onMounted(async () => {
  await fetchPacientes();
});

// Observa mudanças na dieta e busca informações nutricionais
watch(
  () => props.dieta,
  async (newDieta) => {
    if (newDieta) {
      // Faz uma cópia profunda para poder modificar os alimentos
      dietaLocal.value = JSON.parse(JSON.stringify(newDieta));
      // Aguarda o próximo tick do Vue para garantir que a reatividade foi aplicada
      await nextTick();
      await enriquecerAlimentosComNutrientes();
    } else {
      dietaLocal.value = null;
    }
  },
  { immediate: true, deep: true }
);

async function fetchPacientes() {
  try {
    const response = await window.api.listarPacientes({
      idNutricionista: loggedUser.value.id,
    });

    if (response && response.pacientes) {
      pacientes.value = response.pacientes;
    }
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
  }
}

function getPacienteNome(idPaciente) {
  const paciente = pacientes.value.find((p) => p.id === idPaciente);
  return paciente ? paciente.nome : "Paciente não encontrado";
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function formatDateRange(dataInicio, dataFim) {
  return `${formatDate(dataInicio)} - ${formatDate(dataFim)}`;
}

function calculateDuration(dataInicio, dataFim) {
  if (!dataInicio || !dataFim) return "";

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} dias`;
}

function getNomeDiaSemana(diaSemana) {
  const dia = DIAS_SEMANA.find((d) => d.valor === diaSemana);
  return dia ? dia.nome : `Dia ${diaSemana}`;
}

const dietaAtual = computed(() => {
  return dietaLocal.value || props.dieta;
});

const sortedPlanosRefeicao = computed(() => {
  const dieta = dietaAtual.value;
  if (!dieta?.planosRefeicao) return [];
  return [...dieta.planosRefeicao].sort((a, b) => a.diaSemana - b.diaSemana);
});

// Função para buscar informações nutricionais dos alimentos que não as têm
async function enriquecerAlimentosComNutrientes() {
  const dieta = dietaAtual.value;
  if (!dieta?.planosRefeicao) {
    console.log("DietaView: Sem planos de refeição");
    return;
  }

  console.log(
    "DietaView: Iniciando busca de nutrientes",
    dieta.planosRefeicao.length,
    "planos"
  );

  // Coleta todos os alimentos únicos que precisam de informações nutricionais
  const alimentosParaBuscar = new Map();

  for (const plano of dieta.planosRefeicao) {
    if (!plano.refeicoes) continue;

    for (const refeicao of plano.refeicoes) {
      if (!refeicao.alimentos) continue;

      for (const alimento of refeicao.alimentos) {
        // Se o alimento não tem informações nutricionais (undefined, null ou 0), adiciona à lista de busca
        const temNutrientes =
          (alimento.energiaKcal && alimento.energiaKcal > 0) ||
          (alimento.carboidratos && alimento.carboidratos > 0) ||
          (alimento.proteinas && alimento.proteinas > 0) ||
          (alimento.gorduras && alimento.gorduras > 0);

        if (
          !temNutrientes &&
          alimento.nomeAlimento &&
          !alimentosParaBuscar.has(alimento.nomeAlimento)
        ) {
          alimentosParaBuscar.set(alimento.nomeAlimento, []);
        }
      }
    }
  }

  console.log(
    "DietaView: Alimentos para buscar:",
    Array.from(alimentosParaBuscar.keys())
  );

  // Busca informações nutricionais para cada alimento único
  for (const [nomeAlimento, alimentos] of alimentosParaBuscar) {
    try {
      const response = await window.api.buscarAlimentos(nomeAlimento);
      if (response && response.alimentos && response.alimentos.length > 0) {
        // Encontra o alimento exato (comparação case-insensitive)
        const alimentoEncontrado =
          response.alimentos.find(
            (a) => a.nome.toLowerCase() === nomeAlimento.toLowerCase()
          ) || response.alimentos[0];

        // Armazena as informações encontradas
        const nutrientes = {
          energiaKcal: alimentoEncontrado.energiaKcal || 0,
          carboidratos: alimentoEncontrado.carboidratos || 0,
          proteinas: alimentoEncontrado.proteinas || 0,
          gorduras: alimentoEncontrado.gorduras || 0,
        };
        alimentosParaBuscar.set(nomeAlimento, nutrientes);
        console.log(
          `DietaView: Nutrientes encontrados para ${nomeAlimento}:`,
          nutrientes
        );
      } else {
        console.log(`DietaView: Nenhum resultado para ${nomeAlimento}`);
      }
    } catch (error) {
      console.error(`Erro ao buscar nutrientes para ${nomeAlimento}:`, error);
    }
  }

  // Aplica as informações nutricionais encontradas aos alimentos
  let nutrientesAplicados = 0;
  for (const plano of dieta.planosRefeicao) {
    if (!plano.refeicoes) continue;

    for (const refeicao of plano.refeicoes) {
      if (!refeicao.alimentos) continue;

      for (const alimento of refeicao.alimentos) {
        const temNutrientes =
          (alimento.energiaKcal && alimento.energiaKcal > 0) ||
          (alimento.carboidratos && alimento.carboidratos > 0) ||
          (alimento.proteinas && alimento.proteinas > 0) ||
          (alimento.gorduras && alimento.gorduras > 0);

        if (!temNutrientes && alimento.nomeAlimento) {
          const nutrientes = alimentosParaBuscar.get(alimento.nomeAlimento);
          if (
            nutrientes &&
            typeof nutrientes === "object" &&
            nutrientes.energiaKcal !== undefined
          ) {
            // Usa Object.assign para garantir que as propriedades sejam definidas
            Object.assign(alimento, {
              energiaKcal: nutrientes.energiaKcal,
              carboidratos: nutrientes.carboidratos,
              proteinas: nutrientes.proteinas,
              gorduras: nutrientes.gorduras,
            });
            nutrientesAplicados++;
            console.log(
              `DietaView: Aplicados nutrientes a ${alimento.nomeAlimento}:`,
              nutrientes
            );
          }
        }
      }
    }
  }

  // Força atualização reativa
  if (nutrientesAplicados > 0) {
    dietaLocal.value = { ...dietaLocal.value };
    console.log(
      `DietaView: Total de nutrientes aplicados: ${nutrientesAplicados}`
    );
  }
}

// Função para calcular valores nutricionais baseado na quantidade
function calcularValorNutricional(valorPor100g, quantidade) {
  if (!valorPor100g || !quantidade) return 0;
  return (valorPor100g * quantidade) / 100;
}

// Calcula totais nutricionais para uma refeição específica
function calcularTotaisRefeicao(refeicao) {
  if (!refeicao || !refeicao.alimentos || refeicao.alimentos.length === 0) {
    return {
      calorias: 0,
      carboidratos: 0,
      proteinas: 0,
      gorduras: 0,
    };
  }

  let totalCalorias = 0;
  let totalCarboidratos = 0;
  let totalProteinas = 0;
  let totalGorduras = 0;

  refeicao.alimentos.forEach((alimento) => {
    const quantidade = alimento.quantidade || 0;
    totalCalorias += calcularValorNutricional(
      alimento.energiaKcal || 0,
      quantidade
    );
    totalCarboidratos += calcularValorNutricional(
      alimento.carboidratos || 0,
      quantidade
    );
    totalProteinas += calcularValorNutricional(
      alimento.proteinas || 0,
      quantidade
    );
    totalGorduras += calcularValorNutricional(
      alimento.gorduras || 0,
      quantidade
    );
  });

  return {
    calorias: Math.round(totalCalorias * 10) / 10,
    carboidratos: Math.round(totalCarboidratos * 10) / 10,
    proteinas: Math.round(totalProteinas * 10) / 10,
    gorduras: Math.round(totalGorduras * 10) / 10,
  };
}

// Calcula totais nutricionais para um dia específico
function calcularTotaisDia(plano) {
  if (!plano || !plano.refeicoes || plano.refeicoes.length === 0) {
    return {
      calorias: 0,
      carboidratos: 0,
      proteinas: 0,
      gorduras: 0,
    };
  }

  let totalCalorias = 0;
  let totalCarboidratos = 0;
  let totalProteinas = 0;
  let totalGorduras = 0;

  plano.refeicoes.forEach((refeicao) => {
    const totaisRefeicao = calcularTotaisRefeicao(refeicao);
    totalCalorias += totaisRefeicao.calorias;
    totalCarboidratos += totaisRefeicao.carboidratos;
    totalProteinas += totaisRefeicao.proteinas;
    totalGorduras += totaisRefeicao.gorduras;
  });

  return {
    calorias: Math.round(totalCalorias * 10) / 10,
    carboidratos: Math.round(totalCarboidratos * 10) / 10,
    proteinas: Math.round(totalProteinas * 10) / 10,
    gorduras: Math.round(totalGorduras * 10) / 10,
  };
}

function close() {
  emit("close");
}
</script>

<template>
  <div class="bg-[#111827] shadow rounded p-6 w-full max-w-none">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Detalhes da Dieta</h2>
      <button
        @click="close"
        class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        ✕ Fechar
      </button>
    </div>

    <div v-if="dietaAtual" class="space-y-6">
      <!-- Informações do Paciente -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Paciente</h3>
        <p class="text-gray-300">
          {{ getPacienteNome(dietaAtual.idPaciente) }}
        </p>
      </div>

      <!-- Período da Dieta -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Período</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
          <div>
            <span class="font-medium">Data de Início:</span>
            <p>{{ formatDate(dietaAtual.dataInicio) }}</p>
          </div>
          <div>
            <span class="font-medium">Data de Fim:</span>
            <p>{{ formatDate(dietaAtual.dataFim) }}</p>
          </div>
          <div>
            <span class="font-medium">Duração:</span>
            <p>
              {{ calculateDuration(dietaAtual.dataInicio, dietaAtual.dataFim) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Descrição da Dieta -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">
          Descrição da Dieta
        </h3>
        <div class="text-gray-300 whitespace-pre-wrap">
          {{ dietaAtual.descricao }}
        </div>
      </div>

      <!-- Observações -->
      <div
        v-if="dietaAtual.observacoes"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-white mb-3">Observações</h3>
        <div class="text-gray-300 whitespace-pre-wrap">
          {{ dietaAtual.observacoes }}
        </div>
      </div>

      <!-- Planos de Refeições -->
      <div
        v-if="dietaAtual.planosRefeicao && dietaAtual.planosRefeicao.length > 0"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-white mb-4">Plano Alimentar</h3>

        <div class="space-y-6">
          <div
            v-for="plano in sortedPlanosRefeicao"
            :key="plano.id || plano.diaSemana"
            class="border border-gray-600 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-md font-semibold text-teal-400">
                {{ getNomeDiaSemana(plano.diaSemana) }}
              </h4>
              <!-- Totais do Dia -->
              <div
                v-if="plano.refeicoes && plano.refeicoes.length > 0"
                class="flex gap-4 text-sm"
              >
                <div class="text-gray-300">
                  <span class="text-gray-400">Calorias:</span>
                  <span class="font-medium ml-1">
                    {{ calcularTotaisDia(plano).calorias }} kcal
                  </span>
                </div>
                <div class="text-gray-300">
                  <span class="text-gray-400">Carb:</span>
                  <span class="font-medium ml-1">
                    {{ calcularTotaisDia(plano).carboidratos }}g
                  </span>
                </div>
                <div class="text-gray-300">
                  <span class="text-gray-400">Prot:</span>
                  <span class="font-medium ml-1">
                    {{ calcularTotaisDia(plano).proteinas }}g
                  </span>
                </div>
                <div class="text-gray-300">
                  <span class="text-gray-400">Gord:</span>
                  <span class="font-medium ml-1">
                    {{ calcularTotaisDia(plano).gorduras }}g
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="plano.refeicoes && plano.refeicoes.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                v-for="(refeicao, indexRefeicao) in plano.refeicoes"
                :key="refeicao.id || indexRefeicao"
                class="bg-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <h5 class="text-base font-medium text-white">
                    {{ refeicao.nome }}
                  </h5>
                  <!-- Totais da Refeição -->
                  <div
                    v-if="refeicao.alimentos && refeicao.alimentos.length > 0"
                    class="flex gap-3 text-xs text-gray-300"
                  >
                    <span>
                      <span class="text-gray-400">Cal:</span>
                      <span class="font-medium ml-1">
                        {{ calcularTotaisRefeicao(refeicao).calorias }} kcal
                      </span>
                    </span>
                    <span>
                      <span class="text-gray-400">C:</span>
                      <span class="font-medium ml-1">
                        {{ calcularTotaisRefeicao(refeicao).carboidratos }}g
                      </span>
                    </span>
                    <span>
                      <span class="text-gray-400">P:</span>
                      <span class="font-medium ml-1">
                        {{ calcularTotaisRefeicao(refeicao).proteinas }}g
                      </span>
                    </span>
                    <span>
                      <span class="text-gray-400">G:</span>
                      <span class="font-medium ml-1">
                        {{ calcularTotaisRefeicao(refeicao).gorduras }}g
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Alimentos da Refeição -->
                <div
                  v-if="refeicao.alimentos && refeicao.alimentos.length > 0"
                  class="mb-3"
                >
                  <h6 class="text-sm font-medium text-gray-400 mb-2">
                    Ingredientes:
                  </h6>
                  <ul class="space-y-2">
                    <li
                      v-for="(alimento, indexAlimento) in refeicao.alimentos"
                      :key="indexAlimento"
                      class="flex items-center justify-between bg-gray-600 rounded px-3 py-2"
                    >
                      <span class="text-white text-sm flex-1">
                        {{
                          alimento.nomeAlimento ||
                          `Alimento ${alimento.idAlimento}`
                        }}
                      </span>
                      <span class="text-teal-400 text-sm font-medium ml-4">
                        {{ alimento.quantidade }}g
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Observação da Refeição -->
                <div
                  v-if="refeicao.observacao"
                  class="mt-3 pt-3 border-t border-gray-600"
                >
                  <h6 class="text-sm font-medium text-gray-400 mb-1">
                    Observações:
                  </h6>
                  <p class="text-gray-300 text-sm whitespace-pre-wrap">
                    {{ refeicao.observacao }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="text-gray-400 text-sm italic">
              Nenhuma refeição cadastrada para este dia
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não há planos de refeição -->
      <div v-else class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">
          Planos de Refeições
        </h3>
        <p class="text-gray-400 italic">
          Nenhum plano de refeição cadastrado para esta dieta
        </p>
      </div>

      <!-- Informações Adicionais -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">
          Informações Adicionais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <span class="font-medium">ID da Dieta:</span>
            <p class="font-mono text-sm">{{ dietaAtual.id }}</p>
          </div>
          <div>
            <span class="font-medium">Nutricionista:</span>
            <p>{{ loggedUser.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="text-center py-8">
      <div class="text-gray-400">Carregando detalhes da dieta...</div>
    </div>

    <!-- Erro -->
    <div v-else class="text-center py-8">
      <div class="text-red-400">Erro ao carregar detalhes da dieta</div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
