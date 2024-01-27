<template>

  <!-- begin:: Body -->
  <div
    class="page d-flex h-100" style="height: 100%;"
  >
  
    <!-- begin:: Aside Left -->
    
    <!-- end:: Aside Left -->

    <div class="d-flex flex-column flex-row-fluid wrapper h-100" style="height: 100%;">
      <!-- begin:: Content -->
      <div id="kt_content" style="height: 100%;" class="content d-flex flex-column flex-column-fluid h-100">
        <!-- begin:: Content Body -->
        <div class="post d-flex flex-column-fluid h-100"  style="height: 100%;">

            <router-view />
        </div>
        <!-- end:: Content Body -->
      </div>
      <!-- end:: Content -->

     
    </div>
  </div>
  <!-- end:: Body -->
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from "vue";

import { useRoute, useRouter } from "vue-router";


import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Layout",
  components: {
  },
  setup() {
    const route = useRoute();
    // show page loading

  



    return {

    };
  },
});
</script>

<style lang="scss">
.drawer {
  width: 40%;
  border-radius: 10px 0px 0px 0px;
  position: absolute;
  right: 0;
  top: 0;
}
@media (max-width: 1440px) {
  .drawer {
    width: 50vw;
  }
}
</style>
