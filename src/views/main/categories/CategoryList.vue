<template>
    <dataTable
      :data="listList"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :pagination="listPagination"
      @popoverItemAction="popoverItemAction"
      @setItemsPerPage="setItemsPerPage"
      @inputChange="handleSearch"
      @onValidateFiltre="validateFiltre"
      @currentPageChange="currentPageChange"
      entity="catégorie"
      :contextMenuList="contextMenuList"
      webElementAddress="categoryList"
      @rowClick="rowClicked"
    :additionalTableOptions="additionalTableOptions"
    exportEntityName="list"
    :exportFilter="exportFilter"

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
  import { useListStore } from "@/store/useListModule";  
  import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";

  export default {
    components: {
      dataTable,
      CustomRowOptionsVue,
      ListActivationCell
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
      setHeader("CategoryHeader")
      const { listList, listPagination } = storeToRefs(
        useListStore()
      );
      const { fetchLists} = useListStore();
      const serchCriteria = ref();
      const filtersCriteria = ref();
      const route = useRoute();
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
           }
        },
        {
          colId: "category",
          hide: false,
          field: "captionFr",
          filter: {
            conditions: [
              { label: "égal", value: "[equals]" },
              { label: "contient", value: "[contains]" },
              { label: "différent", value: "[not][contains]" },
            ],
            field: "[captionFr]",
          },
             headerName: "Catégorie",
            search: {
             criteria: "[captionFr]",
             insensitive: true,
           },
           flex:1/3
        },
  
        {
          colId: "market",
          hide: false,
          valueGetter: (params) => {
          if(params?.data?.markets){
          const data = params?.data?.markets?.map((e) => e.market.captionFr)
          return data.join(",")}
        },   
        field:"markets.market.captionFr",
        valueGetterType:"listMarkets",    
        headerName: "Marché(s)",
          search: {
            criteria: "[markets][some][market][captionFr]",
            insensitive: true,
          },
          filter: {
            conditions: [
              { label: "égal", value: "[equals]" },
              { label: "contient", value: "[contains]" },
              { label: "différent", value: "[not][contains]" },
            ],
            field: "[markets][some][market][captionFr]",
          },
          flex:1
        },

       
        {
          headerComponentParams: {
        template: "default",
       },
          colId: "active",
          hide: false,
          field: "ids.actif",
          valueGetterType:'boolean',
          headerName: "Statut",
          cellRenderer: ListActivationCell,
          filter: {
            type:'boolean',
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
      const contextMenuList = ref( {
        entity: "delegate",
        list: ["edit"],
      });
          const additionalTableOptions = ["export","import"];

      const getCategory = (value) =>{
        const category = listList.value.find((e) => e.id === value);
        const formattedCategory = {
          ...category,
          markets: category?.markets?.map((e) => (
            e.market
          ))
        }
        setModal("CategoryModal",{
          category:formattedCategory,
          isEdit:true
        });
      } 
      const rowClicked = async(value) => {
        getCategory(value.id)
      };
  
   
      //pagination
      const setItemsPerPage = async (event: any) => {
        await fetchLists("ProductCategory",{
          skip: 0,
          take: parseInt(event.target.value),
        },{ ...serchCriteria.value,...filtersCriteria.value }
        )  
      }
      const currentPageChange = async (val: number) => {
        await fetchLists("ProductCategory",{
          skip: (val - 1) * listPagination.value.take,
          take: listPagination.value.take,
        },
        { ...serchCriteria.value,...filtersCriteria.value }
        )
      }
      const popoverItemAction = (item) => {
      
      if (item.item === "edit") {
        getCategory(item.selectedRow.id)
      }
  
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchLists(
        "ProductCategory",
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
        "ProductCategory",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value ,...filtersCriteria.value}
      );
    };
    const exportFilter = computed(()=>{
      return {
         "where[listTypeName]": "ProductCategory",
          ...serchCriteria.value,
          ...filtersCriteria.value,
      }

    })

      onMounted(async () => {
        await fetchLists("ProductCategory",{
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        });
        
      });
  
      return {
        columnDefs,
        defaultColDef,
        setItemsPerPage,
        currentPageChange,
        listList,
        listPagination,
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
  
  </style>
  