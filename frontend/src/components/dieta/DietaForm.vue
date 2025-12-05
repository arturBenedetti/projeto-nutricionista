<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue";
import { loggedUser } from "../../services/UsuarioService";

const props = defineProps({ dieta: Object });
const emit = defineEmits(["cancel", "saved"]);

const DIAS_SEMANA = [
  { valor: 0, nome: "Domingo" },
  { valor: 1, nome: "Segunda-feira" },
  { valor: 2, nome: "Terça-feira" },
  { valor: 3, nome: "Quarta-feira" },
  { valor: 4, nome: "Quinta-feira" },
  { valor: 5, nome: "Sexta-feira" },
  { valor: 6, nome: "Sábado" },
];

const TIPOS_REFEICAO = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

const localDieta = ref({
  idPaciente: "",
  dataInicio: "",
  dataFim: "",
  descricao: "",
  observacoes: "",
  planosRefeicao: [], // Array de planos de refeições por dia
});

const pacientes = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Estados para busca de alimentos (um para cada refeição)
const buscaAlimento = ref({}); // { "diaSemana-indexRefeicao": "termo" }
const resultadosBusca = ref({}); // { "diaSemana-indexRefeicao": [...] }
const buscandoAlimentos = ref({}); // { "diaSemana-indexRefeicao": boolean }

onMounted(async () => {
  await fetchPacientes();
});

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
    errorMessage.value = "Erro ao carregar lista de pacientes";
  }
}

const dietaId = ref("");

// Função para converter data ISO para formato YYYY-MM-DD
function formatarDataParaInput(dataString) {
  if (!dataString) return "";
  try {
    // Se a string já está no formato YYYY-MM-DD, retorna diretamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
      return dataString;
    }

    // Tenta extrair diretamente da string ISO (formato: YYYY-MM-DDTHH:mm:ss.sssZ)
    const isoMatch = dataString.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      return isoMatch[1];
    }

    // Se não conseguir extrair diretamente, usa Date
    const date = new Date(dataString);
    if (isNaN(date.getTime())) return "";

    // Usa UTC para evitar problemas de timezone
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error, dataString);
    return "";
  }
}

watch(
  () => props.dieta,
  async (newVal) => {
    if (newVal) {
      dietaId.value = newVal.id || "";
      // Faz uma cópia profunda para poder modificar os alimentos
      localDieta.value = {
        idPaciente: newVal.idPaciente || "",
        // Converte as datas do formato ISO para YYYY-MM-DD
        dataInicio: formatarDataParaInput(newVal.dataInicio) || "",
        dataFim: formatarDataParaInput(newVal.dataFim) || "",
        descricao: newVal.descricao || "",
        observacoes: newVal.observacoes || "",
        planosRefeicao: JSON.parse(JSON.stringify(newVal.planosRefeicao || [])),
      };
      // Aguarda o próximo tick do Vue para garantir que a reatividade foi aplicada
      await nextTick();
      // Busca informações nutricionais dos alimentos se não estiverem disponíveis
      await enriquecerAlimentosComNutrientes();
    } else {
      dietaId.value = "";
      localDieta.value = {
        idPaciente: "",
        dataInicio: "",
        dataFim: "",
        descricao: "",
        observacoes: "",
        planosRefeicao: [],
      };
    }
  },
  { immediate: true }
);

// Funções para gerenciar planos de refeições
function getPlanoPorDia(diaSemana) {
  return localDieta.value.planosRefeicao.find((p) => p.diaSemana === diaSemana);
}

function criarOuObterPlano(diaSemana) {
  let plano = getPlanoPorDia(diaSemana);
  if (!plano) {
    plano = {
      diaSemana,
      refeicoes: [],
    };
    localDieta.value.planosRefeicao.push(plano);
  }
  return plano;
}

function adicionarRefeicao(diaSemana) {
  const plano = criarOuObterPlano(diaSemana);
  plano.refeicoes.push({
    nome: "",
    alimentos: [],
    observacao: "",
  });
}

