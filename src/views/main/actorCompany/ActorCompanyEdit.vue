<template>
  <div
    class="col-12 col-md-8 mx-auto mt-4 border border-secondary p-5 bg-white"
  >
    <h3 class="text-center text-primary my-4">Edit ActorCompany</h3>
    <ActorCompanyForm isEdit />
  </div>
</template>
<script lang="ts" setup>
import ActorCompanyForm from "@/components/forms/ActorCompanyForm.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/config";
import { onMounted } from "vue";
onMounted(() => {
  setCurrentPageBreadcrumbs("Edit actorcompany", ["actorcompanies"]);
});
</script>
