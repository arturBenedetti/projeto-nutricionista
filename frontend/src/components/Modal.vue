<!-- src/components/Modal.vue -->
<template>
  <div v-if="show" class="modal-backdrop" @keydown.esc="onClose" tabindex="-1">
    <div class="modal" role="dialog" @click.stop>
      <header class="modal-header">
        <slot name="header"></slot>
        <button @click="close">✖</button>
      </header>
      <section class="modal-body">
        <slot />
      </section>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { watch, toRefs } from "vue";
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const { modelValue } = toRefs(props);
const show = modelValue;

function close() {
  emit("update:modelValue", false);
}
function onClose() {
  close();
}
</script>

<style scoped>

/* estilos mínimos — substitua por Tailwind se quiser */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  border-radius: 8px;
  width: 800px;
  max-width: 95%;
  max-height: 90%;
  overflow: auto;
}
.modal-header,
.modal-footer {
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.modal-body {
  padding: 12px;
}
</style>
