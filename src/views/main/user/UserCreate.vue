<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      fullscreen
    >
    <UserForm :isEdit="false" :payload="payload"/>  
    </el-dialog>
  </div>
</template>
  
  <script lang="ts" setup>
import UserForm from "@/components/forms/UserForm.vue";
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
:deep(.el-dialog__header){
  display: none;

}
:deep(.el-dialog__body){
  word-break: normal;
  padding:0;
 height:auto !important;
}
:deep(.el-dialog__headerbtn){
  display: none;
}

</style>