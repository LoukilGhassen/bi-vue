<template>
  <div
    class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 bg-white"
  >
    <h3 class="text-center text-primary my-4">Edit ActorRelationship</h3>
    <ActorRelationshipForm isEdit />
  </div>
</template>
<script lang="ts" setup>
import ActorRelationshipForm from "@/components/forms/ActorRelationshipForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("Edit actorrelationship", ["actorrelationships"]);
});
</script>
