<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="25vh"
    >
      <div class="d-flex justify-content-between px-12 py-8 pt-10 noir">
        <div class="fs-1 fw-boldest noir">
          <span v-if="payload.isEdit">Modifier</span
          ><span v-else>Ajouter</span> {{ modalTitle }}
        </div>
        <div class="cursor-pointer" @click="handleCloseModal">
          <inline-svg src="/svg/icons/close.svg"></inline-svg>
        </div>
      </div>
      <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9" :rules="rules">
        <div class="form fit-content d-flex flex-column">
          <el-form-item class="w-100" prop="code">
            <label>Code*</label>
            <el-input size="large" v-model="form.code"> </el-input>
          </el-form-item>

          <el-form-item class="w-100" prop="captionFr">
            <label>Description*</label>
            <el-input size="large" v-model="form.captionFr"> </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div
        class="d-flex justify-content-end align-items-center p-9 mx-9 gap-5 pb-15  dialog-footer"
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
import { computed, onMounted, ref } from "vue";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
import _ from "lodash";
import service from "@/service";

const { createList, editList } = useListStore();
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
const modalTitle = computed(() => {
  switch (props?.payload.listType) {
    case "ActorPersoOrientation":
      return "une orientation";

    case "ProductWholesaler":
      return "un grossiste";

    case "ActorPersonQuality":
      return "une qualité";

    case "ActorPersonSpecialization":
      return "une spécialité";

    case "ActorCompanyObject":
      return "un objet social";
    case "OffFieldTypes":
      return "une activité hors terrain";
    case "DeleteReason":
      return "un motif";
    case "VisitType":
      return "un type";
    case "VisitReasons":
      return "un motif";

    default:
      return "une orientation";
  }
});
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const form = ref({
  listTypeNameObject: { listTypeName: props?.payload?.listType },
  code: "",
  captionFr: "",
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
};

const handleSubmitForm = async () => {
  delete form.value.departement;
  const data = {
    code: form.value.code,
    captionFr: form.value.captionFr,
    listTypeNameObject: { listTypeName: props?.payload?.listType },
  };
  if (props?.payload.isEdit) {
    await editList({
      id: form.value.id,
      data,
    });
  } else {
    await createList({ data });
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

onMounted(async() => {
  if (props?.payload.isEdit) {
    form.value = _.cloneDeep(props?.payload.data);
  }else{
       const result = await service.api.listControllerGenerateCode({
        "where[listTypeName]": props?.payload.listType
       })
       const code = result?.data?.code
       form.value.code = code
    }
});
</script>
<style lang="scss" scoped>
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
