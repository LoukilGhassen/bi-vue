<template>
  <el-form :model="ids"     label-width="auto"
    label-position="left" :rules="rules" ref="ruleFormRef">
    <el-form-item label="creation" prop="creation">
      <el-date-picker
        v-model="ids.creation"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="idsFormcreation"
      />
    </el-form-item>
    <el-form-item label="update" prop="update">
      <el-date-picker
        v-model="ids.update"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="idsFormupdate"
      />
    </el-form-item>
    <el-form-item label="deletion" prop="deletion">
      <el-date-picker
        v-model="ids.deletion"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="idsFormdeletion"
      />
    </el-form-item>
    <el-form-item label="updatedBy" prop="updatedBy">
      <el-input v-model="ids.updatedBy" data-test="idsFormupdatedBy" />
    </el-form-item>
    <el-form-item label="deletionBy" prop="deletionBy">
      <el-date-picker
        v-model="ids.deletionBy"
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
        data-test="idsFormdeletionBy"
      />
    </el-form-item>
    <el-form-item label="actor_id" prop="actor">
      <el-select
        v-model="ids.actor.id"
        data-test="idsFormactorId"
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
    <el-form-item label="actorRelationship_id" prop="actorRelationship">
      <el-select
        v-model="ids.actorRelationship.id"
        data-test="idsFormactorRelationshipId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actorrelationship in actorrelationships"
          :data-test="actorrelationship.id"
          :label="actorrelationship.id"
          :key="actorrelationship.id"
          :value="actorrelationship.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="actorRelationshipDefinition_id"
      prop="actorRelationshipDefinition"
    >
      <el-select
        v-model="ids.actorRelationshipDefinition.id"
        data-test="idsFormactorRelationshipDefinitionId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actorrelationshipdefinition in actorrelationshipdefinitions"
          :data-test="actorrelationshipdefinition.id"
          :label="actorrelationshipdefinition.id"
          :key="actorrelationshipdefinition.id"
          :value="actorrelationshipdefinition.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="actorTelecom_id" prop="actorTelecom">
      <el-select
        v-model="ids.actorTelecom.id"
        data-test="idsFormactorTelecomId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actortelecom in actortelecoms"
          :data-test="actortelecom.id"
          :label="actortelecom.id"
          :key="actortelecom.id"
          :value="actortelecom.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="actorVehicule_id" prop="actorVehicule">
      <el-select
        v-model="ids.actorVehicule.id"
        data-test="idsFormactorVehiculeId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="actorvehicule in actorvehicules"
          :data-test="actorvehicule.id"
          :label="actorvehicule.id"
          :key="actorvehicule.id"
          :value="actorvehicule.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="address_id" prop="address">
      <el-select
        v-model="ids.address.id"
        data-test="idsFormaddressId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="address in addresses"
          :data-test="address.id"
          :label="address.id"
          :key="address.id"
          :value="address.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="addressType_id" prop="addressType">
      <el-select
        v-model="ids.addressType.id"
        data-test="idsFormaddressTypeId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="addresstype in addresstypes"
          :data-test="addresstype.id"
          :label="addresstype.id"
          :key="addresstype.id"
          :value="addresstype.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="bisounoursH_id" prop="bisounoursH">
      <el-select
        v-model="ids.bisounoursH.id"
        data-test="idsFormbisounoursHId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="bisounoursh in bisounourshes"
          :data-test="bisounoursh.id"
          :label="bisounoursh.id"
          :key="bisounoursh.id"
          :value="bisounoursh.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="story_id" prop="story">
      <el-select
        v-model="ids.story.id"
        data-test="idsFormstoryId"
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
    <el-form-item label="storyEvent_id" prop="storyEvent">
      <el-select
        v-model="ids.storyEvent.id"
        data-test="idsFormstoryEventId"
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
    <el-form-item label="bisounousJRole_id" prop="bisounousJRole">
      <el-select
        v-model="ids.bisounousJRole.id"
        data-test="idsFormbisounousJRoleId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="bisounousjrole in bisounousjroles"
          :data-test="bisounousjrole.id"
          :label="bisounousjrole.id"
          :key="bisounousjrole.id"
          :value="bisounousjrole.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="bisousnour_id" prop="bisousnour">
      <el-select
        v-model="ids.bisousnour.id"
        data-test="idsFormbisousnourId"
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
    <el-form-item label="list_id" prop="list">
      <el-select
        v-model="ids.list.id"
        data-test="idsFormlistId"
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
    <el-form-item label="role_id" prop="role">
      <el-select
        v-model="ids.role.id"
        data-test="idsFormroleId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="role in roles"
          :data-test="role.id"
          :label="role.id"
          :key="role.id"
          :value="role.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="storyEventInvolve_id" prop="storyEventInvolve">
      <el-select
        v-model="ids.storyEventInvolve.id"
        data-test="idsFormstoryEventInvolveId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="storyeventinvolve in storyeventinvolves"
          :data-test="storyeventinvolve.id"
          :label="storyeventinvolve.id"
          :key="storyeventinvolve.id"
          :value="storyeventinvolve.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="packaging_id" prop="packaging">
      <el-select
        v-model="ids.packaging.id"
        data-test="idsFormpackagingId"
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
    <el-form-item label="roleJPage_id" prop="roleJPage">
      <el-select
        v-model="ids.roleJPage.id"
        data-test="idsFormroleJPageId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="rolejpage in rolejpages"
          :data-test="rolejpage.id"
          :label="rolejpage.id"
          :key="rolejpage.id"
          :value="rolejpage.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="webElement_id" prop="webElement">
      <el-select
        v-model="ids.webElement.id"
        data-test="idsFormwebElementId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="webelement in webelements"
          :data-test="webelement.id"
          :label="webelement.id"
          :key="webelement.id"
          :value="webelement.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="webElementJListFilter_id" prop="webElementJListFilter">
      <el-select
        v-model="ids.webElementJListFilter.id"
        data-test="idsFormwebElementJListFilterId"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="webelementjlistfilter in webelementjlistfilters"
          :data-test="webelementjlistfilter.id"
          :label="webelementjlistfilter.id"
          :key="webelementjlistfilter.id"
          :value="webelementjlistfilter.id"
        />
      </el-select>
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button data-test="idsFormCancelButton" @click="resetForm(ruleFormRef)"
        >Cancel</el-button
      >
      <el-button
        data-test="idsFormSubmitButton"
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

