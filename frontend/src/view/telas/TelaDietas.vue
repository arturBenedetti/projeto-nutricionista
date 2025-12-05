<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Dietas</h1>

    <DietaList
      v-if="!selectedDieta && !showForm"
      :key="listKey"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @delete="onDelete"
    />

    <div v-if="showForm" class="w-full">
      <DietaForm :dieta="selectedDieta" @cancel="onCancel" @saved="onSaved" />
    </div>

    <div v-if="viewMode" class="w-full">
      <DietaView :dieta="selectedDieta" @close="onCancel" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DietaList from "../../components/dieta/DietaList.vue";
import DietaForm from "../../components/dieta/DietaForm.vue";
import DietaView from "../../components/dieta/DietaView.vue";

const selectedDieta = ref(null);
const showForm = ref(false);
const viewMode = ref(false);
const listKey = ref(0);

function onAdd() {
  selectedDieta.value = null;
  showForm.value = true;
}

function onEdit(dieta) {
  selectedDieta.value = dieta;
  showForm.value = true;
}

function onView(dieta) {
  selectedDieta.value = dieta;
  viewMode.value = true;
}

async function onDelete(dieta) {
  // Confirmação antes de excluir
  const confirmar = confirm(
    `Tem certeza que deseja excluir a dieta do paciente?\n\nEsta ação não pode ser desfeita.`
  );

  if (!confirmar) {
    return;
  }

  try {
    const sucesso = await window.api.excluirDieta({ id: dieta.id });

    if (sucesso) {
      alert("Dieta excluída com sucesso!");
      // Força recarregamento da lista incrementando a key
      listKey.value++;
      onCancel();
    } else {
      alert("Erro ao excluir dieta. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao excluir dieta:", error);
    alert("Erro ao excluir dieta. Tente novamente.");
  }
}

function onCancel() {
  selectedDieta.value = null;
  showForm.value = false;
  viewMode.value = false;
}

function onSaved(dietaCriada) {
  if (dietaCriada) {
    selectedDieta.value = dietaCriada;
    showForm.value = false;
    viewMode.value = true;
  } else {
    onCancel();
  }
}
</script>

<style scoped>
div {
  background-color: #111827;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
