<template>
<div class="p-10">
  <div
  class="d-flex justify-content-between w-100"
  @click="handleCloseModal"
 
>
<div class="fs-2 fw-boldest noir pb-10  px-2">
  <span v-if="isEdit">Modifier</span><span v-else>Ajouter</span> un délégué pharmaceutique
</div>
  <inline-svg src="/svg/icons/close.svg"></inline-svg>
</div>

      <el-form ref="formRef" class="px-8" :model="form" :rules="rules">
        <el-form-item  prop="firstName">
          <label class="mb-3">Nom*</label>
          <el-input v-model="form.firstName" size="large"></el-input> 
          </el-form-item>
          <el-form-item  prop="lastName">
            <label class="mb-3">Prénom*</label>
            <el-input v-model="form.lastName" size="large"></el-input> 
            </el-form-item>
            <el-form-item  prop="telephone">
                <label class="mb-3">Téléphone portable*</label>
                <el-input v-model="form.telephone" size="large"></el-input> 
                </el-form-item>
          <el-form-item  prop="email">
            <label class="mb-3">E-mail*</label>
            <el-input v-model="form.email" size="large"></el-input> 
            </el-form-item>
            <div class="d-flex gap-5">
                <div class="w-100">
                  <el-form-item class="w-100" prop="delegateUgaDeparment">
                    <label>Département(s) et UGA*</label>
                    <el-select
                      value-key="id"
                      class="w-100"
                      id="multiple-searchable-select"
                      size="large"
                      filterable
                      multiple
                      v-model="delegateUgaDeparment"
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
                      v-for="tag in delegateUgaDeparment"
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

      </el-form>
      <div
      class="d-flex justify-content-end align-items-center p-6 px-8 gap-5 dialog-footer"
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
        @click="onSubmit(formRef)"
      >
        <inline-svg
          v-if="!isEdit"
          class="me-2"
          src="/svg/icons/plus.svg"
        ></inline-svg
        ><span v-if="!isEdit">Ajouter</span>
        <!--<span v-if="isEdit">Modifier</span> -->
        <span v-if="isEdit">Modifier</span>
      
      
      </el-button>
    </div>
  
    </div>
  </template>
  <script lang="ts" setup>
  import ConfirmModal from "@/components/modals/ConfirmModal.vue";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
  import type { ElForm } from "element-plus";
  import { t } from "@/core/i18n/translate";
  import { ref ,onMounted} from "vue";
  import { storeToRefs } from "pinia";
  import { usePharmaceuticalDelegateStore } from "@/store/usePharmaceuticalDelegateModule";
  const { createPharmaceuticalDelegate,editPharmaceuticalDelegate} = usePharmaceuticalDelegateStore();
  const emit = defineEmits(["close-modal", "approve-modal"]);
  import { setModal } from "@/core/helpers/config";
  import { checkPhone } from "@/core/helpers/customValidation";
  import _ from "lodash";
  import service from "@/service";
  const data = ref<any>({});
  const delegateUgaDeparment = ref([]);
  const handleUgaDepartmentTagClose = (tag: any) => {
    delegateUgaDeparment.value = delegateUgaDeparment.value.filter((uga) => uga !== tag);
};
import { useRoute } from "vue-router";
const route = useRoute();
const checkDisabled = (option) => {
  if (option.listTypeName === "UGA") {
    return delegateUgaDeparment.value.some(
      (e) => e?.code === option?.code?.substring(0, 2)
    );
    
  } else {
    return delegateUgaDeparment.value.some(
      (e) =>
        e.code?.startsWith(option?.code?.substring(0, 2)) &&
        e?.listTypeName === "UGA"
    );
    
  }
  
};
  const {error} = storeToRefs(usePharmaceuticalDelegateStore())
  const props = defineProps({

  isEdit: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: false,
  },
});
  const formRef = ref<InstanceType<typeof ElForm>>();
  const form = ref({
    firstName: "",
    lastName: "",
    telephone:"",
    email:"",
    ugaList: [],
    departments: [],
  });
  const rules = ref({
    firstName: [
      {
        required: true,
        message: t("entityForm.validation.required"),
        trigger: "blur",
      },
    ],
    lastName: [
      {
        required: true,
        message: t("entityForm.validation.required"),
        trigger: "blur",
      },
    ],
    telephone: [
    {
      required: true,
      validator: checkPhone,
      trigger: ["blur", "change"],
    },
    {
        required: true,
        message: t("entityForm.validation.required"),
        trigger: "blur",
      },
  ],
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
    delegateUgaDeparment : [
      {
      validator: (rule: any, value: any, callback: any) => {
        if (delegateUgaDeparment.value.length) {
          callback();
        } else {
          callback(new Error("Ce champ est requis"));
        }
      },
      trigger: ["blur", "change"],
    },
 ]
  });
  const handleCloseModal = () => {
    form.value = {
      firstName: "",
      lastName: "",
      telephone:"",
      email:"",
      ugaList: [],
      departments: [],
    };
    fileList.value = [];
    emit("close-modal");
    setModal("")
  };
  
  const fileList = ref([]);

  const handleSubmitForm = async () => {
  const ugaList = delegateUgaDeparment.value.filter(
    (e) => e.listTypeName === "UGA"
  );
  const departments = delegateUgaDeparment.value.filter(
    (e) => e.listTypeName === "Department"
  );
  const submitData = { ...form.value, ugaList, departments };

  if (props.isEdit) {
    await editPharmaceuticalDelegate({
      data: {
        ...submitData,
        ids:undefined
      },
      id: props.data.id,
      
    });
  } else {    await createPharmaceuticalDelegate({data:submitData});
    handleCloseModal();
  }
  

 
};

const handleCheck = (isChecked, val) => {
  if (isChecked) {
    
    delegateUgaDeparment.value = [...delegateUgaDeparment.value, val];
  } else {
    delegateUgaDeparment.value = delegateUgaDeparment.value.filter(
      (e) => e.id !== val.id
    );
  }
};
const isChecked = (group) => {
  
  const check = delegateUgaDeparment?.value?.some((e) => e?.id === group?.id);
  return check;
};
  const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid ) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } 
      else {
          Components.ElNotification.success({
            message: "opération effectué avec succès",
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


onMounted(async () => {

  const res: any =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "PharmaceuticalDelegateModal"
    );
    data.value = res.data;



   if (props.isEdit) {
    const delagateData = {
      ...props.data, _count:undefined
    };
    delegateUgaDeparment.value = delagateData.ugaList.concat(delagateData.departments)
    form.value = _.cloneDeep(delagateData);
  }
});
  </script>
  <style lang="scss" scoped>

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
  