<script setup>
import { ref, watch, onMounted } from "vue"
import { loggedUser } from "../../services/UsuarioService"

const props = defineProps({ dieta: Object })
const emit = defineEmits(["cancel", "saved"])

const localDieta = ref({
  idPaciente: "",
  dataInicio: "",
  dataFim: "",
  descricao: "",
  observacoes: "",
})

const pacientes = ref([])
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

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
    errorMessage.value = "Erro ao carregar lista de pacientes"
  }
}

watch(
  () => props.dieta,
  (newVal) => {
    localDieta.value = newVal
      ? { ...newVal }
      : {
          idPaciente: "",
          dataInicio: "",
          dataFim: "",
          descricao: "",
          observacoes: "",
        }
  },
  { immediate: true }
)

function validateForm() {
  if (!localDieta.value.idPaciente) {
    errorMessage.value = "Selecione um paciente"
    return false
  }
  if (!localDieta.value.dataInicio) {
    errorMessage.value = "Data de início é obrigatória"
    return false
  }
  if (!localDieta.value.dataFim) {
    errorMessage.value = "Data de fim é obrigatória"
    return false
  }
  if (!localDieta.value.descricao) {
    errorMessage.value = "Descrição é obrigatória"
    return false
  }

  const dataInicio = new Date(localDieta.value.dataInicio)
  const dataFim = new Date(localDieta.value.dataFim)

  if (dataFim <= dataInicio) {
    errorMessage.value = "Data de fim deve ser posterior à data de início"
    return false
  }

  return true
}

async function save() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ""
  successMessage.value = ""

  try {
    const novaDieta = {
      idNutricionista: loggedUser.value.id,
      idPaciente: localDieta.value.idPaciente,
      dataInicio: localDieta.value.dataInicio,
      dataFim: localDieta.value.dataFim,
      descricao: localDieta.value.descricao,
      observacoes: localDieta.value.observacoes,
    }

    await window.api.criarDieta(novaDieta)
    successMessage.value = "Dieta criada com sucesso!"

    // Limpar formulário
    localDieta.value = {
      idPaciente: "",
      dataInicio: "",
      dataFim: "",
      descricao: "",
      observacoes: "",
    }

    setTimeout(() => {
      emit("saved")
    }, 1500)
  } catch (error) {
    console.error("Erro ao criar dieta:", error)
    errorMessage.value = "Erro ao criar dieta. Tente novamente."
  } finally {
    loading.value = false
  }
}

function cancel() {
  emit("cancel")
}
</script>

<template>
  <form @submit.prevent="save" class="bg-[#111827] shadow rounded p-6">
    <h3 class="text-xl font-semibold mb-4 text-white">
      {{ dieta ? "Editar Dieta" : "Nova Dieta" }}
    </h3>

    <div class="space-y-4">
      <!-- Seleção de Paciente -->
      <div>
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
      <div>
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
      <div>
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
