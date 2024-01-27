<template>
  <el-form
    :model="storyeventinvolve"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
  
    <el-form-item label="anyId_id" prop="anyId">
      <el-select
        v-model="storyeventinvolve.anyId.id"
        data-test="storyeventinvolveFormanyIdId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="ids in ids"
          :data-test="ids.id"
          :label="ids.id"
          :key="ids.id"
          :value="ids.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="storyEvent_id" prop="storyEvent.id">
      <el-select
        v-model="storyeventinvolve.storyEvent.id"
        data-test="storyeventinvolveFormstoryEventId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="storyevent in storyevents"
          :data-test="storyevent.id"
          :label="storyevent.id"
          :key="storyevent.id"
          :value="storyevent.id"
        />
      </el-select>
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button
        data-test="storyeventinvolveFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="storyeventinvolveFormSubmitButton"
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

import { useStoryEventInvolveStore } from "@/store/useStoryEventInvolveModule";
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
let storyevents = ref([]);
const { storyeventinvolve, error } = storeToRefs(useStoryEventInvolveStore());
const {
  getStoryEventInvolveById,
  createStoryEventInvolve,
  editStoryEventInvolve,
  resetStoryEventInvolve,
} = useStoryEventInvolveStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  
  anyId: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "storyEvent.id": [
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
    return await editStoryEventInvolve({ id });
  } else await createStoryEventInvolve();
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
          name: `${currentUser.value.role}-list-storyeventinvolve`,
        });
        resetStoryEventInvolve();
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
  resetStoryEventInvolve();
};
const getCurrentStoryEventInvolve = async (id: string) => {
  if (props.isEdit) {
    await getStoryEventInvolveById(id);
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
const getListOfStoryEvent = async () => {
  await supabase
    .from("StoryEvent")
    .select("*")
    .then(({ data }) => {
      storyevents.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetStoryEventInvolve();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfStoryEvent();
  await getCurrentStoryEventInvolve(id);
});
</script>
