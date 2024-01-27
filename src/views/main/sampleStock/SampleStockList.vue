<template>
  <dataTable
    :data="actorSampleList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="actorSamplePagination"
    @popoverItemAction="popoverItemAction"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    entity="échantillon"
    @inputChange="handleSearch"
    :contextMenuList="contextMenuList"
    @onValidateFiltre="validateFiltre"
    webElementAddress="sampleStockList"
    @rowClick="rowClicked"
    :additionalTableOptions="additionalTableOptions"
    :colsOption="false"
    exportEntityName="actorSample"
    :exportFilter="exportFilter"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";
import { ref, onMounted, computed } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";
import { useActorSampleStore } from "@/store/useActorSampleModule";
import { intSort } from "@/core/helpers/dataTableHelper";

export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    ListActivationCell,
  },
  setup(props) {
    const router = useRouter();
    const { setHeader } = useConfigStore();
    setHeader("StockListHeader");
    const { actorSampleList, actorSamplePagination } = storeToRefs(
      useActorSampleStore()
    );
    const { fetchActorSamples } = useActorSampleStore();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const additionalTableOptions = ["export"];

    const columnDefs = ref([
      {
        colId: "selection",
        hide: false,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
        suppressMovable: true,
      },
      {
        colId: "name",
        hide: false,
        field: "name",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: ["[name]"],
        },
        headerName: "Echantillon",
        search: {
          criteria: "[name]",
          insensitive: true,
        },
      },
      {
        colId: "category",
        hide: false,
        field: "listIdSampleCategoryObject.captionFr",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[listIdSampleCategoryObject][captionFr]",
        },
        headerName: "Catégorie",
        search: {
          criteria: "[listIdSampleCategoryObject][captionFr]",
          insensitive: true,
        },
      },

      {
        colId: "market",
        hide: false,
        valueGetter: (params) => {
          if (params?.data?.markets) {
            const data = params?.data?.markets?.map(
              (e) => e.listIdMarket.captionFr
            );
            return data.join(",");
          }
        },
        field: "markets.listIdMarket.captionFr",
        valueGetterType: "sampleMarkets",
        headerName: "Marché(s)",
        search: {
          criteria: "[markets][some][listIdMarket][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[markets][some][listIdMarket][captionFr]",
        },
          flex:1,
          minWidth:200
      },
      {
        colId: "stockQty",
        hide: false,
        field: "stockQty",
        headerName: "Qte. à remettre en main propre",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[stockQty]",
          type: "number",
          lockPinned: true,
          flex:1,
          minWidth:200
        },
        lockPinned: true,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = Number(nodeA.data.stockQty);
          const impB = Number(nodeB.data.stockQty);
          return intSort(impA, impB);
        },
      },

      {
        colId: "stockToShip",
        hide: false,
        headerName: "Qte. à expédier",
        field: "stockToShip",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[stockToShip]",
          type: "number",
        },
        lockPinned: true,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.stockToShip);
          const impB = parseInt(nodeB.data.stockToShip);
          return intSort(impA, impB);
        },
      },

      {
        colId: "user",
        hide: false,
        field: "_count.sampleStocks",
        headerName: "Utilisateurs",
        lockPinned: true,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data._count.sampleStocks);
          const impB = parseInt(nodeB.data._count.sampleStocks);
          return intSort(impA, impB);
        },
      },

      {
        colId: "active",
        hide: false,
        field: "ids.actif",
        valueGetterType: "boolean",
        headerName: "Statut",
        cellRenderer: ListActivationCell,
        filter: {
          type: "boolean",
          field: "[ids][actif]",
        },
      },
      {
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: CustomRowOptionsVue,
        lockPosition: "right",
        cellClass: "locked-col",
        colId: "menu",
        hide: false,
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "delegate",
      list: ["edit"],
    });

    const rowClicked = async (value) => {
      router.push({
        name: "admin-detail-stock",
        params: {
          id: value.id,
        },
      });
    };

    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchActorSamples(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const currentPageChange = async (val: number) => {
      await fetchActorSamples(
        {
          skip: (val - 1) * actorSamplePagination.value.take,
          take: actorSamplePagination.value.take,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const popoverItemAction = (item) => {
      if (item.item === "edit") {
        router.push({
          name: "admin-detail-stock",
          params: { id: item.selectedRow.id },
        });
      }
    };

    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchActorSamples(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...filtersCriteria.value, ...serchCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchActorSamples(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    onMounted(async () => {
      await fetchActorSamples({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });
    const exportFilter = computed(() => {
      return {
        ...serchCriteria.value,
        ...filtersCriteria.value,
      };
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      fetchActorSamples,
      actorSamplePagination,
      contextMenuList,
      rowClicked,
      popoverItemAction,
      actorSampleList,
      handleSearch,
      validateFiltre,
      additionalTableOptions,
      exportFilter,
    };
  },
};
</script>
<style lang="scss" scoped></style>
