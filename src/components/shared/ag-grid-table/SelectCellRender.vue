<template>
  <span v-if="params.data?.actorProductObject?.name">
    {{ params.data?.actorProductObject?.name }}
  </span>
  <el-form class="w-100">
    <el-select
      remote
      filterable
      class="w-100"
      @change="handleSelectProduct"
      :remote-method="querySearch"
      v-model="productSearch"
      value-key="name"
      clearable
      placeholder="Rechercher un produit"
    >
      <el-option
        v-for="item in productList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form>
</template>

<script>
import { useActorActorProductStore } from "@/store/useActorActorProductModule";
import { useRoute } from "vue-router";
import service from "@/service";
import { useActorStore } from "@/store/useActorModule";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";

import { ref } from "vue";

export default {
  components: {},

  props: ["params"],

  setup(props) {
    const route = useRoute();
    const productSearch = ref("");
    const productList = ref([]);

    const { actoractorproductList } = storeToRefs(useActorActorProductStore());
    const { createActorActorProduct, setShowListAddRow } =
      useActorActorProductStore();
    const { updateProductCount } = useActorStore();
    const querySearch = async (queryString) => {
      const { data } = await service.api.actorProductControllerFindMany({
        skip: 0,
        take: 20,
        "where[name][contains]": queryString ? queryString : "",
        "where[name][mode]": "insensitive",
        "where[ids][actif][equals]": true,
        "where[actorActorProducts][none][actorId]": route.params.id
          ? `${route.params.id}`
          : "",
      });
      productList.value = data.paginatedResult;
    };

    const handleSelectProduct = async (selectedProduct) => {
      await createActorActorProduct({
        data: {
          actor: {
            id: route.params.id,
          },
          actorProductObject: {
            id: selectedProduct,
          },
        },
      });
      updateProductCount(1);
      setShowListAddRow(true);
      Components.ElNotification.success({
        message: "Opération effectuée avec succès",
        position: "bottom-right",
        offset: 60,
        duration: 2000,
        customClass: "success-notif",
      });
    };
    return { productList, productSearch, querySearch, handleSelectProduct };
  },
};
</script>
<style scoped></style>
