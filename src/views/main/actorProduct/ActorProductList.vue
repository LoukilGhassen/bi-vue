<template>
  <dataTable
    :data="actorproductList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="actorproductPagination"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    entity="Produits"
    :additionalTableOptions="additionalTableOptions"
    :contextMenuList="contextMenuList"
    webElementAddress="ActorProductList"
    @rowClick="rowClicked"
    :colsOption="false"
    :exportFilter="exportFilter"
    exportEntityName="actorProduct"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import service from "@/service";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";
import { useActorProductStore } from "@/store/useActorProductModule";
import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";

export default {
  components: {
    dataTable,
    CustomRowOptionsVue,
    ListActivationCell,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
    relationType: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const router = useRouter();
    const { setHeader } = useConfigStore();
    setHeader("ProductListHeader");
    const { actorproductList, actorproductPagination } = storeToRefs(
      useActorProductStore()
    );
    const { fetchActorProducts, duplicateActorProduct } =
      useActorProductStore();
    const route = useRoute();
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
          field: "[name]",
        },
        headerName: "Produit",
        search: {
          criteria: "[name]",
          insensitive: true,
        },
      },
      {
        colId: "code",
        hide: false,
        field: "code",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[code]",
        },
        headerName: "Code",
        search: {
          criteria: "[code]",
          insensitive: true,
        },
      },

      {
        colId: "externalId",
        hide: false,
        field: "ids.externalId",
        headerName: "ID Externe",
        lockPinned: true,
      },

      {
        colId: "category",
        hide: false,
        headerName: "Catégorie",
        field: "listIdProductCategoryObject.captionFr",
        search: {
          criteria: "[listIdProductCategoryObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[listIdProductCategoryObject][captionFr]",
        },
        lockPinned: true,
      },

      {
        colId: "market",
        valueGetter: (params) => {
          if (params?.data?.markets) {
            const data = params?.data?.markets?.map(
              (e) => e.listIdProductMarketObject.captionFr
            );
            return data.join(",");
          }
        },
        hide: false,
        headerName: "Marché(s)",
        search: {
          criteria: "[markets][some][listIdProductMarketObject][captionFr]",
          insensitive: true,
        },
        field: "markets.listIdProductMarketObject.captionFr",
        valueGetterType:'productMarket',
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[markets][some][listIdProductMarketObject][captionFr]",
        },
        lockPinned: true,
        flex: 1,
        minWidth:200
      },

      {
        headerComponentParams: {
          template: "default",
        },
        colId: "active",
        hide: false,
        field: "ids.actif",
        headerName: "Statut",
        cellRenderer: ListActivationCell,
        valueGetterType:'boolean',
        filter: {
          type: "boolean",
          field: "[ids][actif]",
        },
        pinned: "right",
        lockPosition: "right",
        maxWidth: 100,
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "actorProduct",
      list: ["edit", "duplicate"],
    });
    const getProduct = (value) => {
      const product = actorproductList.value.find((e) => e.id === value);
      const formattedProduct = {
        ...product,
        markets: product?.markets?.map(
          (market) => market.listIdProductMarketObject
        ),
      };
      setModal("ActorProductModal", {
        product: formattedProduct,
        isEdit: true,
      });
    };
    const rowClicked = async (value) => {
      getProduct(value.id);
    };

    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchActorProducts(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const currentPageChange = async (val: number) => {
      await fetchActorProducts(
        {
          skip: (val - 1) * actorproductPagination.value.take,
          take: actorproductPagination.value.take,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const popoverItemAction = async (item) => {
      if (item.item === "edit") {
        getProduct(item.selectedRow.id);
      }
      if (item.item === "duplicate") {
        await duplicateActorProduct(item.selectedRow.id);
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
      await fetchActorProducts(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchActorProducts(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const exportFilter = computed(() => {
      return {
        ...serchCriteria.value,
        ...filtersCriteria.value,
      };
    });
    onMounted(async () => {
      await fetchActorProducts({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      actorproductList,
      actorproductPagination,
      contextMenuList,
      rowClicked,
      popoverItemAction,
      handleSearch,
      validateFiltre,
      additionalTableOptions,
      exportFilter,
    };
  },
};
</script>
<style lang="scss" scoped></style>
