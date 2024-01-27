<template>
  <div>
    <span class="svg-icon-1 delete p-3 ps-0">
      <el-tooltip content="Fiche à compléter" placement="top" effect="light">
        <template #content
          ><div class="gris-fonce poppins mb-1">
            {{ params.cellData.tooltipTitle }}
          </div>
          <span v-for="tooltipItem in tooltipItems"
            >{{ tooltipItem }}<br />
          </span>
        </template>
        <span class="poppins noir"
          >{{ tooltipItems.length }} {{ params.cellData.entity
          }}<span v-if="tooltipItems.length > 1">s</span>
        </span>
      </el-tooltip>
    </span>
  </div>
</template>

<script>
export default {
  props: ["params"],
  setup(props) {
    const tooltipItems = ref([]);
    switch (props.params.cellData.type) {
      case "product":
        tooltipItems.value =
          props.params.data.storyEvents.Product.storyEventInvolves.map(
            (product) => product.anyId.actorProduct.name
          );
          break
      case "inPlace":
        tooltipItems.value =
          props.params.data.storyEvents.InPlaceSample.storyEventInvolves.map(
            (spl) => spl.anyId.packaging.sample.name
          );
          break
      case "toSend":
        tooltipItems.value =
          props.params.data.storyEvents.ToSendSample.storyEventInvolves.map(
            (spl) => spl.anyId.packaging.sample.name
          );
          break

      default:
         tooltipItems.value = [];
        break;
    }
    return { tooltipItems };
  },
};
</script>
<style lang="scss" scoped></style>
