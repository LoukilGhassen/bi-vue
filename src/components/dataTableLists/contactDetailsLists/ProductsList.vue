<template>
  <dataTable
    :data="actoractorproductList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actoractorproductPagination"
    :additionalTableOptions="additionalTableOptions"
    :webElementAddress="webElementAddress"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @addRow="handleAddRow"
    entity="produits"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import SelectCellRender from "@/components/shared/ag-grid-table/SelectCellRender.vue";
import { useRoute } from "vue-router";

import { useActorProductStore } from "@/store/useActorProductModule";
import { useActorActorProductStore } from "@/store/useActorActorProductModule";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useActorStore } from "@/store/useActorModule";
export default {
  name: "table-column-example",
  components: {
    dataTable,
    CustomRowOptions,
    SelectCellRender,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const route = useRoute();
    const { updateProductCount } = useActorStore();
    const {
      actoractorproductList,
      actoractorproductPagination,
      showListAddRow,
    } = storeToRefs(useActorActorProductStore());
    const {
      fetchActorActorProducts,
      addActorProduct,deleteEmptyActorProduct,
      deleteActorActorProduct,
      setShowListAddRow,
    } = useActorActorProductStore();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const columnDefs = ref([
      {
        colId: "name",
        hide: false,
        field: "actorProductObject.name",
        headerName: "Produit(s) présenté(s)",
        cellRenderer: SelectCellRender,
        flex: 1/3 ,
        search: {
          criteria: "[actorProductObject][name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorProductObject][name]",
        },
        lockPosition: "left",
        suppressMovable: true,
        headerComponentParams: {
          unhidable: true,
          unmovable: true,
        },
        lockPinned: true,
      },
      {
        colId: "market",
        hide: false,
        field: "actorProductObject.markets",
        headerName: "Marché(s)",
        flex: 1 / 3,
        valueGetter: (params) => {
          if (params?.data?.actorProductObject?.markets) {
            const data = params?.data?.actorProductObject?.markets?.map(
              (e) => e.listIdProductMarketObject.captionFr
            );
            return data.join(",");
          }},
        search: {
          criteria:
            "[actorProductObject][markets][some][listIdProductMarketObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorProductObject][markets][some][listIdProductMarketObject][captionFr]",
        },
        lockPinned: true,
      },
      {
        colId: "category",
        hide: false,
        field: "actorProductObject.listIdProductCategoryObject.captionFr",
        headerName: "Catégorie(s)",
        flex: 1 / 3,
        search: {
          criteria:
            "[actorProductObject][listIdProductCategoryObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorProductObject][listIdProductCategoryObject][captionFr]",
        },
        lockPinned: true,
      },

      {
        colId: "menu",
        hide: false,
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: CustomRowOptions,
        lockPosition: "right",
        cellClass: "locked-col",
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "product",
      list: ["delete"],
    });
    const additionalTableOptions = computed(() => {
      return showListAddRow.value ? ["addRow"] : ["addRow", "addRowDisabled"];
    });

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchActorActorProducts(route.params.id,
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        { ...filtersCriteria.value, ...serchCriteria.value }
      );
    };
    const currentPageChange = async (val) => {
      await fetchActorActorProducts(route.params.id,
        {
          skip: (val - 1) * actoractorproductPagination.value.take,
          take: actoractorproductPagination.value.take,
        },
        { ...filtersCriteria.value, ...serchCriteria.value }
      );
    };

    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        if(!item.selectedRow.actorProductObject.id){
           deleteEmptyActorProduct()
           setShowListAddRow(true)
        }
       else await deleteActorActorProduct(item.selectedRow.id);
        updateProductCount(-1);
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      }
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchActorActorProducts(
        route.params.id,
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...filtersCriteria.value, ...serchCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchActorActorProducts(
        route.params.id,
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const handleAddRow = () => {
      addActorProduct({
        actorProductObject: {
          id: "",
          name: "",
          listIdProductCategoryObject: { captionFr: "" },
          listIdProductMarketObject: { captionFr: "" },
        },
      });
      setShowListAddRow(false);
    };

    onMounted(async () => {
      await Promise.all([
        fetchActorActorProducts(route.params.id, {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        }),
      ]);
      setShowListAddRow(true);
    });
    return {
      columnDefs,
      defaultColDef,
      actoractorproductPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      handleAddRow,
      actoractorproductList,
    };
  },
};
</script>
<style lang="scss" scoped></style>
