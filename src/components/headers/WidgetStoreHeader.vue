
<template>
  <div class="d-flex gap-5 align-items-center">
    <div class="py-2 cursor-pointer" @click="handleBackClick">
      <inline-svg src="/svg/icons/arr063.svg" />
    </div>
    <div class="fw-boldest fs-1">Bibliothèque des widgets</div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
const handleBackClick = () => {
  router.push({ name: "home" });
};
</script>
<style lang="scss" scoped>
</style>
