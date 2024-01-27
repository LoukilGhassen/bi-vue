<template>
  <dataTable
    :data="pharmacydistributorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :additionalTableOptions="additionalTableOptions"
    :pagination="pharmacydistributorPagination"
    webElementAddress="pharmacyWholesalerList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @cellEditingStopped="handleCellEditingStopped"
    entity="grossistes"
    @addRow="handleAddRow"
    @rowClick="rowClicked"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useRoute } from "vue-router";

import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { usePharmacyDistributorStore } from "@/store/usePharmacyDistributorModule";
import { useDistributorStore } from "@/store/useDistributorModule";
import SelectDistributorCell from "@/components/shared/ag-grid-table/SelectDistributorCell.vue";
import { useActorStore } from "@/store/useActorModule";
import EditablePlaceholder from "@/components/shared/ag-grid-table/EditablePlaceholder.vue";
export default {
  components: {
    dataTable,
    CustomRowOptions,
    SelectDistributorCell,
  },
  props: {
    webElementAddress: {
      required: false,
      type: String,
    },
  },

  setup() {
    const {
      pharmacydistributorList,
      pharmacydistributorPagination,
      showListAddRow,
    } = storeToRefs(usePharmacyDistributorStore());
    const {
      fetchPharmacyDistributors,
      addPharmacyDistributor,
      deletePharmacyDistributor,
      setShowListAddRow,
      deleteEmptyPharmacyDistributor,
    } = usePharmacyDistributorStore();
    const { editDistributor } = useDistributorStore();
    const { updateWholeSalerCount } = useActorStore();
    const searchCriteria = ref();
    const filterCriteria = ref();
    const route = useRoute();

    const columnDefs = ref([
      {
        colId: "name",
        hide: false,
        flex: 1 / 3,
        search: {
          criteria: "[distributor][name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[distributor][name]",
        },
        lockPosition: "left",
        suppressMovable: true,
        headerComponentParams: {
          unhidable: true,
          unmovable: true,
        },
        lockPinned: true,

        field: "distributor.name",
        headerName: "Répartiteur",
        cellRenderer: SelectDistributorCell,
      },
      {
        colId: "wholesaler",
        hide: false,
        flex: 1 / 3,
        search: {
          criteria: "[distributor][listIdWholesalerObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[distributor][listIdWholesalerObject][captionFr]",
        },
        field: "distributor.listIdWholesalerObject.captionFr",
        headerName: "Grossiste principal",
      },

      {
        colId: "description",
        hide: false,
        flex: 1 / 3,
        search: {
          criteria: "[distributor][description]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[distributor][description]",
        },
        field: "distributor.description",
        editable: true,
        headerName: "Description",
        cellRenderer:EditablePlaceholder
      },
      {
        colId: "menu",
        hide: false,
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: CustomRowOptionsVue,
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
      entity: "wholeSaler",
      list: ["delete"],
    });
    const additionalTableOptions = computed(() => {
      return showListAddRow.value
        ? ["export", "addRow"]
        : ["export", "addRow", "addRowDisabled"];
    });
    //pagination
    const setItemsPerPage = async (event) => {
      await fetchPharmacyDistributors(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          "where[pharmacyId][equals]": route.params.id,
          ...filterCriteria.value,
          ...searchCriteria.value,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchPharmacyDistributors(
        {
          skip: (val - 1) * pharmacydistributorPagination.value.take,
          take: pharmacydistributorPagination.value.take,
        },
        {
          "where[pharmacyId][equals]": route.params.id,
          ...filterCriteria.value,
          ...searchCriteria.value,
        }
      );
    };
    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        if (!item.selectedRow?.id) {
          deleteEmptyPharmacyDistributor();

          setShowListAddRow(true);
        } else await deletePharmacyDistributor(item.selectedRow?.id);
        updateWholeSalerCount(-1);
      }
    };
    const validateFiltre = async (val) => {
      filterCriteria.value = val;
      await fetchPharmacyDistributors(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[pharmacyId][equals]": route.params.id,

          ...filterCriteria.value,
          ...searchCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      searchCriteria.value = val;
      await fetchPharmacyDistributors(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[pharmacyId][equals]": route.params.id,
          ...filterCriteria.value,
          ...searchCriteria.value,
        }
      );
    };
    const handleCellEditingStopped = async (params) => {
      if(params.data?.distributor?.id){
        await editDistributor({
          id: params.data?.distributor?.id,
          data: { description: params.newValue },
        });
      }
    };
    const handleAddRow = () => {
      addPharmacyDistributor({
        id: "",
      });
      setShowListAddRow(false);
    };
    onMounted(async () => {
      await fetchPharmacyDistributors(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[pharmacyId][equals]": route.params.id,
          ...filterCriteria.value,
          ...searchCriteria.value,
        }
      );
      setShowListAddRow(true);
    });
    let isEditInlineCell = ref(false);
    const rowClicked = async (value, event) => {
      if (isEditInlineCell.value) {
        event.api.stopEditing(true);
        isEditInlineCell.value = false;
        return;
      }
      if (!isEditInlineCell.value) {
        event.api.startEditingCell({
          rowIndex: event.rowIndex,
          colKey: "description", // Replace with your actual column key
        });
        isEditInlineCell.value = true;
      }
    };
    return {
      rowClicked,
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      handleCellEditingStopped,
      pharmacydistributorList,
      pharmacydistributorPagination,
      handleAddRow,
      dataTable,
    };
  },
};
</script>
<style lang="scss" scoped></style>
