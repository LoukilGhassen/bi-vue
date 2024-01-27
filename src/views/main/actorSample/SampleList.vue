<template>

  <dataTable
    :data="actorSampleList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="actorSamplePagination"
    :colsOption="false"
    @popoverItemAction="popoverItemAction"
    @setItemsPerPage="setItemsPerPage"
    :additionalTableOptions="additionalTableOptions"
    @currentPageChange="currentPageChange"
    entity="échantillon"
    @inputChange="handleSearch"
    :contextMenuList="contextMenuList"
    @onValidateFiltre="validateFiltre"
    webElementAddress="actorSampleList"
    @rowClick="rowClicked"
    exportEntityName="actorSample"
    :exportFilter="exportFilter"

  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { ref, onMounted, computed } from "vue";
import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";
import { useActorSampleStore } from "@/store/useActorSampleModule";

export default {
  components: {
    dataTable,
    ListActivationCell,
    CustomRowOptionsVue,
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
    setHeader("SampleListHeader")
    const { actorSampleList, actorSamplePagination } = storeToRefs(
      useActorSampleStore()
    );
    const { fetchActorSamples} = useActorSampleStore();
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
        colId: "sample",
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
           headerName: "Echantillon",
          search: {
           criteria: "[name]",
           insensitive: true,
         }
      },

      {
        colId: "category",
        hide: false,
        field: "listIdSampleCategoryObject.captionFr",
        headerName: "Catégorie",
        search: {
          criteria: "[listIdSampleCategoryObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[listIdSampleCategoryObject][captionFr]",
        },
      },
      {
        colId: "market",
        hide: false,
        valueGetter: (params) => {
          if(params?.data?.markets){
          const data = params?.data?.markets?.map((e) => e.listIdMarket.captionFr)
          return data.join(",")} 
          }, 
        field:"markets.listIdMarket.captionFr",
        valueGetterType:"sampleMarkets",
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
        lockPinned: true,
        flex: 1
      },
     
      {
        colId: "active",
        hide: false,
        field: "ids.actif",
        headerName: "Statut",
        valueGetterType:'boolean',
        cellRenderer: ListActivationCell,
        filter: {
          type:'boolean',
          field: "[ids][actif]",
        },
      pinned: "right",
         lockPosition: "right",
         width: 150,

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
    const getSample = (value) =>{
      const sample = actorSampleList.value.find((e) => e.id === value);
      const formattedSample = {
        ...sample,
        markets: sample?.markets?.map((market) => (
          market.listIdMarket
        ))
      }
      setModal("ActorSampleModal",{
        sample:formattedSample,
        isEdit:true
      });
    } 
    const rowClicked = async(value) => {
      getSample(value.id)
    };

 
    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchActorSamples({
        skip: 0,
        take: parseInt(event.target.value),
      },{ ...serchCriteria.value,...filtersCriteria.value }
      )  
    }
    const currentPageChange = async (val: number) => {
      await fetchActorSamples({
        skip: (val - 1) * actorSamplePagination.value.take,
        take: actorSamplePagination.value.take,
      },{ ...serchCriteria.value,...filtersCriteria.value }
      )
    }
    const popoverItemAction = (item) => {
    
    if (item.item === "delete") {
      setModal("DeleteDelegateModal", {
        delegate: item.selectedRow,
        title: "Supprimer Délégué",
      });
    }
    if (item.item === "edit") {
      getSample(item.selectedRow.id)
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
        { ...serchCriteria.value,...filtersCriteria.value }
      );
    };
    const exportFilter = computed(()=>{
      return {
          ...serchCriteria.value,
          ...filtersCriteria.value,
      }

    })

    onMounted(async () => {
      await fetchActorSamples({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      actorSampleList,
      actorSamplePagination,
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
