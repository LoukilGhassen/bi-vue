<template>
  <div class="w-100">
    <div
      class="d-flex justify-content-between p-9 m-9 mt-5 noir"
      v-if="!isEdit"
    >
      <div class="fs-1 fw-boldest noir">Nouveau contact PDS</div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>

    <el-form
      :model="actorPersonData"
      :rules="rules"
      ref="ruleFormRef"
      v-if="actorPersonData.actorPerson"
      :class="!isEdit ? 'px-9 mx-9' : ''"
    >
      <div class="d-flex gap-5">
        <div class="mb-9 w-50 fit-content">
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">Contact</div>
            <div class="d-flex gap-5">
              <el-form-item
                class="w-25"
                prop="actorPerson.listIdGenreObject.id"
              >
                <label class="w-100">Civilité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder=""
                  v-model="actorPersonData.actorPerson.listIdGenreObject.id"
                >
                  <el-option
                    v-for="civility in data?.Civility"
                    :key="civility.id"
                    :label="civility.captionFr"
                    :value="civility.id"
                  />
                </el-select>
              </el-form-item>
              <div class="d-flex gap-5 align-items-center w-75">
                <el-form-item class="w-50" prop="actorName">
                  <label>Nom*</label>
                  <el-input size="large" v-model="actorPersonData.actorName">
                  </el-input>
                </el-form-item>
                <el-form-item class="w-50" prop="actorPerson.firstName">
                  <label>Prénom*</label>
                  <el-input
                    size="large"
                    v-model="actorPersonData.actorPerson.firstName"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50" prop="phone">
                <label>Portable</label>
                <el-input size="large" v-model="actorPersonData.phone">
                </el-input>
              </el-form-item>
              <el-form-item class="w-50" prop="email">
                <label>E-mail</label>
                <el-input size="large" v-model="actorPersonData.email">
                </el-input>
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50" prop="actorPerson.rpps">
                <label class="w-100">RPPS*</label>

                <el-input
                  class="w-100"
                  size="large"
                  v-model="actorPersonData.actorPerson.rpps"
                  :controls="false"
                />
              </el-form-item>
            </div>
          </div>
          <div class="form p-9 fit-content d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">Détails PDS</div>

            <div class="d-flex gap-5 w-100">
              <el-form-item
                class="w-50"
                prop="actorPerson.listIdActorPersonTitleObject.id"
              >
                <label class="w-100">Titre*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder="Sélectionnez un titre"
                  v-model="
                    actorPersonData.actorPerson.listIdActorPersonTitleObject.id
                  "
                >
                  <el-option
                    v-for="type in data?.ActorPersonTitle"
                    :key="type.id"
                    :label="type.captionFr"
                    :value="type.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                class="w-50"
                prop="actorPerson.listIdActorPersonQualityObject.id"
              >
                <label>Qualité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder="Sélectionnez une qualité"
                  v-model="
                    actorPersonData.actorPerson.listIdActorPersonQualityObject
                      .id
                  "
                >
                  <el-option
                    v-for="quality in data?.ActorPersonQuality"
                    :key="quality.id"
                    :label="quality.captionFr"
                    :value="quality.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item
                class="w-50"
                prop="listIdActorPersonSpecializationObject.id"
              >
                <label>Spécialité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  filterable
                  placeholder="Sélectionnez une spécialité"
                  v-model="
                    actorPersonData.listIdActorPersonSpecializationObject.id
                  "
                >
                  <el-option
                    v-for="spec in data?.ActorPersonSpecialization"
                    :key="spec.id"
                    :label="spec.captionFr"
                    :value="spec.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="w-50" prop="importance">
                <label>Importance*</label>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Pour modifier l'ordre d'importance, contactez votre supérieur."
                  placement="bottom"
                  v-if="isEdit"
                >
                  <el-select
                    class="w-100"
                    size="large"
                    placeholder="Sélectionnez un chiffre"
                    v-model.number="actorPersonData.importance"
                    :disabled="isEdit"
                  >
                    <el-option label="0" :value="0"></el-option>
                    <el-option label="1" :value="1"></el-option>
                    <el-option label="2" :value="2"></el-option>
                    <el-option label="3" :value="3"></el-option>
                  </el-select>
                </el-tooltip>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder="Sélectionnez un chiffre"
                  v-model.number="actorPersonData.importance"
                  v-else
                >
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="w-100" prop="actorActorOrientations">
              <label>Orientation*</label>
              <el-select
                value-key="id"
                class="w-100"
                size="large"
                filterable
                multiple
                placeholder="Sélectionnez une ou plusieurs orientations"
                v-model="actorPersonData.actorActorOrientations"
              >
                <el-option
                  v-for="orientation in data?.ActorPersoOrientation"
                  :key="orientation.id"
                  :label="orientation.captionFr"
                  :value="orientation"
                />
              </el-select>
            </el-form-item>
            <div class="mb-3">
              <el-tag
                v-for="tag in actorPersonData.actorActorOrientations"
                :key="tag"
                class="mx-1 my-2 p-5 fs-6 poppins"
                closable
                round
                color="#9A5AFF"
                @close="handleTagClose(tag)"
              >
                {{ tag?.tag }}
              </el-tag>
            </div>
            <el-form-item
              class="w-50 align-self-start"
              prop="actorPerson.rpps"
              v-if="isEdit"
            >
              <label class="w-100">URSAAF</label>
              <el-input
                class="w-100"
                size="large"
                placeholder=""
                v-model="actorPersonData.ursaaf"
                :controls="false"
              />
            </el-form-item>
          </div>
          <div class="d-flex flex-column gap-5">
            <div
              v-for="(address, index) in actorPersonData.addressOfActor"
              :key="address.addressIndex"
            >
              <div v-if="index % 2 === 0 && index !== 0">
                <div class="form d-flex flex-column p-9">
                  <div
                    class="fw-boldest noir pb-0 align-self-start d-flex justify-content-between w-100"
                    v-if="index !== 0"
                  >
                    <div>Adresse secondaire</div>
                    <div
                      class="cursor-pointer"
                      @click="handleDeleteAddress(index)"
                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>
                  </div>

                  <AddressForm
                    :isEdit="isEdit"
                    :data="actorPersonData.addressOfActor[index]"
                    @validate="handleValidate"
                    :submit="formsValidation.submitted"
                    :inputs="inputs"
                    @update="handleFormUpdate($event, index)"
                    :index="address.addressIndex"
                    :listUga="data?.UGA"
                    :showUga="true"
                  />
                </div>
                <div
                  v-if="
                    index === actorPersonData.addressOfActor.length - 1 &&
                    actorPersonData.addressOfActor.length < 5
                  "
                  @click="addNewAddress"
                  class="violet-hover cursor-pointer my-5 d-flex align-items-center gap-2 poppins"
                >
                  <inline-svg src="/svg/icons/plus.svg"> </inline-svg>

                  Ajouter une adresse
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-50">
          <div class="d-flex flex-column gap-5">
            <div
              v-for="(address, index) in actorPersonData.addressOfActor"
              :key="address.addressIndex"
            >
              <div v-if="index % 2 !== 0 || index === 0">
                <div class="form d-flex flex-column p-9">
                  <div
                    class="fw-boldest noir pb-0 align-self-start d-flex justify-content-between w-100"
                  >
                    <span v-if="index === 0"> Adresse principale </span>
                    <span v-else> Adresse secondaire </span>
                    <div
                      class="cursor-pointer"
                      v-if="index !== 0"
                      @click="handleDeleteAddress(index)"
                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>
                  </div>
                  <AddressForm
                    :isEdit="isEdit"
                    :data="actorPersonData.addressOfActor[index]"
                    @validate="handleValidate"
                    :submit="formsValidation.submitted"
                    :inputs="inputs"
                    @update="handleFormUpdate($event, index)"
                    :index="address.addressIndex"
                    :listUga="data?.UGA"
                    :showUga="true"
                  />
                </div>
                <div
                  v-if="
                    index === actorPersonData.addressOfActor.length - 1 &&
                    actorPersonData.addressOfActor.length < 5
                  "
                  @click="addNewAddress"
                  class="violet-hover cursor-pointer my-5 d-flex align-items-center gap-2 poppins"
                >
                  <inline-svg src="/svg/icons/plus.svg"> </inline-svg>
                  Ajouter une adresse
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="d-flex align-items-center w-50 flex-wrap">
          <el-checkbox
            v-model="actorPersonData.actorPerson.acceptAccompagnedVisit"
            label="Accepte les visites accompagnées"
            size="large"
            class="w-50 me-0 fw-normal poppins"
          />
          <el-checkbox
            v-model="actorPersonData.actorPerson.invitedToPC"
            label="Souhaite être invité aux RP"
            size="large"
            class="w-50 me-0 fw-normal poppins"
          />
          <el-checkbox
            v-model="actorPersonData.rdvVisit"
            label="Se visite uniquement sur RDV"
            size="large"
            class="w-50 me-2 fw-normal poppins"
          />

          <div
            class="form d-flex flex-column w-50 p-4 align-items-start mt-4 gap-3"
            v-if="actorPersonData.rdvVisit"
          >
            <p class="fw-boldest mb-9">Jours et heures de préférences</p>
            <div
              v-for="day in data?.days?.slice(0, 5)"
              class="d-flex justify-content-between align-items-start mb-4"
            >
              <el-checkbox
                v-if="actorPersonData.rdvDays[day.tag]"
                v-model="actorPersonData.rdvDays[day.tag].checked"
                :label="day.captionFr"
                size="large"
              />
              <div
                class="d-flex w-50 gap-4"
                v-if="
                  actorPersonData.rdvDays[day.tag] &&
                  actorPersonData.rdvDays[day.tag].checked
                "
              >
                <el-form-item
                  :prop="'rdvDays.' + day.tag + '.times[0]'"
                  class="mb-0"
                >
                  <el-time-picker
                    v-model="actorPersonData.rdvDays[day.tag].times[0]"
                    format="HH:mm"
                    placeholder="hh:mm"
                    class="w-100"
                    :default-value="new Date().setMinutes(0)"
                  />
                </el-form-item>
                <el-form-item
                  class="mb-0"
                  :prop="'actorPerson.rdvDays.' + day.tag + '.times[1]'"
                >
                  <el-time-picker
                    v-model="actorPersonData.rdvDays[day.tag].times[1]"
                    placeholder="hh:mm"
                    format="HH:mm"
                    class="w-100"
                    :default-value="new Date().setMinutes(0)"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button
        v-if="isEdit"
        type="primary"
        class="primary-btn poppins d-flex ms-auto my-4"
        size="large"
        @click="onSubmit(ruleFormRef)"
      >
        Modifier
      </el-button>
    </el-form>
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
import { onMounted, ref } from "vue";
import AddressForm from "@/components/forms/AddressForm.vue";
import { setModal } from "@/core/helpers/config";
import service from "@/service";
import { useActorPersonStore } from "@/store/useActorPersonModule";
import { AddressCreateInput, ActorPerson, List } from "./../../../index";
import { t } from "@/core/i18n/translate";
import { storeToRefs } from "pinia";

