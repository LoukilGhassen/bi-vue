<template>
  <div class="w-100">
    <div
      class="d-flex justify-content-between py-9 m-9 mt-5 noir"
      v-if="!isEdit"
    >
      <div class="fs-1 fw-boldest noir">Nouveau contact Pharmacie</div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :class="!isEdit ? 'px-9 mx-9' : ''"
      :model="form"
      :rules="rules"
    >
      <div class="d-flex gap-9">
        <div class="d-flex flex-column gap-3 w-50">
          <div class="form fit-content p-9 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Coordonnées de la pharmacie
            </div>
            <el-form-item prop="actorName">
              <label class="w-100">Nom*</label>
              <el-input size="large" v-model="form.actorName" />
            </el-form-item>
            <AddressForm
              ref="addressRef"
              :isEdit="isEdit"
              :data="form.addressOfActor[0]"
              :inputs="pharmacyAddress"
              @update="handleFormUpdate($event, 0)"
              :index="0"
              :key="
                form.addressOfActor.length === 0
                  ? 1
                  : form.addressOfActor[0].addressIndex
              "
              :listUga="data?.UGA"
            />
            <div class="d-flex justify-content-between gap-5">
              <el-form-item class="w-50" prop="phone">
                <label>Portable</label>
                <el-input v-model="form.phone" size="large" />
              </el-form-item>
              <el-form-item class="w-50" prop="email">
                <label>E-mail</label>
            <el-input v-model="form.email" size="large" />
              </el-form-item>
            </div>
            <div class="d-flex justify-content-between gap-5">
              <el-form-item class="w-50" v-if="isEdit">
                <label>URSAAF</label>
                <el-input v-model="form.ursaaf" size="large" />
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
                    v-model.number="form.importance"
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
                  v-model.number="form.importance"
                  v-else
                >
                  <el-option label="0" :value="0"></el-option>
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="3" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            
          </div>
          <el-checkbox
            v-model="form.rdvVisit"
            label="Le contact se reserve uniquement sur rendez-vous"
            size="large"
            class="w-50 me-2 fw-normal poppins"
          />
          <div
            class="form d-flex flex-column w-50 p-4 align-items-start mt-4 gap-3"
          >
            <p class="fw-boldest mb-2 noir">Commande en direct</p>
            <el-radio-group
            class="ml-4 poppins"
            v-model="form.listIdInitialValueObject.tag"
          >
            <el-radio
              v-for="item in data?.ProductOrderType"
              :label="item.tag"
              size="large"
              class="noir"
              :key="item.id"
              ><span class="noir">{{ item.captionFr }}</span>
            </el-radio>
          </el-radio-group>
          </div>
          <div class="d-flex flex-column gap-5" v-if="isEdit">
            <div
              v-for="(address, index) in form.addressOfActor"
              :key="address.addressIndex"
            >
              <div v-if="index % 2 === 0 && index !== 0">
                <div class="form d-flex flex-column p-9">
                  <div
                    class="fw-boldest noir align-self-start d-flex justify-content-between w-100"
                  >
                    <div>Adresse du dépôt</div>
                    <div
                      class="cursor-pointer"
                      @click="handleDeleteAddress(index)"
                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>
                  </div>

                  <AddressForm
                    isEdit
                    :validation="false"
                    :data="form.addressOfActor[index]"
                    :inputs="depositAddress"
                    @update="handleFormUpdate($event, index)"
                    :listUga="data?.UGA"
                  />
                </div>
                <div
                  v-if="
                    index === form.addressOfActor.length - 1 &&
                    form.addressOfActor.length < 5
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
        <div class="d-flex flex-column gap-3 w-50">
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Identité du responsable de la pharmacie
            </div>
            <div class="d-flex gap-5">
              <el-form-item
                class="w-25"
                prop="actor1[0].actor2Object.actorPerson.listIdGenreObject.id"
              >
                <label class="w-100">Civilité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder=""
                  v-model="
                    form.actor1[0].actor2Object.actorPerson.listIdGenreObject.id
                  "
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
                <el-form-item
                  class="w-50"
                  prop="actor1[0].actor2Object.actorName"
                >
                  <label>Nom*</label>
                  <el-input
                    size="large"
                    v-model="form.actor1[0].actor2Object.actorName"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  class="w-50"
                  prop="actor1[0].actor2Object.actorPerson.firstName"
                >
                  <label>Prénom*</label>
                  <el-input
                    size="large"
                    v-model="form.actor1[0].actor2Object.actorPerson.firstName"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50" prop="actor1[0].actor2Object.phone">
                <label>Portable</label>
                <el-input
                  size="large"
                  v-model="form.actor1[0].actor2Object.phone"
                >
                </el-input>
              </el-form-item>
              <el-form-item class="w-50" prop="actor1[0].actor2Object.email">
                <label>E-mail</label>
                <el-input
                  size="large"
                  v-model="form.actor1[0].actor2Object.email"
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item
                class="w-50"
                prop="actor1[0].actor2Object.addressOfActor[0].telephone"
              >
                <label class="w-100">Telephone</label>

                <el-input
                  class="w-100"
                  size="large"
                  v-model="
                    form.actor1[0].actor2Object.addressOfActor[0].telephone
                  "
                />
              </el-form-item>
              <el-form-item
                class="w-50"
                prop="actor1[0].actor2Object.actorPerson.rpps"
              >
                <label class="w-100">RPPS*</label>
                <el-input
                  class="w-100"
                  size="large"
                  :controls="false"
                  v-model="form.actor1[0].actor2Object.actorPerson.rpps"
                />
              </el-form-item>
            </div>
          </div>

          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Identité du responsable d'achat
            </div>
            <div class="d-flex gap-5">
              <el-form-item
                class="w-25"
                prop="actor1[1].actor2Object.actorPerson.listIdGenreObject.id"
              >
                <label class="w-100">Civilité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder=""
                  v-model="
                    form.actor1[1].actor2Object.actorPerson.listIdGenreObject.id
                  "
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
                <el-form-item
                  class="w-50"
                  prop="actor1[1].actor2Object.actorName"
                >
                  <label>Nom*</label>
                  <el-input
                    size="large"
                    v-model="form.actor1[1].actor2Object.actorName"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  class="w-50"
                  prop="actor1[1].actor2Object.actorPerson.firstName"
                >
                  <label>Prénom*</label>
                  <el-input
                    size="large"
                    v-model="form.actor1[1].actor2Object.actorPerson.firstName"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50" prop="actor1[1].actor2Object.phone">
                <label>Portable</label>
                <el-input
                  size="large"
                  v-model="form.actor1[1].actor2Object.phone"
                >
                </el-input>
              </el-form-item>
              <el-form-item class="w-50" prop="actor1[1].actor2Object.email">
                <label>E-mail</label>
                <el-input
                  size="large"
                  v-model="form.actor1[1].actor2Object.email"
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item
                class="w-50"
                prop="actor1[1].actor2Object.addressOfActor[0].telephone"
              >
                <label class="w-100">Telephone</label>

                <el-input
                  class="w-100"
                  size="large"
                  v-model="
                    form.actor1[1].actor2Object.addressOfActor[0].telephone
                  "
                />
              </el-form-item>
            </div>
          </div>

          <div class="d-flex flex-column gap-5" v-if="isEdit">
            <div
              v-for="(address, index) in form.addressOfActor"
              :key="address.addressIndex"
            >
              <div v-if="index % 2 !== 0 && index !== 0">
                <div class="form d-flex flex-column p-9">
                  <div
                    class="fw-boldest noir align-self-start d-flex justify-content-between w-100"
                  >
                    <div>Adresse du dépôt</div>
                    <div
                      class="cursor-pointer"
                      @click="handleDeleteAddress(index)"
                      v-if="index !== 1"
                    >
                      <inline-svg src="/svg/icons/trash.svg"> </inline-svg>
                    </div>
                  </div>
                  <AddressForm
                    :validation="false"
                    isEdit
                    :data="form.addressOfActor[index]"
                    :inputs="depositAddress"
                    @update="handleFormUpdate($event, index)"
                    :listUga="data?.UGA"
                  />
                </div>
                <div
                  v-if="
                    index === form.addressOfActor.length - 1 &&
                    form.addressOfActor.length < 5
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
import AddressForm from "@/components/forms/AddressForm.vue";
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const route = useRoute();
const id = route.params.id as string;
import _ from "lodash";
import { useRoute } from "vue-router";
import { checkPhone, checkRpps } from "@/core/helpers/customValidation";
const addressRef = ref();

