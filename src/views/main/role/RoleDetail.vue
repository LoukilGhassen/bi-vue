<template>
  <div class="role-detail w-100 px-7 pt-7" style="height: calc(100vh - 130px)">
    <p class="fw-boldest">Information du rôle</p>
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      class="h-100"
      v-if="form.roleJPages"
    >
      <div class="info d-flex gap-4 w-100">
        <el-form-item prop="roleName">
          <label class="">Nom du rôle</label>
          <el-input size="large" v-model="form.roleName" />
        </el-form-item>
        <el-form-item class="w-50" prop="description">
          <label class="w-100">Description du rôle</label>
          <el-input size="large" v-model="form.description" />
        </el-form-item>
      </div>
      <div class="modules p-10 mb-4 h-100">
        <el-divider content-position="center">Utilisation du CRM</el-divider>
        <div class="Module" v-for="(crmModule,key) in crmList" :key="key">
          <div
            v-for="(moduleService, index) in crmModule" :key="index"
            class="d-flex align-items-center gap-3"
            :class="[
              index !== 0 ? 'ps-12' : '',
              index === 0 ? 'fw-boldest' : '',
            ]"
          >
            <el-switch
              active-text=""
              class="mx-2"
              @change="handleCrmSwitchChange($event,index,moduleService.tag)"
              v-model="form.roleJPages[moduleService.tag].hasAccess"
              :disabled="
                !form.roleJPages[crmModule[0].tag].hasAccess && index !== 0
              "
            />
            <p class="d-inline max-w-max-content text-nowrap mb-0">
              {{ moduleService.captionFr }}
            </p>

            <el-divider />
            <el-select
              v-if="!standardModules.includes(moduleService.tag)"
              v-model="
                form.roleJPages[moduleService.tag].listIdPermissionTypeObject.id
              "
              class="m-2"
              placeholder="Select"
              size="large"
              :disabled="
                (!form.roleJPages[crmModule[0].tag].hasAccess && index !== 0) ||
                !form.roleJPages[moduleService.tag].hasAccess
              "
            >
              <el-option
                v-for="permission in rolePermissionList"
                :key="permission.id"
                :label="permission.captionFr"
                :value="permission.id"
              />
            </el-select>
          </div>
        </div>
        <el-divider content-position="center">Fonction de support </el-divider>
        <div class="Module" v-for="(SupportModule,key) in supportList" :key="key">
          <div
            v-for="(moduleService, index) in SupportModule" :key="index"
            class="d-flex align-items-center gap-3"
            :class="[
              index !== 0 ? 'ps-12' : '',
              index === 0 ? 'fw-boldest' : '',
            ]"
          >
            <el-switch
              active-text=""
              class="mx-2"
              @change="handleSupportSwitchChange($event,index,moduleService.tag)"
              v-model="form.roleJPages[moduleService.tag].hasAccess"
              :disabled="
                !form.roleJPages[SupportModule[0].tag].hasAccess && index !== 0
              "
            />
            <p class="d-inline max-w-max-content text-nowrap mb-0">
              {{ moduleService.captionFr }}
            </p>

            <el-divider :style="{ color: 'black' }" />
            <el-select
              v-if="!standardModules.includes(moduleService.tag)"
              v-model="
                form.roleJPages[moduleService.tag].listIdPermissionTypeObject.id
              "
              class="m-2"
              placeholder="Select"
              size="large"
              :disabled="
                (!form.roleJPages[SupportModule[0].tag].hasAccess &&
                  index !== 0) ||
                !form.roleJPages[moduleService.tag].hasAccess
              "
            >
              <el-option
                v-for="permission in rolePermissionList"
                :key="permission.id"
                :label="permission.captionFr"
                :value="permission.id"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="d-flex w-100">
        <el-button
          type="primary"
          class="primary-btn poppins ms-auto"
          size="large"
          @click="onSubmit(ruleFormRef)"
        >
          Modifier
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
//import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import type { ElForm } from "element-plus";
import { t } from "@/core/i18n/translate";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
import { useRoleStore } from "@/store/useRoleModule";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/store/useConfig";
import _ from "lodash";
import service from "@/service";
const { setHeader } = useConfigStore();
setHeader("RoleListHeader");
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const route = useRoute();
const crmList = ref();
const supportList = ref();
const { error, role } = storeToRefs(useRoleStore());
const { getRoleById, editRole } = useRoleStore();
const form = ref({
  roleName: "",
  description: "",
});
const disableSwitch = (list,tag) => {
  const elementList = list.find((e) => e[0].tag === tag)
    elementList?.map((e) => {
      form.value.roleJPages[e.tag].hasAccess = false
    })
}
const handleSupportSwitchChange = (value,index,tag) => {
  if(!value && index===0){
    disableSwitch(supportList.value,tag)
  }
} 
const handleCrmSwitchChange = (value,index,tag) => {
  if(!value && index===0){
    disableSwitch(crmList.value,tag)

  }
}
// standard => always just read permission
const standardModules = [
  "Dashboard",
  "NextVmVisitWidget",
  "VmStockWidget",
  "DirStockWidget",
  "WidgetAppointmentsOfWeekVm",
  "VmVisitFrequencyWidget",
  "DirPodiumRankingWidget",
  "TeamMonitoringWidgetOnDirAnnualVisitObjective",
  "WidgetVisitsToRecordVm",
  "WidgetDoctorsToVisitVm",
  "VisitObjectivesToAchieveDir",
  "ProductObjectivesToAchieveVm",
  "ProductObjectivesToAchieveDir",
  "VmNetworkCoverage",
  "DirNetworkCoverage",
  "GenericReportsAndStatistics",
  "TeamManagement",
  "TeamManagementDashboard",
  "SupportVisit",
  "SupportContact",
  "SupportOffFieldActivity",
];
const rolePermissionList = ref([]);
const onSubmit = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await editRole({ id: route.params.id, data: form.value });
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const rules = {
  roleName: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["change", "blur"],
    },
  ],
  description: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["change", "blur"],
    },
  ],
};
onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "UpdateRolesList"
    );
    
    const id = route?.params?.id as string;
    await getRoleById(id);
    form.value = _.cloneDeep(role.value);
  const crmModules = role.value?.tag === 'VM' || role.value?.tag.includes('DIR') ? 
  [
    "CrmDashboard",
    "CrmCalendar",
    "CrmVisit",
    "CrmContact",
    "CrmOffFiealdActivity",
    "CrmPreDefinedReportsAndStatistics",
    "CrmGenericReportsAndStatistics",
    "CrmMarketing",
    "CrmCongres",
    "CrmTeamManagement",
  ] : 
  [
    "CrmCalendar",
    "CrmVisit",
    "CrmContact",
    "CrmOffFiealdActivity",
    "CrmPreDefinedReportsAndStatistics",
    "CrmGenericReportsAndStatistics",
    "CrmMarketing",
    "CrmCongres",
    "CrmTeamManagement",
  ]
  crmList.value = crmModules.map((key) => resp?.data[key]);
  supportList.value = [
    "SupportUserManagement",
    "SupportProducts",
    "SupportSamples",
    "SupportDeleteReasons",
    "SupportVisit",
    "SupportContact",
    "SupportOffFieldActivity",
  ].map((key) => resp?.data[key]);
  rolePermissionList.value = resp?.data?.RolePermissions;
});

</script>
<style lang="scss" scoped>
.role-detail {
  background-color: $gris-clair;
}
.info {
  :deep(.el-input input) {
    background-color: $gris-clair;
    border: 1px solid $gris-moyen;
    color: $noir;
    font-family: "poppins";
  }
}
.modules {
  overflow-y: scroll;
  background-color: white;
  border-radius: 10px;
  max-height: calc(100vh - 350px);
}
:deep(.el-select) {
  max-width: 120px;
  min-width: 120px;
}
</style>
