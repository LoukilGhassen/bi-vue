<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      {{ actor.actorObject?.actorName }}
      {{ actor.actorObject?.actorPerson?.firstName }}
    </div>
    <div class="d-flex gap-5">
      <el-button
        size="large"
        type="primary"
        class="fw-boldest poppins"
        v-if="actorType !== 'entity' && actorType !== 'healthCenter'"
        @click="handleAddVisit"
      >
        <inline-svg class="me-3" src="/svg/icons/plus.svg" />
        Ajouter une visite
      </el-button>
      <el-switch
        :model-value="actor.actorObject?.actif"
        active-text="Actif"
        class="mx-2"
        @change="handleToggleActif"
      />

      <el-tooltip
        class="box-item"
        effect="dark"
        content="Dupliquer le contact"
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
        content="Envoyer un message au contact"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleSendEmail"
        >
          <inline-svg src="/svg/icons/send.svg" />
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="box-item"
        effect="dark"
        content="Supprimer le contact"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleDeleteModal"
        >
          <inline-svg src="/svg/icons/trash.svg" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import service from "@/service";
import { useActorStore } from "@/store/useActorModule";
import { useActorPersonStore } from "@/store/useActorPersonModule";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { deleteActor,setActif } = useActorStore();
const handleSendEmail = () => {
  setModal("SendEmailModal", {
    type: "actor",
    toEmail: actor.value?.actorObject?.email,
  });
};
const props = defineProps({
  payload: {
    type: Object,
    required: false,
  },
});
const { actor, error } = storeToRefs(useActorStore());

const actorType = ref(route.params.type);

//const switchVal = ref(actor.value?.actorObject?.actif);
const handleDuplicate = async () => {
  await service.api.actorControllerDuplicate(route.params.id as string);
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
const handleDeleteContact = async (id: string, motif: string) => {
  await deleteActor({
    id,
    deletedReason: motif,
  });
  router.push({
    name: "admin-list-contact",
  });
};

const handleDeleteModal = () => {
  setModal("DeleteContactModal", {
    id: route.params.id,
    deleteEntity: handleDeleteContact,
    title: "Supprimer le contact",
    text: `le contact ${actor?.value?.actorObject?.actorName}`,
  });
};
const handleBackClick = () => {
  router.push({
    name: "admin-list-contact",
  });
};
const handleToggleActif = async (val: boolean) => {
  if(val){
    await service.api.actorControllerUpdate(route.params.id as string, {
        actif: val,
     });
    Components.ElNotification.success({
      message: "Opération effectuée avec succès",
      type: "success",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
    setActif(true)
  }else{
    setModal("DisableContactModal", {
    text:  actor?.value?.actorObject?.actorName,
    id: route.params.id,
    actif: val,
    title: "Désactiver le contact",
  });
  }
  
};
const handleAddVisit = () => {
  setModal("VisitCreate", { actor: actor.value.id });
};
/* watch(actor, () => {
  switchVal.value = actor.value?.actorObject?.actif;
});
 */</script>
<style lang="scss" scoped>
.el-button {
  margin-left: 0;
}
:deep(.el-button--large) {
  padding: 12px 15px;
}

:deep(.el-switch__label.is-active) {
  color: $noir;
}
</style>
