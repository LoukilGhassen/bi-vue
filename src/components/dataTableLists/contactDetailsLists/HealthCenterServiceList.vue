<template>
  <div>
    <dataTable
      :data="serviceList"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :contextMenuList="contextMenuList"
      :pagination="servicePagination"
      @addRow="handleAddRow"
      @popoverItemAction="popoverItemAction"
      @onValidateFiltre="validateFiltre"
      @inputChange="handleSearch"
      webElementAddress="serviceList"
      @setItemsPerPage="setItemsPerPage"
      @currentPageChange="currentPageChange"
      :additionalTableOptions="additionalTableOptions"
      entity="services"
    />
    <ConfirmModal
      title="Ajouter un service"
      :isOpenModal="createNewService"
      @close-confirm-modal="handleServiceClose"
      @approve-confirm-modal="handleNewService"
      :beforeClose="handleServiceClose"
      confirmTitle="Ajouter"
    >
      <div class="p-9 form">
        <ServiceForm
          title="Service 1"
          @update="handleServiceUpdate"
          :index="0"
          ref="serviceRef"
          :serviceTeamIds="servicesTeamIds"
        />
      </div>
    </ConfirmModal>
    <ConfirmModal
      title="Modifier un service"
      :isOpenModal="showUpdateService"
      @close-confirm-modal="handleServiceClose"
      @approve-confirm-modal="handleUpdateService"
      :beforeClose="handleServiceClose"
      confirmTitle="Modifier"
    >
      <div class="p-9 form" style="background-color: rgba(244, 244, 246, 1)">
        <ServiceForm
          title="Service 1"
          @update="handleUpdateServiceChange"
          :index="0"
          :data="updateService"
          ref="updateServiceRef"
          :serviceTeamIds="servicesTeamIds"
        />
      </div>
    </ConfirmModal>
  </div>
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useRoute } from "vue-router";
import { useServiceStore } from "@/store/useServiceModule";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ServiceForm from "@/components/forms/ServiceForm.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { useActorStore } from "@/store/useActorModule";

