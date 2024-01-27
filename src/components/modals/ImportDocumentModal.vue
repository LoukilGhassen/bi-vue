<template>
  <ConfirmModal
    title="Ajouter un document"
    :isOpenModal="$props.showModal"
    @close-confirm-modal="handleCloseModal"
    @approve-confirm-modal="handleAddDocument"
    :beforeClose="handleCloseModal"
    confirmTitle="Ajouter"
    width="35%"
  >
    <el-form :model="form">
      <el-form-item class="w-100">
        <el-upload
          class="w-100"
          drag
          multiple
          v-model="form.document"
        >
          <div class="el-upload--text w-100 poppins noir">
            <span class="noir">
              Cliquez pour sélectionner vos documents ou déposez-les
            </span> 
          </div>
          <inline-svg src="/svg/icons/upload.svg" />
          <template #tip>
            <div class="el-upload__tip fs-6 poppins">
             <span class="noir">
              Formats autorisés : jpg, jpeg, gif, pdf, doc, docx, png. | Taille
              max : 8 Mo
             </span> 
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </ConfirmModal>
</template>
<script lang="ts" setup>
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { ref } from "vue";
const emit = defineEmits(["close-modal"]);
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});
const form = ref({
  document: [],
});

const handleCloseModal = () => {
    emit("close-modal");
};

const handleAddDocument = () => {
    console.log("document added");
    handleCloseModal()
}

</script>
<style lang="scss" scoped>
:deep(.el-upload--text) {
  width: 100%;
  color:$noir;

}
:deep(.el-upload-dragger) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap:20px;
  background-color: $gris-clair;

}
</style>