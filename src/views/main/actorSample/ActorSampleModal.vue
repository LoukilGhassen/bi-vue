<template>
    <div>
      <el-dialog
        v-model="$props.showModal"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        top="25vh"
      >
      <ActorSampleForm :isEdit="payload && payload.isEdit" :sample="payload.sample"/>
    </el-dialog>
  </div>
  </template>
  
  <script lang="ts" setup>
  import ActorSampleForm from "@/components/forms/ActorSampleForm.vue";
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
  