import { Components } from "@tekab-dev-team/storybook-devfactory";
import type { ElForm } from "element-plus";
import { useRoute } from "vue-router";
import _ from "lodash";
import { useActorStore } from "@/store/useActorModule";
import { checkPhone, checkRpps } from "@/core/helpers/customValidation";

const { error, actor } = storeToRefs(useActorStore());
const { createActor, editActor, setActiveTabsName } = useActorStore();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const handleCloseModal = () => {
  setModal("");
};

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  inputs: {
    type: Object,
    required: true,
  },
});
const route = useRoute();
const id = route.params.id as string;
const data = ref<any>({});
onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorPersonForm"
    );
  data.value = resp.data;
  if (props.isEdit) {
    actorPersonData.value = _.cloneDeep(actor.value.actorObject);
  }
});
const formsValidation = ref({
  submitted: false,
  counter: 0,
  mainFormValidation: false,
});
const handleValidate = async (valid: boolean) => {
  if (valid) {
    formsValidation.value.counter += 1;
    if (
      formsValidation.value.counter ===
        actorPersonData.value.addressOfActor.length &&
      formsValidation.value.mainFormValidation
    ) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      }
    }
  } else {
    formsValidation.value.counter = 0;
    formsValidation.value.submitted = false;
    formsValidation.value.mainFormValidation = false;
  }
};
const actorPersonData = ref({
  listIdActorPersonSpecializationObject: {
    id: "",
  },
  actif: true,
  importance: 0,
  phone: "",
  email: null,
  actorName: "",
  addressOfActor: props.isEdit
    ? []
    : ([{ addressIndex: 0 }] as Array<AddressCreateInput>),
  actorActorOrientations: [],
  rdvVisit: false,
  ursaaf: "",
  actorPerson: {
    firstName: "",
    nickname: "",
    birthLocation: "",
    notes: "",
    listIdActorPersonTitleObject: { id: "" },
    listIdActorPersonTypeObject: { id: "11" },
    listIdGenreObject: { id: "" },
    listIdActorPersonQualityObject: { id: "" },
    acceptAccompagnedVisit: false,
    invitedToPC: false,
    rpps: "",
  },
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
});
const handleFormUpdate = (payload: AddressCreateInput, index: number) => {
  actorPersonData.value.addressOfActor[index] = {
    ...actorPersonData.value.addressOfActor[index],
    ...payload,
  };
};
const addNewAddress = () => {
  actorPersonData.value.addressOfActor = [
    ...actorPersonData.value.addressOfActor,
    {
      addressIndex:
        actorPersonData.value.addressOfActor[
          actorPersonData.value.addressOfActor.length - 1
        ].addressIndex + 1,
    } as AddressCreateInput,
  ];
};
const handleTagClose = (tag: any) => {
  actorPersonData.value.actorActorOrientations =
    actorPersonData.value.actorActorOrientations.filter(
      (orientation) => orientation !== tag
    );
};