const props = defineProps({
  depositAddress: {
    required: false,
  },
  pharmacyAddress: {
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const form = ref({
  actorName: "",
  actorCompany: {
    listIdActorCompanyTypeObject: {
      listTypeName_tag: {
        listTypeName: "ActorCompanyTypes",
        tag: "Pharmacy",
      },
    },
  },
  listIdInitialValueObject:{
      listTypeNameObject: {
        listTypeName:"ProductOrderType",
      },
      tag: "Yes",
  },
  actif: true,
  importance: null,
  phone: "",
  email: "",
  addressOfActor: props.isEdit
    ? []
    : ([
        {
          addressTypeId: props.pharmacyAddress.id,
          tag: "",
          town: "",
          zipCode: "",
          street: "",
          addressIndex: 0,
          listIdUga: "",
          departement: "",
        },
        {
          addressIndex: 1,
          tag: "",
          town: "",
          zipCode: "",
          street: "",
          addressTypeId: props.depositAddress.id,
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
  actor1: [
    {
      listIdActorRelationshipTypeObject: {
        listTypeName_tag: {
          listTypeName: "actorRelationShipType",
          tag: "Manager",
        },
      },
      actor2Object: {
        actorName: "",
        phone: "",
        email: "",
        addressOfActor: [
          {
            telephone: "",
            addressTypeId: "2016",
            tag: "",
            town: "",
            zipCode: "",
            street: "",
            streetNb: 0,
          },
        ],
        actorPerson: {
          rpps: "",
          firstName: "",
          listIdGenreObject: {
            id: "",
          },
          listIdActorPersonTypeObject: {
            listTypeName_tag: {
              listTypeName: "ActorPersonTypes",
              tag: "Relation",
            },
          },
        },
      },
    },
    {
      listIdActorRelationshipTypeObject: {
        listTypeName_tag: {
          listTypeName: "actorRelationShipType",
          tag: "Purchasing Manager",
        },
      },
      actor2Object: {
        actorName: "",
        phone: "",
        email: "",
        addressOfActor: [
          {
            telephone: "",
            addressTypeId: "2018",
            tag: "",
            town: "",
            zipCode: "",
            street: "",
            streetNb: 0,
          },
        ],
        actorPerson: {
          rpps: "",
          firstName: "",
          listIdGenreObject: {
            id: "",
          },
          listIdActorPersonTypeObject: {
            listTypeName_tag: {
              listTypeName: "ActorPersonTypes",
              tag: "Relation",
            },
          },
        },
      },
    },
  ],
});

const data = ref<any>({});
const addNewAddress = () => {
  form.value.addressOfActor = [
    ...form.value.addressOfActor,
    {
      addressIndex:
        form.value.addressOfActor[form.value.addressOfActor.length - 1]
          .addressIndex + 1,
    } as AddressCreateInput,
  ];
};
const handleFormUpdate = (payload: AddressCreateInput, index: number) => {
  form.value.addressOfActor[index] = {
    ...form.value.addressOfActor[index],
    ...payload,
  };
};
const handleDeleteAddress = (index: number) => {
  form.value.addressOfActor.splice(index, 1);
};

onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorPharmacyForm"
    );
  data.value = resp.data;
  if (props.isEdit) {
    form.value = _.cloneDeep(actor.value.actorObject);
  }
});
const handleSubmitForm = async () => {
  if (props.isEdit) {
    const data = {
      ...form.value,
      addressOfActor: form.value.addressOfActor.map((item, index) => {
        return {
          ...item,
          addressIndex: index,
          streetNb: item.streetNb === 0 ? undefined : item.streetNb,
        };
      }),
    };
    await editActor({ id, data: data });
  } else {
    await createActor({ data: form.value });
  }
};
const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  const addressValidation = await addressRef.value.refValidation();

  formEl.validate(async (valid) => {
    if (valid && addressValidation) {
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
        setActiveTabsName("pharmacy");
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
  "actor1[0].actor2Object.email": [
    {
      required: false,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: "change",
    },
  ],
  "actor1[1].actor2Object.email": [
    {
      required: false,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: "change",
    },
  ],
  "actor1[0].actor2Object.phone": [
    {
      validator: checkPhone,
      trigger: ["change", "blur"],
    },
  ],
  "actor1[1].actor2Object.phone": [
    {
      validator: checkPhone,
      trigger: ["change", "blur"],
    },
  ],
  "addressOfActor[0].listIdUga": [
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
  "addressOfActor[0].departement": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
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
  "addressOfActor[0].listIdCountry": [
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
      trigger: ["change", "blur"],
    },
  ],
  "listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actor1[0].actor2Object.actorName": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor1[0].actor2Object.actorPerson.listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actor1[0].actor2Object.actorPerson.firstName": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor1[0].actor2Object.actorPerson.rpps": [
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
  "actor1[1].actor2Object.actorName": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor1[1].actor2Object.actorPerson.listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actor1[1].actor2Object.actorPerson.firstName": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor1[1].actor2Object.addressOfActor[0].telephone": [
    {
      validator: checkPhone,
      trigger: ["change", "blur"],
    },
  ],
  "actor1[0].actor2Object.addressOfActor[0].telephone": [
    {
      validator: checkPhone,
      trigger: ["change", "blur"],
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
</style>
