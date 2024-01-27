<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      fullscreen
      >
    <ActorPersonForm :inputs="payload.inputs"/>  
    </el-dialog>
  </div>
</template>
  
  <script lang="ts" setup>
  import ActorPersonForm from "@/components/forms/ActorPersonForm.vue";
  import ActorPharmacyForm from "@/components/forms/ActorPharmacyForm.vue";
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

}
:deep(.el-dialog__headerbtn){
  display: none;
}

</style>
  