<template>
  <dataTable
    :data="fakeData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :additionalTableOptions="additionalTableOptions"
    :webElementAddress="webElementAddress"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @import="handleImport"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
      entity="documents"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";

import { useActorStore } from "@/store/useActorModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { setModal } from "@/core/helpers/config";

export default {
  components: {
    dataTable,
    CustomRowOptions,
  },
  props:{
    webElementAddress: {
      required:true,
      type:String
    }
  },

  setup() {
    const { actorList, actorPagination } = storeToRefs(useActorStore());
    const { fetchActors } = useActorStore();

    const columnDefs = ref([
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
      },
      {
        field: "nom de document",
        headerName: "Nom du document",
      },
      {
        field: "type",
        headerName: "Type",
      },
      {
        field: "ajouté le",
        headerName: "Ajouté le",
      },
      {
        field: "taille de fichier",
        headerName: "Taille du fichier",
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
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "document",
      list: ["edit",  "delete", "download"],
    });
    const additionalTableOptions = ["export", "import"];

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchActors({
        skip: 0,
        take: parseInt(event.target.value),
      });
    };
    const currentPageChange = async (val) => {
      await fetchActors({
        skip: (val - 1) * actorPagination.value.take,
        take: actorPagination.value.take,
      });
    };
    const fakeData = ref([
    {'nom de document': 'Report Q1 2023', 'type': '.pdf', 'ajouté le': '2023-01-15', 'taille de fichier': '2.5 MB'},
    {'nom de document': 'Invoice #12345', 'type': '.pdf', 'ajouté le': '2023-02-10', 'taille de fichier': '1.2 MB'},
    {'nom de document': 'Vacation Photos', 'type': '.jpg', 'ajouté le': '2023-03-20', 'taille de fichier': '4.7 MB'},
    {'nom de document': 'Budget Spreadsheet', 'type': '.xls', 'ajouté le': '2023-04-05', 'taille de fichier': '450 KB'},
    {'nom de document': 'Contract Agreement', 'type': '.docx', 'ajouté le': '2023-05-12', 'taille de fichier': '800 KB'},
    {'nom de document': 'Presentation Slides', 'type': '.pptx', 'ajouté le': '2023-06-30', 'taille de fichier': '3.1 MB'},
    {'nom de document': 'Resume', 'type': '.doc', 'ajouté le': '2023-07-08', 'taille de fichier': '150 KB'},
]);

    const popoverItemAction = (item) => {
      
    };
    const validateFiltre = (val) => {
      console.log(val, "vaaaaaaal");
    };
    const handleSearch = (val) => {
      console.log(val, "************");
    };

    const handleImport = () => {
      console.log("import");
      setModal("ImportDocumentModal");
    };
    onMounted(async () => {
      //   await fetchActors({
      //     skip: 0,
      //     take: Number(localStorage.getItem("take")) || 20,
      //   });
    });
    return {
      columnDefs,
      defaultColDef,
      actorPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      fakeData,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      handleImport,
    };
  },
};
</script>
<style lang="scss" scoped></style>
