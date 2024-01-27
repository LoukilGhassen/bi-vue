<template>
  <dataTable
    :data="actorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="pharmacyList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @rowClick="rowClicked"
    entity="pharmacies"
    :exportFilter="exportFilter"
    exportEntityName="actorView"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";

import { useActorStore } from "@/store/useActorModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ContactStatus from "@/components/shared/ag-grid-table/ContactStatus.vue";
import { useRouter } from "vue-router";
import { setModal } from "@/core/helpers/config";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { dateSort, intSort} from "@/core/helpers/dataTableHelper";
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
    const serchCriteria = ref();
    const filtersCriteria = ref();
    // getting col value from array of nested object
    const addressValueGetter = (params) => {
      const addresse = params.data.actorObject?.addressOfActor.find(
        (add) => add?.addressType?.type === "pharmacy"
      );
      //    // TODO GETTING THE VALUE OF THE PRINCIPAL ADRESSE
      if (addresse) {
        const { street, streetNb, zipCode, town } = addresse;
        return `${street} ,${streetNb} ${town} ${zipCode}`;
      }
      return "";
    };
    const cipValueGetter = (params) => {
      const addresse = params.data.actorObject?.addressOfActor.find(
        (add) => add?.addressType?.type === "pharmacy"
      );
      if (addresse) {
        return addresse?.row1Value;
      }
      return "";
    };

    const columnDefs = ref([
      {
        colId: "checkbox",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
        hide: false,
        suppressMovable: true,
      },
      {
        colId: "codeCIP",
        field: "actorObject.addressOfActor",
        headerName: "Code CIP",
        valueGetter: cipValueGetter,
        valueGetterType: "pharmacyCodeCip",
        search: {
          criteria: "[addressOfActor][some][row1Value]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][row1Value]",
        },
        hide: false,
        lockPinned: true,
      },
      {
        colId: "nom",
        field: "actorObject.actorName",
        cellRenderer: ContactStatus,
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
        width: 300,
      },
      {
        colId: "importance",
        field: "actorObject.importance",
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
        colId: "dpt",
        field: "actorObject.addressOfActor",
        headerName: "Dpt",
        valueGetterType: "actorDepartment",
        valueGetter: (params) =>
          params.data.actorObject?.addressOfActor.length
            ? params.data.actorObject.addressOfActor[0].departement
            : "",
        search: {
          criteria: "[addressOfActor][some][departement]",
          insensitive: true,
        },
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
        colId: "uga",
        hide: false,
        field: "actorObject.addressOfActor",
        valueGetterType: "actorUga",
        headerName: "UGA",
        valueGetter: (params) =>
          params.data.actorObject?.addressOfActor.length &&
          params.data.actorObject?.addressOfActor[0].listIdUgaObject
            ? params.data.actorObject.addressOfActor[0].listIdUgaObject.code
            : "",
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
        lockPinned: true,
      },
      {
        colId: "adresse",
        hide: false,
        field: "actorObject.addressOfActor",
        headerName: "Adresse",
        valueGetterType: "actorAddress",
        valueGetter: addressValueGetter,
        search: {
          criteria: "[addressOfActor][some][street]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][street]",
        },
        lockPinned: true,

        width: 300,
      },
      {
        hide: false,
        colId: "objectifVisiteAnnuelle",
        field: "actorObject.yearVisitObjective",
        headerName: "Objectif de visite annuelle",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorObject][yearVisitObjective]",
          type: "number",
        },
        lockPinned: true,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.actorObject.yearVisitObjective);
          const impB = parseInt(nodeB.data.actorObject.yearVisitObjective);
          return intSort(impA, impB);
        },
      },
      {
        hide: false,
        colId: "options",
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
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "Pharmacy",

          ...serchCriteria.value,
          ...filtersCriteria.value,
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
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "Pharmacy",
          ...serchCriteria.value,
          ...filtersCriteria.value,
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
        params: { type: "pharmacy", id: value.id },
      });
    };
    const popoverItemAction = async (item) => {
      if (item.item === "edit")
        router.push({
          name: "admin-detail-contact",
          params: { type: "pharmacy", id: item.selectedRow.id },
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
      filtersCriteria.value = val;
      await fetchActorsView(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        "",
        {
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "Pharmacy",
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
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "Pharmacy",
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };

    const exportCsv = async () => {};
    const exportFilter = computed(() => {
      return {
        "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
          "Pharmacy",
        ...filtersCriteria.value,
        ...serchCriteria.value,
      };
    });
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
