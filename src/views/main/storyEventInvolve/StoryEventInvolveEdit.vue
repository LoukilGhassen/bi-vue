<template>
  <div
    class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 bg-white"
  >
    <h3 class="text-center text-primary my-4">Edit StoryEventInvolve</h3>
    <StoryEventInvolveForm isEdit />
  </div>
</template>
<script lang="ts" setup>
import StoryEventInvolveForm from "@/components/forms/StoryEventInvolveForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("Edit storyeventinvolve", ["storyeventinvolves"]);
});
</script>