function removerRefeicao(diaSemana, indexRefeicao) {
  const plano = getPlanoPorDia(diaSemana);
  if (plano) {
    plano.refeicoes.splice(indexRefeicao, 1);
    // Remove o plano se não tiver mais refeições
    if (plano.refeicoes.length === 0) {
      const indexPlano = localDieta.value.planosRefeicao.indexOf(plano);
      if (indexPlano > -1) {
        localDieta.value.planosRefeicao.splice(indexPlano, 1);
      }
    }
  }
}

// Funções para buscar e adicionar alimentos
function getBuscaKey(diaSemana, indexRefeicao) {
  return `${diaSemana}-${indexRefeicao}`;
}

async function buscarAlimentos(diaSemana, indexRefeicao, inputElement = null) {
  const key = getBuscaKey(diaSemana, indexRefeicao);
  const termo = buscaAlimento.value[key] || "";

  if (!termo || termo.trim().length < 2) {
    resultadosBusca.value[key] = [];
    return;
  }

  // Salva o elemento de input para restaurar o foco depois
  const inputRef = inputElement;

  buscandoAlimentos.value[key] = true;
  try {
    const response = await window.api.buscarAlimentos(termo);
    if (response && response.alimentos) {
      resultadosBusca.value[key] = response.alimentos;
    } else {
      resultadosBusca.value[key] = [];
    }
  } catch (error) {
    console.error("Erro ao buscar alimentos:", error);
    resultadosBusca.value[key] = [];
  } finally {
    buscandoAlimentos.value[key] = false;
    // Restaura o foco no campo de input após a busca, se ainda estiver montado
    if (inputRef && document.activeElement !== inputRef) {
      // Usa nextTick para garantir que o DOM foi atualizado
      await nextTick();
      // Verifica se o elemento ainda existe no DOM antes de focar
      if (document.body.contains(inputRef)) {
        inputRef.focus();
      }
    }
  }
}

function adicionarAlimento(diaSemana, indexRefeicao, alimento) {
  const plano = getPlanoPorDia(diaSemana);
  if (plano && plano.refeicoes[indexRefeicao]) {
    plano.refeicoes[indexRefeicao].alimentos.push({
      idAlimento: alimento.id,
      nomeAlimento: alimento.nome,
      quantidade: 100, // quantidade padrão em gramas
      // Armazena informações nutricionais por 100g para cálculo
      energiaKcal: alimento.energiaKcal || 0,
      carboidratos: alimento.carboidratos || 0,
      proteinas: alimento.proteinas || 0,
      gorduras: alimento.gorduras || 0,
    });
    const key = getBuscaKey(diaSemana, indexRefeicao);
    buscaAlimento.value[key] = "";
    resultadosBusca.value[key] = [];
  }
}

function removerAlimento(diaSemana, indexRefeicao, indexAlimento) {
  const plano = getPlanoPorDia(diaSemana);
  if (plano && plano.refeicoes[indexRefeicao]) {
    plano.refeicoes[indexRefeicao].alimentos.splice(indexAlimento, 1);
  }
}

// Função para buscar informações nutricionais dos alimentos que não as têm
async function enriquecerAlimentosComNutrientes() {
  if (!localDieta.value?.planosRefeicao) return;

  // Coleta todos os alimentos únicos que precisam de informações nutricionais
  const alimentosParaBuscar = new Map();

  for (const plano of localDieta.value.planosRefeicao) {
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
      }
    } catch (error) {
      console.error(`Erro ao buscar nutrientes para ${nomeAlimento}:`, error);
    }
  }

  // Aplica as informações nutricionais encontradas aos alimentos
  let nutrientesAplicados = 0;
  for (const plano of localDieta.value.planosRefeicao) {
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
          }
        }
      }
    }
  }

  // Força atualização reativa se nutrientes foram aplicados
  if (nutrientesAplicados > 0) {
    localDieta.value = { ...localDieta.value };
  }
}

