<template>
  <el-form
    :model="actorcompany"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="companyObject" prop="companyObject">
      <el-input
        v-model="actorcompany.companyObject"
        data-test="actorcompanyFormcompanyObject"
      />
    </el-form-item>
    <el-form-item label="shortName" prop="shortName">
      <el-input
        v-model="actorcompany.shortName"
        data-test="actorcompanyFormshortName"
      />
    </el-form-item>
    <el-form-item
      label="listIdActorCompanyFormObject_id"
      prop="listIdActorCompanyFormObject"
    >
      <el-select
        v-model="actorcompany.listIdActorCompanyFormObject.id"
        data-test="actorcompanyFormlistIdActorCompanyFormObjectId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="list in lists"
          :data-test="list.id"
          :label="list.id"
          :key="list.id"
          :value="list.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="listIdActorCompanyTypeObject_id"
      prop="listIdActorCompanyTypeObject.id"
    >
      <el-select
        v-model="actorcompany.listIdActorCompanyTypeObject.id"
        data-test="actorcompanyFormlistIdActorCompanyTypeObjectId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="list in lists"
          :data-test="list.id"
          :label="list.id"
          :key="list.id"
          :value="list.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="actor_id" prop="actor.id">
      <el-select
        v-model="actorcompany.actor.id"
        data-test="actorcompanyFormactorId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actor in actors"
          :data-test="actor.id"
          :label="actor.id"
          :key="actor.id"
          :value="actor.id"
        />
      </el-select>
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="actorcompanyFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actorcompanyFormSubmitButton"
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

import { useActorCompanyStore } from "@/store/useActorCompanyModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let lists = ref([]);
let actors = ref([]);
const { actorcompany, error } = storeToRefs(useActorCompanyStore());
const {
  getActorCompanyById,
  createActorCompany,
  editActorCompany,
  resetActorCompany,
} = useActorCompanyStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  companyObject: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  shortName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  listIdActorCompanyFormObject: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "listIdActorCompanyTypeObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor.id": [
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
    return await editActorCompany({ id });
  } else await createActorCompany();
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
        router.push({ name: `${currentUser.value.role}-list-actorcompany` });
        resetActorCompany();
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
  resetActorCompany();
};
const getCurrentActorCompany = async (id: string) => {
  if (props.isEdit) {
    await getActorCompanyById(id);
  }
};

const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};
const getListOfActor = async () => {
  await supabase
    .from("Actor")
    .select("*")
    .then(({ data }) => {
      actors.value = data;
    });




};

onMounted(async () => {
  if (!props.isEdit) resetActorCompany();
  const id = route.params.id as string;
  await getListOfList();
  await getListOfActor();
  await getCurrentActorCompany(id);
});
</script>
