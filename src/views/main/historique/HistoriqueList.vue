<template>
  <dataTable
    :data="logList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="logPagination"
    :webElementAddress="webElementAddress"
    @popoverItemAction="popoverItemAction"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @rowClick="rowClicked"
    :filterOption="false"
    :colsOption="false"
    :viewsOption="false"
    @confirmDateRangePicker="confirmDateRangePicker"
    :dateRangeFilterOption="true"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useConfigStore } from "@/store/useConfig";
import { setModal } from "@/core/helpers/config";

import { useLogStore } from "@/store/useLogModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

export default {
  components: {
    dataTable,
    AvatarCellRender,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const { setHeader } = useConfigStore();
    const { logList, logPagination } = storeToRefs(useLogStore());
    setHeader("HistoriqueHeader");

    const { fetchLogs } = useLogStore();
    const serchCriteria = ref();
    const dateSearch = ref();
    const objectValueGetter = (params: any) => {
      const actionType = params?.data?.listIdActionTypeObject?.tag;
      const entityType = params?.data?.listIdEntityTypeObject?.captionFr;
      const entityTag = params?.data?.listIdEntityTypeObject?.tag;
      const payload = params?.data?.payload;
      if (
        [
          "ContactPDS",
          "ContactPharmacy",
          "ContactHealthCenter",
          "ContactEntity",
        ].includes(entityTag)
      ) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.actorName || ""} ${
            payload?.newValue?.actorPerson?.firstName || ""
          }`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.actorName || ""} ${
            payload?.actorPerson?.firstName || ""
          }`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (
        ["PdsVisit", "PharmacyVisit", "Appointment", "FieldActivity"].includes(
          entityTag
        )
      ) {
        if (actionType === "Update") {
          return `${entityType} ${
            payload?.newValue?.actorIdByObject?.actorName || ""
          } le ${formatDate(payload?.newValue?.startDate)}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${
            payload?.actorIdByObject?.actorName || ""
          } le ${formatDate(payload?.startDate)}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["ContactConfiguration"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${
            payload?.newValue?.actorIdByObject?.firstName || ""
          } ${payload?.newValue?.lastName || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.firstName || ""} ${
            payload?.lastName || ""
          }`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["ProductManagement"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.name || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.name || ""}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["SampleConfiguration"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload.newValue?.name || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload.name || ""}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["UserParameter"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.firstName || ""} le ${
            payload?.newValue?.lastName || ""
          }`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.firstName || ""} le ${
            payload?.lastName || ""
          }`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["StockConfiguration"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.sample?.name || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.sample?.name || ""}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }

      if (
        [
          "OrientationConfiguration",
          "FieldActivityConfiguration",
          "ReasonConfiguration",
          "VisitConfiguration",
        ].includes(entityTag)
      ) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.captionFr || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.captionFr || ""}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
      if (["RoleManagement"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.roleName || ""}`;
        }
      }
      if (["ProductCategoryConfiguration"].includes(entityTag)) {
        if (actionType === "Update") {
          return `${entityType} ${payload?.newValue?.captionFr || ""}`;
        }
        if (actionType === "Create") {
          return `${entityType} ${payload?.captionFr || ""}`;
        }
        if (actionType === "Delete") {
          return `${entityType}`;
        }
      }
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("FR-fr", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };
    const columnDefs = ref([
      {
        field: "date",
        headerName: "Date",
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
          params.data?.ids?.creation
            ? formatDate(params.data?.ids?.creation)
            : "",
        colId: "date",
        hide: false,
        lockPinned: true,
      },
      {
        field: "time",
        headerName: "Heure",
        colId: "time",
        hide: false,
        lockPinned: true,
        valueGetter: (params) =>
          params.data?.ids?.creation
            ? new Date(params.data?.ids?.creation).toLocaleTimeString("FR-fr", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
      },
      {
        field: "user",
        colId: "user",
        headerName: "Utilisateur",
        cellRenderer: AvatarCellRender,
        cellRendererParams: {
          cellData: {
            type: "logUser",
          },
        },
        hide: false,
        lockPinned: true,
        width: 250,
        search: [
          {
            criteria: "[ids][creationByObject][user][firstName]",
            insensitive: true,
          },
          {
            criteria: "[ids][creationByObject][user][lastName]",
            insensitive: true,
          },
        ],
      },
      {
        field: "roles",
        colId: "roles",
        headerName: "Rôle(s)",
        hide: false,
        lockPinned: true,
        valueGetter: (params: any) =>
          params.data.ids?.creationByObject?.user?.userTypes
            ?.map(
              (userType: any) =>
                userType?.role?.roleName?.charAt(0).toUpperCase() +
                userType?.role?.roleName?.slice(1)
            )
            .join(","),
        search: {
          criteria:
            "[ids][creationByObject][user][userTypes][some][role][roleName]",
          insensitive: true,
        },
        maxWidth: 200,
      },
      {
        field: "listIdEntityTypeObject.captionFr",
        colId: "object",
        headerName: "Objet",
        hide: false,
        lockPinned: true,
        valueGetter: objectValueGetter,
        search: [
          {
            criteria: "[listIdEntityTypeObject][captionFr]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][actor][actorName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][actor][actorPerson][firstName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][story][actorIdByObject][actorName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][pharmaceuticalDelegate][firstName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][pharmaceuticalDelegate][lastName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][actorProduct][name]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][actorSample][name]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][user][firstName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][user][lastName]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][sampleStock][sample][name]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][list][captionFr]",
            insensitive: true,
          },
          {
            criteria: "[anyIdObject][role][roleName]",
            insensitive: true,
          },
        ],
        flex: 1 / 6,
        minWidth: 250,
      },

      {
        field: "listIdActionTypeObject.captionFr",
        hide: false,
        colId: "action",
        headerName: "Action",
        lockPinned: true,
        search: {
          criteria: "[listIdActionTypeObject][captionFr]",
          insensitive: true,
        },
      },
    ]);

    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      headerComponentParams: {
        unhidable: true,
      },
    };
    const contextMenuList = ref({
      entity: "visit",
      list: ["edit", "duplicate", "delete", "view"],
    });

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchLogs(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          ...serchCriteria.value,
          ...dateSearch.value,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchLogs(
        {
          skip: (val - 1) * logPagination.value.take,
          take: logPagination.value.take,
        },
        {
          ...serchCriteria.value,
          ...dateSearch.value,
        }
      );
    };
    const rowClicked = (value) => {
      console.log(value);
      setModal("HistoriqueDetailModal", {
        data: value,
      });
    };

    const confirmDateRangePicker = async (range) => {
      dateSearch.value = range ? {
        "where[ids][creation][gte]": range[0],
        "where[ids][creation][lte]": range[1],
      } : {};
      await fetchLogs(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
          ...dateSearch.value,
        }
      );
    };
    const popoverItemAction = (item) => {
      //   if (item.item === "edit") {
      //     router.push({
      //       name: "admin-detail-visit",
      //       params: { id: item.selectedRow.id },
      //     });
      //   }
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchLogs(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
          ...dateSearch.value,
        }
      );
    };

    onMounted(async () => {
      await fetchLogs({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });
    return {
      columnDefs,
      defaultColDef,
      logPagination,
      setItemsPerPage,
      currentPageChange,
      contextMenuList,
      handleSearch,
      logList,
      popoverItemAction,
      rowClicked,
      confirmDateRangePicker,
    };
  },
};
</script>
<style lang="scss" scoped></style>
