<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="15vh"
    >
    <ActorProductForm :isEdit="payload && payload.isEdit" :product="payload.product"/>
  </el-dialog>
</div>
</template>

<script lang="ts" setup>
import ActorProductForm from "@/components/forms/ActorProductForm.vue";
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
