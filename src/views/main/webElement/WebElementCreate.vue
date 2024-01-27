<template>
  <div class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 card">
    <h3 class="text-center text-primary my-4">Create WebElement</h3>
    <WebElementForm :isEdit="false" />
  </div>
</template>

<script lang="ts" setup>
import WebElementForm from "@/components/forms/WebElementForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("create webelement", ["webelements"]);
});
</script>
