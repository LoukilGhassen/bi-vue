<template>
  <div>
    <dataTable
      :data="listList"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :pagination="listPagination"
      @popoverItemAction="popoverItemAction"
      @onValidateFiltre="validateFiltre"
      @inputChange="handleSearch"
      @setItemsPerPage="setItemsPerPage"
      @currentPageChange="currentPageChange"
      :additionalTableOptions="additionalTableOptions"
      :entity="entityValue"
      :contextMenuList="contextMenuList"
      :webElementAddress="webElementAddress"
      @rowClick="rowClicked"
      :colsOption="false"
       :exportFilter="exportFilter"
    exportEntityName="list"
    />
  </div>
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";
import { ref, onMounted, computed, watch } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute, useRouter } from "vue-router";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { useListStore } from "@/store/useListModule";
import { setModal } from "@/core/helpers/config";

export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    ListActivationCell,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
    entityValue: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const router = useRouter();
    const { listList, listPagination } = storeToRefs(useListStore());
    const { fetchLists } = useListStore();
    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const basicColDefs = ref([
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
        colId: "code",
        hide: false,
        field: "code",
        headerName: "Code",
        headerComponentParams: {
          template: "default",
        },
        search: {
          criteria: "[code]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[code]",
        },
      },
      {
        colId: "description",
        hide: false,
        field: "captionFr",
        headerName: "Description",
        headerComponentParams: {
          template: "default",
        },
        search: {
          criteria: "[captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[captionFr]",
        },
        flex: 1 / 3,
      },
      {
        colId: "status",
        hide: false,
        cellRenderer: ListActivationCell,
        field: "ids.actif",
        valueGetterType:'boolean',
        headerComponentParams: {
          template: "default",
        },
        filter: {
          field: "[ids][actif]",
          type: "boolean",
        },
        headerName: "Statut",
        lockPosition: "right",
        cellClass: "locked-col",
        pinned: "right",
        maxWidth: 100,
      },
    ]);
    const wholeSalerColumnDefs = ref([
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
        colId: "code",
        hide: false,
        field: "code",
        headerName: "Code",
        headerComponentParams: {
          template: "default",
        },
        search: {
          criteria: "[code]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[code]",
        },
      },
      {
        colId: "description",
        hide: false,
        field: "captionFr",
        headerName: "Description",
        headerComponentParams: {
          template: "default",
        },
        search: {
          criteria: "[captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[captionFr]",
        },
        flex: 1 / 5,
      },
      {
        colId: "distibutors",
        hide: false,
        field: "_count.listIdWholesalerObject",
        headerName: "Répartiteur(s)",
        headerComponentParams: {
          template: "default",
        },
        flex: 1 / 3,
      },
      {
        colId: "status",
        hide: false,
        cellRenderer: ListActivationCell,
        headerComponentParams: {
          template: "default",
        },
        filter: {
          field: "[ids][actif]",
          type: "boolean",
        },
        headerName: "Statut",
        lockPosition: "right",
        cellClass: "locked-col",
        pinned: "right",
        maxWidth: 100,
      },
    ]);
    const columnDefs = computed(() => {
      if (props.webElementAddress === "ProductWholesaler") {
        return wholeSalerColumnDefs.value;
      } else {
        return basicColDefs.value;
      }
    });

    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const additionalTableOptions = ["export"];
    const contextMenuList = ref({ entity: "list", list: ["edit"] });
    const rowClicked = (value) => {
      if (props.webElementAddress === "ProductWholesaler") {
        router.push({
          name: "admin-contactsConfig-wholeSaler-details",
          params: { id: value.id },
        });
      } else
        setModal("ListsFormModal", {
          isEdit: true,
          data: value,
          listType: props.webElementAddress,
        });
    };

    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchLists(
        props.webElementAddress,
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const currentPageChange = async (val: number) => {
      await fetchLists(
        props.webElementAddress,
        {
          skip: (val - 1) * listPagination.value.take,
          take: listPagination.value.take,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };

    const popoverItemAction = (item) => {
      if (item.item === "edit") {
        if (props.webElementAddress === "ProductWholesaler") {
          router.push({
            name: "admin-contactsConfig-wholeSaler-details",
            params: { id: item.selectedRow.id },
          });
        } else
          setModal("ListsFormModal", {
            isEdit: true,
            listType: props.webElementAddress,
            data: item.selectedRow,
          });
      }
    };

    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchLists(
        props.webElementAddress,
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchLists(
        props.webElementAddress,
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };

     const exportFilter = computed(()=>{
      return {
        "where[listTypeName]": props.webElementAddress,
          ...serchCriteria.value,
          ...filtersCriteria.value,
      }

    })
    watch(
      () => props.webElementAddress,
      async () => {
        await fetchLists(props.webElementAddress, {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        });
      }
    );
    onMounted(async () => {
      await fetchLists(props.webElementAddress, {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      handleSearch,
      popoverItemAction,
      listList,
      listPagination,
      contextMenuList,
      rowClicked,
      additionalTableOptions,
      exportFilter
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container {
  height: calc(100vh - 255px);
}
</style>
