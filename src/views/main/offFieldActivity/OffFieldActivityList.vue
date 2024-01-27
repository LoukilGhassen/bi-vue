<template>
  <dataTable
    :data="storyList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="storyPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="offFieldList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @import="importData"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @addRow="handleAddRow"
    @rowClick="rowClicked"
    entity="activités"
    :exportFilter="exportFilter"
    exportEntityName="story"
  />
</template>
<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useConfigStore } from "@/store/useConfig";
import { useStoryStore } from "@/store/useStoryModule";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { dateSort } from "@/core/helpers/dataTableHelper";
export default {
  name: "table-column-example",
  components: {
    dataTable,
    CustomRowOptions,
  },

  setup() {
    const { fetchStories, deleteStory, duplicateStory } = useStoryStore();
    const { storyList, storyPagination } = storeToRefs(useStoryStore());
    const { setHeader } = useConfigStore();
    setHeader("offFieldActivityHeader");
    const serchCriteria = ref();
    const filtersCriteria = ref();

    const router = useRouter();

    const dateValueGetter = (params) => {
      const dateFormat = (dateInput) =>
        new Date(dateInput).toLocaleDateString("fr-FR", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      return params.data?.startDate &&
        params.data?.startDate === params.data?.endDate
        ? dateFormat(params.data?.startDate)
        : `Du ${dateFormat(params.data?.startDate)} au ${dateFormat(
            params.data?.endDate
          )}`;
    };

    const durationValueGetter = (params) => {
      const { startDate, startTime, endDate, endTime } = params?.data;
      const start = `${startDate.split("T")[0]}T${startTime.split("T")[1]}`;
      const end =
        endDate && endTime
          ? `${endDate.split("T")[0]}T${endTime.split("T")[1]}`
          : "";
      return formatDuration(start, end);
    };

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
        colId: "startDate",
        hide: false,
        lockPinned: true,
        valueGetterType: "date",
        field: "startDate",
        headerName: "Date",
        valueGetter: dateValueGetter,
        flex: 1 / 3,
        minWidth:200,
        filter: {
          type: "date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[startDate]",
        },
        comparator: (date1, date2, nodeA, nodeB, isDescending) => {
          const startDateA = new Date(
            `${nodeA.data.startDate.split("T")[0]}T${
              nodeA.data.startTime.split("T")[1]
            }`
          );
          const startDateB = new Date(
            `${nodeB.data.startDate.split("T")[0]}T${
              nodeB.data.startTime.split("T")[1]
            }`
          );
          return dateSort(startDateA,startDateB)
        },
      },
      {
        colId: "duration",
        hide: false,
        lockPinned: true,

        field: "startDate",
        headerName: "Durée",
        valueGetter: durationValueGetter,
      },
      {
        colId: "reason",
        hide: false,
        lockPinned: true,

        field: "storyEvents.OffFieldType.listIdEventTypeValueObject.captionFr",
        headerName: "Motif",
        valueGetterType: "storyEvents",
        prefixCriteria: [
          {
            criteria: "[storyEvents][some][listIdEventTypeObject][tag]",
            value: "OffFieldType",
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
        },
      },
      {
        colId: "description",
        hide: false,
        lockPinned: true,

        field: "description",
        headerName: "Commentaire",
        flex: 1,
        search: {
          criteria: "[description]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[description]",
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
      entity: "activity",
      list: ["edit", "duplicate", "delete"],
    });
    const additionalTableOptions = ["export"];

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchStories(
        "OffFieldActivity",
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchStories(
        "OffFieldActivity",
        {
          skip: (val - 1) * storyPagination.value.take,
          take: storyPagination.value.take,
        },
        {
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleDeleteVisit = async (id, motif) => {
      await deleteStory({
        id,
        deletedReason: motif,
      });
    };
    const rowClicked = (value) => {
      const story = storyList.value.find((e) => e.id === value.id);
      setModal("OffFieldActivityFormModal", { data: story, isEdit: true });
    };
    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        setModal("DeleteContactModal", {
          id: item.selectedRow.id,
          deleteEntity: handleDeleteVisit,
          title: "Supprimer l'activité",
          text: `l'activité ${item.selectedRow.id}`,
        });
      }
      if (item.item === "edit") {
        const story = storyList.value.find((e) => e.id === item.selectedRow.id);
        setModal("OffFieldActivityFormModal", { data: story, isEdit: true });
      }
      if (item.item === "duplicate") {
        await duplicateStory(item.selectedRow.id);
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

      await fetchStories(
        "OffFieldActivity",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchStories(
        "OffFieldActivity",
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const exportCsv = () => {
      console.log("export");
    };

    const importData = () => {
      console.log("importData");
    };

    const handleAddRow = () => {};

    const formatDuration = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInMilliseconds = Math.abs(end - start);
      const minutes = Math.floor(diffInMilliseconds / (60 * 1000));

      if (minutes < 60) {
        return `${minutes}mn`;
      } else if (minutes < 60 * 12) {
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
      } else if (minutes < 60 * 24) {
        return "demi jour";
      } else if (minutes < 60 * 24 * 2) {
        return "1 jour";
      } else {
        const days = Math.floor(minutes / (60 * 24));
        const remainingMinutes = minutes % (60 * 24);
        const remainingHours = Math.floor(remainingMinutes / 60);

        let result = `${days} jour`;
        if (days > 1) {
          result += "s";
        }

        if (remainingHours > 0) {
          result += ` et ${remainingHours}h`;
        }
        return result;
      }
    };

    onMounted(async () => {
      await fetchStories("OffFieldActivity", {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });
    const exportFilter = computed(() => {
      return {
        "where[aboutAny][contains]": "OffFieldActivity",
        ...serchCriteria.value,
        ...filtersCriteria.value,
      };
    });

    return {
      columnDefs,
      defaultColDef,
      storyPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      storyList,
      handleSearch,
      exportCsv,
      additionalTableOptions,
      popoverItemAction,
      importData,
      handleAddRow,
      rowClicked,
      exportFilter,
    };
  },
};
</script>
<style lang="scss" scoped></style>

<!--   storyEvents: {
          select: { 
            id: true,
            address: true,
            description: true, 
            listIdEventTypeObject: {
              select: {
                id: true,
                captionFr: true,
                tag: true
              }
            },
            listIdEventTypeValueObject: {
              select: {
                id: true,
                captionFr: true,
                tag: true
              }
            }
          }
        } -->
