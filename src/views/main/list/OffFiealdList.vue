<template>
  <div>
   <ListList entityValue="activités hors terrain" webElementAddress="OffFieldTypes"/>
  </div>
</template>

<script lang="ts">
import ListList from "@/views/main/list/ListList.vue"
import { useConfigStore } from "@/store/useConfig";
import { can } from "@/core/helpers/permission";

export default {
  components: {
    ListList
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },

  },
  
  setup(props) {

    const { setHeader } = useConfigStore();
   setHeader("ListsHeader", { listType: "OffFieldTypes" })
    return {  
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
