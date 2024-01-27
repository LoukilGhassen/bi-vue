<template>
    <span v-if="params.data.actorProductObject.name">
      {{ params.data.actorProductObject.name }}
    </span>
    <el-select
    v-else
    remote
    filterable
    class="w-100"
    @change="handleSelectSubstitute"
    :remote-method="querySearch"
    v-model="substituteSearch"
    value-key="name"
    clearable
    placeholder="Rechercher un remplaçant"
    >
    <el-option
        v-for="item in pdsList"
        :key="item.id"
        :label="item"
        :value="item.id"
    />
    </el-select>
  </template>
  
  <script >
  import { useActorActorProductStore } from "@/store/useActorActorProductModule";
  import { useRoute } from "vue-router";
  import service from "@/service";
  
  import { storeToRefs } from "pinia";
  
  import { ref } from "vue";
  
  export default {
    components: {},
  
    props: ["params"],
  
    setup(props) {
      const route = useRoute();
      const substituteSearch = ref("");
      const productList = ref([]);
  
      const { createActorActorProduct , setShowListAddRow } = useSubstituteStore();
      const querySearch = async (queryString) => {
/*         const { data } =  await service.api.actorControllerFindMany({
          "where[actorName][contains]": queryString,
          "where[substitutes][none][substituedId]": route.params.id,
          "where[id][not]": route.params.id,
          "where[actorCompany]": null,
          "where[actorPerson][listIdActorPersonTypeObject][tag]": 'PDS'
        });

        productList.value = data.paginatedResult;
 */      };
  
      const handleSelectSubstitute = async (payload) => {
        

        setShowListAddRow(true)
      };
      return { substituteList, substituteSearch, querySearch, handleSelectSubstitute };
    },
  };
  </script>
  <style scoped></style>
  