export default {
  components: {
    dataTable,
    CustomRowOptions,
    ServiceForm,
    ConfirmModal,
  },

  setup() {
    const { serviceList, servicePagination, error } = storeToRefs(
      useServiceStore()
    );
    const {
      fetchServices,
      createService,
      deleteService,
      editService,
      duplicateService,
      setActiveCollapseService
    } = useServiceStore();
    const { setActiveActorDetailTabName,updateServicesCount } = useActorStore();
    const route = useRoute();
    const serviceRef = ref(null);
    const updateServiceRef = ref(null);
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const actorType = ref(route.params.type);
    const createNewService = ref(false);
    const showNewService = () => {
      createNewService.value = true;
    };
    const handleServiceClose = () => {
      createNewService.value = false;
      showUpdateService.value = false;
    };
    const handleNewService = async () => {
      const validation = await serviceRef.value.validate();
      const duplicated = serviceList.value.find(
        (service) =>
          service.name.toUpperCase() === newService.value.name.toUpperCase()
      );
      if (duplicated) {
        Components.ElMessage.error("Les noms de services doivent être uniques");
        return false;
      }
      if (validation) {
        await createService({
          data: { ...newService.value, healthCenter: { id: route.params.id } },
        });
                updateServicesCount(1)

        createNewService.value = false;
        if (!!error.value) {
          Components.ElMessage.error(error.value?.message);
          console.log(error, "error");
        } else {
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 3000,
            customClass: "success-notif",
          });
        }
      }
    };
    const handleUpdateServiceChange = (service) => {
      updateService.value = service;
    };
    const handleServiceUpdate = (service) => {
      newService.value = service;
    };
    const newService = ref({});

    const columnDefs = ref([
      {
        colId: "service",
        hide: false,
        lockPinned: true,

        field: "name",
        headerName: "Services",
        flex: 1 / 5,
        search: {
          criteria: "[name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[name]",
        },
      },
      {
        colId: "telephone",
        hide: false,
        lockPinned: true,

        field: "telephone",
        headerName: "Téléphone",
        flex: 1 / 5,
        search: {
          criteria: "[telephone]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[telephone]",
        },
      },
      {
        colId: "email",
        hide: false,
        lockPinned: true,

        field: "email",
        headerName: "E-mail",
        flex: 1 / 5,
        search: {
          criteria: "[email]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[email]",
        },
      },
      {
        colId: "fax",
        hide: false,
        lockPinned: true,

        field: "fax",
        headerName: "Fax",
        flex: 1 / 5,
        search: {
          criteria: "[fax]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[fax]",
        },
      },
      {
        colId: "headOfDepartment",
        hide: false,
        field: "headOfDepartment",
        headerName: "Chef de service",
        flex: 1 / 5,
        lockPinned: true,
        search: {
          criteria: "[headOfDepartment]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[headOfDepartment]",
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
    const additionalTableOptions = ["addRow"];
    const contextMenuList = ref({
      entity: "service",
      list: ["edit", "duplicate", "delete", "viewTeam"],
    });

    //pagination
    const setItemsPerPage = async (event) => {
      await fetchServices(
        route.params.id,
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
      await fetchServices(
        route.params.id,
        {
          skip: (val - 1) * servicePagination.value.take,
          take: servicePagination.value.take,
        },
        {
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const showUpdateService = ref(false);
    const updateService = ref();
    const handleUpdateService = async () => {
      const duplicated = serviceList.value.find(
        (service) =>
          service.name.toUpperCase() ===
            updateService.value.name.toUpperCase() &&
          service.id !== updateService.value.id
      );
      if (duplicated) {
        Components.ElMessage.error("Les noms de services doivent être uniques");
        return false;
      }

      const validation = await updateServiceRef.value.validate();
      if (validation) {
        await editService({
          id: updateService.value.id,
          data: updateService.value,
        });
        showUpdateService.value = false;
        if (!!error.value) {
          Components.ElMessage.error(error.value?.message);
          console.log(error, "error");
        } else {
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 3000,
            customClass: "success-notif",
          });
        }
      }
    };

    const popoverItemAction = async (item) => {
      
      if (item.item === "delete") {
        await deleteService(item.selectedRow.id);
        updateServicesCount(-1)
      }
      if (item.item === "edit") {
        updateService.value = {
          ...item.selectedRow,
          team: item.selectedRow.team.map((item) => item.actorPerson),
        };
        showUpdateService.value = true;
      }
      if (item.item === "duplicate") {
        const duplicated = serviceList.value.find((service) => {
          return (
            service.name.toUpperCase() ===
              item.selectedRow.name.toUpperCase() + " DUPLIQUÉ" &&
            service.id !== item.selectedRow.id
          );
        });
        if (duplicated) {
          Components.ElMessage.error(
            "Les noms de services doivent être uniques"
          );
          return false;
        }

        await duplicateService(item.selectedRow.id);
        if (!!error.value) {
          Components.ElMessage.error(error.value?.message);
          console.log(error, "error");
        } else {
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 3000,
            customClass: "success-notif",
          });
        }
      }
      if (item.item === "viewTeam") { 
        setActiveCollapseService(item.selectedRow.name)
        setActiveActorDetailTabName("healthCenterserviceDoctors");
      }
    };
    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchServices(
        route.params.id,
        {
          skip: 0,
          take: servicePagination.value.take,
        },
        {
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchServices(
        route.params.id,
        {
          skip: 0,
          take: servicePagination.value.take,
        },
        {
          ...filtersCriteria.value,
          ...serchCriteria.value,
        }
      );
    };
    const handleAddRow = () => {
      createNewService.value = true;
    };
    onMounted(async () => {
      if (actorType.value === "healthCenter") {
        await fetchServices(route.params.id, {
          skip: 0,
          take: servicePagination.value.take,
        });
      }
    });
    const servicesTeamIds = computed(() =>
      serviceList.value.flatMap((service) =>
        service.team.map((item) => item.actorPerson.id)
      )
    );
    return {
      columnDefs,
      defaultColDef,
      servicePagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      serviceList,
      handleAddRow,
      handleServiceClose,
      showNewService,
      createNewService,
      handleNewService,
      serviceRef,
      handleServiceUpdate,
      handleServiceClose,
      handleUpdateService,
      showUpdateService,
      updateService,
      handleUpdateServiceChange,
      updateServiceRef,
      servicesTeamIds,
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container{
    height: calc(100vh - 410px);
}</style>
