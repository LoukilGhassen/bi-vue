<template>
  <el-form :model="role"     label-width="auto"
    label-position="left" :rules="rules" ref="ruleFormRef">
    <el-form-item label="deleteDate" prop="deleteDate">
      <el-date-picker
        v-model="role.deleteDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="roleFormdeleteDate"
      />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="roleFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="roleFormSubmitButton"
        type="primary"
        @click="onSubmit(ruleFormRef)"
        >Create</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "@/core/services/SupabaseClientService";

import { useRoleStore } from "@/store/useRoleModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let ids = ref([]);
const { role, error } = storeToRefs(useRoleStore());
const { getRoleById, createRole, editRole, resetRole } = useRoleStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  deleteDate: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  roleName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  creationDate: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handleSubmitForm = async () => {
  isLoading.value = true;
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editRole({ id });
  } else await createRole();
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
        router.push({ name: `${currentUser.value.role}-list-role` });
        resetRole();
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  resetRole();
};
const getCurrentRole = async (id: string) => {
  if (props.isEdit) {
    await getRoleById(id);
  }
};

const getListOfIds = async () => {
  await supabase
    .from("Ids")
    .select("*")
    .then(({ data }) => {
      ids.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetRole();
  const id = route.params.id as string;
  await getListOfIds();
  await getCurrentRole(id);
});
</script>
