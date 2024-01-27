<template>
  <dataTable
    :data="storyList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="storyPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="visitList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @import="importData"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @addRow="handleAddRow"
    @rowClick="rowClicked"
    entity="visites"
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
import {dateSort} from "@/core/helpers/dataTableHelper"

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
    setHeader("VisitListHeader");
    const serchCriteria = ref();
    const filtersCriteria = ref();

    const router = useRouter();
    const addressValueGetter = (params) => {
      const address = params.data?.storyEvents?.Visit?.address;
      if (address) {
        const { street, streetNb, zipCode, town } = address;
        return `${streetNb} ${street} ,${zipCode} ${town} `;
      }
      return "";
    };
    const contactType = (params) => {
      if (params.data.actorIdByObject?.actorPerson) return "PDS";
      if (
        params.data.actorIdByObject?.actorCompany?.listIdActorCompanyTypeObject
      )
        return params.data.actorIdByObject?.actorCompany
          ?.listIdActorCompanyTypeObject.captionFr;
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
        field: "startDate",
        colId: "startDate",
        hide: false,
        headerName: "Date de la visite effectuée",
        valueGetterType: "date",
        lockPinned: true,
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
        valueGetter: (params) =>
          params.data?.startDate
            ? new Date(params.data?.startDate).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "",
        comparator: (date1, date2, nodeA, nodeB, isDescending) => {
          const startDateA = new Date(
            `${nodeA.data.startDate.split("T")[0]}T${nodeA.data.startTime.split("T")[1]}`
          );
          const startDateB = new Date(
            `${nodeB.data.startDate.split("T")[0]}T${nodeB.data.startTime.split("T")[1]}`
          );
         return dateSort(startDateA,startDateB)
        },
      },
      {
        valueGetterType: "storyEvents",
        field: "storyEvents.VisitType.listIdEventTypeValueObject.captionFr",
        headerName: "Type de visite",
        colId: "type",
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorIdByObject.actorName",
        headerName: "Contact",
        headerComponentParams: {
          unhidable: true,
        },
        search: {
          criteria: "[actorIdByObject][actorName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorIdByObject][actorName]",
        },
        colId: "contact",
        hide: false,
        lockPinned: true,
      },
      /*   {
        field: "actorIdByObject",
        headerName: "Type de contact",
        valueGetter: contactType,
        colId: "contactType",
        hide: false,
      }, */
      {
        field: "actorIdByObject.actorPerson.rpps",
        headerName: "RPPS",
        search: {
          criteria: "[actorIdByObject][actorPerson][rpps]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorIdByObject][actorPerson][rpps]",
        },
        colId: "rpps",
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorIdByObject.addressOfActor",

        valueGetterType: "actorDepartment",
        headerName: "Département",
        valueGetter: (params) =>
          params.data.actorIdByObject?.addressOfActor &&
          params.data.actorIdByObject?.addressOfActor[0]?.listIdUgaObject
            ? params.data.actorIdByObject.addressOfActor[0].listIdUgaObject.code.substring(
                0,
                2
              )
            : "",
        colId: "departement",
        hide: false,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorIdByObject][addressOfActor][some][departement]",
        },
        lockPinned: true,
      },
      {
        field: "actorIdByObject.addressOfActor",
        valueGetterType: "actorUga",
        headerName: "UGA",
        valueGetter: (params) =>
          params.data.actorIdByObject?.addressOfActor &&
          params.data.actorIdByObject?.addressOfActor[0]?.listIdUgaObject
            ? params.data.actorIdByObject?.addressOfActor[0]?.listIdUgaObject
                .code
            : "",
        colId: "uga",
        hide: false,
        search: {
          criteria:
            "[actorIdByObject][addressOfActor][some][listIdUgaObject][code]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actorIdByObject][addressOfActor][some][listIdUgaObject][code]",
        },
        lockPinned: true,
      },
      {
        field:
          "actorIdByObject.listIdActorPersonSpecializationObject.captionFr",
        headerName: "Spécialité",
        search: {
          criteria:
            "[actorIdByObject][listIdActorPersonSpecializationObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actorIdByObject][listIdActorPersonSpecializationObject][captionFr]",
        },
        colId: "speciality",
        lockPinned: true,

        hide: false,
      },
      {
        field: "actorIdByObject.importance",
        headerName: "Importance",
        colId: "importance",
        hide: false,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorIdByObject][importance]",
          type: "number",
        },
      },
      {
        field: "actorIdByObject.actorView.lastVisitDate",
        headerName: "Dernière date de visite",
        colId: "lastVisit",
        valueGetterType: "date",
        hide: false,
        filter: {
          type: "date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorIdByObject][actorView][lastVisitDate]",
        },
        lockPinned: true,
        valueGetter: (params) =>
          params.data?.actorIdByObject?.actorView?.lastVisitDate
            ? new Date(
                params.data?.actorIdByObject?.actorView?.lastVisitDate
              ).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "",
      },
      {
        field: "storyEvents.Visit.listIdEventTypeValueObject.captionFr",
        headerName: "Motif de la visite",
        valueGetterType: "storyEvents",
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
        },
        colId: "motifVisit",
        hide: false,
        lockPinned: true,
      },
      {
        field: "storyEvents.Visit",
        headerName: "Adresse",
        valueGetter: addressValueGetter,
        valueGetterType: "storyEventsVisitAddress",
        colId: "adresse",
        hide: false,
        lockPinned: true,
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
      entity: "visit",
      list: ["edit", "duplicate", "delete", "view"],
    });
    const additionalTableOptions = ["export"];

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchStories(
        "visit",
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          ...filtersCriteria.value,
          ...serchCriteria.value,
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
          ...filtersCriteria.value,
          ...serchCriteria.value,
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
      router.push({
        name: "admin-detail-visit",
        params: { id: value.id },
      });
    };

    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        setModal("DeleteContactModal", {
          id: item.selectedRow.id,
          deleteEntity: handleDeleteVisit,
          title: "Supprimer la visite",
          text: `la visite de ${item.selectedRow.actorIdByObject.actorName}`,
        });
      }
      if (item.item === "edit") {
        router.push({
          name: "admin-detail-visit",
          params: { id: item.selectedRow.id },
        });
      }
      if (item.item === "duplicate") {
        await duplicateStory(item.selectedRow.id);
        Components.ElNotification.success({
          message: "opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      }
      if (item.item === "view") {
        const type = item.selectedRow.actorIdByObject.actorPerson
          ? "pds"
          : item.selectedRow.actorIdByObject.actorCompany.listIdActorCompanyTypeObject.tag.toLowerCase();
        router.push({
          name: "admin-detail-contact",
          params: { type, id: item.selectedRow.actorIdByObject.id },
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

    const exportFilter = computed(() => {
      return {
        "where[aboutAny][contains]": "visit",
        ...serchCriteria.value,
        ...filtersCriteria.value,
      };
    });

    onMounted(async () => {
      await fetchStories("visit", {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
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
