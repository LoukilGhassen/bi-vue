<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
        <span class="cursor-pointer" @click="goBack">
          <inline-svg src="/svg/icons/arr063.svg" />
        </span>
        Liste des produits</div>
      <div class="d-flex gap-5">
        <el-button size="large" class="poppins secondary-btn fw-normal" @click="handleCategories">
          Gestion des catégories
        </el-button>
        <el-button size="large" type="primary" class="fw-boldest poppins" @click="handleAddProduct">
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Ajouter un produit
        </el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import {setModal} from "@/core/helpers/config"
  import { useRouter } from "vue-router";
  const router = useRouter()
  const handleCategories = () => {
   router.push({name:"admin-list-categories"})
  }
  const handleAddProduct = () => {
    setModal('ActorProductModal')
  }
  const goBack = () => {
  router.back();
};
  </script>
  <style lang="scss" scoped>
  </style>