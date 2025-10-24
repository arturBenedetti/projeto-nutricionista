<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Dietas</h1>

    <DietaList
      v-if="!selectedDieta && !showForm"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @delete="onDelete"
    />

    <DietaForm
      v-if="showForm"
      :dieta="selectedDieta"
      @cancel="onCancel"
      @saved="onSaved"
    />

    <DietaView v-if="viewMode" :dieta="selectedDieta" @close="onCancel" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import DietaList from "../../components/dieta/DietaList.vue"
import DietaForm from "../../components/dieta/DietaForm.vue"
import DietaView from "../../components/dieta/DietaView.vue"

const selectedDieta = ref(null)
const showForm = ref(false)
const viewMode = ref(false)

function onAdd() {
  selectedDieta.value = null
  showForm.value = true
}

function onEdit(dieta) {
  selectedDieta.value = dieta
  showForm.value = true
}

function onView(dieta) {
  selectedDieta.value = dieta
  viewMode.value = true
}

function onDelete(dieta) {
  // TODO: Implementar confirmação e exclusão
  console.log("Deletar dieta:", dieta)
  // Por enquanto, apenas log
  alert("Funcionalidade de exclusão será implementada em breve!")
}

function onCancel() {
  selectedDieta.value = null
  showForm.value = false
  viewMode.value = false
}

function onSaved() {
  onCancel()
}
</script>

<style scoped>
div {
  background-color: #111827;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
