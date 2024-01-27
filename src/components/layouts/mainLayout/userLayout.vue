<template>
    <div class="user-layout">
        <router-view />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    components: {},
    name: "userLayout",
    setup() {

    },
  });
  </script>
  <style lang="scss" scoped>
  .user-layout {
    width: 100%;
height: 100%;
  }

  </style>
  