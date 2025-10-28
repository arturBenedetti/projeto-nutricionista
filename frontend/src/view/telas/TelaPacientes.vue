<script setup>
import { ref } from "vue";
import PacienteList from "../../components/paciente/PacienteList.vue";
import PacienteForm from "../../components/paciente/PacienteForm.vue";
import PacienteView from "../../components/paciente/PacienteView.vue";
import { loggedUser } from "../../services/UsuarioService";

const selectedPaciente = ref(null);
const showForm = ref(false);
const viewMode = ref(false);

function onAdd() {
  selectedPaciente.value = null;
  showForm.value = true;
}

function onEdit(paciente) {
  selectedPaciente.value = { ...paciente };
  // Converter a data para o formato YYYY-MM-DD que o input date espera
  if (selectedPaciente.value.dataNascimento instanceof Date) {
    selectedPaciente.value.dataNascimento =
      selectedPaciente.value.dataNascimento.toISOString().split("T")[0];
  } else if (typeof selectedPaciente.value.dataNascimento === "string") {
    // Se já for string, converter de ISO para YYYY-MM-DD
    const date = new Date(selectedPaciente.value.dataNascimento);
    selectedPaciente.value.dataNascimento = date.toISOString().split("T")[0];
  }
  showForm.value = true;
}

function onView(paciente) {
  selectedPaciente.value = paciente;
  viewMode.value = true;
}

function onCancel() {
  selectedPaciente.value = null;
  showForm.value = false;
  viewMode.value = false;
}

function onSaved() {
  onCancel();
}
</script>

<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Pacientes</h1>

    <PacienteList
      v-if="!selectedPaciente && !showForm"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @delete="onDelete"
    />

    <PacienteForm
      v-if="showForm"
      :paciente="selectedPaciente"
      @cancel="onCancel"
      @saved="onSaved"
    />

    <PacienteView
      v-if="viewMode"
      :paciente="selectedPaciente"
      @close="onCancel"
    />
  </div>
</template>

<style scoped>
@import "tailwindcss";

.container {
  @apply rounded-xl p-6 bg-[#111827] shadow-md;
}
</style>
