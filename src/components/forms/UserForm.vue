<template>
  <div class="w-100" :class="{ 'p-15': !isEdit }">
    <div class="d-flex justify-content-between mb-5 noir" v-if="!isEdit">
      <div class="fs-1 fw-boldest noir">Ajouter un utilisateur</div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
    <el-form ref="ruleFormRef" :model="form"  :disabled="!$can('edit','CreateModifyUser')"  :rules="rules">
      <div class="d-flex gap-5 w-100" >
        <div class="mb-9 fit-content w-75">
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Information de l’utilisateur
            </div>
            <div class="d-flex gap-5">
              <el-form-item class="w-25" prop="listIdGenreObject.id">
                <label class="w-100">Civilité*</label>
                <el-select
                  class="w-100"
                  size="large"
                  placeholder=""
                  v-model="form.listIdGenreObject.id"
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
                <el-form-item class="w-50" prop="lastName">
                  <label>Nom*</label>
                  <el-input size="large" v-model="form.lastName"> </el-input>
                </el-form-item>
                <el-form-item class="w-50" prop="firstName">
                  <label>Prénom*</label>
                  <el-input v-model="form.firstName" size="large"> </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-50" prop="telephone">
                <label>Téléphone portable</label>
                <el-input size="large" v-model="form.telephone"> </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">
              Adresse de l’utilisateur
            </div>
            <div class="d-flex gap-5">
              <el-form-item class="w-150px" prop="addressOfUser.streetNb">
                <label class="w-100">N°*</label>
                <el-input-number
                  :controls="false"
                  class="w-100"
                  v-model.number="form.addressOfUser.streetNb"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-50" prop="addressOfUser.street">
                <label>Rue*</label>
                <el-input
                  v-model="form.addressOfUser.street"
                  type="text"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-50">
                <label>Complément d'adresse</label>
                <el-input
                  class="w-100"
                  v-model="form.addressOfUser.notes"
                  type="text"
                  size="large"
                />
              </el-form-item>
            </div>
            <div class="d-flex gap-5 w-100">
              <el-form-item class="w-150px" prop="addressOfUser.zipCode">
                <label>Code postal*</label>
                <el-input
                  v-model="form.addressOfUser.zipCode"
                  type="text"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-50" prop="addressOfUser.town">
                <label>Ville*</label>
                <el-input
                  v-model="form.addressOfUser.town"
                  type="text"
                  size="large"
                />
              </el-form-item>
              <el-form-item class="w-50" prop="addressOfUser.listIdCountryObject.id">
                <label class="w-100">Pays*</label>
                <el-select
                  remote
                  v-model="form.addressOfUser.listIdCountryObject.id"
                  filterable
                  clearable
                  size="large"
                  :remote-method="remoteMethod"
                  placeholder="  "
                  class="w-100"
                >
                  <el-option
                    v-for="country in countries"
                    :key="country.id"
                    :label="country.captionFr"
                    :value="country.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="form fit-content p-9 mb-5 d-flex flex-column">
            <div class="fw-boldest noir mb-3 align-self-start">Affectation</div>
            <div class="d-flex gap-5">
              <div class="w-100">
                <el-form-item class="w-100">
                  <label>UGA et départements</label>
                  <el-select
                    value-key="id"
                    class="w-100"
                    id="multiple-searchable-select"
                    size="large"
                    filterable
                    multiple
                    v-model="userUgaDeparment"
                    placeholder="Sélectionnez"
                  >
                    <el-option-group
                      v-for="group in data?.Department"
                      :key="group.id"
                    >
                      <template #default>
                        <div class="w-100 ms-5">
                          <el-checkbox
                            :disabled="checkDisabled(group)"
                            class="w-100"
                            :label="group.code"
                            size="large"
                            :model-value="isChecked(group)"
                            @change="handleCheck($event, group)"
                          />
                        </div>
                        <el-option
                          v-for="ugaDepartment in data?.UGA?.filter((el) =>
                            el?.code?.startsWith(group.code)
                          )"
                          :key="ugaDepartment.id"
                          :label="ugaDepartment.code"
                          :value="ugaDepartment"
                          :disabled="checkDisabled(ugaDepartment)"
                        />
                      </template>
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <div class="mb-3">
                  <el-tag
                    v-for="tag in userUgaDeparment"
                    :key="tag"
                    class="mx-1 my-2 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleUgaDepartmentTagClose(tag)"
                  >
                    {{ tag?.tag }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="d-flex gap-5">
              <div class="w-50">
                <el-form-item class="w-100">
                  <label>Spécialités</label>
                  <el-select
                    id="multiple-searchable-select"
                    value-key="id"
                    class="w-100"
                    size="large"
                    filterable
                    multiple
                    placeholder="Sélectionnez une spécialité"
                    v-model="form.specialities"
                  >
                    <el-option
                      v-for="speciality in data?.ActorPersonSpecialization"
                      :key="speciality.id"
                      :label="speciality.captionFr"
                      :value="speciality"
                    />
                  </el-select>
                </el-form-item>
                <div class="mb-3">
                  <el-tag
                    v-for="tag in form.specialities"
                    :key="tag"
                    class="mx-1 my-2 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleSpecialitiesTagClose(tag)"
                  >
                    {{ tag?.captionFr }}
                  </el-tag>
                </div>
              </div>
              <div class="w-50">
                <el-form-item class="w-100" prop="actorActorOrientations">
                  <label>Carnet d’adresse</label>
                  <el-select
                    id="multiple-searchable-select"
                    value-key="id"
                    class="w-100"
                    size="large"
                    filterable
                    multiple
                    placeholder="Sélectionnez un type de contact"
                    v-model="form.contacts"
                  >
                    <el-option
                      v-for="contact in data?.Contacts"
                      :key="contact.id"
                      :label="contact.captionFr"
                      :value="contact"
                    />
                  </el-select>
                </el-form-item>
                <div class="mb-3">
                  <el-tag
                    v-for="tag in form.contacts"
                    :key="tag"
                    class="mx-1 my-2 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleContactsTagClose(tag)"
                  >
                    {{ tag?.captionFr }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="d-flex gap-5">
              <div class="w-50">
                <el-form-item class="w-100" prop="userTypes">
                  <label>Rôle(s)(2 maximum)*</label>
                  <el-select
                    value-key="id"
                    class="w-100"
                    size="large"
                    filterable
                    id="multiple-searchable-select"
                    multiple
                    placeholder="Sélectionnez un rôle"
                    v-model="form.userTypes"
                    :multiple-limit="2"
                  >
                    <el-option
                      v-for="role in roleList"
                      :key="role.id"
                      :label="role.roleName"
                      :value="role"
                    />
                  </el-select>
                </el-form-item>
                <div class="mb-3">
                  <el-tag
                    v-for="tag in form.userTypes"
                    :key="tag"
                    class="mx-1 my-2 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleUserTypeRoleTagClose(tag)"
                  >
                    {{ tag?.roleName }}
                  </el-tag>
                </div>
              </div>
              <div class="w-50" v-can:access="'AttachTeams'">
                <el-form-item class="w-100">
                  <label>Equipe rattachée</label>
                  <el-select
                    id="multiple-searchable-select"
                    size="large"
                    class="w-100"
                    placeholder="Sélectionnez un membre"
                    multiple
                    remote
                    filterable
                    :remote-method="queryAttendant"
                    value-key="id"
                    :disabled="!$can('edit','AttachTeams')"
                    v-model="form.user1Team"
                  >
                    <el-option
                      v-for="item in userTeam"
                      :key="item.id"
                      :label="item.lastName"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <div>
                  <el-tag
                    v-for="tag in form.user1Team"
                    :key="tag.id"
                    class="mx-1 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleUserTeamTagClose(tag)"
                  >
                    {{ tag.lastName }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form fit-content p-9 mb-5 d-flex flex-column w-50">
          <div class="fw-boldest noir mb-3 align-self-start">
            Identifiant utilisateur
          </div>
          <div class="d-flex flex-column">
            <el-form-item class="w-100" prop="username">
              <label>E-mail*</label>
              <el-input size="large" v-model="form.username" :disabled="isEdit"> </el-input>
            </el-form-item>
            <el-form :model="newEmailForm" ref="ruleEmailFormRef" :rules="newEmailRules" >
              <el-form-item class="w-100" prop="newEmail"   v-if="isEdit">
                <label>Nouvel e-mail</label>
                <el-input size="large" v-model="newEmailForm.newEmail"> </el-input>
              </el-form-item>
              <el-form-item class="w-100" prop="newEmailConfirm"  v-if="isEdit">
                <label>Confirmation du nouvel e-mail</label>
                <el-input size="large" v-model="newEmailForm.newEmailConfirm"> </el-input>
              </el-form-item>  
            </el-form>
          </div>
        </div>
      </div>
      <el-button
        v-if="isEdit && $can('edit','CreateModifyUser')"
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
import { onMounted, ref, watch } from "vue";
import { setModal } from "@/core/helpers/config";
import { t } from "@/core/i18n/translate";
import { storeToRefs } from "pinia";
import service from "@/service";

import { Components } from "@tekab-dev-team/storybook-devfactory";
import UpdateUserRole from "@/components/modals/UpdateUserRole.vue";
import type { ElForm } from "element-plus";
import { useRoute } from "vue-router";
import _ from "lodash";
import { supabase } from "@/core/services/SupabaseClientService";
import { useUserStore } from "@/store/useUserModule";
import { checkPhone } from "@/core/helpers/customValidation";
import { can } from "@/core/helpers/permission";

const newEmailForm = ref({
   newEmail:"",
   newEmailConfirm :""
})
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const handleCloseModal = () => {
  setModal("");
};
const { createUser, editUser } = useUserStore();
const { user } = storeToRefs(useUserStore());
const form = ref({
  listIdGenreObject: {
    id: "",
  },
  lastName: "",
  firstName: "",
  telephone: "",
  username: "",
  addressOfUser: {
    streetNb: 0,
    street: "",
    notes: "",
    zipCode: "",
    town: "",
    listIdCountryObject: {
      id: "",
    },
  },
  ugaList: [],
  departments: [],
  specialities: [],
  contacts: [],
  userTypes: [],
  user1Team: [],
});

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const { error } = storeToRefs(useUserStore());
const route = useRoute();
const id = route.params.id as string;
const data = ref<any>({});
const countries = ref([]);
const userTeam = ref([]);
const userUgaDeparment = ref([]);
const remoteMethod = async (query: string) => {
  const { data } = query
    ? await supabase
        .from("List")
        .select("captionFr,tag,id")
        .eq("listTypeName", "Countries")
        .ilike("captionFr", `%${query}%`)
    : await supabase
        .from("List")
        .select("captionFr,tag,id")
        .eq("listTypeName", "Countries");
  countries.value = data;
};
const areRolesEqual = ref(false);
const handleUgaDepartmentTagClose = (tag: any) => {
  userUgaDeparment.value = userUgaDeparment.value.filter((uga) => uga !== tag);
};
const initialRole = ref();
const checkDisabled = (option) => {
  if (option.listTypeName === "UGA") {
    return userUgaDeparment.value.some(
      (e) => e.code === option.code.substring(0, 2)
    );
  } else {
    return userUgaDeparment.value.some(
      (e) =>
        e.code.startsWith(option.code.substring(0, 2)) &&
        e.listTypeName === "UGA"
    );
  }
};
const ruleEmailFormRef =  ref()
const handleSpecialitiesTagClose = (tag: any) => {
  if(can('edit','CreateModifyUser')){  
    form.value.specialities = form.value.specialities.filter(
    (speciality) => speciality !== tag
  );}

};

const handleContactsTagClose = (tag: any) => {
  if(can('edit','CreateModifyUser')){ 
    form.value.contacts = form.value.contacts.filter(
    (contact) => contact !== tag
  );}
 
};

const handleUserTypeRoleTagClose = (tag: any) => {
  if(can('edit','CreateModifyUser')){ 
    form.value.userTypes = form.value.userTypes.filter(
    (type) => type.id !== tag.id
  );}
 
};
const handleUserTeamTagClose = (tag: any) => {
  if(can('edit','AttachTeams') && can('edit','CreateModifyUser')){
    form.value.user1Team = form.value.user1Team.filter((user) => user !== tag);
  }
};

const queryAttendant = async (queryString: string) => {
  const editArg = props.isEdit
    ? {
        "where[id][not]": route.params?.id,
      }
    : {};
  const { data } = await service.api.userControllerFindMany({
    take: 50,
    skip: 0,
    "where[lastName][contains]": queryString ? `${queryString}` : "",
    "where[lastName][mode]": "insensitive",
    "where[OR][0][userTypes][some][role][tag]": "VM",
    "where[OR][1][userTypes][some][role][tag]": "DIR0",
    "where[OR][2][userTypes][some][role][tag]": "DIR1",
    "where[OR][3][userTypes][some][role][tag]": "DIR2",
    ...editArg,
  });
  userTeam.value = data.paginatedResult;
};
const roleList = ref([]);
const handleSubmitForm = async () => {
  const ugaList = userUgaDeparment.value.filter(
    (e) => e.listTypeName === "UGA"
  );
  const departments = userUgaDeparment.value.filter(
    (e) => e.listTypeName === "Department"
  );
  const submitData = { ...form.value, ugaList, departments };
  if (props.isEdit) {
    const userTypesIds = form.value?.userTypes?.map((userType) => userType.id);
    areRolesEqual.value =
      userTypesIds.length === initialRole.value.length &&
      userTypesIds.every((item) => initialRole.value?.includes(item));
    if (!areRolesEqual.value) {
      setModal("UpdateUserRole", {
        title: "Modification du rôle",
        confirmTitle: "Modifier",
        user: {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
        },
        updateData: {
          ...submitData,
          username: newEmailForm.value.newEmail.length ? newEmailForm.value.newEmail : undefined,
        },
        updateId: id,
      });
    } else {
      await editUser({
        id,
        data: {
          ...submitData,
          username: newEmailForm.value.newEmail.length ? newEmailForm.value.newEmail : undefined
        },
      });
       if(newEmailForm.value.newEmail?.length && newEmailForm.value.newEmailConfirm?.length){
          form.value.username = newEmailForm.value.newEmail
          newEmailForm.value.newEmail = newEmailForm.value.newEmailConfirm = ""
       } 

    }
  } else {
    await createUser({ data: {...submitData,roles: ["user"]} });
    handleCloseModal();
  }
};

const handleCheck = (isChecked, val) => {
  if (isChecked) {
    userUgaDeparment.value = [...userUgaDeparment.value, val];
  } else {
    userUgaDeparment.value = userUgaDeparment.value.filter(
      (e) => e.id !== val.id
    );
  }
};
const isChecked = (group) => {
  const check = userUgaDeparment.value.some((e) => e.id === group.id);
  return check;
};
const validateConfirmEmail = (rule: any, value: any, callback: any) => {
      if (value !== newEmailForm.value?.newEmail) {
        callback(
          new Error(
              "l'email et l'email de confirmation ne sont pas les mêmes"
          )
        );
      } else {
        callback();
      }
    };
const newEmailRules = {
  newEmail: [
    {
      required: false,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: ["blur","change"],
    },
  ],
  newEmailConfirm: [
    {
      required: false,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: ["blur","change"],
    },
    {
      validator:validateConfirmEmail,
      trigger: ["blur","change"],
    }
  ],

};

const rules = {
  "listIdGenreObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    },
  ],
  firstName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  lastName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "addressOfUser.streetNb": [
    {
      required: true,

      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "addressOfUser.street": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "addressOfUser.zipCode": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "addressOfUser.town": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "addressOfUser.listIdCountryObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],

  username: [
    {
      required: true,
      type: "email",
      message: `Ladresse e-mail est invalide`,
      trigger: ["blur","change"],
    },
  ],
  userTypes: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],

  telephone: [
    {
      validator: checkPhone,
      trigger: ["blur", "change"],
    },
  ],
};

const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  let emailValid = false
  ruleEmailFormRef.value.validate(async (validEmail:boolean) => {
      emailValid= validEmail
    })
  formEl.validate(async (valid) => {
    if (valid && emailValid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        if (!(props.isEdit && !areRolesEqual.value)) {
          setModal("");
          Components.ElNotification.success({
            message: "opération effectué avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};



onMounted(async () => {
  setTimeout(() => {
    const elements = document?.querySelectorAll("#multiple-searchable-select");
    elements.forEach((e) => {
      e.removeAttribute("readonly");
    });
  }, 1000);
  const res: any =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "UserForm"
    );
  data.value = res.data;
  if (props.isEdit) {
    const userData = {
      ...user.value,
      listIdGenreObject:
        user.value.listIdGenreObject && user.value.listIdGenreObject.id
          ? { id: user.value.listIdGenreObject.id }
          : { id: "" },
    };
    userUgaDeparment.value = userData.ugaList.concat(userData.departments);
    initialRole.value = userData?.userTypes?.map((e) => e.id);
    form.value = _.cloneDeep(userData);
  }
  const roleRes = await service.api.roleControllerFindMany({
    take: 50,
    skip: 0,
  });
  roleList.value = roleRes?.data?.paginatedResult;
  await remoteMethod("");
  await queryAttendant("");
});
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