function validateForm() {
  if (!localDieta.value.idPaciente) {
    errorMessage.value = "Selecione um paciente";
    return false;
  }
  if (!localDieta.value.dataInicio) {
    errorMessage.value = "Data de início é obrigatória";
    return false;
  }
  if (!localDieta.value.dataFim) {
    errorMessage.value = "Data de fim é obrigatória";
    return false;
  }
  if (!localDieta.value.descricao) {
    errorMessage.value = "Descrição é obrigatória";
    return false;
  }

  const dataInicio = new Date(localDieta.value.dataInicio);
  const dataFim = new Date(localDieta.value.dataFim);

  if (dataFim <= dataInicio) {
    errorMessage.value = "Data de fim deve ser posterior à data de início";
    return false;
  }

  // Valida se todas as refeições têm nome
  for (const plano of localDieta.value.planosRefeicao) {
    for (const refeicao of plano.refeicoes) {
      if (!refeicao.nome || refeicao.nome.trim() === "") {
        errorMessage.value = "Todas as refeições devem ter um nome";
        return false;
      }
    }
  }

  return true;
}

async function save() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Serializa os dados para evitar problemas com objetos reativos do Vue
    // que não podem ser clonados pelo IPC do Electron
    const planosRefeicaoSerializados = localDieta.value.planosRefeicao.map(
      (plano) => ({
        ...(plano.id && { id: plano.id }),
        diaSemana: plano.diaSemana,
        refeicoes: plano.refeicoes.map((refeicao) => ({
          ...(refeicao.id && { id: refeicao.id }),
          nome: refeicao.nome,
          alimentos: refeicao.alimentos.map((alimento) => ({
            idAlimento: alimento.idAlimento,
            quantidade: Number(alimento.quantidade),
            ...(alimento.nomeAlimento && {
              nomeAlimento: alimento.nomeAlimento,
            }),
          })),
          ...(refeicao.observacao && { observacao: refeicao.observacao }),
        })),
      })
    );

    const isEditando = !!dietaId.value;

    const dadosDieta = {
      idNutricionista: loggedUser.value.id,
      idPaciente: localDieta.value.idPaciente,
      dataInicio: localDieta.value.dataInicio,
      dataFim: localDieta.value.dataFim,
      descricao: localDieta.value.descricao,
      ...(localDieta.value.observacoes && {
        observacoes: localDieta.value.observacoes,
      }),
      ...(planosRefeicaoSerializados.length > 0 && {
        planosRefeicao: planosRefeicaoSerializados,
      }),
    };

    let dietaSalva;
    if (isEditando) {
      // Atualiza dieta existente
      dietaSalva = await window.api.atualizarDieta({
        ...dadosDieta,
        id: dietaId.value,
      });
      successMessage.value = "Dieta atualizada com sucesso!";
    } else {
      // Cria nova dieta
      dietaSalva = await window.api.criarDieta(dadosDieta);
      successMessage.value = "Dieta criada com sucesso!";
    }

    // Limpar formulário
    dietaId.value = "";
    localDieta.value = {
      idPaciente: "",
      dataInicio: "",
      dataFim: "",
      descricao: "",
      observacoes: "",
      planosRefeicao: [],
    };

    setTimeout(() => {
      emit("saved", dietaSalva);
    }, 1500);
  } catch (error) {
    console.error("Erro ao criar dieta:", error);
    errorMessage.value = "Erro ao criar dieta. Tente novamente.";
  } finally {
    loading.value = false;
  }
}

function cancel() {
  emit("cancel");
}

// Função para calcular valores nutricionais baseado na quantidade
function calcularValorNutricional(valorPor100g, quantidade) {
  if (!valorPor100g || !quantidade) return 0;
  return (valorPor100g * quantidade) / 100;
}

