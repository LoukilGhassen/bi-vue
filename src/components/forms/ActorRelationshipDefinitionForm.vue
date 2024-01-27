<template>
  <el-form
    :model="actorrelationshipdefinition"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="tag" prop="tag">
      <el-input
        v-model="actorrelationshipdefinition.tag"
        data-test="actorrelationshipdefinitionFormtag"
      />
    </el-form-item>
    <el-form-item label="relationshipCaptionFr" prop="relationshipCaptionFr">
      <el-input
        v-model="actorrelationshipdefinition.relationshipCaptionFr"
        data-test="actorrelationshipdefinitionFormrelationshipCaptionFr"
      />
    </el-form-item>
    <el-form-item label="reverseRelationshipTag" prop="reverseRelationshipTag">
      <el-input
        v-model="actorrelationshipdefinition.reverseRelationshipTag"
        data-test="actorrelationshipdefinitionFormreverseRelationshipTag"
      />
    </el-form-item>
    <el-form-item
      label="reverseRelationshipCaptionFr"
      prop="reverseRelationshipCaptionFr"
    >
      <el-input
        v-model="actorrelationshipdefinition.reverseRelationshipCaptionFr"
        data-test="actorrelationshipdefinitionFormreverseRelationshipCaptionFr"
      />
    </el-form-item>
   
    <el-form-item
      label="listIdActorType1Object_id"
      prop="listIdActorType1Object.id"
    >
      <el-select
        v-model="actorrelationshipdefinition.listIdActorType1Object.id"
        data-test="actorrelationshipdefinitionFormlistIdActorType1ObjectId"
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
    <el-form-item
      label="listIdActorType2Object_id"
      prop="listIdActorType2Object.id"
    >
      <el-select
        v-model="actorrelationshipdefinition.listIdActorType2Object.id"
        data-test="actorrelationshipdefinitionFormlistIdActorType2ObjectId"
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
        data-test="actorrelationshipdefinitionFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="actorrelationshipdefinitionFormSubmitButton"
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

import { useActorRelationshipDefinitionStore } from "@/store/useActorRelationshipDefinitionModule";
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
let lists = ref([]);
const { actorrelationshipdefinition, error } = storeToRefs(
  useActorRelationshipDefinitionStore()
);
const {
  getActorRelationshipDefinitionById,
  createActorRelationshipDefinition,
  editActorRelationshipDefinition,
  resetActorRelationshipDefinition,
} = useActorRelationshipDefinitionStore();

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
  relationshipCaptionFr: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  reverseRelationshipTag: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  reverseRelationshipCaptionFr: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  "listIdActorType1Object.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "listIdActorType2Object.id": [
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
    return await editActorRelationshipDefinition({ id });
  } else await createActorRelationshipDefinition();
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
          name: `${currentUser.value.role}-list-actorrelationshipdefinition`,
        });
        resetActorRelationshipDefinition();
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
  resetActorRelationshipDefinition();
};
const getCurrentActorRelationshipDefinition = async (id: string) => {
  if (props.isEdit) {
    await getActorRelationshipDefinitionById(id);
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
const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetActorRelationshipDefinition();
  const id = route.params.id as string;
  await getListOfIds();
  await getListOfList();
  await getCurrentActorRelationshipDefinition(id);
});
</script>
