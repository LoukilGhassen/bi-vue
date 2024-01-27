<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <OffFieldActivityForm :isEdit="payload.isEdit" :data="payload.data ||null "/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import OffFieldActivityForm from "@/components/forms/OffFieldActivityForm.vue"
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
:deep(.el-dialog){
   --el-dialog-margin-top: 5vh !important;
}
.date-picker__container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.date-picker__container:hover {
  border: 1px solid #c0c4cc !important;
}
.date-picker__container:focus {
  border: 1px solid $violet-fonce !important;
}
:deep(.el-input__prefix) {
  display: none !important;
}
</style>
