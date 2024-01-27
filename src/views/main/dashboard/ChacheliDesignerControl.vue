<template>
    <div class="chacheli-designer-control">
      <span class="button-group">
        <button
          type="button"
          :disabled="editMode"
          @click.prevent.stop="$emit('editMode', true)"
        >
          Edit</button
        ><button
          type="button"
          :disabled="!editMode"
          @click.prevent.stop="$emit('editMode', false)"
        >
          Show
        </button>
      </span>
      <span class="form" v-show="editMode">
        <b>Cols</b>: <number-input :value="layout.cols" @input="setCols" />
      </span>
    </div>
  </template>
  
  <style lang="scss">
  .chacheli-designer-control {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  
    button + button {
      margin-left: -1px;
    }
  
    span.form {
      padding-left: 20px;
    }
  }
  </style>
  
  <script setup>
  import {ref} from "vue"
  import NumberInput from "./NumberInput.vue";
  const props = defineProps({
    layout: { type: Object },
    data: { type: Object },
    editMode: { type: Boolean },
  });
  
  const chacheli = ref({
    text: "",
    comp: "dummy-green",
  });
  const localData = ref({
    content: "",
  });
  const emit = defineEmits(["add","cols","rows"])
  const add = () => {
    emit(
      "add",
      Object.assign({}, chacheli.value),
      Object.assign({}, localData.value)
    );
  };
  const setCols = (v) => {
    emit("cols", v);
  };
  const setRows = (v) => {
    emit("rows", v);
  };
  </script>
  