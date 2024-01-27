<template>
  <div class="d-flex flex-column">
    <div class="mb-5 py-4">
      <p class="fw-boldest pb-3">Remis sur place</p>
      <dataTable
        :data="computedInplaceData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :contextMenuList="contextMenuList"
        webElementAddress="pdsInPlaceSampleList"
        @popoverItemAction="popoverItemAction"
        @onValidateFiltre="validateFiltre"
        @inputChange="handleSearch"
        :withFooter="false"
        entity="types d’échantillon"
      />
    </div>
    <div>
      <p class="fw-boldest pb-3">À expédier</p>
      <dataTable
        :data="computedToSendData"
        :columnDefs="toSendColumnDefs"
        :defaultColDef="defaultColDef"
        :contextMenuList="contextMenuList"
        webElementAddress="pdsToSendSampleList"
        @popoverItemAction="popoverItemAction"
        @onValidateFiltre="validateToSendFiltre"
        @inputChange="handleToSendSearch"
        :withFooter="false"
        entity="types d’échantillon"
      />
    </div>
  </div>
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import service from "@/service";

import { useActorStore } from "@/store/useActorModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useRoute } from "vue-router";

export default {
  components: {
    dataTable,
    CustomRowOptions,
  },

  setup() {
    const { actorList, actorPagination } = storeToRefs(useActorStore());
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const toSendSearchCriteria = ref()
    const toSendFiltersCriteria = ref()
    const route = useRoute();
    const id = route.params.id;
    const columnDefs = ref([
      {
        colId: "name",
        hide: false,
        field: "name",
        headerName: "Echantillons",
        flex: 1 / 6,
        search: {
          criteria:
            "[anyId][packaging][sample][name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[anyId][packaging][sample][name]",
        },
        lockPinned:true,

      },
      {
        colId: "qty",
        hide: false,
        field: "qty",
        headerName: "Qté. remise",
        flex: 1 / 6,
        lockPinned:true,

      },
      {
        colId: "stockQty",
        hide: false,
        field: "stockQty",
        headerName: "Qté. restante",
        flex: 1 / 6,
        lockPinned:true,

      },
      {
        colId: "date",
        hide: false,

        field: "date",
        headerName: "Date",
        flex: 1 / 6,
         filter: {
          type:"date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field:
            "[storyEvent][story][startDate]",
        },
         lockPinned:true,

      },
      {
        colId: "address",
        hide: false,

        field: "address",
        headerName: "Adresse",
        flex: 1 / 6,
        prefixCriteria:[
          {
            criteria: "[storyEvent][story][storyEvents][some][listIdEventTypeObject][tag]",
            value: "Visit",
          },
        ],
        search :{
           criteria: "[storyEvent][story][storyEvents][some][address][street]",
           insensitive: true,
         },
         filter: {
           conditions: [
             { label: "égal", value: "[equals]" },
             { label: "contient", value: "[contains]" },
             { label: "différent", value: "[not][contains]" },
           ],
           field: "[storyEvent][story][storyEvents][some][address][street]",
         },
        lockPinned:true,

      },
    ]);
    const toSendColumnDefs = ref([
      {
        colId: "name",
        hide: false,
        field: "name",
        headerName: "Echantillons",
        flex: 1 / 6,
        search: {
          criteria:
            "[anyId][packaging][sample][name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[anyId][packaging][sample][name]",
        },

      },
      {
        colId: "qty",
        hide: false,
        field: "qty",
        headerName: "Qté. remise",
        flex: 1 / 6,
      },
      {
        colId: "stockQty",
        hide: false,
        field: "stockQty",
        headerName: "Qté. restante",
        flex: 1 / 6,
      },
      {
        colId: "date",
        hide: false,

        field: "date",
        headerName: "Date",
        flex: 1 / 6,
         filter: {
          type:"date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field:
            "[storyEvent][story][startDate]",
        },
 
      },
      {
        colId: "address",
        hide: false,
        field: "address",
        headerName: "Adresse",
        flex: 1 / 6,
        search :{
           criteria: "[anyId][packaging][address][street]",
           insensitive: true,
         },
         filter: {
           conditions: [
             { label: "égal", value: "[equals]" },
             { label: "contient", value: "[contains]" },
             { label: "différent", value: "[not][contains]" },
           ],
           field: "[anyId][packaging][address][street]",
         },
      },
    ])
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "contact",
      list: ["edit", "duplicate", "delete", "view"],
    });

    const toSendData = ref([]);
    const inPlaceData = ref([]);
    const popoverItemAction = (item) => {
      
    };
    const validateFiltre = async(val) => {
       filtersCriteria.value = val
       const resp = await service.api.storyEventInvolveControllerFindMany({
        "where[storyEvent][listIdEventTypeObject][listTypeName]": "EventType",
        "where[storyEvent][listIdEventTypeObject][tag]": "InPlaceSample",
        "where[storyEvent][story][actorIdBy]": id,
        ...serchCriteria.value,
        ...filtersCriteria.value
      }); 
      inPlaceData.value = resp.data.paginatedResult 

    };
    const handleSearch = async(val) => {

       serchCriteria.value = val
       const resp = await service.api.storyEventInvolveControllerFindMany({
        "where[storyEvent][listIdEventTypeObject][listTypeName]": "EventType",
        "where[storyEvent][listIdEventTypeObject][tag]": "InPlaceSample",
        "where[storyEvent][story][actorIdBy]": id,
        ...serchCriteria.value,
        ...filtersCriteria.value
      }); 
      inPlaceData.value = resp.data.paginatedResult
     };
    const validateToSendFiltre = async(val) => {
      toSendFiltersCriteria.value = val
       const resp = await service.api.storyEventInvolveControllerFindMany({
        "where[storyEvent][listIdEventTypeObject][listTypeName]": "EventType",
        "where[storyEvent][listIdEventTypeObject][tag]": "ToSendSample",
        "where[storyEvent][story][actorIdBy]": id,
        ...toSendSearchCriteria.value,
        ...toSendFiltersCriteria.value
      }); 
      toSendData.value = resp.data.paginatedResult
 
    };
    const handleToSendSearch = async(val) => {
       toSendSearchCriteria.value = val
       const resp = await service.api.storyEventInvolveControllerFindMany({
        "where[storyEvent][listIdEventTypeObject][listTypeName]": "EventType",
        "where[storyEvent][listIdEventTypeObject][tag]": "ToSendSample",
        "where[storyEvent][story][actorIdBy]": id,
        ...toSendSearchCriteria.value,
        ...toSendFiltersCriteria.value
      }); 
      toSendData.value = resp.data.paginatedResult
     };
    onMounted(async () => {
      const resp = await service.api.storyEventInvolveControllerFindMany({
        "where[storyEvent][listIdEventTypeObject][listTypeName]": "EventType",
        "where[OR][0][storyEvent][listIdEventTypeObject][tag]": "InPlaceSample",
        "where[OR][1][storyEvent][listIdEventTypeObject][tag]": "ToSendSample",
        "where[storyEvent][story][actorIdBy]": id,
      });
      inPlaceData.value = resp.data.paginatedResult
      toSendData.value = resp.data.paginatedResult

    });
    const computedInplaceData = computed(()=>{
      let inPlaceStock = 0;
      let inPlaceQty = 0;

      let data = inPlaceData.value
        .filter((el) => el.storyEvent.listIdEventTypeObject.tag === "InPlaceSample")
        .map((subItem) => {
          const storyAddress = subItem.storyEvent.story.storyEvents[0].address;
          inPlaceStock += subItem.anyId.packaging.sample.stockQty;
          inPlaceQty += subItem.anyId.packaging.qty;
            return ({
              name: subItem.anyId.packaging.sample.name,
              qty: subItem.anyId.packaging.qty,
              stockQty: subItem.anyId.packaging.sample.stockQty,
              date: new Date(subItem.storyEvent.story.startDate).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
              address: storyAddress
                ? (storyAddress?.street ??
                  "") + " " + (storyAddress?.streetNb ??
                  "") + " " + (storyAddress?.town ??
                  "") + " " + (storyAddress?.zipCode ??
                  "")
                : "",
            })
        }); 
        data = [...data,{name: 'Total', qty: inPlaceQty, stockQty: inPlaceStock, date: '', address: ''}]
        return data
    })
    const computedToSendData = computed(()=>{

      let toSendStock = 0;
        let toSendQty = 0;
       let data = toSendData.value
        .filter((el) => el.storyEvent.listIdEventTypeObject.tag === "ToSendSample")
        .map((subItem) =>
           {
            toSendStock += subItem.anyId.packaging.sample.stockToShip;
            toSendQty += subItem.anyId.packaging.qty;
            return {
              name: subItem.anyId.packaging.sample.name,
              qty: subItem.anyId.packaging.qty,
              stockQty: subItem.anyId.packaging.sample.stockToShip,
              date: new Date(subItem.storyEvent.story.startDate).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
              address:
                (subItem.anyId.packaging.address?.street ||
                "") + " " + (subItem.anyId.packaging.address?.streetNb ||
                "") + " " + (subItem.anyId.packaging.address?.town ||
                "") + " " + (subItem.anyId.packaging.address?.zipCode ||
                ""),
            };
          }
        )
        data = [...data,{name: 'Total', qty: toSendQty, stockQty: toSendStock, date: '', address: ''}]
     return data
    })

    return {
      columnDefs,
      defaultColDef,
      validateFiltre,
      contextMenuList,
      handleSearch,
      popoverItemAction,
      computedInplaceData,
      computedToSendData,
      validateToSendFiltre,
      handleToSendSearch,
      toSendColumnDefs
    };
  },
};
</script>
<style lang="scss" scoped>
.total-section {
  p {
    width: calc(100% / 5);
    padding-left: 25px;
  }
}
:deep(.dataTable_container) {
  height: fit-content !important;
  max-height: 700px;
}
:deep(.ag-root-wrapper-body.ag-layout-normal) {
  min-height: 150px;
  max-height: 600px;
  height: fit-content;
}
:deep(.ag-root.ag-layout-normal) {
  height: auto;
}
:deep(.ag-row-last){
  font-weight: 700;
}
</style>
