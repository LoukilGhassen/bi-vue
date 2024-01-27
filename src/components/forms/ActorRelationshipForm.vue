<template>
  <el-form
    :model="actorrelationship"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="deleteCascade" prop="deleteCascade">
      <el-switch
        v-model="actorrelationship.deleteCascade"
        data-test="actorrelationshipFormdeleteCascade"
      />
    </el-form-item>
    <el-form-item
      label="listIdActorRelationshipTypeObject"
      prop="listIdActorRelationshipTypeObject"
    >
      <el-input
        v-model="actorrelationship.listIdActorRelationshipTypeObject"
        data-test="actorrelationshipFormlistIdActorRelationshipTypeObject"
      />
    </el-form-item>
    <el-form-item label="actor1Object_id" prop="actor1Object.id">
      <el-select
        v-model="actorrelationship.actor1Object.id"
        data-test="actorrelationshipFormactor1ObjectId"
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
    <el-form-item label="actor2Object_id" prop="actor2Object.id">
      <el-select
        v-model="actorrelationship.actor2Object.id"
        data-test="actorrelationshipFormactor2ObjectId"
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
    <div class="d-flex justify-content-end">
      <el-button
        data-test="actorrelationshipFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actorrelationshipFormSubmitButton"
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

import { useActorRelationshipStore } from "@/store/useActorRelationshipModule";
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
let ids = ref([]);
const { actorrelationship, error } = storeToRefs(useActorRelationshipStore());
const {
  getActorRelationshipById,
  createActorRelationship,
  editActorRelationship,
  resetActorRelationship,
} = useActorRelationshipStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  deleteCascade: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor1Object.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actor2Object.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  listIdActorRelationshipTypeObject: [
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
    return await editActorRelationship({ id });
  } else await createActorRelationship();
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
          name: `${currentUser.value.role}-list-actorrelationship`,
        });
        resetActorRelationship();
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
  resetActorRelationship();
};
const getCurrentActorRelationship = async (id: string) => {
  if (props.isEdit) {
    await getActorRelationshipById(id);
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
const getListOfIds = async () => {
  await supabase
    .from("Ids")
    .select("*")
    .then(({ data }) => {
      ids.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetActorRelationship();
  const id = route.params.id as string;
  await getListOfActor();
  await getListOfIds();
  await getCurrentActorRelationship(id);
});
</script>
