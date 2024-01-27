<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      Visite {{ story?.actorIdByObject?.actorView?.actorObject?.actorName }}
    </div>
    <div class="d-flex gap-5">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Voir fiche contact"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleViewProfile"
        >
          <inline-svg :width="14" :height="16" src="/svg/icons/profil.svg" />
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="dupliquer visite"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleDuplicate"
        >
          <inline-svg src="/svg/icons/duplicate.svg" />
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Supprimer visite"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleDeleteClick"
        >
          <inline-svg src="/svg/icons/trash.svg" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import router from "@/router";
import { useStoryStore } from "@/store/useStoryModule";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import service from "@/service";
const { deleteStory } = useStoryStore();
const { error, story } = storeToRefs(useStoryStore());
const route = useRoute();
const handleDeleteClick = () => {
  setModal("DeleteContactModal", {
    id: route.params.id,
    deleteEntity: handleDeleteContact,
    title: "Supprimer la visite",
    text: `la visite de ${story?.value?.actorIdByObject?.actorView?.actorObject?.actorName}`,
  });
};
const handleDuplicate = async () => {
  await service.api.storyControllerDuplicate(route.params.id as string);
  if (!!error.value) {
    Components.ElMessage.error("opération échouée");
    console.log(error, "error");
  } else {
    Components.ElNotification.success({
      message: "Opération effectuée avec succès",
      type: "success",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
    setModal("");
  }
};
const handleViewProfile = () => {
  const type = story?.value.actorIdByObject?.actorView?.actorObject.actorCompany
    ? story?.value.actorIdByObject?.actorView?.actorObject.actorCompany.listIdActorCompanyTypeObject.tag.toLowerCase()
    : "pds";
  router.push({
    name: "admin-detail-contact",
    params: {
      type: type,
      id: story?.value?.actorIdByObject?.actorView?.actorObject?.id,
    },
  });
};
const handleDeleteContact = async (id: string, motif: string) => {
  await deleteStory({
    id,
    deletedReason: motif,
  });
  router.push({
    name: "visites",
  });
};

const handleBackClick = () => {
  router.push({
    name: "visites",
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
</style>
