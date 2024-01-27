<template>
  <div class="w-100">
    <div
      class="d-flex justify-content-between p-9 m-9 mt-5 noir"
      v-if="!isEdit"
    >
      <div class="fs-1 fw-boldest noir">Nouveau contact Entité</div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      :class="!isEdit ? 'px-9 mx-9' : ''"
    >
      <div class="d-flex gap-9">
        <div class="gap-5 w-50">
          <div class="mb-9 w-100 fit-content">
            <div class="form fit-content p-9 mb-5 d-flex flex-column">
              <div class="fw-boldest noir mb-4 align-self-start">Identité</div>
              <div class="d-flex flex-column gap-3 w-100">
                <el-form-item
                  class="w-100"
                  prop="actorCompany.listIdActorCompanyFormObject.id"
                >
                  <label class="w-100">Objet social*</label>
                  <el-select
                    class="w-100"
                    size="large"
                    placeholder=""
                    v-model="form.actorCompany.listIdActorCompanyFormObject.id"
                  >
                    <el-option
                      v-for="object in data?.ActorCompanyObject"
                      :key="object.id"
                      :label="object.captionFr"
                      :value="object.id"
                    />
                  </el-select>
                </el-form-item>
                <div class="d-flex gap-5 align-items-center w-100">
                  <el-form-item class="w-50" prop="actorName">
                    <label>Nom*</label>
                    <el-input size="large" v-model="form.actorName"> </el-input>
                  </el-form-item>
                  <el-form-item class="w-50" prop="ursaaf">
                    <label>URSAFF</label>
                    <el-input size="large" v-model="form.ursaaf"> </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <div class="form d-flex flex-column p-9 w-100 fit-content">
            <span
              class="fw-boldest noir align-self-start d-flex justify-content-between w-100 mb-4"
            >
              Complément d'informations
            </span>

            <div class="d-flex gap-3 w-100">
              <el-form-item class="w-50" prop="rpps">
                <label class="w-100">Nom président</label>

                <el-input
                  class="w-100"
                  size="large"
                  v-model="form.actorCompany.presidentName"
                  :controls="false"
                />
              </el-form-item>
              <el-form-item class="w-50" prop="actor.listIdUgaObject.id">
                <label class="w-100">Nom du trésorier</label>
                <el-input
                  class="w-100"
                  size="large"
                  v-model="form.actorCompany.treasurerName"
                  :controls="false"
                />
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50">
                <label>Portable</label>
                <el-input size="large" v-model="form.phone"> </el-input>
              </el-form-item>
              <el-form-item class="w-50" prop="email">
                <label>E-mail</label>
                <el-input size="large" v-model="form.email"> </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="form d-flex flex-column p-9 gap-0 fit-content">
          <div
            class="fw-boldest noir pb-3 align-self-start d-flex justify-content-between w-100"
          >
            <span> Adresse de l'entité </span>
          </div>
          <AddressForm
            v-for="(address, index) in form.addressOfActor"
            :key="index"
            :isEdit="isEdit"
            :data="form.addressOfActor[index]"
            :submit="formsValidation.submitted"
            :inputs="inputs"
            @update="handleFormUpdate($event, index)"
            @validate="handleValidate"
            :showUga="false"
          />
        </div>
      </div>
      <el-divider />
      <span
        class="fw-boldest noir align-self-start d-flex justify-content-between w-100 mb-4"
      >
        Pièces jointes
      </span>
      <InputTable
        :data="form.documents"
        :columns="documentsColumns"
        @inputChange="handleInPlaceInput"
        @add="handleAddDocument"
        @delete="handlDeleteDocument"
        @name="handleDocumentSelect"
        @nameSuggest="handleSuggestDocument"
        @showDetails="handleDetails"
        showDetails
      />
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
import { onMounted, ref } from "vue";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
const { error, actor } = storeToRefs(useActorStore());
const { createActor, getActorById, editActor, setActiveTabsName } =
  useActorStore();
import { supabase } from "@/core/services/SupabaseClientService";
import InputTable from "@/components/shared/InputTable.vue";
import AddressForm from "@/components/forms/AddressForm.vue";
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const route = useRoute();
const id = route.params.id as string;
import _ from "lodash";
import { useRoute } from "vue-router";
import { checkIsNum, checkPhone } from "@/core/helpers/customValidation";

