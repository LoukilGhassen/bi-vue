<template>
  <div class="card-password__container p-10">
    <div class="fs-2 mb-5 fw-boldest color-gris">
      <span>Modification du mot de passe</span>
    </div>

    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="300px"
        label-position="top"
      >
        <el-form-item label="Mot de passe actuel" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" size="large" />
        </el-form-item>

        <el-form-item label="Nouveau mot de passe" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" size="large" />
        </el-form-item>
        <el-checkbox-group
          class="d-flex mb-5 flex-column"
          v-model="ruleForm.type"
        >
          <el-checkbox
            label="1 Majuscule"
            name="type"
            size="large"
            :checked="hasUpperCase"
            :disabled="!hasUpperCase"
            @change="updateCheckbox('1 Majuscule')"
          />
          <el-checkbox
            label="1 Minuscule"
            name="type"
            size="large"
            :checked="hasLowerCase"
            :disabled="!hasLowerCase"
            @change="updateCheckbox('1 Minuscule')"
          />
          <el-checkbox
            label="1 Chiffre"
            name="type"
            size="large"
            :checked="hasNumber"
            :disabled="!hasNumber"
            @change="updateCheckbox('1 Chiffre')"
          />
          <el-checkbox
            label="1 caractère spécial"
            name="type"
            size="large"
            :checked="hasSpecialChar"
            :disabled="!hasSpecialChar"
            @change="updateCheckbox('1 caractère spécial')"
          />
          <el-checkbox
            label="8 Caractères"
            name="type"
            size="large"
            :checked="hasMinLength"
            :disabled="!hasMinLength"
            @change="updateCheckbox('8 Caractères')"
          />
        </el-checkbox-group>
        <el-form-item
          label="Confirmation du mot de passe"
          prop="confirmNewPassword"
        >
          <el-input v-model.number="ruleForm.confirmNewPassword" size="large" />
        </el-form-item>
        <el-button
          size="large"
          class="w-100 mt-1 color-btn"
          @click="submitForm(ruleFormRef)"
        >
          Modifier
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
const ruleFormRef = ref<FormInstance>();
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/useUserModule";
import service from "@/service";
const { error } = storeToRefs(useStoryStore());
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useStoryStore } from "@/store/useStoryModule";
const { currentUser } = storeToRefs(useAuthStore());
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== ruleForm.value.newPassword) {
    callback(new Error("Les mots de passe ne correspondent pas."));
  } else {
    callback();
  }
};
const rules = ref({
  oldPassword: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    },
  ],
  newPassword: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    },
  ],
  confirmNewPassword: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    },
    {
      validator: validateConfirmPassword,
      trigger: ['blur', 'change']
    },
  ],
});
const ruleForm = ref({
  oldPassword: "",
  newPassword: "",
  type: [] as string[],
  confirmNewPassword: "",
});

const hasUpperCase = computed(
  () => ruleForm.value.newPassword.match(/[A-Z]/)?.length > 0
);
const hasLowerCase = computed(
  () => ruleForm.value.newPassword.match(/[a-z]/)?.length > 0
);
const hasNumber = computed(
  () => ruleForm.value.newPassword.match(/[0-9]/)?.length > 0
);
const hasSpecialChar = computed(
  () => ruleForm.value.newPassword.match(/[^A-Za-z0-9]/)?.length > 0
);
const hasMinLength = computed(() => ruleForm.value.newPassword.length >= 8);
const updateCheckbox = (checkboxType: string) => {
  const isChecked = ruleForm.value.type.includes(checkboxType);
  if (isChecked) {
    ruleForm.value.type = ruleForm.value.type.filter(
      (type) => type !== checkboxType
    );
  } else {
    ruleForm.value.type.push(checkboxType);
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  ruleForm.value = {
    oldPassword: "",
    newPassword: "",
    type: [],
    confirmNewPassword: "",
  };
  formEl.resetFields();
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid && ruleForm.value.type.length === 5) {
      const payload = {
        id: currentUser.value.id,
        data: {
          password: ruleForm.value.oldPassword,
          newPassword: ruleForm.value.newPassword,
        },
      };
      try {
        await service.api.userControllerUpdatePassword(
          payload.id,
          payload.data
        );
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
        }
        resetForm(formEl);
      } catch (error: any) {

        Components.ElNotification.error({
            message: "Vérifiez votre mot de passe actuel.",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "error-notif",
          });
     
      }
    } else if(ruleForm.value.type.length !== 5) {
      
      Components.ElNotification.error({
            message: "Vérifiez toutes les cases.",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "error-notif",
          });
    }
  });
};

watch(
  () => ruleForm.value.newPassword,
  () => {
    ruleForm.value.type = [];

    if (hasUpperCase.value) ruleForm.value.type.push("1 Majuscule");
    if (hasLowerCase.value) ruleForm.value.type.push("1 Minuscule");
    if (hasNumber.value) ruleForm.value.type.push("1 Chiffre");
    if (hasSpecialChar.value) ruleForm.value.type.push("1 caractère spécial");
    if (hasMinLength.value) ruleForm.value.type.push("8 Caractères");
  }
);
</script>
<style lang="scss" scoped>
.card-password__ {
  &container {
    border-radius: 10px;
    box-shadow: 1px 1px 7px 0px rgba(193, 182, 178, 0.94);
  }
}
.color-gris {
  color: $gris-fonce;
}

.color-btn {
  color:$violet-fonce!important;
  border-color:$violet-fonce!important;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: $vert;
  border-color:$vert ;
}
:deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
  color: #455460;
}
:deep(.el-button){
  margin:0px
}
</style>
