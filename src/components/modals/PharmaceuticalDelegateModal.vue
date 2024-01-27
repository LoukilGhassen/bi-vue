<template>

 
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <DelegateForm :isEdit="payload.isEdit" :data="payload.data"/>
    </el-dialog>
  </div 
>
  </template>
  <script lang="ts" setup>
  const emit = defineEmits(["close-modal", "deleted-reason"]);

  import DelegateForm from "@/components/forms/DelegateForm.vue"
  const props = defineProps({
    showModal: {
    type: Boolean,
    required: true,
  },
  payload: {
      type: Object,
      required: false,
    }
});

  </script>
  <style lang="scss" scoped>

  </style>
  