<template>
  <el-form :model="story"     label-width="auto"
    label-position="left" :rules="rules" ref="ruleFormRef">
    <el-form-item label="captionFr" prop="captionFr">
      <el-input v-model="story.captionFr" data-test="storyFormcaptionFr" />
    </el-form-item>
    <el-form-item label="description" prop="description">
      <el-input v-model="story.description" data-test="storyFormdescription" />
    </el-form-item>
    <el-form-item label="startDate" prop="startDate">
      <el-date-picker
        v-model="story.startDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="storyFormstartDate"
      />
    </el-form-item>
    <el-form-item label="archiveDate" prop="archiveDate">
      <el-date-picker
        v-model="story.archiveDate"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="storyFormarchiveDate"
      />
    </el-form-item>
    <el-form-item label="actorPersonIdByObject_id" prop="actorPersonIdByObject">
      <el-select
        v-model="story.actorPersonIdByObject.id"
        data-test="storyFormactorPersonIdByObjectId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actorperson in actorpeople"
          :data-test="actorperson.id"
          :label="actorperson.id"
          :key="actorperson.id"
          :value="actorperson.id"
        />
      </el-select>
    </el-form-item>
  
    <div class="d-flex justify-content-end">
      <el-button
        data-test="storyFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="storyFormSubmitButton"
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

import { useStoryStore } from "@/store/useStoryModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let actorpeople = ref([]);
let ids = ref([]);
const { story, error } = storeToRefs(useStoryStore());
const { getStoryById, createStory, editStory, resetStory } = useStoryStore();

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
  description: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  startDate: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  archiveDate: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actorPersonIdByObject: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  aboutAny: [
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
    return await editStory({ id });
  } else await createStory();
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
        router.push({ name: `${currentUser.value.role}-list-story` });
        resetStory();
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
  resetStory();
};
const getCurrentStory = async (id: string) => {
  if (props.isEdit) {
    await getStoryById(id);
  }
};

const getListOfActorPerson = async () => {
  await supabase
    .from("ActorPerson")
    .select("*")
    .then(({ data }) => {
      actorpeople.value = data;
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
  if (!props.isEdit)resetStory();
  const id = route.params.id as string;
  await getListOfActorPerson();
  await getListOfIds();
  await getCurrentStory(id);
});
</script>
