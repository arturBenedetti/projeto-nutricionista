<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Cadastro de Pacientes</h1>

    <PersonList
      v-if="!selectedPerson && !showForm"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @delete="onDelete"
    />

    <PersonForm
      v-if="showForm"
      :person="selectedPerson"
      @cancel="onCancel"
      @saved="onSaved"
    />

    <PersonView v-if="viewMode" :person="selectedPerson" @close="onCancel" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PersonList from "../../components/person/PersonList.vue";
import PersonForm from "../../components/person/PersonForm.vue";
import PersonView from "../../components/person/PersonView.vue";

const selectedPerson = ref(null);
const showForm = ref(false);
const viewMode = ref(false);

function onAdd() {
  selectedPerson.value = null;
  showForm.value = true;
}

function onEdit(person) {
  selectedPerson.value = person;
  showForm.value = true;
}

function onView(person) {
  selectedPerson.value = person;
  viewMode.value = true;
}

function onCancel() {
  selectedPerson.value = null;
  showForm.value = false;
  viewMode.value = false;
}

function onSaved() {
  onCancel();
}
</script>

<style scoped>
div {
  background-color: black;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
