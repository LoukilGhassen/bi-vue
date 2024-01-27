<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1 d-flex align-items-center gap-5" >
        <span class="cursor-pointer" @click="goBack">
          <inline-svg src="/svg/icons/arr063.svg" />
        </span>
        <span>Mon profil</span>
      </div>
      <div class="d-flex gap-5">
        <el-button size="large" type="primary" class="fw-boldest poppins" @click="toggleSendEmailModal">
          Contacter l’administrateur
        </el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
import { ref, computed } from 'vue';
import { setModal } from "@/core/helpers/config";
import { useRoute,useRouter } from 'vue-router';
const prevRoute = ref(null);
const route = useRoute();
const router = useRouter();
const toggleSendEmailModal = () => {
  setModal("SendEmailModal", {
    title: "Contacter l'administrateur",
    type: "adminContact",
  });
};
const goBack = () => {
  router.back();
};
  </script>
  <style lang="scss" scoped>
  </style>