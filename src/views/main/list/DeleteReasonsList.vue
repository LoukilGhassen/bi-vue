<template>
  <div>
   <ListList entityValue="motifs" webElementAddress="DeleteReason"/>
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
   setHeader("ListsHeader", { listType: "DeleteReason" })
    return {  
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
