<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1">Activité Hors Terrain</div>
    <div class="d-flex gap-5">
      <el-button size="large" type="primary" class="fw-boldest poppins" @click="handleAddActivity">
        <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
        Ajouter une activité hors terrain
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {setModal} from "@/core/helpers/config"

const handleAddActivity = () => {
 setModal('OffFieldActivityFormModal')
}
</script>
<style lang="scss" scoped>
</style>