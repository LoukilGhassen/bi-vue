<template>
  <el-dialog
    v-model="isOpenModal"
    :before-close="handleClose"
    destroy-on-close
    :top="top"
  >
    <div class="d-flex justify-content-between pt-9 px-9 noir">
      <div class="fs-2 fw-boldest noir">
        {{ title }}
      </div>
      <inline-svg
        src="/svg/icons/close.svg"
        class="cursor-pointer"
        @click="$emit('close-confirm-modal')"
      ></inline-svg>
    </div>
    <div class="mt-9 px-9">
      <slot></slot>
    </div>
    <div
      class="d-flex justify-content-end align-items-center p-9 gap-6 dialog-footer"
    >
      <div
        data-test="ConfirmModalCancelButton"
        @click="$emit('close-confirm-modal')"
        class="cancel-btn"
      >
        Annuler
      </div>
      <el-button
        data-test="ConfirmModalConfirmButton"
        type="primary"
        class="primary-btn m-0"
        size="large"
        :loading="isLoading"
        @click="$emit('approve-confirm-modal')"
        >{{ confirmTitle }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
const props = defineProps({
  isOpenModal: {
    type: Boolean,
    required: true,
    default: false,
  },
  isLoading: Boolean,
  title: String,
  handleClose: Function,
  confirmTitle: {
    type: String,
    default: "Supprimer",
  },
  top: {
    type: String,
    required: false,
    default: "5vh",
  },
});
defineEmits(["close-confirm-modal", "approve-confirm-modal"]);
const modalWidth = ref(window.innerWidth < 768 ? 20 : 25);
const resizeHandler = () => {
  if (window.innerWidth < 768) return (modalWidth.value = 25);
  else modalWidth.value = 20;
};

onMounted(() => {
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
</script>
<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  word-break: normal;
  padding: 0;
}
:deep(.el-dialog__headerbtn) {
  display: none;
}
</style>
