<template>
  <div class="dropdown-container" ref="dropdownContainer">
    <div class="dropdown-trigger" @click="toggleDropdown">
      <slot name="trigger">{{ label }}</slot>
    </div>
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu" @click.stop>
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  label: String,
});

const emit = defineEmits(["open", "close"]);

const isOpen = ref(false);
const dropdownContainer = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit("open");
  } else {
    emit("close");
  }
};

const closeDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false;
    emit("close");
  }
};

const handleClickOutside = (event) => {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target)
  ) {
    closeDropdown();
  }
};

const handleEscape = (event) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
});

defineExpose({
  close: closeDropdown,
  isOpen,
});
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
  user-select: none;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background: #1f2937;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
}

/* Transition animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
