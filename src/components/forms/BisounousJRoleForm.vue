<template>
  <el-form
    :model="bisounousjrole"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="role_id" prop="role.id">
      <el-select
        v-model="bisounousjrole.role.id"
        data-test="bisounousjroleFormroleId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="role in roles"
          :data-test="role.id"
          :label="role.id"
          :key="role.id"
          :value="role.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="bisousnours_id" prop="bisousnours.id">
      <el-select
        v-model="bisounousjrole.bisousnours.id"
        data-test="bisounousjroleFormbisousnoursId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="bisousnour in bisousnours"
          :data-test="bisousnour.id"
          :label="bisousnour.id"
          :key="bisousnour.id"
          :value="bisousnour.id"
        />
      </el-select>
    </el-form-item>
 
    <div class="d-flex justify-content-end">
      <el-button
        data-test="bisounousjroleFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="bisounousjroleFormSubmitButton"
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

import { useBisounousJRoleStore } from "@/store/useBisounousJRoleModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let roles = ref([]);
let bisousnours = ref([]);
let ids = ref([]);
const { bisounousjrole, error } = storeToRefs(useBisounousJRoleStore());
const {
  getBisounousJRoleById,
  createBisounousJRole,
  editBisounousJRole,
  resetBisounousJRole,
} = useBisounousJRoleStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  "role.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "bisousnours.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
});

const handleSubmitForm = async () => {
  isLoading.value = true;
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editBisounousJRole({ id });
  } else await createBisounousJRole();
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
        router.push({ name: `${currentUser.value.role}-list-bisounousjrole` });
        resetBisounousJRole();
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
  resetBisounousJRole();
};
const getCurrentBisounousJRole = async (id: string) => {
  if (props.isEdit) {
    await getBisounousJRoleById(id);
  }
};

const getListOfRole = async () => {
  await supabase
    .from("Role")
    .select("*")
    .then(({ data }) => {
      roles.value = data;
    });
};
const getListOfBisousnour = async () => {
  await supabase
    .from("Bisousnour")
    .select("*")
    .then(({ data }) => {
      bisousnours.value = data;
    });
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
  if (!props.isEdit)resetBisounousJRole();
  const id = route.params.id as string;
  await getListOfRole();
  await getListOfBisousnour();
  await getListOfIds();
  await getCurrentBisounousJRole(id);
});
</script>
