<template>
  <el-form
    :model="rolejpage"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
   
    <el-form-item label="page_id" prop="page.id">
      <el-select
        v-model="rolejpage.page.id"
        data-test="rolejpageFormpageId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="webelement in webelements"
          :data-test="webelement.id"
          :label="webelement.id"
          :key="webelement.id"
          :value="webelement.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="role_id" prop="role.id">
      <el-select
        v-model="rolejpage.role.id"
        data-test="rolejpageFormroleId"
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
    <div class="d-flex justify-content-end">
      <el-button
        data-test="rolejpageFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="rolejpageFormSubmitButton"
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

import { useRoleJPageStore } from "@/store/useRoleJPageModule";
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
let webelements = ref([]);
let roles = ref([]);
const { rolejpage, error } = storeToRefs(useRoleJPageStore());
const {
  getRoleJPageById,
  createRoleJPage,
  editRoleJPage,
  resetRoleJPage,
} = useRoleJPageStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  
  "page.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "role.id": [
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
    return await editRoleJPage({ id });
  } else await createRoleJPage();
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
        router.push({ name: `${currentUser.value.role}-list-rolejpage` });
        resetRoleJPage();
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
  resetRoleJPage();
};
const getCurrentRoleJPage = async (id: string) => {
  if (props.isEdit) {
    await getRoleJPageById(id);
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
const getListOfWebElement = async () => {
  await supabase
    .from("WebElement")
    .select("*")
    .then(({ data }) => {
      webelements.value = data;
    });
};
const getListOfRole = async () => {
  await supabase
    .from("Role")
    .select("*")
    .then(({ data }) => {
      roles.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetRoleJPage();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfWebElement();
  await getListOfRole();
  await getCurrentRoleJPage(id);
});
</script>
