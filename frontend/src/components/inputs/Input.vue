<template>
  <div>
    <label v-if="label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :autofocus="autofocus"
      :style="inputStyle"
      @input="updateValue"
    />
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    label: {
      type: String,
      default: '', // Texto para o label do campo
    },
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text', // Tipo de input: text, password, email, etc
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    inputStyle: {
      type: Object,
      default: () => ({}), // Para passar estilos inline
    },
    inputId: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`, // Gerar id único
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:value', event.target.value); // Emitir o valor para o componente pai
    },
  },
};
</script>

<style scoped>
input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  border-color: #007BFF;
  outline: none;
}

input[disabled] {
  background-color: #f5f5f5;
}
</style>