// Calcula totais nutricionais para um dia específico
function calcularTotaisDia(diaSemana) {
  const plano = getPlanoPorDia(diaSemana);
  if (!plano || !plano.refeicoes) {
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
    if (refeicao.alimentos && refeicao.alimentos.length > 0) {
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
    }
  });

  return {
    calorias: Math.round(totalCalorias * 10) / 10,
    carboidratos: Math.round(totalCarboidratos * 10) / 10,
    proteinas: Math.round(totalProteinas * 10) / 10,
    gorduras: Math.round(totalGorduras * 10) / 10,
  };
}
</script>

<template>
  <form
    @submit.prevent="save"
    class="bg-[#111827] shadow rounded p-6 w-full max-w-none"
  >
    <h3 class="text-xl font-semibold mb-4 text-white">
      {{ dieta ? "Editar Dieta" : "Nova Dieta" }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Seleção de Paciente -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Paciente *
        </label>
        <select
          v-model="localDieta.idPaciente"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          :disabled="loading"
        >
          <option value="">Selecione um paciente</option>
          <option
            v-for="paciente in pacientes"
            :key="paciente.id"
            :value="paciente.id"
          >
            {{ paciente.nome }}
          </option>
        </select>
      </div>

      <!-- Data de Início -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Data de Início *
        </label>
        <input
          type="date"
          v-model="localDieta.dataInicio"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          :disabled="loading"
        />
      </div>

      <!-- Data de Fim -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Data de Fim *
        </label>
        <input
          type="date"
          v-model="localDieta.dataFim"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          :disabled="loading"
        />
      </div>

      <!-- Descrição -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Descrição da Dieta *
        </label>
        <textarea
          v-model="localDieta.descricao"
          rows="4"
          placeholder="Descreva os detalhes da dieta..."
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Observações -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Observações
        </label>
        <textarea
          v-model="localDieta.observacoes"
          rows="3"
          placeholder="Observações adicionais (opcional)..."
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Planos de Refeições por Dia da Semana -->
      <div class="md:col-span-2 mt-6">
        <h4 class="text-lg font-semibold text-white mb-4">
          Planos Alimentar por Dia da Semana
        </h4>

        <div class="space-y-6">
          <div
            v-for="dia in DIAS_SEMANA"
            :key="dia.valor"
            class="border border-gray-600 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-md font-medium text-white">{{ dia.nome }}</h5>
              <button
                type="button"
                @click="adicionarRefeicao(dia.valor)"
                class="text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                :disabled="loading"
              >
                + Adicionar Refeição
              </button>
            </div>

            <!-- Totais Nutricionais do Dia -->
            <div
              v-if="
                getPlanoPorDia(dia.valor) &&
                getPlanoPorDia(dia.valor).refeicoes &&
                getPlanoPorDia(dia.valor).refeicoes.length > 0
              "
              class="mb-3 p-3 bg-teal-900/30 border border-teal-700/50 rounded-lg"
            >
              <h6 class="text-sm font-semibold text-teal-300 mb-2">
                Totais do Dia
              </h6>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span class="text-gray-400">Calorias:</span>
                  <p class="text-white font-medium">
                    {{ calcularTotaisDia(dia.valor).calorias }} kcal
                  </p>
                </div>
                <div>
                  <span class="text-gray-400">Carboidratos:</span>
                  <p class="text-white font-medium">
                    {{ calcularTotaisDia(dia.valor).carboidratos }}g
                  </p>
                </div>
                <div>
                  <span class="text-gray-400">Proteínas:</span>
                  <p class="text-white font-medium">
                    {{ calcularTotaisDia(dia.valor).proteinas }}g
                  </p>
                </div>
                <div>
                  <span class="text-gray-400">Gorduras:</span>
                  <p class="text-white font-medium">
                    {{ calcularTotaisDia(dia.valor).gorduras }}g
                  </p>
                </div>
              </div>
            </div>

            <!-- Lista de Refeições do Dia -->
            <div
              v-if="getPlanoPorDia(dia.valor)"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3"
            >
              <div
                v-for="(refeicao, indexRefeicao) in getPlanoPorDia(dia.valor)
                  .refeicoes"
                :key="indexRefeicao"
                class="bg-gray-800 rounded p-4 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <select
                    v-model="refeicao.nome"
                    class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mr-2"
                    :disabled="loading"
                  >
                    <option value="">Selecione o tipo de refeição</option>
                    <option
                      v-for="tipo in TIPOS_REFEICAO"
                      :key="tipo"
                      :value="tipo"
                    >
                      {{ tipo }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="removerRefeicao(dia.valor, indexRefeicao)"
                    class="text-red-400 hover:text-red-300 px-2"
                    :disabled="loading"
                  >
                    ✕
                  </button>
                </div>

                <!-- Busca de Alimentos -->
                <div class="relative">
                  <input
                    type="text"
                    :value="
                      buscaAlimento[`${dia.valor}-${indexRefeicao}`] || ''
                    "
                    @input="
                      (e) => {
                        const key = `${dia.valor}-${indexRefeicao}`;
                        const inputElement = e.target;
                        buscaAlimento[key] = inputElement.value;
                        buscarAlimentos(dia.valor, indexRefeicao, inputElement);
                      }
                    "
                    placeholder="Buscar alimento..."
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    :disabled="loading"
                  />
                  <!-- Indicador de busca -->
                  <div
                    v-if="buscandoAlimentos[`${dia.valor}-${indexRefeicao}`]"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  >
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"
                    ></div>
                  </div>
                  <div
                    v-if="
                      (resultadosBusca[`${dia.valor}-${indexRefeicao}`] || [])
                        .length > 0
                    "
                    class="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded max-h-48 overflow-y-auto"
                  >
                    <button
                      type="button"
                      v-for="alimento in resultadosBusca[
                        `${dia.valor}-${indexRefeicao}`
                      ] || []"
                      :key="alimento.id"
                      @click="
                        adicionarAlimento(dia.valor, indexRefeicao, alimento)
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-600 text-white border-b border-gray-600 last:border-0"
                    >
                      {{ alimento.nome }}
                    </button>
                  </div>
                </div>

                <!-- Lista de Alimentos da Refeição -->
                <div v-if="refeicao.alimentos.length > 0" class="space-y-2">
                  <div
                    v-for="(alimento, indexAlimento) in refeicao.alimentos"
                    :key="indexAlimento"
                    class="flex items-center gap-2 bg-gray-700 rounded p-2"
                  >
                    <span class="flex-1 text-white text-sm">
                      {{ alimento.nomeAlimento }}
                    </span>
                    <input
                      type="number"
                      v-model.number="alimento.quantidade"
                      min="1"
                      step="1"
                      placeholder="Qtd (g)"
                      class="w-24 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      :disabled="loading"
                    />
                    <span class="text-gray-400 text-sm">g</span>
                    <button
                      type="button"
                      @click="
                        removerAlimento(dia.valor, indexRefeicao, indexAlimento)
                      "
                      class="text-red-400 hover:text-red-300 px-2"
                      :disabled="loading"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <!-- Observação da Refeição -->
                <div>
                  <textarea
                    v-model="refeicao.observacao"
                    rows="2"
                    placeholder="Observações sobre esta refeição (opcional)..."
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    :disabled="loading"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensagens de erro e sucesso -->
    <div
      v-if="errorMessage"
      class="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-300"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="successMessage"
      class="mt-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-300"
    >
      {{ successMessage }}
    </div>

    <!-- Botões -->
    <div class="flex gap-3 mt-6">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        {{ loading ? "Salvando..." : "Salvar" }}
      </button>

      <button
        type="button"
        @click="cancel"
        :disabled="loading"
        class="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
input,
select,
textarea {
  color-scheme: dark;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
}
</style>
