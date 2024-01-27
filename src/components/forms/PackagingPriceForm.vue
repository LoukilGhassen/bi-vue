<template>
  <el-form
    :model="packagingprice"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="price" prop="price">
      <el-input-number
        :min="0"
        :max="100000"
        v-model="packagingprice.price"
        data-test="packagingpriceFormprice"
      />
    </el-form-item>
    <el-form-item label="validFrom" prop="validFrom">
      <el-date-picker
        v-model="packagingprice.validFrom"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="packagingpriceFormvalidFrom"
      />
    </el-form-item>
    <el-form-item label="validUntil" prop="validUntil">
      <el-date-picker
        v-model="packagingprice.validUntil"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="packagingpriceFormvalidUntil"
      />
    </el-form-item>
    <el-form-item label="listIdCurrencyObject_id" prop="listIdCurrencyObject.id">
      <el-select
        v-model="packagingprice.listIdCurrencyObject.id"
        data-test="packagingpriceFormlistIdCurrencyObjectId"
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
    <el-form-item label="packaging_id" prop="packaging.id">
      <el-select
        v-model="packagingprice.packaging.id"
        data-test="packagingpriceFormpackagingId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="packaging in packagings"
          :data-test="packaging.id"
          :label="packaging.id"
          :key="packaging.id"
          :value="packaging.id"
        />
      </el-select>
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="packagingpriceFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="packagingpriceFormSubmitButton"
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

import { usePackagingPriceStore } from "@/store/usePackagingPriceModule";
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
let packagings = ref([]);
const { packagingprice, error } = storeToRefs(usePackagingPriceStore());
const {
  getPackagingPriceById,
  createPackagingPrice,
  editPackagingPrice,
  resetPackagingPrice,
} = usePackagingPriceStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  price: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  validFrom: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  validUntil: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "listIdCurrencyObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "packaging.id": [
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
    return await editPackagingPrice({ id });
  } else await createPackagingPrice();
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
        router.push({ name: `${currentUser.value.role}-list-packagingprice` });
        resetPackagingPrice();
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
  resetPackagingPrice();
};
const getCurrentPackagingPrice = async (id: string) => {
  if (props.isEdit) {
    await getPackagingPriceById(id);
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
const getListOfPackaging = async () => {
  await supabase
    .from("Packaging")
    .select("*")
    .then(({ data }) => {
      packagings.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetPackagingPrice();
  const id = route.params.id as string;
  await getListOfList();
  await getListOfPackaging();
  await getCurrentPackagingPrice(id);
});
</script>
