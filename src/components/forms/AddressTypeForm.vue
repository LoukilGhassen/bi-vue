<template>
  <el-form
    :model="addresstype"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="tag" prop="tag">
      <el-input v-model="addresstype.tag" data-test="addresstypeFormtag" />
    </el-form-item>
    <el-form-item label="captionFr" prop="captionFr">
      <el-input
        v-model="addresstype.captionFr"
        data-test="addresstypeFormcaptionFr"
      />
    </el-form-item>
    <el-form-item label="row1Tag" prop="row1Tag">
      <el-input
        v-model="addresstype.row1Tag"
        data-test="addresstypeFormrow1Tag"
      />
    </el-form-item>
    <el-form-item label="row1CaptionFr" prop="row1CaptionFr">
      <el-input
        v-model="addresstype.row1CaptionFr"
        data-test="addresstypeFormrow1CaptionFr"
      />
    </el-form-item>
    <el-form-item label="row2Tag" prop="row2Tag">
      <el-input
        v-model="addresstype.row2Tag"
        data-test="addresstypeFormrow2Tag"
      />
    </el-form-item>
    <el-form-item label="row2CaptionFr" prop="row2CaptionFr">
      <el-input
        v-model="addresstype.row2CaptionFr"
        data-test="addresstypeFormrow2CaptionFr"
      />
    </el-form-item>
    <el-form-item label="row3Tag" prop="row3Tag">
      <el-input
        v-model="addresstype.row3Tag"
        data-test="addresstypeFormrow3Tag"
      />
    </el-form-item>
    <el-form-item label="row3CaptionFr" prop="row3CaptionFr">
      <el-input
        v-model="addresstype.row3CaptionFr"
        data-test="addresstypeFormrow3CaptionFr"
      />
    </el-form-item>
    <el-form-item label="row4Tag" prop="row4Tag">
      <el-input
        v-model="addresstype.row4Tag"
        data-test="addresstypeFormrow4Tag"
      />
    </el-form-item>
    <el-form-item label="row4CaptionFr" prop="row4CaptionFr">
      <el-input
        v-model="addresstype.row4CaptionFr"
        data-test="addresstypeFormrow4CaptionFr"
      />
    </el-form-item>
  
    <div class="d-flex justify-content-end">
      <el-button
        data-test="addresstypeFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="addresstypeFormSubmitButton"
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

import { useAddressTypeStore } from "@/store/useAddressTypeModule";
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
const { addresstype, error } = storeToRefs(useAddressTypeStore());
const {
  getAddressTypeById,
  createAddressType,
  editAddressType,
  resetAddressType,
} = useAddressTypeStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  tag: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  captionFr: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row1Tag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row1CaptionFr: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row2Tag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row2CaptionFr: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row3Tag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row3CaptionFr: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row4Tag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  row4CaptionFr: [
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
    return await editAddressType({ id });
  } else await createAddressType();
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
        router.push({ name: `${currentUser.value.role}-list-addresstype` });
        resetAddressType();
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
  resetAddressType();
};
const getCurrentAddressType = async (id: string) => {
  if (props.isEdit) {
    await getAddressTypeById(id);
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
  if (!props.isEdit)resetAddressType();
  const id = route.params.id as string;
  await getListOfIds();
  await getCurrentAddressType(id);
});
</script>
