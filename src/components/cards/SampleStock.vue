<template>
  <div class="sample-stock__container w-100 h-100">
    <CardHeader
      title="Stock Echantillon"
      icon="/svg/icons/sample.svg"
      :widget="props.payload"
    />
    <div class="p-5 pt-0" v-if="!props.payload?.reduced">
      <div
        v-for="product in products"
        :key="product.name"
        class="d-flex align-items-center pb-7 gap-5"
      >
        <div class="sample-stock__product-name">produit {{ product.name }}</div>
        <div class="sample-stock__progress">
          <el-progress :percentage="product.percentage" :show-text="false" :color="customColors" />
        </div>
        <div>{{product.percentage}}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CardHeader from "./CardHeader.vue";
const products = [{name:"A",percentage:70},{name:"B",percentage:50},{name:"C",percentage:30}
,{name:"D",percentage:100},{name:"E",percentage:50},{name:"F",percentage:30},{name:"G",percentage:100}
,{name:"A",percentage:44},{name:"B",percentage:80},{name:"C",percentage:60}]
const customColors = (percentage: number) => {
  if (percentage < 40) {
    return '#6E1AF9'
  }
  if (percentage < 70) {
    return '#FFD700'
  }
  return '#10E5E5'
}
const props = defineProps({
  payload:{
    required: false,
  }
})


</script>
<style lang="scss" scoped>
.sample-stock__ {
  &container {
    overflow-y:scroll;
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);

  }
  &progress {
    flex: 1;
  }
}
:deep(.el-progress-bar__outer) {
  background-color: transparent;
  border-radius: 0px;

}
:deep(.el-progress-bar__inner) {
  border-radius: 0px;
}
</style>