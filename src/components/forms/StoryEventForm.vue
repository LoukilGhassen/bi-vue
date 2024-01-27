<template>
  <el-form
    :model="storyevent"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="eventDate" prop="eventDate">
      <el-date-picker
        v-model="storyevent.eventDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="storyeventFormeventDate"
      />
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-input
        v-model="storyevent.description"
        data-test="storyeventFormdescription"
      />
    </el-form-item>
    <el-form-item label="displayInSchedule" prop="displayInSchedule">
      <el-switch
        v-model="storyevent.displayInSchedule"
        data-test="storyeventFormdisplayInSchedule"
      />
    </el-form-item>
    <el-form-item label="story_id" prop="story.id">
      <el-select
        v-model="storyevent.story.id"
        data-test="storyeventFormstoryId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="story in stories"
          :data-test="story.id"
          :label="story.id"
          :key="story.id"
          :value="story.id"
        />
      </el-select>
    </el-form-item>
   
    <el-form-item label="listIdEventTypeObject_id" prop="listIdEventTypeObject">
      <el-select
        v-model="storyevent.listIdEventTypeObject.id"
        data-test="storyeventFormlistIdEventTypeObjectId"
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
        data-test="storyeventFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="storyeventFormSubmitButton"
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

import { useStoryEventStore } from "@/store/useStoryEventModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let stories = ref([]);
let ids = ref([]);
let lists = ref([]);
const { storyevent, error } = storeToRefs(useStoryEventStore());
const {
  getStoryEventById,
  createStoryEvent,
  editStoryEvent,
  resetStoryEvent,
} = useStoryEventStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  eventDate: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  displayInSchedule: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "story.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  listIdEventTypeObject: [
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
    return await editStoryEvent({ id });
  } else await createStoryEvent();
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
        router.push({ name: `${currentUser.value.role}-list-storyevent` });
        resetStoryEvent();
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
  resetStoryEvent();
};
const getCurrentStoryEvent = async (id: string) => {
  if (props.isEdit) {
    await getStoryEventById(id);
  }
};

const getListOfStory = async () => {
  await supabase
    .from("Story")
    .select("*")
    .then(({ data }) => {
      stories.value = data;
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
const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};

onMounted(async () => {

  if (!props.isEdit)resetStoryEvent();
  const id = route.params.id as string;
  await getListOfStory();
  await getListOfIds();
  await getListOfList();
  await getCurrentStoryEvent(id);
});
</script>
