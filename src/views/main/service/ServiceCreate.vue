<template>
    <div>
      <h3 class="text-center text-primary my-4">Ajouter un service</h3>
      <ServiceForm :isEdit="false" />
    </div>
  </template>
<script lang="ts" setup>
import ServiceForm from "@/components/forms/ServiceForm.vue"
</script>