import { useIdsStore } from "@/store/useIdsModule";
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
let actorrelationships = ref([]);
let actorrelationshipdefinitions = ref([]);
let actortelecoms = ref([]);
let actorvehicules = ref([]);
let addresses = ref([]);
let addresstypes = ref([]);
let bisounourshes = ref([]);
let stories = ref([]);
let storyevents = ref([]);
let bisounousjroles = ref([]);
let bisousnours = ref([]);
let lists = ref([]);
let roles = ref([]);
let storyeventinvolves = ref([]);
let packagings = ref([]);
let rolejpages = ref([]);
let webelements = ref([]);
let webelementjlistfilters = ref([]);
const { ids, error } = storeToRefs(useIdsStore());
const { getIdsById, createIds, editIds, resetIds } = useIdsStore();

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const isLoading = ref<boolean>(false);
const rules = reactive({
  creation: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  update: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  deletion: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actor: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actorRelationship: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actorRelationshipDefinition: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actorTelecom: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  actorVehicule: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  address: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  addressType: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  bisounoursH: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  story: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  storyEvent: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  bisounousJRole: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  bisousnour: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  list: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  role: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  storyEventInvolve: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  packaging: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  roleJPage: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  webElement: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  webElementJListFilter: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  creationBy: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  updatedBy: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  deletionBy: [
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
    return await editIds({ id });
  } else await createIds();
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
        router.push({ name: `${currentUser.value.role}-list-ids` });
        resetIds();
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
  resetIds();
};
const getCurrentIds = async (id: string) => {
  if (props.isEdit) {
    await getIdsById(id);
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
const getListOfActorRelationship = async () => {
  await supabase
    .from("ActorRelationship")
    .select("*")
    .then(({ data }) => {
      actorrelationships.value = data;
    });
};
const getListOfActorRelationshipDefinition = async () => {
  await supabase
    .from("ActorRelationshipDefinition")
    .select("*")
    .then(({ data }) => {
      actorrelationshipdefinitions.value = data;
    });
};
const getListOfActorTelecom = async () => {
  await supabase
    .from("ActorTelecom")
    .select("*")
    .then(({ data }) => {
      actortelecoms.value = data;
    });
};
const getListOfActorVehicule = async () => {
  await supabase
    .from("ActorVehicule")
    .select("*")
    .then(({ data }) => {
      actorvehicules.value = data;
    });
};
const getListOfAddress = async () => {
  await supabase
    .from("Address")
    .select("*")
    .then(({ data }) => {
      addresses.value = data;
    });
};
const getListOfAddressType = async () => {
  await supabase
    .from("AddressType")
    .select("*")
    .then(({ data }) => {
      addresstypes.value = data;
    });
};
const getListOfBisounoursH = async () => {
  await supabase
    .from("BisounoursH")
    .select("*")
    .then(({ data }) => {
      bisounourshes.value = data;
    });
};
const getListOfStory = async () => {
  await supabase
    .from("Story")
    .select("*")
    .then(({ data }) => {
      stories.value = data;
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
const getListOfBisounousJRole = async () => {
  await supabase
    .from("BisounousJRole")
    .select("*")
    .then(({ data }) => {
      bisounousjroles.value = data;
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
const getListOfList = async () => {
  await supabase
    .from("List")
    .select("*")
    .then(({ data }) => {
      lists.value = data;
    });
};
const getListOfRole = async () => {
  await supabase
    .from("Role")
    .select("*")
    .then(({ data }) => {
      roles.value = data;
    });
};
const getListOfStoryEventInvolve = async () => {
  await supabase
    .from("StoryEventInvolve")
    .select("*")
    .then(({ data }) => {
      storyeventinvolves.value = data;
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
const getListOfRoleJPage = async () => {
  await supabase
    .from("RoleJPage")
    .select("*")
    .then(({ data }) => {
      rolejpages.value = data;
    });
};
const getListOfWebElement = async () => {
  await supabase
    .from("WebElement")
    .select("*")
    .then(({ data }) => {
      webelements.value = data;
    });
};
const getListOfWebElementJListFilter = async () => {
  await supabase
    .from("WebElementJListFilter")
    .select("*")
    .then(({ data }) => {
      webelementjlistfilters.value = data;
    });
};

onMounted(async () => {
  if (!props.isEdit)resetIds();
  const id = route.params.id as string;
  await getListOfActor();
  await getListOfActorRelationship();
  await getListOfActorRelationshipDefinition();
  await getListOfActorTelecom();
  await getListOfActorVehicule();
  await getListOfAddress();
  await getListOfAddressType();
  await getListOfBisounoursH();
  await getListOfStory();
  await getListOfStoryEvent();
  await getListOfBisounousJRole();
  await getListOfBisousnour();
  await getListOfList();
  await getListOfRole();
  await getListOfStoryEventInvolve();
  await getListOfPackaging();
  await getListOfRoleJPage();
  await getListOfWebElement();
  await getListOfWebElementJListFilter();
  await getCurrentIds(id);
});
</script>
