<template>
  <div>
    <el-tabs
      v-model="activeTabsName"
      class="demo-tabs contact"
      @tab-change="handleTabsClick"
    >
      <!-- <el-tab-pane label="Types de visite" name="VisitType">
        <ListList
          entityValue="types"
          webElementAddress="VisitType"
          v-if="activeTabsName === 'VisitType'"
        />
      </el-tab-pane> -->
      <el-tab-pane label="Motifs de visite" name="VisitReasons">
        <ListList
          entityValue="motifs"
          webElementAddress="VisitReasons"
          v-if="activeTabsName === 'VisitReasons'"
        />
      </el-tab-pane>
      <el-tab-pane label="Objectifs de visite" name="VisitObjectives"
        ><VisitObjectives v-if="activeTabsName === 'VisitObjectives'"/></el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script lang="ts">
import ListList from "@/views/main/list/ListList.vue";
import { useConfigStore } from "@/store/useConfig";
import { ref } from "vue";
import VisitObjectives from './VisitObjectives.vue'
//import { can } from "@/core/helpers/permission";

export default {
  components: {
    ListList,
    VisitObjectives
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const activeTabsName = ref("VisitReasons");
    const { setHeader } = useConfigStore();
    setHeader("ListsHeader", { listType: activeTabsName.value });
      const handleTabsClick = async (name) => {
      activeTabsName.value = name;
      setHeader("ListsHeader", {
        listType: name,
      });
    };

    return { activeTabsName,handleTabsClick };
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-tabs__content) {
  overflow: auto;
  height: calc(100vh - 160px);
  position: static;
}
:deep(.el-tab-pane){
  height: 100%
}
</style>
