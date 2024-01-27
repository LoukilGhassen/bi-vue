<template>
  <ConfirmModal
    :title="payload.title"
    :isOpenModal="$props.showModal"
    @close-confirm-modal="handleCloseConfirmModal"
    @approve-confirm-modal="submitForm(ruleFormRef)"
    :beforeClose="handleCloseConfirmModal"
    width="30%"
    top="25vh"
  >
    <span class="noir poppins"
      >{{ $t("confirmModal.deleteContent") }} {{ payload.text }}. Cette action
      est irréversible.
    </span>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
    >
      <p class="mt-5 noir fw-bolder gris-fonce">Motif</p>
      <el-form-item label="" prop="motifValue">
        <el-select
          v-model="ruleForm.motifValue"
          class="w-100"
          placeholder="Sélectionnez un motif de suppression"
          size="large"
          @change="handleMotifChange"
        >
          <el-option
            v-for="motif in motifs"
            :key="motif.id"
            :label="motif.captionFr"
            :value="motif.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </ConfirmModal>
</template>
<script lang="ts" setup>
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import type { ElForm } from "element-plus";
import { t } from "@/core/i18n/translate";

import { onMounted, reactive, ref } from "vue";
import service from "@/service";
import { Components } from "@tekab-dev-team/storybook-devfactory";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close-modal", "deleted-reason"]);

const motifs = ref([]);
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const ruleForm = reactive({
  motifValue: "",
});
const rules = reactive({
  motifValue: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
});
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleDeleteEntity();
    }
  });
};
const handleCloseConfirmModal = () => {
  emit("close-modal");
};
const handleMotifChange = () => {
  emit("deleted-reason", ruleForm.motifValue);
};
const handleDeleteEntity = async () => {
  const { deleteEntity } = props.payload;
  await deleteEntity(props.payload.id, ruleForm.motifValue);
  Components.ElNotification.success({
    message: "Opération effectuée avec succès",
    type: "success",
    position: "bottom-right",
    offset: 60,
    duration: 2000,
    customClass: "success-notif",
  });
  ruleForm.motifValue = "";
  handleCloseConfirmModal();
};

onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "DeleteModal"
    );
  motifs.value = resp.data?.DeleteReason;
});
</script>
<style lang="scss" scoped>
</style>
