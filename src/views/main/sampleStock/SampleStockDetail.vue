<template>
    <div class="h-100">
      <el-tabs
        v-model="activeName"
        class="demo-tabs h-100"
      >
        <el-tab-pane label="Stock" name="Stock" class="h-100">
          <StockDetailForm/>

        </el-tab-pane>
        <el-tab-pane
          label="Quantité remise en main propre "
          name="inplace"
          >
          <StockAttribution v-if="activeName==='inplace'" type="inPlace"/>
        </el-tab-pane>
        <el-tab-pane
          label="Quantité expédiée"
          name="toSend">
          <StockAttribution v-if="activeName==='toSend'" type="ToSend"/>
          </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  <script lang="ts" setup>
    import { useConfigStore } from "@/store/useConfig";
    import { ref } from "vue";
    import StockDetailForm from "@/components/forms/StockDetailForm.vue";
    import StockAttribution from "@/components/shared/ag-grid-table/StockAttribution.vue";
    const { setHeader } = useConfigStore();
   
    setHeader("StockDetailHeader");
    const activeName = ref("Stock");
    const handleClick = (tab, event: Event) => {
    };

</script>

<style lang="scss" scoped>

:deep(.el-tabs){
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__content) {
  overflow: initial;
  position: static;
  flex:1;
}

</style>
