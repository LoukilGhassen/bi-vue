<template>
  <el-form
    :model="actoractororientation"
    label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="comment" prop="comment">
      <el-input
        v-model="actoractororientation.comment"
        data-test="actoractororientationFormcomment"
      />
    </el-form-item>
    <el-form-item label="relevantFor" prop="relevantFor">
      <el-select
        v-model="actoractororientation.relevantFor"
        data-test="actoractororientationFormrelevantFor"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="option in actoractororientationEnumOptions?.relevantFor
            ?.options"
          :data-test="option.value"
          :label="option.label"
          :key="option.value"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="actor_id" prop="actor.id">
      <el-select
        v-model="actoractororientation.actor.id"
        data-test="actoractororientationFormactorId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actor in actors"
          :data-test="actor.id"
          :label="actor.id"
          :key="actor.id"
          :value="actor.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="actorOrientationObject_id"
      prop="ActorOrientationObject.id"
    >
      <el-select
        v-model="actoractororientation.ActorOrientationObject.id"
        data-test="actoractororientationFormactorOrientationObjectId"
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
        data-test="actoractororientationFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actoractororientationFormSubmitButton"
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

import { useActorActorOrientationStore } from "@/store/useActorActorOrientationModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: { type: Boolean, default: false },
});
let actors = ref([]);
let lists = ref([]);
const { actoractororientation, error } = storeToRefs(
  useActorActorOrientationStore()
);
const {
  getActorActorOrientationById,
  createActorActorOrientation,
  editActorActorOrientation,
  resetActorActorOrientation,
} = useActorActorOrientationStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const actoractororientationEnumOptions = {
  relevantFor: {
    options: [
      { label: "Both ", value: "Both" },
      { label: " persons ", value: "Persons" },
      { label: " companies", value: "Companies" },
    ],
  },
};
const rules = reactive({
  comment: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  relevantFor: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "ActorOrientationObject.id": [
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
    return await editActorActorOrientation({ id });
  } else await createActorActorOrientation();
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
          name: `${currentUser.value.role}-list-actoractororientation`,
        });
        resetActorActorOrientation();
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
  resetActorActorOrientation();
};
const getCurrentActorActorOrientation = async (id: string) => {
  if (props.isEdit) {
    await getActorActorOrientationById(id);
  }
};

const getListOfActor = async () => {
  await supabase
    .from("Actor")
    .select("*")
    .then(({ data }) => {
      actors.value = data;
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
  if (!props.isEdit) resetActorActorOrientation();
  const id = route.params.id as string;
  await getListOfActor();
  await getListOfList();
  await getCurrentActorActorOrientation(id);
});
</script>
