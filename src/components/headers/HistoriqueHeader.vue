<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      <span> Historique </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleBackClick = () => {
  router.push({
    name: "home",
  });
};
</script>
<style lang="scss" scoped>
.el-button {
  margin-left: 0;
}
:deep(.el-button--large) {
  padding: 12px 15px;
}
:deep(.el-switch__label.is-active) {
  color: $noir;
}
</style>
