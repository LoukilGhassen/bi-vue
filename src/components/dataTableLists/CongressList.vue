<template>
  <dataTable
    :data="actorList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    :pagination="actorPagination"
    :additionalTableOptions="additionalTableOptions"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @export="exportCsv"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
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

export default {
  components: {
    dataTable,
    CustomRowOptions,
    ContactStatus,
  },

  setup() {
    const router = useRouter();
    const { actorList, actorPagination } = storeToRefs(useActorStore());
    const { fetchActors, deleteActor } = useActorStore();

    // getting col value from array of nested object
    const addressValueGetter = (params) => {
      if (
        Array.isArray(params.data.addressOfActor) &&
        params.data.addressOfActor.length > 0
      ) {
        //const addresse = params.data.addressOfActor.find((add)=> add.addressType.type === 'pharmacy')
        const addresse = params.data.addressOfActor[0];
        // TODO GETTING THE VALUE OF THE PRINCIPAL ADRESSE
        const { street, streetNb, zipCode, town } = addresse;
        return `${street} ,${streetNb} ${town} ${zipCode}`;
      }
      return "";
    };

    const columnDefs = ref([
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
      },
      {
        field: "actorName",
        //cellRenderer: ContactStatus,
        headerName: "Nom",
      },
      {
        field: "listIdActorPersonSpecializationObject.captionFr",
        headerName: "Spécialité",
      },
      {
        field: "ursaaf",
        headerName: "URSAFF",
      },
      {
        field: "addressOfActor",
        headerName: "Addresse",
        valueGetter: addressValueGetter,
      },
      {
        field: "addressOfActor[0].row1Value",
        headerName: "Date début",
        valueGetter: (params) =>
          params?.data?.addressOfActor[0]?.row1Value
            ? params.data?.addressOfActor[0]?.row1Value.split(" ")[0]
            : "",
      },
      {
        field: "actorName",
        headerName: "Heure début",
        valueGetter: (params) =>
          params?.data?.addressOfActor[0]?.row1Value
            ? params?.data?.addressOfActor[0]?.row1Value.split(" ")[1]
            : "",
      },
      {
        field: "addressOfActor[0].row2Value",
        headerName: "Date fin",
        valueGetter: (params) =>
          params.data.addressOfActor[0].row2Value
            ? params.data.addressOfActor[0].row2Value.split(" ")[0]
            : "",
      },
      {
        field: "actorName",
        headerName: "Heure fin",
        valueGetter: (params) =>
          params.data.addressOfActor[0].row2Value
            ? params.data.addressOfActor[0].row2Value.split(" ")[1]
            : "",
      },
      {
        field: "",
        headerName: "PJ",
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
      await fetchActors(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        "",
        "congress"
      );
    };
    const currentPageChange = async (val) => {
      await fetchActors(
        {
          skip: (val - 1) * actorPagination.value.take,
          take: actorPagination.value.take,
        },
        "",
        "congress"
      );
    };
    const handleDeleteContact = async (id, motif) => {
      await deleteActor({
        id,
        deletedReason: motif,
      });
    };
    const popoverItemAction = (item) => {
      if (item.item === "edit")
        router.push({
          name: "admin-detail-contact",
          params: { type: "congress", id: item.selectedRow.id },
        });
      if (item.item === "delete") {
        setModal("DeleteContactModal", {
          id: item.selectedRow.id,
          deleteEntity: handleDeleteContact,
          title: "Supprimer le contact",
          text: `le contact ${item.selectedRow.id}`,
        });
      }
    };
    const validateFiltre = (val) => {
      console.log(val, "vaaaaaaal");
    };
    const handleSearch = (val) => {
      console.log(val, "************");
    };

    const exportCsv = () => {
      console.log("export");
    };

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
    };
  },
};
</script>
<style lang="scss" scoped></style>
