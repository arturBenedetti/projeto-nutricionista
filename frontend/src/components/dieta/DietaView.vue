<script setup>
import { ref, onMounted } from "vue"
import { loggedUser } from "../../services/UsuarioService"

const props = defineProps({ dieta: Object })
const emit = defineEmits(["close"])

const pacientes = ref([])
const loading = ref(false)

onMounted(async () => {
  await fetchPacientes()
})

async function fetchPacientes() {
  try {
    const response = await window.api.listarPacientes({
      idNutricionista: loggedUser.value.id,
    })

    if (response && response.pacientes) {
      pacientes.value = response.pacientes
    }
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)
  }
}

function getPacienteNome(idPaciente) {
  const paciente = pacientes.value.find((p) => p.id === idPaciente)
  return paciente ? paciente.nome : "Paciente não encontrado"
}

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

function formatDateRange(dataInicio, dataFim) {
  return `${formatDate(dataInicio)} - ${formatDate(dataFim)}`
}

function calculateDuration(dataInicio, dataFim) {
  if (!dataInicio || !dataFim) return ""

  const inicio = new Date(dataInicio)
  const fim = new Date(dataFim)
  const diffTime = Math.abs(fim - inicio)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return `${diffDays} dias`
}

function close() {
  emit("close")
}
</script>

<template>
  <div class="bg-[#111827] shadow rounded p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Detalhes da Dieta</h2>
      <button
        @click="close"
        class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        ✕ Fechar
      </button>
    </div>

    <div v-if="dieta" class="space-y-6">
      <!-- Informações do Paciente -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Paciente</h3>
        <p class="text-gray-300">{{ getPacienteNome(dieta.idPaciente) }}</p>
      </div>

      <!-- Período da Dieta -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Período</h3>
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

      <!-- Informações Adicionais -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">
          Informações Adicionais
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <span class="font-medium">ID da Dieta:</span>
            <p class="font-mono text-sm">{{ dieta.id }}</p>
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
