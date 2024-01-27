<template>
    <div class="d-flex justify-content-between w-100">
      <div class="fw-boldest fs-1">Mon agenda</div>
      <div class="d-flex gap-5">
        <el-button size="large" class="poppins secondary-btn fw-normal" @click="handleAddVisit">
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Ajouter une visite
        </el-button>
        <el-button size="large" type="primary" class="fw-boldest poppins" @click="handleAddEvent">
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Ajouter un évènement
        </el-button>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
  import {setModal} from "@/core/helpers/config"
  
  const handleAddVisit = () => {
   setModal('VisitCreate',{type:'agenda'})
  }
  const handleAddEvent = () => {
    setModal('CalendarEventAdd')
  }
  </script>
  <style lang="scss" scoped>
  </style>