<template>
  <ConfirmModal
    :title="payload?.title || 'Envoyer un e-mail au contact'"
    :isOpenModal="$props.showModal"
    @close-confirm-modal="handleCloseModal"
    @approve-confirm-modal="onSubmit(formRef)"
    :beforeClose="handleCloseModal"
    confirmTitle="Envoyer"
  >
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item v-if="!currentUser" prop="email">
        <label class="mb-3">E-mail</label>
        <el-input v-model="form.email" size="large"></el-input> </el-form-item
      ><el-form-item prop="subject">
        <label class="mb-3">Objet</label>
        <el-input v-model="form.subject" size="large"></el-input>
      </el-form-item>
      <el-form-item prop="message">
        <label class="mb-3">Message</label>
        <el-input
          v-model="form.message"
          :rows="5"
          type="textarea"
          placeholder=""
        />
      </el-form-item>
      <el-form-item class="w-100">
        <el-upload
          class="w-100"
          drag
          multiple
          v-model:file-list="fileList"
          ref="uploadRef"
          action="#"
          :auto-upload="false"
        >
          <div class="el-upload--text w-100 poppins">
            Cliquez pour sélectionner vos documents ou déposez-les
          </div>
          <inline-svg src="/svg/icons/upload.svg" />
          <template #tip>
            <div class="el-upload__tip fs-6 poppins noir">
              <span class="noir">
                Formats autorisés : jpg, jpeg, gif, pdf, doc, docx, png. |
                Taille max : 8 Mo</span
              >
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </ConfirmModal>
</template>
<script lang="ts" setup>
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import type { ElForm } from "element-plus";
import { t } from "@/core/i18n/translate";
import { ref } from "vue";
import type { UploadInstance } from "element-plus";
import service from "@/service";
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { useActorStore } from "@/store/useActorModule";
const uploadRef = ref<UploadInstance>();
const emit = defineEmits(["close-modal", "approve-modal"]);
const { currentUser } = storeToRefs(useAuthStore());
const { actor } = storeToRefs(useActorStore());
import axios from "axios";
import { setModal } from "@/core/helpers/config";
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Object,
    required: false,
  },
});
const formRef = ref<InstanceType<typeof ElForm>>();
const form = ref({
  subject: "",
  message: "",
});
const rules = ref({
  email: [
    {
      required: true,
      message: t("entityForm.validation.required"),
      trigger: "blur",
    },
    {
      type: "email",
      message: "Ladresse e-mail est invalide",
      trigger: ["blur", "change"],
    },
  ],
  subject: [
    {
      required: true,
      message: t("entityForm.validation.required"),
      trigger: "blur",
    },
  ],
  message: [
    {
      required: true,
      message: t("entityForm.validation.required"),
      trigger: "blur",
    },
  ],
});
const handleCloseModal = () => {
  form.value = {
    subject: "",
    message: "",
  };
  fileList.value = [];
  emit("close-modal");
};

const fileList = ref([]);

const handleUploadFile = async (e) => {};
const handleError = (message: string) => {
  Components.ElMessage.error(message);
  setModal("");
};
const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      let url = import.meta.env.VITE_API_URL;
      const headers = {
        accept: "application/json",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      };
      const formData = new FormData();
      fileList.value.map((f: any) => {
        formData.append("files", f.raw);
      });
      if (props.payload.type === "adminContact") {
        if (!form.value.email && !currentUser.value.email) {
          handleError("Veuillez renseigner votre email");
          return;
        }
        url = url + "/nest/api/contact_admin";
        formData.append(
          "data",
          JSON.stringify({
            ...form.value,
            from: form.value.email || currentUser.value.email,
          })
        );
      } else {
        url = url + "/nest/api/actors/contact_actor";
        formData.append(
          "data",
          JSON.stringify({
            ...form.value,
            to: props.payload?.toEmail || "",
            from: currentUser.value.email,
          })
        );

        if (!props.payload?.toEmail || !currentUser.value.email) {
          handleError("Veuillez renseigner les e-mails nécessaires");
          return;
        }
      }

      axios
        .post(url, formData, { headers })
        .then((response: any) => {
          console.log(response.data);
        })
        .catch((error: any) => {
          console.error(error);
        });
      handleCloseModal();
      Components.ElNotification.success({
        message: "Opération effectuée avec succès",
        type: "success",
        position: "bottom-right",
        offset: 60,
        duration: 2000,
        customClass: "success-notif",
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>
<style lang="scss" scoped>
:deep(.el-upload--text) {
  width: 100%;
  color: $noir;
}
:deep(.el-upload-dragger) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  background-color: $gris-clair;
}
</style>
