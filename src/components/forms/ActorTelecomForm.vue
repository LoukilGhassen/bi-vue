<template>
  <el-form
    :model="actortelecom"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="telecomName" prop="telecomName">
      <el-select
        v-model="actortelecom.telecomName"
        data-test="actortelecomFormtelecomName"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="option in actortelecomEnumOptions?.telecomName?.options"
          :data-test="option.value"
          :label="option.label"
          :key="option.value"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="value" prop="value">
      <el-input
        v-model="actortelecom.value"
        data-test="actortelecomFormvalue"
      />
    </el-form-item>
    <el-form-item
      label="listIdActorTelecomFamillyObject_id"
      prop="listIdActorTelecomFamillyObject"
    >
      <el-select
        v-model="actortelecom.listIdActorTelecomFamillyObject.id"
        data-test="actortelecomFormlistIdActorTelecomFamillyObjectId"
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
        data-test="actortelecomFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actortelecomFormSubmitButton"
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

import { useActorTelecomStore } from "@/store/useActorTelecomModule";
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
let ids = ref([]);
const { actortelecom, error } = storeToRefs(useActorTelecomStore());
const {
  getActorTelecomById,
  createActorTelecom,
  editActorTelecom,
  resetActorTelecom,
} = useActorTelecomStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const actortelecomEnumOptions = {
  telecomName: {
    options: [
      { label: "Téléphone ", value: "Telephone" },
      { label: " fax ", value: "Fax" },
      { label: " e-mail", value: "EMail" },
    ],
  },
};
const rules = reactive({
  telecomName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  value: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  listIdActorTelecomFamillyObject: [
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
    return await editActorTelecom({ id });
  } else await createActorTelecom();
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
        router.push({ name: `${currentUser.value.role}-list-actortelecom` });
        resetActorTelecom();
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
  resetActorTelecom();
};
const getCurrentActorTelecom = async (id: string) => {
  if (props.isEdit) {
    await getActorTelecomById(id);
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
const getListOfIds = async () => {
  await supabase
    .from("Ids")
    .select("*")
    .then(({ data }) => {
      ids.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetActorTelecom();
  const id = route.params.id as string;
  await getListOfList();
  await getListOfIds();
  await getCurrentActorTelecom(id);
});
</script>
