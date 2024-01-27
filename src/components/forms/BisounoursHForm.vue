<template>
  <el-form
    :model="bisounoursh"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="creationDate" prop="creationDate">
      <el-date-picker
        v-model="bisounoursh.creationDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="bisounourshFormcreationDate"
      />
    </el-form-item>
    <el-form-item label="h" prop="h">
      <el-input v-model="bisounoursh.h" data-test="bisounourshFormh" />
    </el-form-item>
  
    <el-form-item label="bisousnours_id" prop="bisousnours.id">
      <el-select
        v-model="bisounoursh.bisousnours.id"
        data-test="bisounourshFormbisousnoursId"
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
        data-test="bisounourshFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="bisounourshFormSubmitButton"
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

import { useBisounoursHStore } from "@/store/useBisounoursHModule";
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
let bisousnours = ref([]);
const { bisounoursh, error } = storeToRefs(useBisounoursHStore());
const {
  getBisounoursHById,
  createBisounoursH,
  editBisounoursH,
  resetBisounoursH,
} = useBisounoursHStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  creationDate: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  h: [
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
    return await editBisounoursH({ id });
  } else await createBisounoursH();
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
        router.push({ name: `${currentUser.value.role}-list-bisounoursh` });
        resetBisounoursH();
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
  resetBisounoursH();
};
const getCurrentBisounoursH = async (id: string) => {
  if (props.isEdit) {
    await getBisounoursHById(id);
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
const getListOfBisousnour = async () => {
  await supabase
    .from("Bisousnour")
    .select("*")
    .then(({ data }) => {
      bisousnours.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetBisounoursH();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfBisousnour();
  await getCurrentBisounoursH(id);
});
</script>