const handleSubmitForm = async () => {
  const actorOrientations = actorPersonData.value.actorActorOrientations.map(
    (e: List) => e.id
  );
  if (props.isEdit) {
    await editActor({
      data: {
        ...actorPersonData.value,
        email: actorPersonData.value?.email?.length
          ? actorPersonData.value.email
          : null,
        actorActorOrientations: actorOrientations,
        addressOfActor: actorPersonData.value.addressOfActor.map(
          (item, index) => {
            return {
              ...item,
              addressIndex: index,
            };
          }
        ),
      },
      id: id,
    });
  } else {
    await createActor({
      data: {
        ...actorPersonData.value,
        email: actorPersonData.value?.email?.length
          ? actorPersonData.value.email
          : null,
        actorActorOrientations: actorOrientations,
      },
    });
    handleCloseModal();
  }
};
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formsValidation.value.submitted = true;
  formEl.validate(async (valid) => {
    if (valid) {
      formsValidation.value.mainFormValidation = true;
      if (
        formsValidation.value.counter ===
        actorPersonData.value.addressOfActor.length
      ) {
        await handleSubmitForm();

        if (!!error.value) {
          formsValidation.value.mainFormValidation = false;
          Components.ElMessage.error(error.value?.message);
          console.log(error, "error");
        } else {
          setActiveTabsName("pds");
          setModal("");
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      } else {
        formsValidation.value.mainFormValidation = false;
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

const rules = {
  phone: [
    {
      validator: checkPhone,
      trigger: ["change", "blur"],
    },
  ],

  "actorPerson.listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  actorName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actorPerson.firstName": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actorPerson.rpps": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: checkRpps,
      trigger: ["change", "blur"],
    },
  ],
  "listIdUgaObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actorPerson.listIdActorPersonTitleObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actorPerson.listIdActorPersonQualityObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "listIdActorPersonSpecializationObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  importance: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  actorActorOrientations: [
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
  departement: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
};
const handleDeleteAddress = (index: number) => {
  actorPersonData.value.addressOfActor.splice(index, 1);
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
</style>
