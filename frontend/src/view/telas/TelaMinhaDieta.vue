<script setup>
import { ref, computed, onMounted } from "vue";
import { loggedUser } from "../../services/UsuarioService";

const dieta = ref(null);
const loading = ref(true);
const errorMessage = ref("");

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
  await buscarDieta();
});

async function buscarDieta() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await window.api.buscarDietaPaciente({
      idUsuario: loggedUser.value.id,
    });

    if (response) {
      dieta.value = response;
    } else {
      errorMessage.value = "Nenhuma dieta válida encontrada no momento.";
    }
  } catch (error) {
    console.error("Erro ao buscar dieta:", error);
    errorMessage.value = "Erro ao carregar sua dieta. Tente novamente.";
  } finally {
    loading.value = false;
  }
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

const sortedPlanosRefeicao = computed(() => {
  if (!dieta.value?.planosRefeicao) return [];
  return [...dieta.value.planosRefeicao].sort(
    (a, b) => a.diaSemana - b.diaSemana
  );
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-white">Minha Dieta</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-400">Carregando sua dieta...</div>
    </div>

    <!-- Erro ou sem dieta -->
    <div
      v-else-if="errorMessage || !dieta"
      class="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center"
    >
      <p class="text-gray-300">{{ errorMessage || "Nenhuma dieta encontrada" }}</p>
      <p class="text-gray-400 text-sm mt-2">
        Entre em contato com seu nutricionista para mais informações.
      </p>
    </div>

    <!-- Dieta -->
    <div v-else class="space-y-6">
      <!-- Período da Dieta -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Período da Dieta</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
          <div>
            <span class="font-medium">Data de Início:</span>
            <p>{{ formatDate(dieta.dataInicio) }}</p>
          </div>
          <div>
            <span class="font-medium">Data de Fim:</span>
            <p>{{ formatDate(dieta.dataFim) }}</p>
          </div>
          <div>
            <span class="font-medium">Duração:</span>
            <p>{{ calculateDuration(dieta.dataInicio, dieta.dataFim) }}</p>
          </div>
        </div>
      </div>

      <!-- Descrição da Dieta -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">
          Descrição da Dieta
        </h3>
        <div class="text-gray-300 whitespace-pre-wrap">
          {{ dieta.descricao }}
        </div>
      </div>

      <!-- Observações -->
      <div
        v-if="dieta.observacoes"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-white mb-3">Observações</h3>
        <div class="text-gray-300 whitespace-pre-wrap">
          {{ dieta.observacoes }}
        </div>
      </div>

      <!-- Planos de Refeições -->
      <div
        v-if="dieta.planosRefeicao && dieta.planosRefeicao.length > 0"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-white mb-4">
          Planos de Refeições
        </h3>

        <div class="space-y-6">
          <div
            v-for="plano in sortedPlanosRefeicao"
            :key="plano.id || plano.diaSemana"
            class="border border-gray-600 rounded-lg p-4"
          >
            <h4 class="text-md font-semibold text-teal-400 mb-3">
              {{ getNomeDiaSemana(plano.diaSemana) }}
            </h4>

            <div
              v-if="plano.refeicoes && plano.refeicoes.length > 0"
              class="space-y-4"
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
      <div
        v-else
        class="bg-gray-800 border border-gray-700 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold text-white mb-3">
          Planos de Refeições
        </h3>
        <p class="text-gray-400 italic">
          Nenhum plano de refeição cadastrado para esta dieta
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>


