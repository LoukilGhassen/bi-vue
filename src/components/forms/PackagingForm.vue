<template>
  <el-form
    :model="packaging"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="captionFr" prop="captionFr">
      <el-input
        v-model="packaging.captionFr"
        data-test="packagingFormcaptionFr"
      />
    </el-form-item>
    <el-form-item label="qty" prop="qty">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="packaging.qty"
        data-test="packagingFormqty"
      />
    </el-form-item>
    <el-form-item label="product_id" prop="product.id">
      <el-select
        v-model="packaging.product.id"
        data-test="packagingFormproductId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actorproduct in actorproducts"
          :data-test="actorproduct.id"
          :label="actorproduct.id"
          :key="actorproduct.id"
          :value="actorproduct.id"
        />
      </el-select>
    </el-form-item>
  
    <div class="d-flex justify-content-end">
      <el-button
        data-test="packagingFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="packagingFormSubmitButton"
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

import { usePackagingStore } from "@/store/usePackagingModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let actorproducts = ref([]);
let ids = ref([]);
const { packaging, error } = storeToRefs(usePackagingStore());
const {
  getPackagingById,
  createPackaging,
  editPackaging,
  resetPackaging,
} = usePackagingStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  captionFr: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  qty: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "product.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  isASample: [
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
    return await editPackaging({ id });
  } else await createPackaging();
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
        router.push({ name: `${currentUser.value.role}-list-packaging` });
        resetPackaging();
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
  resetPackaging();
};
const getCurrentPackaging = async (id: string) => {
  if (props.isEdit) {
    await getPackagingById(id);
  }
};

const getListOfActorProduct = async () => {
  await supabase
    .from("ActorProduct")
    .select("*")
    .then(({ data }) => {
      actorproducts.value = data;
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
  if (!props.isEdit) resetPackaging();
  const id = route.params.id as string;
  await getListOfActorProduct();
  await getListOfIds();
  await getCurrentPackaging(id);
});
</script>
