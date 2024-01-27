<template>
    <div class="modal-text p-5 noir fs-4">
        Un e-mail a été envoyé à <span class="violet-hover fw-boldest"> {{ email }} </span> . veuillez vérifier votre boîte de réception pour confirmer votre adresse e-mail.
    </div>
  </template>
  
  <script lang="ts" setup>
  const props = defineProps({
    email: {
      type: String,
      required:false
    }
});

  </script>
  <style scoped lang="scss">
   :deep(.el-dialog__custom-class) {
      background: $primary-500 !important;
      border-radius: 10px;
      width: 50%;
      max-width: 1100px;
      word-break: break-word!important;
      @media (max-width: 1100px) {
        width:90%;
    }
  
  }
  :deep(.el-dialog__header){
    padding:0px!important;
  }
  :deep(.el-dialog__body){
    padding:0px!important;
    word-break: break-word!important;
  }
  .modal-text{
    word-break: break-word!important;
  }
  </style>
  