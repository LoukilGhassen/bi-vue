<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
        <span class="cursor-pointer" @click="goBack">
          <inline-svg src="/svg/icons/arr063.svg" />
        </span>
        {{actorSample.name}}
      </div>
      <el-switch
        :model-value="actorSample?.ids?.actif"
        active-text="Actif"
        class="mx-2"
        @change="handleToggleActif"
      />
    </div>
  </template>
  <script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import service from "@/service";
import { useActorSampleStore } from "@/store/useActorSampleModule";
  const route = useRoute();
  const router = useRouter();
  const props = defineProps({
    payload: {
      type: Object,
      required: false,
    },
  });

  const {actorSample} = storeToRefs(useActorSampleStore());
  const {toggleActif} = (useActorSampleStore());
  const id = route.params?.id;
  const goBack = () => {
  router.back();
};
  const handleToggleActif = async (val: boolean) => {
    await service.api.idsControllerUpdate(id,{actif: val}); 
    toggleActif(val)
    Components.ElNotification.success({
      message: "Opération effectuée avec succès",
      type: "success",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
  
};
  </script>
  <style lang="scss" scoped>
  .el-button {
    margin-left: 0;
  }
  :deep(.el-button--large) {
    padding: 12px 15px;
  }
  :deep(.el-switch) {
    --el-switch-on-color: #10e5e5;
    --el-switch-off-color: #e6e9ed;
  }
  :deep(.el-switch__label.is-active) {
    color: $noir;
  }
  </style>
  