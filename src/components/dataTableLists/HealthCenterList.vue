<template>
  <dataTable
    :data="actorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="healthCenterList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @rowClick="rowClicked"
    entity="établissements de santé"
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
import { useRoute } from "vue-router";
import { Components } from "@tekab-dev-team/storybook-devfactory";

export default {
  components: {
    dataTable,
    CustomRowOptions,
    ContactStatus,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { actorList, actorPagination } = storeToRefs(useActorStore());
    const { fetchActorsView, deleteActor, duplicateActor } = useActorStore();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const healthCenterCondition = route.params.id ? { "where[actorObject][actorCompany][services][some][team][some][actorPerson][id]" : route.params.id,} : {}

    // getting col value from array of nested object
    const addressValueGetter = (params) => {
      if (
        Array.isArray(params.data.actorObject.addressOfActor) &&
        params.data.actorObject.addressOfActor.length > 0
      ) {
        // const addresse = params.data.addressOfActor.find((add)=> add.addressType.type === 'pharmacy')
        const addresse = params.data?.actorObject?.addressOfActor[0];
        // TODO GETTING THE VALUE OF THE PRINCIPAL ADRESSE
        const { street, streetNb, zipCode, town } = addresse;
        return `${street} ,${streetNb} ${town} ${zipCode}`;
      }
      return "";
    };
    const cipValueGetter = (params) => {
      if (
        Array.isArray(params.data?.actorObject?.addressOfActor) &&
        params.data?.actorObject?.addressOfActor?.length > 0
      ) {
        //  const addresse = params.data.addressOfActor.find((add)=> add.addressType.type === 'pharmacy')
        const addresse = params.data?.actorObject?.addressOfActor[0];
        return addresse.row1Value;
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
        suppressMovable:true

      },
      {
        colId: "actorName",
        field: "actorObject.actorName",
        //cellRenderer: ContactStatus,
        headerName: "Nom",
        cellRenderer: "ContactStatus",
        lockPinned:true,

        search: {
          criteria: "[actorName]",
          insensitive: true,
        },
        hide: false,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorName]",
        },
      },
      {
        hide: false,
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
        lockPinned:true,

      },
      {
        colId: "departement",
        hide: false,
        field: "actorObject.addressOfActor",
        valueGetterType:'actorDepartment',
        headerName: "Dpt",
        valueGetter: (params) =>
          params.data?.actorObject?.addressOfActor?.length
            ? params.data.actorObject.addressOfActor[0].departement
            : "",
        search: {
          criteria: "[addressOfActor][some][departement]",
          insensitive: true,
        },
        lockPinned:true,

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][departement]",
        },
      },

      {
        hide: false,
        colId: "uga",
        field: "actorObject.addressOfActor",
        valueGetterType:'actorUga',
        headerName: "UGA",
        lockPinned:true,

        valueGetter: (params) => {
          return params.data?.actorObject?.addressOfActor?.length &&
            params.data?.actorObject?.addressOfActor[0].listIdUgaObject
            ? params.data.actorObject.addressOfActor[0].listIdUgaObject.code
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
      },
      {
        hide: false,
        colId: "address",
        field: "actorObject.addressOfActor",
        headerName: "Adresse",
        valueGetterType:'actorAddress',
        valueGetter: addressValueGetter,
         search: {
          criteria: "[addressOfActor][some][street]",
          insensitive: true,
        },
        lockPinned:true,

        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][addressOfActor][some][street]",
        },
      },
      {
        colId: "codeCip",
        field: "actorObject.addressOfActor",
        headerName: "Code CIP",
        lockPinned:true,
        valueGetterType:'healthCenterCip',
        hide: false,
        valueGetter: cipValueGetter,
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
      },
      {
        colId: "pj",
        field: "",
        lockPinned:true,

        hide: false,
        headerName: "PJ",
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
            "HealthCenter",
            ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 

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
            "HealthCenter",
            ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 

        }
      );
    };
    const handleDeleteContact = async (id, motif) => {
      await deleteActor({
        id,
        deletedReason: motif,
      });
    };
   const rowClicked=(value)=>{
    router.push({
          name: "admin-detail-contact",
          params: { type: "healthCenter", id: value.id},
        });
   }

    const popoverItemAction = async (item) => {
      if (item.item === "edit")
        router.push({
          name: "admin-detail-contact",
          params: { type: "healthCenter", id: item.selectedRow.id },
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
            "HealthCenter",
            ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 
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
            "HealthCenter",
            ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 
        }
      );
    };
    const exportCsv = () => {
      console.log("export");
    };

    const exportFilter = computed(()=>{
      return  {
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "HealthCenter",
           ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 
        }

    })

    onMounted(async () => {
      if(route.params && route.params.type ==='pds'){
        await fetchActorsView(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        "",
        {
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "HealthCenter",
           ...healthCenterCondition,
            ...filtersCriteria.value,
            ...serchCriteria.value 
        }
      );
      }
    });
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
      exportFilter
    };
  },
};
</script>
<style lang="scss" scoped></style>
