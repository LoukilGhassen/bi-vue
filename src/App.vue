<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Home from './views/Home.vue'
const route = useRoute();
const router = useRouter();


onMounted(async () => {
  
});

</script>
<template>

  <div  style="height: 100%;">
   <Home/>
  </div>
</template>

<style lang="scss">
#app {
height: 100%;}
</style>
