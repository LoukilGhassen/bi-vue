<template>
  <div class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 card">
    <h3 class="text-center text-primary my-4">Create Bisousnour</h3>
    <BisousnourForm :isEdit="false" />
  </div>
</template>

<script lang="ts" setup>
import BisousnourForm from "@/components/forms/BisousnourForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("create bisousnour", ["bisousnours"]);
});
</script>
