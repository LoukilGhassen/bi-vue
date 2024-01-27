<template>
    <div class="admin-layout">
        <router-view />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    name: "adminLayout",
    components: {},
    setup() {

    },
  });
  </script>
  <style lang="scss" scoped>
  .admin-layout {
    width: 100%;
height: 100%;
  }

  </style>
  