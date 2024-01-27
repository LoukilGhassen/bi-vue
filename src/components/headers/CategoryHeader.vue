<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
        <span class="cursor-pointer" @click="goBack">
          <inline-svg src="/svg/icons/arr063.svg" />
        </span>
        Gestion des catégories de produit</div>
      <div class="d-flex gap-5">
        <el-button size="large" type="primary" class="fw-boldest poppins" @click="handleAddCategory">
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Ajouter une catégorie
        </el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import {setModal} from "@/core/helpers/config"
  import { useRouter } from "vue-router";
  const router = useRouter()
  const handleAddCategory = () => {
   setModal('CategoryModal')
  }
  const goBack = () => {
  router.back();
};
  </script>
  <style lang="scss" scoped>
  </style>