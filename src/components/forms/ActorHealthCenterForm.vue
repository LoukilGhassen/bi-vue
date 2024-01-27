<template>
  <div class="w-100">
    <div
      class="d-flex justify-content-between p-9 m-9 mt-5 noir"
      v-if="!isEdit"
    >
      <div class="fs-1 fw-boldest noir">
        Nouveau contact Etablissement de santé
      </div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
    <el-form ref="ruleFormRef" :class="!isEdit ? 'px-9 mx-9' : ''" :model="form" :rules="rules">
      <div class="d-flex gap-9 w-100">
        <div class="d-flex flex-column w-50">
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Coordonnées de l'établissement de santé
            </div>
            <el-form-item prop="actorName">
              <label class="w-100">Nom*</label>
              <el-input size="large" v-model="form.actorName" />
            </el-form-item>
            <AddressForm
              :isEdit="isEdit"
              :data="form.addressOfActor[0]"
              :inputs="inputs"
              @update="handleFormUpdate($event, 0)"
              :index="0"
              :key="
                form.addressOfActor.length === 0
                  ? 1
                  : form.addressOfActor[0].addressIndex
              "
              :listUga="data?.UGA"
              ref="addressRef"
            /><el-form-item class="w-50">
                <label>E-mail</label>
                <el-input v-model="form.email" size="large" />
              </el-form-item>
          </div>
          <div class="mb-9 fit-content" v-if="!props.isEdit">
            <div class="d-flex flex-column gap-5">
              <div
                v-for="(service, index) in form.actorCompany.services"
                :key="index"
              >
                <div v-if="index % 2 === 0 && index !== 0">
                  <div class="form d-flex flex-column p-9">
                    <div
                      class="fw-boldest noir pb-0 align-self-start d-flex justify-content-between w-100"
                      v-if="index !== 0"
                    >
                      <div>Service {{ index + 1 }}</div>
                      <div
                      class="cursor-pointer"
                      @click="handleDeleteService(index)"

                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>

                    </div>

                    <ServiceForm
                      @update="handleServiceUpdate($event, index)"
                      :index="index"
                      ref="servicesRef"
                      :serviceTeamIds="servicesTeamIds"
                      :key="serviceKeys[index]"
                      :data="form.actorCompany.services[index]"

                    />
                  </div>
                  <div
                    v-if="index === form.actorCompany.services.length - 1"
                    @click="addNewService"
                    class="violet-hover cursor-pointer my-5 d-flex align-items-center gap-2 poppins"
                  >
                    <inline-svg src="/svg/icons/plus.svg"> </inline-svg>

                    Ajouter un service
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-50" v-if="!props.isEdit">
          <div class="d-flex flex-column gap-5">
            <div
              v-for="(service, index) in form.actorCompany.services"
              :key="index"
            >
              <div v-if="index % 2 !== 0 || index === 0">
                <div class="form d-flex flex-column p-9">
                  <div
                    class="fw-boldest noir pb-0 align-self-start d-flex justify-content-between w-100"
                  >
                    <span> Service {{ index + 1 }} </span>
                    <div
                    class="cursor-pointer"
                    v-if="index !== 0"
                    @click="handleDeleteService(index)"

                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>
                  </div>
                  <ServiceForm
                    @update="handleServiceUpdate($event, index)"
                    :index="index"
                    ref="servicesRef"
                    :serviceTeamIds="servicesTeamIds"
                    :key="serviceKeys[index]"
                    :data="form.actorCompany.services[index]"
                  />
                </div>
                <div
                  v-if="index === form.actorCompany.services.length - 1"
                  @click="addNewService"
                  class="violet-hover cursor-pointer my-5 d-flex align-items-center gap-2 poppins"
                >
                  <inline-svg src="/svg/icons/plus.svg"> </inline-svg>
                  Ajouter un service
                </div>
              </div>
            </div>
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
import { computed, onMounted, ref } from "vue";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
const { error, actor } = storeToRefs(useActorStore());
const { createActor, editActor, setActiveTabsName } = useActorStore();

