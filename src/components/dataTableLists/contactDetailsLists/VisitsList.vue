<template>
  <dataTable
    :data="storyList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="storyPagination"
    :webElementAddress="webElementAddress"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    entity="visites"
    @rowClick="rowClicked"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import VisitTooltipListsCellRender from "@/components/shared/ag-grid-table/VisitTooltipListsCellRender.vue";

import { useStoryStore } from "@/store/useStoryModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";

export default {
  components: {
    dataTable,
    CustomRowOptions,
    VisitTooltipListsCellRender,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const router = useRouter();
    const { storyList, storyPagination } = storeToRefs(useStoryStore());
    const { fetchStories } = useStoryStore();
    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();

    const columnDefs = ref([
      {
        field: "startDate",
        headerName: "Date",
        filter: {
          type:"date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field:
            "[startDate]",
        },
        valueGetter: (params) =>
          params.data?.startDate
            ? new Date(params.data?.startDate).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "",
        colId: "date",
        hide: false,
        lockPinned: true,
      },
      {
        field: "storyEvents.VisitType.listIdEventTypeValueObject.captionFr",
        headerName: "Type de visite",
        colId: "type",
        hide: false,
        lockPinned: true,
        prefixCriteria: [
          {
            criteria: "[storyEvents][some][listIdEventTypeObject][tag]",
            value: "VisitType",
          },
        ],
        search: {
          criteria:
            "[storyEvents][some][listIdEventTypeValueObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[storyEvents][some][listIdEventTypeValueObject][captionFr]",
          filterKey:"visitType",

        },
      },
      {
        field: "storyEvents.Visit.listIdEventTypeValueObject.captionFr",
        colId: "motif",
        headerName: "Motif de visite",
        hide: false,
        lockPinned: true,
        prefixCriteria: [
          {
            criteria: "[storyEvents][some][listIdEventTypeObject][tag]",
            value: "Visit",
          },
        ],
        search: {
          criteria:
            "[storyEvents][some][listIdEventTypeValueObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[storyEvents][some][listIdEventTypeValueObject][captionFr]",
          filterKey:"visitReason"
        },

      },
      {
        field: "listIdDurationObject.code",
        colId: "duration",
        headerName: "Temps",
        hide: false,
        lockPinned: true,
      },
      {
        field: "",
        colId: "product",
        headerName: "Produits présentés",
        hide: false,
        lockPinned: true,
        cellRenderer: "VisitTooltipListsCellRender",
        cellRendererParams: {
          cellData: {
            entity: "produit",
            tooltipTitle: "Produits présentés",
            type: "product",
          },
        },
      },

      {
        field: "",
        hide: false,
        colId: "doc",
        headerName: "Docs remis",
        lockPinned: true,
        // TODO CELL RENDERER
      },

      {
        field: "storyEvents.NextVisit.listIdEventTypeValueObject",
        colId: "dateNextRdv",
        hide: false,
        lockPinned: true,
        headerName: "Date prochain RDV",
        valueGetter: (params) => {
            if(params.data.storyEvents.NextVisit && params.data.storyEvents.NextVisit.storyEventInvolves.length &&
               params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId && params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story?.startDate
            ){
             return  new Date(params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startDate)
             .toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })

            }
            return ""
        }
      },
      {
        field: "",
        colId: "objectiveNextRdv",
        hide: false,
        headerName: "Objectif prochaine visite",
        lockPinned: true,
        valueGetter: (params) => {
            if(params.data.storyEvents.NextVisit && params.data.storyEvents.NextVisit.storyEventInvolves.length &&
               params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId 
            ){
              if(params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.aboutAny && params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.aboutAny ==='Appointment'){
                return params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.storyEvents[0].description
              }else{
                return params.data.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.description
              }
            }
            return ""
        }
      },
      {
        field: "",
        colId: "inPlace",
        headerName: "Echantillons Remis",
        hide: false,
        lockPinned: true,
        cellRenderer: "VisitTooltipListsCellRender",
        cellRendererParams: {
          cellData: {
            entity: "échantillon",
            tooltipTitle: "Echantillons Remis",
            type: "inPlace",
          },
        },
      },
      {
        field: "",
        colId: "toSend",
        headerName: "Echantillons Expédiés",
        hide: false,

        cellRenderer: "VisitTooltipListsCellRender",
        cellRendererParams: {
          cellData: {
            entity: "échantillon",
            tooltipTitle: "Echantillons expédiés",
            type: "toSend",
          },
        },
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
      entity: "visit",
      list: ["edit", "duplicate", "delete", "view"],
    });

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchStories(
        "visit",
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
           ...serchCriteria.value,
           ...filtersCriteria.value,
          "where[actorIdBy]": route.params.id,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchStories(
        "visit",
        {
          skip: (val - 1) * storyPagination.value.take,
          take: storyPagination.value.take,
        },
        {
           ...serchCriteria.value,
           ...filtersCriteria.value,
          "where[actorIdBy]": route.params.id,
        }
      );
    };
    const rowClicked = (value) => {
      router.push({
        name: "admin-detail-visit",
        params: { id: value.id },
      });
    };
    const popoverItemAction = (item) => {
      
      if (item.item === "edit") {
        router.push({
          name: "admin-detail-visit",
          params: { id: item.selectedRow.id },
        });
      }
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchStories(
        "visit",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
           ...filtersCriteria.value,
           ...serchCriteria.value,
          "where[actorIdBy]": route.params.id,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchStories(
        "visit",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...filtersCriteria.value,
           ...serchCriteria.value,
          "where[actorIdBy]": route.params.id,
        }
      );
    };

    onMounted(async () => {
      await fetchStories(
        "visit",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          //  ...searchCriteria,
          "where[actorIdBy]": route.params.id,
        }
      );
    });
    return {
      columnDefs,
      defaultColDef,
      storyPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      storyList,
      popoverItemAction,
      rowClicked,
    };
  },
};
</script>
<style lang="scss" scoped></style>
