<template>
  <dataTable
    :data="tableData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorrelationshipPagination"
    :additionalTableOptions="additionalTableOptions"
    :webElementAddress="webElementAddress"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    @addRow="handleAddRow"
        @rowClick="rowClicked"
        :exportedfromClient='true'
    entity="médecins"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useRoute, useRouter } from "vue-router";
import { useActorRelationshipStore } from "@/store/useActorRelationshipModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import AttachedDoctorSelectCell from "@/components/shared/ag-grid-table/AttachedDoctorSelectCell.vue";
import { transformObject, replaceKeys } from "@/core/helpers/dataTableHelper";
import { useActorStore } from "@/store/useActorModule";
import AttachedAddressSelectCell from "@/components/shared/ag-grid-table/AttachedAddressSelectCell.vue";

export default {
  components: {
    dataTable,
    CustomRowOptions,
    AttachedAddressSelectCell
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
  },

  setup() {
    const router = useRouter();
    const {
      actorrelationshipList,
      actorrelationshipPagination,
      showListAddRow,
    } = storeToRefs(useActorRelationshipStore());
    const {
      fetchActorRelationships,
      addActorRelationShip,
      deleteEmptyActorRelationShip,
      setShowListAddRow,
      deleteActorRelationship,
    } = useActorRelationshipStore();
    const { setActiveActorDetailTabName } = useActorStore();

    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const addressValueGetter = (params) => {
      if (params.data.address) {
        const { street, streetNb, zipCode, town } = params.data.address;
        return `${street} ,${streetNb} ${town} ${zipCode}`;
      }
      return "";
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
        width: 50,
        suppressMovable: true,
        lockPosition: "left",
        pinned: "left",
      },
      {
        colId: "name",
        hide: false,
        field: "Nom",
        headerName: "Nom",
        cellRenderer: AttachedDoctorSelectCell,
        search: {
          criteria: "[actor1Object][actorName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][actorName]",
        },
        suppressMovable: true,
        headerComponentParams: {
          unhidable: true,
          unmovable: true,
        },
        lockPosition: "left",
        pinned: true,
      },
      {
        colId: "rpps",
        hide: false,
        field: "RPPS",
        headerName: "RPPS",
        lockPinned: true,
        search: {
          criteria: "[actor1Object][actorPerson][rpps]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][actorPerson][rpps]",
        },
      },
      {
        colId: "firstName",
        hide: false,
        lockPinned: true,
        field: "Prénom",
        headerName: "Prénom",
        search: {
          criteria: "[actor1Object][actorPerson][firstName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][actorPerson][firstName]",
        },
      },
      {
        colId: "importance",
        hide: false,
        lockPinned: true,
        field: "importance",
        headerName: "importance",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actor1Object][importance]",
          type: "number",
        },
      },
      {
        colId: "speciality",
        hide: false,
        lockPinned: true,

        field: "Spécialité",
        headerName: "Spécialité",
        search: {
          criteria:
            "[actor1Object][listIdActorPersonSpecializationObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actor1Object][listIdActorPersonSpecializationObject][captionFr]",
        },
      },
      {
        colId: "lastVisitDate",
        hide: false,
        lockPinned: true,

        field: "Dernière date de visite",
        headerName: "Derniere visite",
        filter: {
          type: "date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actor1Object][actorView][lastVisitDate]",
        },
      },
      {
        colId: "uga",
        hide: false,
        lockPinned: true,

        field: "UGA",
        headerName: "UGA",
        search: {
          criteria:
            "[actor1Object][addressOfActor][some][listIdUgaObject][code]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][addressOfActor][some][listIdUgaObject][code]",
        },
      },

      {
        colId: "address",
        hide: false,
        field: "address",
        lockPinned: true,
        headerName: "Adresse",
        valueGetter: addressValueGetter,
        cellRenderer: AttachedAddressSelectCell,
        search: {
          criteria: "[relation1Address][street]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][addressOfActor][some][street]",
        },
      },
      {
        colId: "email",
        hide: false,
        field: "email",
        lockPinned: true,

        headerName: "E-mail",
        search: {
          criteria: "[actor1Object][email]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actor1Object][email]",
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
      entity: "attachedDoctor",
      list: ["edit", "delete"],
    });
    const additionalTableOptions = computed(() => {
      return showListAddRow.value
        ? ["export", "addRow"]
        : ["export", "addRow", "addRowDisabled"];
    });

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchActorRelationships(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          "where[listIdActorRelationshipTypeObject][tag]": "AttachedDoctor",
          ...pdsTypeCondition,                                                              
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const rowClicked =(val)=>{
      router.push({
          name: "admin-detail-contact",
          params: { type: "pds", id: val.actorId },
        });
        setActiveActorDetailTabName("Informations");
    }
    const currentPageChange = async (val) => {
      await fetchActorRelationships(
        {
          skip: (val - 1) * actorrelationshipPagination.value.take,
          take: actorrelationshipPagination.value.take,
        },
        {
          "where[listIdActorRelationshipTypeObject][tag]": "AttachedDoctor",
          ...pdsTypeCondition,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const tableData = computed(() => {
      return actorrelationshipList.value.map((item) => {
        return item.actor2Object.id !== route.params.id
          ? {
              id: item.id,
              actorId: item.actor2Object?.id,
              RPPS: item.actor2Object?.actorView?.actorObject?.actorPerson
                ?.rpps,
              Nom: item.actor2Object?.actorView?.actorObject?.actorName,
              Prénom:
                item.actor2Object?.actorView?.actorObject?.actorPerson
                  ?.firstName,
              importance: item.actor2Object?.actorView?.actorObject?.importance,
              Spécialité:
                item.actor2Object?.actorView?.actorObject
                  ?.listIdActorPersonSpecializationObject?.captionFr,
              "Dernière date de visite": item.actor2Object?.actorView
                ?.lastVisitDate
                ? new Date(
                    item.actor2Object?.actorView?.lastVisitDate
                  ).toLocaleDateString("FR-fr", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "",
              Dpt: item.actor2Object?.actorView?.actorObject?.addressOfActor[0]
                ?.departement,
              UGA: item.actor2Object?.actorView?.actorObject?.addressOfActor[0]
                ?.listIdUgaObject?.code,
              email: item.actor2Object?.actorView?.actorObject?.email,
              address:item.relation2Address?.id,
              actorAddresses:item.actor2Object?.actorView?.actorObject?.addressOfActor,
              relationSide:2
            }
          : {
              id: item.id,
              actorId: item.actor1Object?.id,
              RPPS: item.actor1Object?.actorView?.actorObject?.actorPerson
                ?.rpps,
              Nom: item.actor1Object?.actorView?.actorObject?.actorName,
              Prénom:
                item.actor1Object?.actorView?.actorObject?.actorPerson
                  ?.firstName,
              importance: item.actor1Object?.actorView?.actorObject?.importance,
              Spécialité:
                item.actor1Object?.actorView?.actorObject
                  ?.listIdActorPersonSpecializationObject?.captionFr,
              "Dernière date de visite": item.actor1Object?.actorView
                ?.lastVisitDate
                ? new Date(
                    item.actor1Object?.actorView?.lastVisitDate
                  ).toLocaleDateString("FR-fr", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "",
              Dpt: item.actor1Object?.actorView?.actorObject?.addressOfActor[0]
                ?.departement,
              UGA: item.actor1Object?.actorView?.actorObject?.addressOfActor[0]
                ?.listIdUgaObject?.code,
              email: item.actor1Object?.actorView?.actorObject?.email,
              address:item.relation1Address?.id,
              actorAddresses:item.actor1Object?.actorView?.actorObject?.addressOfActor,
              relationSide:1
            };
      });
    });
    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        if (!item.selectedRow.id) {
          deleteEmptyActorRelationShip();
          setShowListAddRow(true);
        } else await deleteActorRelationship(item.selectedRow.id);
      }
      if (item.item === "edit") {
        router.push({
          name: "admin-detail-contact",
          params: { type: "pds", id: item.selectedRow.actorId },
        });
        setActiveActorDetailTabName("Informations");
      }
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = {
        "where[OR][0][actor2]": route.params.id,
        ...transformObject(val, 0),
        "where[OR][1][actor1]": route.params.id,
        ...transformObject(replaceKeys(replaceKeys(val, "actor1Object", "actor2Object"),"relation1Address","relation2Address"), 1),
      };
      await fetchActorRelationships(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[listIdActorRelationshipTypeObject][tag]": "AttachedDoctor",
         ...pdsTypeCondition,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = {
        "where[OR][0][actor2]": route.params.id,
        ...transformObject(val, 0),
        "where[OR][1][actor1]": route.params.id,
        ...transformObject(replaceKeys(replaceKeys(val, "actor1Object", "actor2Object"),"relation1Address","relation2Address"), 1),
      };
      await fetchActorRelationships(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[listIdActorRelationshipTypeObject][tag]": "AttachedDoctor",
            ...pdsTypeCondition,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleAddRow = () => {
      addActorRelationShip({
        id: "",
        actor1Object: { id: "" },
        actor2Object: { id: "" },
      });
      setShowListAddRow(false);
    };
    const pdsTypeCondition =
        route.params.type === "pds"
          ? {
              "where[actor1Object][actorPerson][listIdActorPersonTypeObject][tag]":
                "PDS",
            }
          : {
              "where[actor2Object][actorPerson][listIdActorPersonTypeObject][tag]":
                "PDS",
            };

    onMounted(async () => {
      await fetchActorRelationships(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[OR][0][actor1]": route.params.id,
          "where[OR][1][actor2]": route.params.id,
          ...pdsTypeCondition,
          "where[listIdActorRelationshipTypeObject][tag]": "AttachedDoctor",
        }
      );
      setShowListAddRow(true);
    });
    return {
      columnDefs,
      defaultColDef,
      actorrelationshipPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      actorrelationshipList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      handleAddRow,
      tableData,
      rowClicked
    };
  },
};
</script>
<style lang="scss" scoped></style>