const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const route = useRoute();
const id = route.params.id as string;
import _ from "lodash";
import { useRoute } from "vue-router";
import AddressForm from "@/components/forms/AddressForm.vue";
import ServiceForm from "@/components/forms/ServiceForm.vue";
const props = defineProps({
  inputs: {
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const addressRef = ref();
const serviceKeys = ref([0])
const form = ref({
  actorName: "",
  actorCompany: {
    listIdActorCompanyTypeObject: {
      listTypeName_tag: {
        listTypeName: "ActorCompanyTypes",
        tag: "HealthCenter",
      },
    },
    services: props.isEdit ? [] : [{}],
  },
  actif: true,
  importance: 0,
  phone: "",
  email: "",
  addressOfActor: props.isEdit
    ? []
    : ([
        {
          addressTypeId: props.inputs.id,
          tag: "",
          row1Value: "",
          listIdCountry: "",
          town: "",
          zipCode: "",
          street: "",
          listIdUga: "",
          departement: "",
          addressIndex: 0,
        },
      ] as Array<AddressCreateInput>),
  rdvVisit: false,
  rdvDays: {
    Monday: {
      checked: false,
      times: [],
    },
    Tuesday: {
      checked: false,
      times: [],
    },
    Wednesday: {
      checked: false,
      times: [],
    },
    Thursday: {
      checked: false,
      times: [],
    },
    Friday: {
      checked: false,
      times: [],
    },
  },
  ursaaf: "",
  yearVisitObjective: 0,
});

const data = ref<any>({});
const servicesRef = ref([]);

defineExpose({
  servicesRef,
});

onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorHealthCenterForm"
    );
  data.value = resp.data;
  if (props.isEdit) {
    form.value = _.cloneDeep(actor.value.actorObject);
  }
});
const handleFormUpdate = (payload: AddressCreateInput, index: number) => {
  form.value.addressOfActor[index] = {
    ...form.value.addressOfActor[index],
    ...payload,
  };
};

const handleServiceUpdate = (payload: any, index: number) => {
  form.value.actorCompany.services[index] = _.cloneDeep(payload);
};
const addNewService = () => {
  form.value.actorCompany.services = [...form.value.actorCompany.services, {}];
  serviceKeys.value = [...serviceKeys.value,(serviceKeys.value[serviceKeys.value.length -1] + 1) ]

};

const handleSubmitForm = async () => {
  if (props.isEdit) {
    await editActor({ id, data: { ...form.value, rdvDays: undefined } });
  } else {
    await createActor({ data: form.value });
  }
};
const handleDeleteService = (index: number) => {
  console.log(index,"inndexxx")
  serviceKeys.value.splice(index, 1)
  form.value?.actorCompany?.services?.splice(index, 1);
};
const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  let serviceValidation = true;
  await Promise.all(
    servicesRef.value.map(async (serv: any) => {
      const validation = await serv.validate();
      if (!validation) {
        serviceValidation = false;
      }
    })
  );
  const addressValidation = await addressRef.value.refValidation();
  formEl.validate(async (valid: boolean) => {
    if (valid && serviceValidation && addressValidation) {
      if (!props.isEdit) {
        let seen = new Set();
        let hasDuplicates = form.value.actorCompany.services.some(function (
          currentObject
        ) {
          return seen.size === seen.add(currentObject.name).size;
        });
        if (hasDuplicates) {
          Components.ElMessage.error(
            "Les noms de services doivent être uniques"
          );
          return false;
        }
      }
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
        setActiveTabsName("healthCenter");
        setModal("");
      }
    } else {
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
  importance: [
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
  listIdUga: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
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
const servicesTeamIds = computed(() =>
  form.value.actorCompany.services
    .flatMap((serv: any) => serv.team?.map((tm: any) => tm.id))
    .filter((id) => id !== undefined)
);
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
</style>
