<template>
    <ConfirmModal
      :title="payload.title"
      :isOpenModal="$props.showModal"
      @close-confirm-modal="handleCloseConfirmModal"
      @approve-confirm-modal="handleDeleteDelegate"
      :beforeClose="handleCloseConfirmModal"
      width="30%"
      top="25vh"
    >
      <span class="noir">
        Vous êtes sur le point de supprimer
        {{ props.payload.user.lastName + " " + props.payload.user.firstName }}.
        Les droits et les configurations liés aux utilisateurs rattachés vont être
        modifiés.
      </span>
    </ConfirmModal>
  </template>
  <script lang="ts" setup>
  import ConfirmModal from "@/components/modals/ConfirmModal.vue";
  import { useRoute,useRouter } from "vue-router";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
  
  import { useUserStore } from "@/store/useUserModule";
import { usePharmaceuticalDelegateStore } from "@/store/usePharmaceuticalDelegateModule";
  const props = defineProps({
    showModal: {
      type: Boolean,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
  });
  const router = useRouter();
  const route= useRoute()
  
  const emit = defineEmits(["close-modal", "deleted-reason"]);
  const { deletePharmaceuticalDelegate } = usePharmaceuticalDelegateStore();
  const handleCloseConfirmModal = () => {
    emit("close-modal");
  };
  
  const handleDeleteDelegate = async () => {
    console.log(props.payload,'props.payload')
    await deletePharmaceuticalDelegate(props.payload.user.id);
    if(route.name !== "admin-list-delegate" ){
        router.push({
      name: "admin-list-delegate",
    });
    }
    handleCloseConfirmModal();
    Components.ElNotification.success({
      message: "opération effectué avec succès",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
  };
  </script>
  <style lang="scss" scoped></style>
  