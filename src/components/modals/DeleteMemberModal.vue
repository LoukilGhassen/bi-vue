<template>
    <ConfirmModal
      :title="payload.title"
      :isOpenModal="$props.showModal"
      @close-confirm-modal="handleCloseConfirmModal"
      @approve-confirm-modal="handleDeleteUser"
      :beforeClose="handleCloseConfirmModal"
      width="30%"
      top="25vh"
    >
      <span class="noir">
        Vous êtes sur le point de supprimer l’attribution de l'utilisateur 
        {{ props.payload.user.firstName + " " + props.payload.user.lastName}}.
        Les quantités attribuées ont déjà été utilisée. Cela va impacter le suivi de vos stocks échantillon. Souhaitez-vous continuer ?
      </span>
    </ConfirmModal>
  </template>
  <script lang="ts" setup>
  import ConfirmModal from "@/components/modals/ConfirmModal.vue";
  import { useRoute,useRouter } from "vue-router";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
import { useSampleStockStore } from "@/store/useSampleStockModule";
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
  const { deleteSampleStock } = useSampleStockStore();
  const handleCloseConfirmModal = () => {
    emit("close-modal");
  };
  
  const handleDeleteUser = async () => {
    await deleteSampleStock(props.payload.user.id);
    // if(route.name !== "admin-list-stock" ){
    //     router.push({
    //   name: "admin-list-stock",
    // });
    // }
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
  