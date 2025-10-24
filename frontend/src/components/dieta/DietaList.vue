<script setup>
import { ref, onMounted } from "vue"
import { loggedUser } from "../../services/UsuarioService"

const emit = defineEmits(["add", "edit", "view", "delete"])

const dietas = ref([])
const loading = ref(false)
const pacientes = ref([])

onMounted(async () => {
  await fetchPacientes()
  await fetchData()
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

async function fetchData() {
  loading.value = true
  try {
    const response = await window.api.listarDietas({
      idNutricionista: loggedUser.value.id,
    })

    if (response && response.dietas) {
      dietas.value = response.dietas
    } else {
      console.error("Erro ao listar dietas:", response)
    }
  } catch (error) {
    console.error("Erro ao buscar dietas:", error)
  } finally {
    loading.value = false
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

function onAdd() {
  emit("add")
}

function onEdit(dieta) {
  emit("edit", dieta)
}

function onView(dieta) {
  emit("view", dieta)
}

function onDelete(dieta) {
  emit("delete", dieta)
}
</script>

<template>
  <div class="bg-[#111827] shadow rounded p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Dietas Cadastradas</h2>
      <button
        @click="onAdd"
        class="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        + Nova Dieta
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-400">Carregando dietas...</div>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="dietas.length === 0" class="text-center py-8">
      <div class="text-gray-400 mb-4">Nenhuma dieta cadastrada</div>
      <button
        @click="onAdd"
        class="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Criar primeira dieta
      </button>
    </div>

    <!-- Lista de dietas -->
    <div v-else class="space-y-4">
      <div
        v-for="dieta in dietas"
        :key="dieta.id"
        class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-2">
              {{ getPacienteNome(dieta.idPaciente) }}
            </h3>

            <div class="text-sm text-gray-300 mb-2">
              <div class="mb-1">
                <span class="font-medium">Período:</span>
                {{ formatDateRange(dieta.dataInicio, dieta.dataFim) }}
              </div>

              <div class="mb-1">
                <span class="font-medium">Descrição:</span>
                {{ dieta.descricao }}
              </div>

              <div v-if="dieta.observacoes" class="mb-1">
                <span class="font-medium">Observações:</span>
                {{ dieta.observacoes }}
              </div>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="flex gap-2 ml-4">
            <button
              @click="onView(dieta)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
              title="Visualizar"
            >
              👁️
            </button>

            <button
              @click="onEdit(dieta)"
              class="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded transition-colors"
              title="Editar"
            >
              ✏️
            </button>

            <button
              @click="onDelete(dieta)"
              class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition-colors"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover\:bg-gray-750:hover {
  background-color: #374151;
}
</style>
