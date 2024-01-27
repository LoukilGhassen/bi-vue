<template>
    <div>
      <el-dialog
        v-model="$props.showModal"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        top="25vh"
      >
      <CategoryForm :isEdit="payload && payload.isEdit" :category="payload.category"/>
    </el-dialog>
  </div>
  </template>
  
  <script lang="ts" setup>
  import CategoryForm from "@/components/forms/CategoryForm.vue";
  const props = defineProps({
      showModal: {
        type: Boolean,
        required: true,
      },
      payload:{
        type:Object,
        required:true
      }
    });
  </script>
  <style lang="scss" scoped>
  :deep(.el-input__prefix) {
    display: none !important;
  }
  
  
  </style>
  