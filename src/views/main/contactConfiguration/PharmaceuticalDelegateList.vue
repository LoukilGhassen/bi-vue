<template>
  <dataTable
    :data="pharmaceuticaldelegateList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="pharmaceuticaldelegatePagination"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @setItemsPerPage="setItemsPerPage"
    @inputChange="handleSearch"
    @currentPageChange="currentPageChange"
    entity="Délégués"
    :contextMenuList="contextMenuList"
    webElementAddress="PharmaceuticalDelegate"
    @rowClick="rowClicked"
    :additionalTableOptions="additionalTableOptions"
     :exportFilter="exportFilter"
    exportEntityName="pharmaceuticalDelegate"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { ref, onMounted,computed } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";

import { usePharmaceuticalDelegateStore } from "@/store/usePharmaceuticalDelegateModule";
import ListActivationCellVue from "../../../components/shared/ag-grid-table/ListActivationCell.vue";

export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    ListActivationCellVue,
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
    setHeader("ContactConfigurationHeader");
    const { pharmaceuticaldelegateList, pharmaceuticaldelegatePagination } =
      storeToRefs(usePharmaceuticalDelegateStore());
    const { fetchPharmaceuticalDelegates } = usePharmaceuticalDelegateStore();
    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();
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
        colId: "firstName",
        hide: false,
        field: "firstName",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[firstName]",
        },
        headerName: "Nom",
        search: {
          criteria: "[firstName]",
          insensitive: true,
        },
        flex:1,
        minWidth: 200,
      },
      {
        colId: "lastName",
        hide: false,

        field: "lastName",

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[lastName]",
        },
        headerName: "Prénom",
        search: {
          criteria: "[lastName]",
          insensitive: true,
        },
        flex:1,
        minWidth: 200,
      },

      {
        colId: "telephone",
        hide: false,
        field: "telephone",
        headerName: "Téléphone portable",
        search: {
          criteria: "[telephone]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[telephone]",
        },
      },
      {
        colId: "email",
        hide: false,
        field: "email",
        headerName: "E-mail",
        search: {
          criteria: "[email]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[email]",
        },
        lockPinned: true,
        flex:1,
        minWidth: 200,
      },

      {
        colId: "Departement",
        hide: false,
        headerName: "Département(s)",
        field: "_count.departments",
        lockPinned: true,
      },

      {
        colId: "UGA",
        hide: false,
        field: "_count.ugaList",
        headerName: "UGA",
        lockPinned: true,
      },

      {
        colId: "active",
        hide: false,
        field: "ids.actif",
        valueGetterType:'boolean',
        headerName: "Statut",
        cellRenderer: ListActivationCellVue,
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
    const additionalTableOptions = ["export"];

    const rowClicked = async (value) => {
      const delegate = pharmaceuticaldelegateList.value.find(
        (e) => e.id === value.id
      );
      const formattedDelegate = {
        ...delegate,
        departments: delegate?.departments?.map(
          (e) => e.listIdDepartmentObject
        ),
        ugaList: delegate?.ugaList.map((e) => e.listIdUgaObject),
      };
      setModal("PharmaceuticalDelegateModal", {
        data: formattedDelegate,
        isEdit: true,
      });
    };

    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchPharmaceuticalDelegates(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const currentPageChange = async (val: number) => {
      await fetchPharmaceuticalDelegates(
        {
          skip: (val - 1) * pharmaceuticaldelegatePagination.value.take,
          take: pharmaceuticaldelegatePagination.value.take,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const popoverItemAction = (item) => {
      if (item.item === "edit") {
        const delegate = pharmaceuticaldelegateList.value.find(
          (e) => e.id === item.selectedRow.id
        );
        const formattedDelegate = {
          ...delegate,
          departments: delegate?.departments?.map(
            (e) => e.listIdDepartmentObject
          ),
          ugaList: delegate?.ugaList.map((e) => e.listIdUgaObject),
        };
        setModal("PharmaceuticalDelegateModal", {
          data: formattedDelegate,
          isEdit: true,
        });
      }
    };

    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchPharmaceuticalDelegates(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchPharmaceuticalDelegates(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
     const exportFilter = computed(()=>{
      return {
          ...serchCriteria.value,
          ...filtersCriteria.value,
      }

    })
    onMounted(async () => {
      await fetchPharmaceuticalDelegates({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      pharmaceuticaldelegateList,
      pharmaceuticaldelegatePagination,
      contextMenuList,
      rowClicked,
      popoverItemAction,
      handleSearch,
      validateFiltre,
      additionalTableOptions,
      exportFilter
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container {
  height: calc(100vh - 260px);
}
</style>
