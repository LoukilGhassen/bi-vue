<template>
  <el-form :model="list"     label-width="auto"
    label-position="left" :rules="rules" ref="ruleFormRef">
    <el-form-item label="code" prop="code">
      <el-input v-model="list.code" data-test="listFormcode" />
    </el-form-item>
    <el-form-item label="tag" prop="tag">
      <el-input v-model="list.tag" data-test="listFormtag" />
    </el-form-item>
    <el-form-item label="captionFr" prop="captionFr">
      <el-input v-model="list.captionFr" data-test="listFormcaptionFr" />
    </el-form-item>
    <el-form-item label="sortIndex" prop="sortIndex">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="list.sortIndex"
        data-test="listFormsortIndex"
      />
    </el-form-item>
    
    <el-form-item label="listTypeName_id" prop="listTypeName">
      <el-select
        v-model="list.listTypeNameObject.listTypeName"
        data-test="listFormlistTypeNameId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="listtype in listtypes"
          :data-test="listtype.id"
          :label="listtype.listTypeName"
          :key="listtype.listTypeName"
          :value="listtype.listTypeName"
        />
      </el-select>
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="listFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="listFormSubmitButton"
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

import { useListStore } from "@/store/useListModule";
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
let listtypes = ref([]);
const { list, error } = storeToRefs(useListStore());
const { getListById, createList, editList, resetList } = useListStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  code: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  tag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  captionFr: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  sortIndex: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  listTypeName: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  listsId: [
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
    return await editList({ id });
  } else await createList();
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
        router.push({ name: `${currentUser.value.role}-list-list` });
        resetList();
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
  resetList();
};
const getCurrentList = async (id: string) => {
  if (props.isEdit) {
    await getListById(id);
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
const getListOfListType = async () => {
  await supabase
    .from("ListType")
    .select("*")
    .then(({ data }) => {
      listtypes.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetList();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfListType();
  await getCurrentList(id);
});
</script>
