<template>
  <dataTable
    :data="actorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="pdsList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @rowClick="rowClicked"
    entity="professionnels de santé"
    exportEntityName="actorView"
    :exportFilter="exportFilter"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import service from "@/service";
import XLSX from "xlsx";

import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ContactStatus from "@/components/shared/ag-grid-table/ContactStatus.vue";
import { useRouter } from "vue-router";
import { setModal } from "@/core/helpers/config";
import { useActorStore } from "@/store/useActorModule";
import { useWebElementStore } from "@/store/useWebElementModule";
import { dateSort, intSort } from "@/core/helpers/dataTableHelper";
export default {
  components: {
    dataTable,
    CustomRowOptions,
    ContactStatus,
  },

  setup() {
    const router = useRouter();
    const { actorList, actorPagination } = storeToRefs(useActorStore());
    const { fetchActorsView, deleteActor, duplicateActor } = useActorStore();
    const { setWebElements } = useWebElementStore();
    const serchCriteria = ref();
    const filtersCriteria = ref();

    // getting col value from array of nested object
    const addressValueGetter = (params) => {
      if (
        Array.isArray(params?.data?.actorObject?.addressOfActor) &&
        params?.data?.actorObject?.addressOfActor?.length > 0
      ) {
        // TODO GETTING THE VALUE OF THE PRINCIPAL ADRESSE
        const { street, streetNb, zipCode, town } =
          params.data.actorObject.addressOfActor[0];
        return `${street} ,${streetNb} ${town} ${zipCode}`;
      }
      return "";
    };

    const columnDefs = ref([
      {
        colId: "selection",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
        sortIndex: 5,
        hide: false,
        lockPosition: "left",
        pinned: "left",
        suppressMovable: true,
      },
      {
        field: "actorObject.actorPerson.rpps",
        colId: "rpps",
        headerName: "RPPS",
        search: {
          criteria: "[actorPerson][rpps]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorPerson][rpps]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorObject.actorName",
        colId: "actorName",
        cellRenderer: "ContactStatus",
        headerName: "Nom",
        search: {
          criteria: "[actorName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorName]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorObject.actorPerson.firstName",
        headerName: "Prénom",
        colId: "firstName",
        search: {
          criteria: "[actorPerson][firstName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorPerson][firstName]",
        },
        lockPinned: true,
        hide: false,
      },
      {
        field: "actorObject.importance",
        colId: "importance",
        headerName: "Importance",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorObject][importance]",
          type: "number",
        },
        hide: false,
        lockPinned: true,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.actorObject.importance);
          const impB = parseInt(nodeB.data.actorObject.importance);
          return intSort(impA, impB);
        },
      },
      {
        field: "actorObject.listIdActorPersonSpecializationObject.captionFr",
        headerName: "Spécialité",
        colId: "speciality",
        search: {
          criteria: "[listIdActorPersonSpecializationObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actorObject][listIdActorPersonSpecializationObject][captionFr]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        field: "lastVisitDate",
        colId: "lastVisitDate",
        headerName: "Dernière date de visite",
        valueGetterType: "date",
        valueGetter: (params) =>
          params.data?.lastVisitDate
            ? new Date(params.data?.lastVisitDate).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "",
        hide: false,
        filter: {
          type: "date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[lastVisitDate]",
        },
        lockPinned: true,
        comparator: (date1, date2, nodeA, nodeB, isDescending) => {
          const startDateA = new Date(nodeA.data.lastVisitDate);
          const startDateB = new Date(nodeB.data.lastVisitDate);
          return dateSort(startDateA, startDateB);
        },
      },
      {
        field: "actorObject.addressOfActor",
        headerName: "Dpt",
        colId: "departement",
        search: {
          criteria: "[addressOfActor][some][departement]",
          insensitive: true,
        },
        valueGetterType: "actorDepartment",
        valueGetter: (params) =>
          params.data?.actorObject?.addressOfActor?.length
            ? params.data?.actorObject?.addressOfActor[0]?.departement
            : "",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][departement]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorObject.addressOfActor",
        headerName: "UGA",
        colId: "uga",
        valueGetterType: "actorUga",
        valueGetter: (params) => {
          return params.data?.actorObject?.addressOfActor?.length
            ? params.data?.actorObject?.addressOfActor[0]?.listIdUgaObject?.code
            : "";
        },
        search: {
          criteria: "[addressOfActor][some][listIdUgaObject][code]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][listIdUgaObject][code]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        field: "actorObject.addressOfActor",
        headerName: "Adresse",
        colId: "address",
        search: {
          criteria: "[addressOfActor][some][town]",
          insensitive: true,
        },
        valueGetterType: "actorAddress",
        valueGetter: addressValueGetter,
        hide: false,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][town]",
        },
        lockPinned: true,
      },
      {
        field: "actorObject.yearVisitObjective",
        headerName: "Objectif de visite annuelle",
        hide: false,
        colId: "yearVisitObjective",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not][equals]" },
          ],
          field: "[actorObject][yearVisitObjective]",
          type: "number",
          lockPinned: true,
        },
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.actorObject.yearVisitObjective);
          const impB = parseInt(nodeB.data.actorObject.yearVisitObjective);
          return intSort(impA, impB);
        },
      },
      {
        field: "actorObject.rdvVisit",
        headerName: "Reçoit sur RDV",
        hide: false,
        colId: "rdvVisit",
        valueGetterType: "boolean",
        filter: {
          field: "[actorObject][rdvVisit]",
          type: "boolean",
        },
        lockPinned: true,
      },
      {
        field: "actorObject.actorPerson.acceptAccompagnedVisit",
        headerName: "Accepte les visites accompagnées",
        hide: false,
        valueGetterType: "boolean",
        colId: "acceptAccompagnedVisit",
        filter: {
          field: "[actorObject][actorPerson][acceptAccompagnedVisit]",
          type: "boolean",
        },
        lockPinned: true,
      },
      {
        field: "actorObject.actorPerson.invitedToPC",
        headerName: "Souhaite être invité aux RP",
        hide: false,
        valueGetterType: "boolean",
        colId: "invitedToPC",
        filter: {
          field: "[actorObject][actorPerson][invitedToPC]",
          type: "boolean",
        },
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
        hide: false,
        colId: "menu",
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref({
      entity: "contact",
      list: ["edit", "duplicate", "delete", "view"],
    });
    const additionalTableOptions = ["export"];

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchActorsView(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        "",
        {
          "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
            "PDS",
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchActorsView(
        {
          skip: (val - 1) * actorPagination.value.take,
          take: actorPagination.value.take,
        },
        "",
        {
          "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
            "PDS",
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const handleDeleteContact = async (id, motif) => {
      await deleteActor({
        id,
        deletedReason: motif,
      });
    };
    const rowClicked = (value) => {
      router.push({
        name: "admin-detail-contact",
        params: { type: "pds", id: value.id },
      });
    };
    const popoverItemAction = async (item) => {
      if (item.item === "edit")
        router.push({
          name: "admin-detail-contact",
          params: { type: "pds", id: item.selectedRow.id },
        });
      if (item.item === "delete") {
        setModal("DeleteContactModal", {
          id: item.selectedRow.id,
          deleteEntity: handleDeleteContact,
          title: "Supprimer le contact",
          text: `le contact ${item.selectedRow.actorObject.actorName}`,
        });
      }
      if (item.item === "duplicate") {
        await duplicateActor(item.selectedRow.id);
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
      console.log(val);
      filtersCriteria.value = val;

      await fetchActorsView(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        "",
        {
          "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
            "PDS",
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchActorsView(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        "",
        {
          "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
            "PDS",
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const exportFilter = computed(() => {
      return {
        "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
          "PDS",
        ...serchCriteria.value,
        ...filtersCriteria.value,
      };
    });
    const exportCsv = async () => {};
    onMounted(async () => {});
    return {
      columnDefs,
      defaultColDef,
      actorPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      exportCsv,
      additionalTableOptions,
      popoverItemAction,
      actorList,
      addressValueGetter,
      rowClicked,
      exportFilter,
    };
  },
};
</script>
<style lang="scss" scoped></style>
