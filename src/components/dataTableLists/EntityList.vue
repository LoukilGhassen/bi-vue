<template>
  <dataTable
    :data="actorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorPagination"
    :additionalTableOptions="additionalTableOptions"
    webElementAddress="entityList"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @rowClick="rowClicked"
    entity="entités"
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
      if (
        Array.isArray(params.data.actorObject.addressOfActor) &&
        params.data.actorObject.addressOfActor.length > 0
      ) {
        // const addresse = params.data.addressOfActor.find((add)=> add.addressType.type === 'pharmacy')
        const addresse = params.data.actorObject.addressOfActor[0];
        // TODO GETTING THE VALUE OF THE PRINCIPAL ADRESSE
        const { street, streetNb, zipCode, town } = addresse;
        return `${street} ,${streetNb} ${town} ${zipCode}`;
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
        hide: false,
        pinned: "left",
        width: 50,
        suppressMovable:true
      },
      {
        hide: false,
        colId: "objetSocial",
        field:
          "actorObject.actorCompany.listIdActorCompanyFormObject.captionFr",
        headerName: "Objet social",
        search: {
          criteria: "[actorCompany][listIdActorCompanyFormObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actorObject][actorCompany][listIdActorCompanyFormObject][captionFr]",
        },
        lockPinned:true,
        flex:2/6
      },
      {
        hide: false,
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
        lockPinned:true,
        flex:1/6
      },
      {
        hide: false,

        colId: "ursaaf",
        field: "actorObject.ursaaf",
        headerName: "URSAFF",
        search: {
          criteria: "[ursaaf]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][ursaaf]",
        },
      lockPinned:true,
      },
      {
        hide: false,

        colId: "nomPresident",
        field: "actorObject.actorCompany.presidentName",
        headerName: "Nom du président",
        search: {
          criteria: "[actorCompany][presidentName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorCompany][presidentName]",
        },
        lockPinned:true,
flex:1/6
      },
      {
        hide: false,

        colId: "nomTresorier",
        field: "actorObject.actorCompany.treasurerName",
        headerName: "Nom du trésorier",
        search: {
          criteria: "[actorCompany][treasurerName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorObject][actorCompany][treasurerName]",
        },
        lockPinned:true,
        flex:1/6
      },
      {
        hide: false,
        colId: "adresse",
        field: "actorObject.addressOfActor",
        headerName: "Adresse",
        valueGetterType:'actorAddress',
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
        lockPinned:true,
        flex:2/6
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
            "Entity",
            ...filtersCriteria.value,
            ...serchCriteria.value 

        },
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
            "Entity",
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
    const rowClicked = (value) => {
      router.push({
        name: "admin-detail-contact",
        params: { type: "entity", id: value.id },
      });
    };
    const popoverItemAction = async (item) => {
      if (item.item === "edit")
        router.push({
          name: "admin-detail-contact",
          params: { type: "entity", id: item.selectedRow.id },
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
            "Entity",
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
            "Entity",
            ...filtersCriteria.value,
            ...serchCriteria.value 
        }
      );
    };

    const exportCsv = () => {
      console.log("export");
    };
    const exportFilter = computed(()=>{
      return {
          "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]":
            "Entity",
            ...filtersCriteria.value,
            ...serchCriteria.value 
        }

    })

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
      exportFilter
    };
  },
};
</script>
<style lang="scss" scoped></style>
