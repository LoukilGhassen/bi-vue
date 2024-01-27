<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1">Gestion des utilisateurs</div>
      <div class="d-flex gap-5">
        <el-button size="large" v-if="roleVisible" class="poppins secondary-btn" @click="toRoleManagement">
          Gestion des rôles
        </el-button>
        <el-button size="large" v-if="addUserVisible" type="primary" class="fw-boldest poppins" @click="handleNewUser">
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Ajouter un utilisateur
        </el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import { useRouter } from "vue-router";
  import {setModal} from "@/core/helpers/config"
  import { storeToRefs } from "pinia";
  import { useAuthStore } from "@/store/useAuth";
  import { useWebElementStore } from '@/store/useWebElementModule';
import { computed } from "vue";

  const { currentUser } = storeToRefs(useAuthStore());
  const { webElementPermission } = storeToRefs(useWebElementStore());
  const router = useRouter();
   const toRoleManagement =()=> {
      router.push({
        name: "admin-list-role",
      });
  }
  const handleNewUser = () => {
    setModal('UserCreate')
  }
   const roleVisible = computed(()=>{
    return(
      currentUser.value?.user_metadata?.userTypes.includes('ADMIN')
    )
  })
   const addUserVisible = computed(()=>{
    return(
      webElementPermission.value['CreateModifyUser'].permissions.filter((permission)=>currentUser?.value?.user_metadata?.userTypes?.includes(permission.role?.tag)).some((permission)=>permission.hasAccess === true && permission.listIdPermissionTypeObject.tag === 'edit') 

    )
  }) 
   </script>
  <style lang="scss" scoped>
  </style>