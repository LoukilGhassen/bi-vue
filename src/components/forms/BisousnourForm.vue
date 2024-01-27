<template>
  <el-form
    :model="bisousnour"
        label-width="auto"
    label-position="left"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="login" prop="login">
      <el-input v-model="bisousnour.login" data-test="bisousnourFormlogin" />
    </el-form-item>
    <el-form-item label="actorPersonIdObject_id" prop="actorPersonIdObject.id">
      <el-select
        v-model="bisousnour.actorPersonIdObject.id"
        data-test="bisousnourFormactorPersonIdObjectId"
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
 
    <el-form-item label="listsIdUserTypeObject_id" prop="listsIdUserTypeObject.id">
      <el-select
        v-model="bisousnour.listsIdUserTypeObject.id"
        data-test="bisousnourFormlistsIdUserTypeObjectId"
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
        data-test="bisousnourFormCancelButton"
        @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="bisousnourFormSubmitButton"
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

import { useBisousnourStore } from "@/store/useBisousnourModule";
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
let lists = ref([]);
const { bisousnour, error } = storeToRefs(useBisousnourStore());
const {
  getBisousnourById,
  createBisousnour,
  editBisousnour,
  resetBisousnour,
} = useBisousnourStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  login: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "actorPersonIdObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  
  "listsIdUserTypeObject.id": [
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
    return await editBisousnour({ id });
  } else await createBisousnour();
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
        router.push({ name: `${currentUser.value.role}-list-bisousnour` });
        resetBisousnour();
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
  resetBisousnour();
};
const getCurrentBisousnour = async (id: string) => {
  if (props.isEdit) {
    await getBisousnourById(id);
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
const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetBisousnour();
  const id = route.params.id as string;
  await getListOfActorPerson();
  await getListOfIds();
  await getListOfList();
  await getCurrentBisousnour(id);
});
</script>
