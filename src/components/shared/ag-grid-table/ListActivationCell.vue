<template>
  <el-switch v-model="status" @change="editUgaStatus" @click.stop="" />
</template>

<script>
import { ref } from "vue";
import service from "@/service";

export default {
  props: ["params"],
  setup(props) {

   
    const status = ref(props.params?.data?.ids?.actif);
    const editUgaStatus = async (val) => {
       await service.api.idsControllerUpdate(props.params?.data?.id, {actif:val} );
    };
    return {
      status,
      editUgaStatus,
    };
  },
};
</script>
<style lang="scss" scoped></style>