<template>
  <div class="h-100">
    <el-tabs
      v-model="activeName"
      class="demo-tabs h-100"
      @tab-change="handleClick"
    >
      <el-tab-pane label="Orientations" name="ActorPersoOrientation">
        <ListList
          entityValue="orientations"
          webElementAddress="ActorPersoOrientation"
          v-if="activeName === 'ActorPersoOrientation'"
        />
      </el-tab-pane>

      <el-tab-pane
        label="Délégué(s) pharmaceutique(s)"
        name="delegate"
      ></el-tab-pane
      ><PharmaceuticalDelegateList v-if="activeName === 'delegate'" />
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/store/useConfig";
import { ref } from "vue";
import ListList from "@/views/main/list/ListList.vue";
import PharmaceuticalDelegateList from "./PharmaceuticalDelegateList.vue";
const { setHeader } = useConfigStore();

setHeader("ListsHeader", {
  listType: "ActorPersoOrientation",
});
const activeName = ref("ActorPersoOrientation");
const handleClick = (name) => {
  switch (name) {
    case "ActorPersoOrientation":  
      setHeader("ListsHeader", {
        listType: "ActorPersoOrientation",
      });
      break;

    case "delegate":
      setHeader("ContactConfigurationHeader");
      break;

    default:
      return;
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__content) {
  flex: 1;
}
:deep(.el-tabs__content) {
  overflow: initial;
  position: static;
}
</style>
