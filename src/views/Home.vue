<template>
  <MainDashboard />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MainDashboard from "./main/dashboard/MainDashboard.vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "home",
  components: {
    MainDashboard,
  },
  setup() {
    onMounted(async () => {
    });
    return {  };
  },
});
</script>
<style lang="scss" scoped>
.sample-stock {
  height: 100%;
  flex: 1;
}
.next-rdv {
  flex: 1;
}
:deep(.el-dialog__mention-legal) {
  height: 80vh;
  width: 80vw;
  box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  border-radius: 10px;
}
:deep(.el-dialog__body) {
  height: 100%;
  padding: 0;
}
:deep(.el-dialog__header) {
  padding: 33px;
  font-weight: 700;
}
:deep(.el-dialog__headerbtn) {
  font-size: 25px;
  padding-top: 26px;
  padding-right: 50px;
}
:deep(.el-dialog__close) {
  color: black;
}
</style>
