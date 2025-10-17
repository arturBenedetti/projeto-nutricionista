<template>
  <div class="p-6">
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

    <PacienteView v-if="viewMode" :paciente="selectedPaciente" @close="onCancel" />
  </div>
</template>

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
  selectedPaciente.value = paciente;
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

<style scoped>
div {
  background-color: #111827;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
