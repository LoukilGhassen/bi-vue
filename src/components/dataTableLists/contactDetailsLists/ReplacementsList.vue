<template>
  <div>
    <dataTable
      :data="substituteList"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :contextMenuList="contextMenuList"
      :confirmDeleteModalTitle="'Supprimer un remplaçant'"
      :pagination="substitutePagination"
      :additionalTableOptions="additionalTableOptions"
      webElementAddress="pdsSubstitutionsList"
      @popoverItemAction="popoverItemAction"
      @onValidateFiltre="validateFiltre"
      @inputChange="handleSearch"
      @setItemsPerPage="setItemsPerPage"
      @currentPageChange="currentPageChange"
      @addRow="handleAddRow"
      entity="remplaçants"
    />
    <ConfirmModal
      title="Gérer les remplaçants du contact"
      :isOpenModal="showAddSubstituteModal"
      @close-confirm-modal="() => (showAddSubstituteModal = false)"
      @approve-confirm-modal="() => (submitNewSubstitute = true)"
      :beforeClose="() => (showAddSubstituteModal = false)"
      confirmTitle="Ajouter"
    >
      <SubstituteForm
        :submit="submitNewSubstitute"
        @submit="handleNewSubstitute"
        @invalid="submitNewSubstitute = false"
        :contact="contact"
      />
    </ConfirmModal>
  </div>
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSubstituteStore } from "@/store/useSubstituteModule";
import { useRoute } from "vue-router";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import SubstituteForm from "@/components/forms/SubstituteForm.vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";

export default {
  name: "table-column-example",
  components: {
    dataTable,
    CustomRowOptionsVue,
    ConfirmModal,
    SubstituteForm,
  },

  setup() {
    const { fetchSubstitutes, createManySubstitute, deleteSubstitute } =
      useSubstituteStore();
    const { substituteList, substitutePagination, error } = storeToRefs(
      useSubstituteStore()
    );
    const route = useRoute();
    const id = route.params?.id;
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const contact = computed(() => ({
      id: id,
      substituteds: substituteList.value,
    }));
    const columnDefs = ref([
      {
        field: "lastName",
        colId: "lastName",
        hide: false,

        lockPinned: true,

        headerName: "Nom",
        flex: 1 / 3,
        search: {
          criteria: "[lastName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[lastName]",
        },
      },
      {
        colId: "firstName",
        hide: false,
        lockPinned: true,

        field: "firstName",
        headerName: "Prénom",
        flex: 1 / 3,
        search: {
          criteria: "[firstName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[firstName]",
        },
      },

      {
        colId: "rpps",
        hide: false,
        lockPinned: true,

        field: "rpps",
        headerName: "RPPS",
        flex: 1 / 3,
        search: {
          criteria: "[rpps]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[rpps]",
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
    const showAddSubstituteModal = ref(false);
    const submitNewSubstitute = ref(false);
    const contextMenuList = ref({
      entity: "replacement",
      list: ["edit", "delete"],
    });
    const additionalTableOptions = ["addRow"];

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchSubstitutes(
        {
          skip: 0,
          take: parseInt(event.target.value),
        },
        {
          "where[substituedId]": id,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const currentPageChange = async (val) => {
      await fetchSubstitutes(
        {
          skip: (val - 1) * substitutePagination.value.take,
          take: substitutePagination.value.take,
        },
        {
          "where[substituedId]": id,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };

    const popoverItemAction = async (item) => {
      
      if (item.item === "edit") {
        showAddSubstituteModal.value = true;
      }
      if (item.item === "delete") {
        await deleteSubstitute(item.selectedRow.id);
        if (!error.value) {
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            type: "success",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      }
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchSubstitutes(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[substituedId]": id,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchSubstitutes(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[substituedId]": id,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };

    const handleAddRow = () => {
      showAddSubstituteModal.value = true;
    };

    const handleNewSubstitute = async (payload) => {
      await createManySubstitute(payload, id);

      if (!error.value) {
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          type: "success",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      }
      submitNewSubstitute.value = false;
      showAddSubstituteModal.value = false;
    };

    onMounted(async () => {
      await fetchSubstitutes(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[substituedId]": id,
        }
      );
    });
    return {
      columnDefs,
      defaultColDef,
      substitutePagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      substituteList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      handleAddRow,
      contextMenuList,
      showAddSubstituteModal,
      submitNewSubstitute,
      handleNewSubstitute,
      contact,
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container[data-v-36e791e9] {
  height: calc(100vh - 410px);
}
</style>
