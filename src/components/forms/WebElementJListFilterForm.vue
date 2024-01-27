<template>
  <el-form
    :model="webelementjlistfilter"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="htmlControlName" prop="htmlControlName">
      <el-input
        v-model="webelementjlistfilter.htmlControlName"
        data-test="webelementjlistfilterFormhtmlControlName"
      />
    </el-form-item>
    <el-form-item label="listTypeNameObject_id" prop="listTypeNameObject">
      <el-select
        v-model="webelementjlistfilter.listTypeNameObject.listTypeName"
        data-test="webelementjlistfilterFormlistTypeNameObjectId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="listtype in listtypes"
          :data-test="listtype.listTypeName"
          :label="listtype.listTypeName"
          :key="listtype.listTypeName"
          :value="listtype.listTypeName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="webElement_id" prop="webElement.id">
      <el-select
        v-model="webelementjlistfilter.webElement.id"
        data-test="webelementjlistfilterFormwebElementId"
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
    <div class="d-flex justify-content-end">
      <el-button
        data-test="webelementjlistfilterFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="webelementjlistfilterFormSubmitButton"
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

import { useWebElementJListFilterStore } from "@/store/useWebElementJListFilterModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let listtypes = ref([]);
let ids = ref([]);
let webelements = ref([]);
const { webelementjlistfilter, error } = storeToRefs(
  useWebElementJListFilterStore()
);
const {
  getWebElementJListFilterById,
  createWebElementJListFilter,
  editWebElementJListFilter,
  resetWebElementJListFilter,
} = useWebElementJListFilterStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  htmlControlName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  listTypeNameObject: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  "webElement.id": [
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
    return await editWebElementJListFilter({ id });
  } else await createWebElementJListFilter();
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
        router.push({
          name: `${currentUser.value.role}-list-webelementjlistfilter`,
        });
        resetWebElementJListFilter();
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
  resetWebElementJListFilter();
};
const getCurrentWebElementJListFilter = async (id: string) => {
  if (props.isEdit) {
    await getWebElementJListFilterById(id);
  }
};

const getListOfListType = async () => {
  await supabase
    .from("ListType")
    .select("*")
    .then(({ data }) => {
      listtypes.value = data;
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
const getListOfWebElement = async () => {
  await supabase
    .from("WebElement")
    .select("*")
    .then(({ data }) => {
      webelements.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetWebElementJListFilter();
  const id = route.params.id as string;
  await getListOfListType();
  await getListOfIds();
  await getListOfWebElement();
  await getCurrentWebElementJListFilter(id);
});
</script>
