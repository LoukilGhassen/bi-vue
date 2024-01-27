<template>
  <el-form
    :model="actorvehicule"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="immatriculation" prop="immatriculation">
      <el-input
        v-model="actorvehicule.immatriculation"
        data-test="actorvehiculeFormimmatriculation"
      />
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-input
        v-model="actorvehicule.description"
        data-test="actorvehiculeFormdescription"
      />
    </el-form-item>
   
    <el-form-item
      label="listIdVehiculeTypeObject_id"
      prop="listIdVehiculeTypeObject"
    >
      <el-select
        v-model="actorvehicule.listIdVehiculeTypeObject.id"
        data-test="actorvehiculeFormlistIdVehiculeTypeObjectId"
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
    <div class="d-flex justify-content-end">
      <el-button
        data-test="actorvehiculeFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actorvehiculeFormSubmitButton"
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

import { useActorVehiculeStore } from "@/store/useActorVehiculeModule";
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
let lists = ref([]);
const { actorvehicule, error } = storeToRefs(useActorVehiculeStore());
const {
  getActorVehiculeById,
  createActorVehicule,
  editActorVehicule,
  resetActorVehicule,
} = useActorVehiculeStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  immatriculation: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  description: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  listIdVehiculeTypeObject: [
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
    return await editActorVehicule({ id });
  } else await createActorVehicule();
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
        router.push({ name: `${currentUser.value.role}-list-actorvehicule` });
        resetActorVehicule();
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
  resetActorVehicule();
};
const getCurrentActorVehicule = async (id: string) => {
  if (props.isEdit) {
    await getActorVehiculeById(id);
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
const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetActorVehicule();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfList();
  await getCurrentActorVehicule(id);
});
</script>
