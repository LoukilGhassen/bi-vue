<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="25vh"
    >
    <div class="d-flex justify-content-between p-9 m-9 mt-5 noir">
      <div class="fs-1 fw-boldest noir">
        <span v-if="payload.isEdit">Modifier</span><span v-else>Ajouter</span> une
        UGA
      </div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
      <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9" :rules="rules">
        <div class="form fit-content d-flex flex-column">
          <el-form-item class="w-100" prop="code">
            <label>Code UGA*</label>
            <el-input size="large" v-model="form.code"> </el-input>
          </el-form-item>

          <el-form-item
            class="w-100"
            prop="captionFr"
          >
            <label>Description*</label>
            <el-input
              size="large"
              v-model="form.captionFr"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="w-100" prop="departement">
            <label>Département*</label>
            <el-input
              v-model="form.departement"
              size="large"
            />
          </el-form-item>
        </div>
      </el-form>
       <div
      class="d-flex justify-content-end align-items-center p-9 mx-9 gap-5 dialog-footer"
    >
      <div
        data-test="ConfirmModalCancelButton"
        @click="handleCloseModal"
        class="cancel-btn me-2"
      >
        Annuler
      </div>
      <el-button
        data-test="ConfirmModalConfirmButton"
        type="primary"
        class="primary-btn poppins"
        size="large"
        @click="onSubmit(ruleFormRef)"
      >
        <inline-svg
          v-if="!payload.isEdit"
          class="me-2"
          src="/svg/icons/plus.svg"
        ></inline-svg>
        <span v-if="!payload.isEdit">Ajouter</span>
        <span v-if="payload.isEdit">Modifier</span>
      </el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { t } from "@/core/i18n/translate";
import { setModal } from "@/core/helpers/config";
import { useListStore } from "@/store/useListModule";
import { ref } from "vue";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";




    const { createList,editList } = useListStore();
    const { error } = storeToRefs(useListStore());

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
const handleCloseModal = () => {
  setModal("");
};
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const form = ref({
  listTypeNameObject: { listTypeName: "UGA" },
  code: "",
  captionFr: "",
  departement: "",
  status: true
});
const rules = {
  code: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  captionFr: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  departement: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
};

const handleSubmitForm = async () => {
 delete form.value.departement
  if (props.payload.isEdit) {
    // await editList({
    //   id: form.value.id,
    //   data,
    // });
  } else {
    console.log(form.value,'foooorrrrrm');
    await createList({ data: form.value });
  }
};
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  


    formEl.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
          Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
        setModal("");

        
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
  
};
</script>
<style lang="scss" scoped>
:deep(.el-dialog) {
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
