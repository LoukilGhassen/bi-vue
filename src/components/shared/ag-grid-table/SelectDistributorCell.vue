<template>
    <span v-if="params.data?.distributor?.name">
      {{ params.data?.distributor?.name }}
    </span>
    <el-form class="w-100">
      <el-select
        remote
        filterable
        class="w-100"
        @change="handleSelectDistributor"
        :remote-method="querySearch"
        clearable
        placeholder="Rechercher un répartiteur"
      >
        <el-option
          v-for="item in wholesalerList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form>
  </template>
  
  <script>
  import { useRoute } from "vue-router";
  import service from "@/service";
  import { storeToRefs } from "pinia";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
  import { usePharmacyDistributorStore } from "@/store/usePharmacyDistributorModule";

  import { ref } from "vue";
import { useActorStore } from "@/store/useActorModule";

  
  export default {
    components: {},
  
    props: ["params"],
  
    setup(props) {
      const route = useRoute();
  //  const productSearch = ref("");
      const wholesalerList = ref([]);
      const { updateWholeSalerCount } = useActorStore();

      const { createPharmacyDistributor, setShowListAddRow } =  usePharmacyDistributorStore();
      const querySearch = async (queryString) => {
        const { data } = await service.api.distributorControllerFindMany({
          skip: 0,
          take: 20,
          "where[name][contains]": queryString ? queryString : "",
          "where[name][mode]": "insensitive",
          "where[ids][actif][equals]": true,
          "where[listIdWholesalerObject][ids][actif][equals]":true,
          "where[pharmacies][none][pharmacyId]": route.params.id
            ? `${route.params.id}`
            : "",
        });
        wholesalerList.value = data.paginatedResult;
      };
  
      const handleSelectDistributor = async (selectedDistributor) => {
        await createPharmacyDistributor({
          data: {
            pharmacy: {
              id: route.params.id,
            },
            distributor: {
              id: selectedDistributor,
            },
          },
        });
        setShowListAddRow(true);
        updateWholeSalerCount(1)
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      };
      onMounted(async () => {
        if (!props.params?.data?.distributor?.name) {
          querySearch("");
        }
      });
      return { wholesalerList, querySearch, handleSelectDistributor };
    },
  };
  </script>
  <style scoped></style>
  