const props = defineProps({
  inputs: {
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const formsValidation = ref({
  submitted: false,
  counter: 0,
  mainFormValidation: false,
});
const documentsColumns = ref([
  {
    label: "Nom",
    prop: "name",
    type: "autoComplete",
    valueKey: "name",
    suggestions: [[]],
    name: "name",
  },
  {
    label: "Type de document",
    prop: "type",
    type: "text",
    name: "type",
  },
]);

const fakeDocumentSuggegtions = [
  { name: "doc1", type: "Brochure" },
  { name: "doc2", type: "Fiche posologique" },
  { name: "doc3", type: "HAS" },
];
const form = ref({
  actorName: "",
  actorCompany: {
    listIdActorCompanyTypeObject: {
      listTypeName_tag: {
        listTypeName: "ActorCompanyTypes",
        tag: "Entity",
      },
    },
    listIdActorCompanyFormObject: {
      id: "",
    },
    presidentName: "",
    treasurerName: "",
  },
  actif: true,
  importance: 0,
  phone: "",
  email: null,
  addressOfActor: props.isEdit
    ? []
    : ([
        {
          addressIndex: 0,
        },
      ] as Array<AddressCreateInput>),
  ursaaf: "",
  yearVisitObjective: 0,
  documents: [],
});

const data = ref<any>({});

const handleFormUpdate = (payload: AddressCreateInput, index: number) => {
  form.value.addressOfActor[index] = {
    ...form.value.addressOfActor[index],
    ...payload,
  };
};

onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorEntityForm"
    );
  data.value = resp.data;
  if (props.isEdit) {
    form.value = _.cloneDeep({ ...actor.value.actorObject, documents: [] });
  }
});

const handleValidate = async (valid: boolean) => {
  if (valid) {
    formsValidation.value.counter += 1;
    if (
      formsValidation.value.counter === form.value.addressOfActor.length &&
      formsValidation.value.mainFormValidation
    ) {
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
        setActiveTabsName("entity");
        setModal("");
      }
    } else {
      formsValidation.value.counter = 0;
    }
  } else {
    formsValidation.value.counter = 0;
    formsValidation.value.submitted = false;
    formsValidation.value.mainFormValidation = false;
  }
};

const handleSubmitForm = async () => {
  if (props.isEdit) {
    const data = {
      ...form.value,
      email: form.value.email?.length ? form.value.email : null,
      addressOfActor: form.value.addressOfActor.map((item, index) => {
        return {
          ...item,
          addressIndex: index,
        };
      }),
    };
    await editActor({ id, data: { ...data, documents: undefined } });
  } else {
    await createActor({
      data: {
        ...form.value,
        email: form.value.email?.length ? form.value.email : undefined,
        documents: undefined,
      },
    });
  }
};
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formsValidation.value.submitted = true;
  formEl.validate(async (valid) => {
    if (valid) {
      formsValidation.value.mainFormValidation = true;
      if (formsValidation.value.counter === form.value.addressOfActor.length) {
        await handleSubmitForm();
        if (!!error.value) {
          Components.ElMessage.error(error.value?.message);
          console.log(error, "error");
        } else {
          formsValidation.value.counter = 0;
          formsValidation.value.submitted = false;
          formsValidation.value.mainFormValidation = false;
          setActiveTabsName("entity");
          setModal("");
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      }
    } else {
      formsValidation.value.mainFormValidation = false;
      formsValidation.value.submitted = false;
      formsValidation.value.counter = 0;
      console.log("error submit!");
      return false;
    }
  });
};
const handleCloseModal = () => {
  setModal("");
};

// documents table

const handleAddDocument = () => {
  form.value.documents = [
    ...form.value.documents,
    {
      name: "",
      type: "",
    },
  ];
};
const handlDeleteDocument = (payload: any) => {
  form.value.documents.splice(payload.index, 1);
};
const handleSuggestDocument = async (payload: {
  query: string;
  index: number;
}) => {
  const searchInput = payload.query ?? "";
  //TODO GET DOCUMENTS LIST FROM API
  documentsColumns.value[0].suggestions[payload.index] =
    fakeDocumentSuggegtions.filter((suggest) =>
      suggest.name.toLowerCase().includes(searchInput.toLowerCase())
    );
};

const handleDocumentSelect = (payload: any) => {
  form.value.documents[payload.index] = payload.value;
};
const handleDetails = (payload: any) => {
  console.log(payload, "payload");
};

const rules = {
  actorName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actorCompany.listIdActorCompanyFormObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
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
  phone: [
    {
      validator: checkPhone,
      trigger: "blur",
    },
  ],
  ursaaf: [
    {
      validator: checkIsNum,
      trigger: "blur",
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
:deep(.el-divider--horizontal) {
  border-top: 1px solid $gris-clair;
}
</style>
