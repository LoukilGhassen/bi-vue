<template>
  <div class="w-100">
    <div
      class="d-flex justify-content-between p-9 m-9 mt-5 noir"
      v-if="!isEdit"
    >
      <div class="fs-1 fw-boldest noir">
        Nouveau contact Coordonnées du congrès
      </div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      class="px-9 mx-9 w-100"
      :model="form"
      :rules="rules"
    >
      <div class="d-flex gap-9 justify-content-center">
        <div class="form fit-content p-9 mb-5 d-flex flex-column w-100">
          <div class="fw-boldest noir mb-3 align-self-start">
            Coordonnées du congrès
          </div>
          <el-form-item prop="actorName" class="w-100">
            <label class="w-100">Nom*</label>
            <el-input size="large" v-model="form.actorName" />
          </el-form-item>
          <div class="address-form w-100">
            <div class="d-flex gap-5">
              <el-form-item class="w-25" prop="addressOfActor[0].streetNb">
                <label class="w-100">N°</label>
                <el-input-number
                  :controls="false"
                  class="w-100"
                  v-model.number="form.addressOfActor[0].streetNb"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-75" prop="addressOfActor[0].street">
                <label>Rue*</label>
                <el-input
                  v-model="form.addressOfActor[0].street"
                  type="text"
                  size="large"
                />
              </el-form-item>
            </div>
            <el-form-item class="w-100">
              <label>Complément d'adresse</label>
              <el-input
                class="w-100"
                v-model="form.addressOfActor[0].notes"
                type="text"
                size="large"
              />
            </el-form-item>
            <div class="d-flex justify-content-between gap-5">
              <el-form-item class="w-50">
                <label>Portable</label>
                <el-input v-model="form.phone" size="large" />
              </el-form-item>
              <el-form-item class="w-50" prop="email">
                <label>Email</label>
                <el-input size="large" v-model="form.email" />
              </el-form-item>
            </div>
            <div class="d-flex justify-content-between gap-5">
              <el-form-item class="w-50">
                <label>Téléphone</label>
                <el-input
                  v-model="form.addressOfActor[0].telephone"
                  type="text"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-50">
                <label>Fax</label>
                <el-input
                  v-model="form.addressOfActor[0].fax"
                  type="text"
                  size="large"
                />
              </el-form-item>
            </div>
            <div class="d-flex justify-content-between gap-5 w-100">
              <el-form-item class="w-50">
                <label>Spécialité</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder="Sélectionnez une spécialité"
                  filterable
                  v-model="form.listIdActorPersonSpecializationObject.id"
                >
                  <el-option
                    v-for="spaciality in data?.ActorPersonSpecialization"
                    :key="spaciality.id"
                    :label="spaciality.code"
                    :value="spaciality.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="w-50">
                <label>Date début - Date fin</label>
                <el-date-picker
                  v-model="rangeDate"
                  type="datetimerange"
                  range-separator="To"
                  format="YYYY/MM/DD hh:mm"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                />
              </el-form-item>
            </div>
          </div>
          <div class="d-flex justify-content-between gap-5 w-100" v-if="isEdit">
            <el-form-item class="w-100">
              <label>URSAAF</label>
              <el-input v-model="form.ursaaf" size="large" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div
      class="d-flex justify-content-end align-items-center p-9 gap-5 dialog-footer"
    >
      <el-button
        v-if="isEdit"
        type="primary"
        class="primary-btn poppins"
        size="large"
        @click="onSubmit(ruleFormRef)"
      >
        Modifier
      </el-button>
    </div>

    <div
      v-if="!isEdit"
      class="d-flex justify-content-end align-items-center p-9 gap-5 dialog-footer"
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
        <inline-svg class="me-2" src="/svg/icons/plus.svg"></inline-svg>
        Ajouter
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import service from "@/service";
import { useActorStore } from "@/store/useActorModule";
import { AddressCreateInput } from "index";
import { onMounted, ref, watch } from "vue";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
const { error, actor } = storeToRefs(useActorStore());
const { createActor, getActorById, editActor } = useActorStore();

const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const route = useRoute();
const id = route.params.id as string;
import _ from "lodash";

const props = defineProps({
  inputs: {
    type: Array,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const rangeDate = ref(["", ""]);
const form = ref({
  actorName: "",
  actorCompany: {
    listIdActorCompanyTypeObject: {
      listTypeName_tag: {
        listTypeName: "ActorCompanyTypes",
        tag: "Congress",
      },
    },
  },
  listIdActorPersonSpecializationObject: {
    id: "",
  },
  actif: true,
  phone: "",
  email: null,
  addressOfActor: [
    {
      addressTypeId: "2021",
      tag: "",
      listIdCountry: "1019",
      row1Value: "",
      row2Value: "",
      town: "",
      zipCode: "",
      street: "",
      streetNb: 0,
    },
  ] as Array<AddressCreateInput>,
  rdvVisit: false,
  ursaaf: "",
  yearVisitObjective: 0,
});
watch(rangeDate, (val) => {
  form.value.addressOfActor[0].row1Value = val[0];
  form.value.addressOfActor[0].row2Value = val[1];
});
const data = ref<any>({});
onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorCongressForm"
    );
  data.value = resp.data;
  if (props.isEdit) {
    await getActorById(id);
    form.value = _.cloneDeep(actor.value);
    rangeDate.value = [
      form?.value?.addressOfActor[0]?.row1Value,
      form.value.addressOfActor[0].row2Value,
    ];
    console.log(form.value, "vaaaaaalllllll");
  }
});

const handleSubmitForm = async () => {
  if (props.isEdit) {
    await editActor({ id, data: form.value });
  } else {
    await createActor({ data: form.value });
  }
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
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
const handleCloseModal = () => {
  setModal("");
};

const rules = {
  actorName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  email: [
    {
      required: false,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: "change",
    },
  ],
  "addressOfActor[0].street": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "addressOfActor[0].streetNb": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "addressOfActor[0].town": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "addressOfActor[0].zipCode": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
};
</script>
<style lang="scss" scoped>
.form {
  background: #f4f4f6;
}
.fit-content {
  height: fit-content;
}
label {
  font-size: 12px;
  font-weight: 700;
}
:deep(.el-tag) {
  color: white;
}
:deep(.el-tag__close) {
  color: white;
}
:deep(.el-select__tags) {
  display: none;
}
:deep(.el-input__prefix) {
  display: none !important;
}
:deep(.el-date-editor) {
  width: 100% !important;
}
</style>
