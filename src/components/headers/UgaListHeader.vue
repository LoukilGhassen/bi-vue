<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1">Liste des UGA</div>
    <div class="d-flex gap-5">
      <el-button size="large" type="primary" class="fw-boldest poppins" @click="handleAddActivity">
        <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
        Ajouter un UGA
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {setModal} from "@/core/helpers/config"

const handleAddActivity = () => {
 setModal('UgaFormModal')
}
</script>
<style lang="scss" scoped>
</style>