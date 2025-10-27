<template>
  <div class="dropdown-item" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script setup>
const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};
</script>

<style scoped>
.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  user-select: none;
}

.dropdown-item:hover {
  background-color: #2f3e53;
}

.dropdown-item:first-child {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.dropdown-item:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}
</style>
