<template>
    <div class="card-info__container p-10 pb-5 ">
      <div class="fs-2  mb-5 fw-boldest color-gris">  
        <span class="">Mes informations</span></div>

      <div >
        <el-form
        ref="ruleFormRef"
        :model="user"
        status-icon
        label-width="300px"
        label-position="top"
      >
         <el-form-item label="Nom" prop="nom" >
          <el-input :value="user?.lastName"  :disabled="true " size="large" />
        </el-form-item>
        <el-form-item label="Prénom" prop="Prénom">
          <el-input :value="user?.firstName" :disabled="true" size="large"/>
        </el-form-item>
      
           <el-form-item label="Téléphone portable" prop="Téléphone portable">
          <el-input :value="user?.telephone" :disabled="true" size="large"/>
        </el-form-item>
    
         <el-form-item label="E-mail" prop="E-mail">
          <el-input :value="user?.username" :disabled="true" size="large"/>
        </el-form-item>
      
         <el-form-item label="N° et nom de la rue" prop="N° et nom de la rue">
          <el-input  :value="user?.addressOfUser?.streetNb" :disabled="true" size="large"/>
        </el-form-item>
     
        <el-form-item label="Code postal" prop="Code postal">
          <el-input  :value="user?.addressOfUser?.zipCode" :disabled="true" size="large"/>
        </el-form-item>
        
           <el-form-item label="Ville" prop="Ville">
          <el-input  :value="user?.addressOfUser?.town" :disabled="true" size="large"/>
        </el-form-item>
    
        <el-form-item label="Pays" prop="Pays">
          <el-input  :value="user.addressOfUser?.listIdCountryObject?.captionFr" :disabled="true" size="large"/>
        </el-form-item>
      
      </el-form>
      </div>
    </div>
  </template>
  <script setup lang="ts">
import {ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
import { useUserStore } from "@/store/useUserModule";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useUserStore());


  </script>
  <style lang="scss" scoped>
  .card-info__ {
    &container {
      border-radius: 10px;
      box-shadow: 1px 1px 7px 0px rgba(193, 182, 178, 0.94);
    }
  }
.color-gris{
  color:$gris-fonce
}

  </style>