<template>
  <button :class="buttonClass" :style="buttonStyle">
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    label: {
      type: String,
      default: "Clique aqui",
    },
    color: {
      type: String,
      default: "blue",
    },
    size: {
      type: String,
      default: "medium",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: String,
      default: "",
    },
    buttonStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    buttonClass() {
      return {
        btn: true,
        [`btn-${this.size}`]: true,
        [`btn-${this.color}`]: true,
        "btn-disabled": this.disabled,
        [this.buttonClass]: this.buttonClass,
      };
    },
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("click");
      }
    },
  },
};
</script>

<style scoped>
.btn {
  padding: 10px;
  border: none;
  cursor: pointer;
}
.btn-small {
  font-size: 12px;
  padding: 5px 10px;
}
.btn-medium {
  font-size: 16px;
  padding: 10px 20px;
}
.btn-large {
  font-size: 20px;
  padding: 15px 30px;
}
.btn-blue {
  background-color: rgb(71, 169, 255);
  color: white;
}
.btn-red {
  background-color: red;
  color: white;
}
.btn-teal {
  background-color: #00b5ad;
  color: white;
}
.btn-disabled {
  background-color: grey;
  cursor: not-allowed;
}
</style>
