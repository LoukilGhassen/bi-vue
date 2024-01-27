<template>
  <el-collapse v-model="activeNames" v-if="serviceList.length > 0">
    <el-collapse-item
      v-for="(service, index) in serviceList"
      :key="service.id"
      :title="`Service ${service.name}`"
      :name="service.name"
      :class="{ 'odd-header': index % 2 === 0 }"
    >
      <div
        :style="{
          backgroundColor: index % 2 === 0 ? 'rgba(244,244, 246, 1)' : '',
          height: 'fit-content',
        }"
        class="px-3"
      >
        <dataTable
          :data="service.team"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :contextMenuList="contextMenuList"
          @popoverItemAction="popoverItemAction"
          @onValidateFiltre="validateFiltre($event, service)"
          @inputChange="handleSearch($event, service)"
          :additionalTableOptions="
            showAddBtns[service.id] ? ['addRow'] : ['addRow', 'addRowDisabled']
          "
          :withFooter="false"
          :customBg="index % 2 === 0"
          @addRow="handleAddRow(service)"
          entity="médecins"
          :isService="true"
          :webElementAddress="service.id"
              @rowClick="rowClicked"
        />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptions from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useRoute } from "vue-router";
import { useServiceStore } from "@/store/useServiceModule";
import { useActorPersonStore } from "@/store/useActorPersonModule";
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ServiceAttachedDoctorSelectCell from "@/components/shared/ag-grid-table/ServiceAttachedDoctorSelectCell.vue";
import { useRouter } from "vue-router";
import { useActorStore } from "@/store/useActorModule";
import { setModal } from "@/core/helpers/config";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import service from "@/service";

export default {
  components: {
    dataTable,
    CustomRowOptions,
  },

  setup() {
    const router = useRouter();
    const { setActiveActorDetailTabName } = useActorStore();
    const serchCriteria = ref();
    const filtersCriteria = ref();

    const {
      serviceList,
      servicePagination,
      showAddBtns,
      activeCollapseService,
    } = storeToRefs(useServiceStore());
    const {
      addAttachedMed,
      deleteAttachedDoctor,
      setServiceTeam,
      setActiveCollapseService,
      deleteEmptyTeamMemberRowe,
    } = useServiceStore();
    const route = useRoute();
    const actorType = ref(route.params.type);
    const activeNames = ref(activeCollapseService);
    const { fetchServices } = useServiceStore();

    const columnDefs = ref([
      {
        colId: "name",
        hide: false,
        field: "actorPerson.actor.actorName",
        lockPinned: true,
        suppressMovable: true,
        headerComponentParams: {
          unhidable: true,
          unmovable: true,
        },
        lockPosition: "left",
        pinned: true,

        headerName: "Nom",
        cellRenderer: ServiceAttachedDoctorSelectCell,
        search: {
          criteria: "[actorPerson][actor][actorName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorPerson][actor][actorName]",
        },
      },
      {
        colId: "firstName",
        hide: false,
        lockPinned: true,
        field: "actorPerson.firstName",
        headerName: "Prénom",
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
          field: "[actorPerson][firstName]",
        },
      },
      {
        colId: "speciality",
        hide: false,
        lockPinned: true,
        field:
          "actorPerson.actor.listIdActorPersonSpecializationObject.captionFr",
        headerName: "Spécialité",
        search: {
          criteria:
            "[actorPerson][actor][listIdActorPersonSpecializationObject][captionFr]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field:
            "[actorPerson][actor][listIdActorPersonSpecializationObject][captionFr]",
        },
      },
      {
        colId: "lastVisitDate",
        hide: false,
        lockPinned: true,

        field: "actorPerson.actor.actorView.lastVisitDate",
        headerName: "Dernière visite",
        valueGetter: (params) =>
          params.data?.actorPerson?.actor?.actorView?.lastVisitDate
            ? new Date(
                params.data?.actorPerson?.actor?.actorView?.lastVisitDate
              ).toLocaleDateString("FR-fr", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "",

        filter: {
          type: "date",
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorPerson][actor][actorView][lastVisitDate]",
        },
      },
      {
        colId: "rpps",
        hide: false,
        lockPinned: true,

        field: "actorPerson.rpps",
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
          field: "[actorPerson][rpps]",
        },
      },
      {
        colId: "serviceName",
        hide: false,
        lockPinned: true,

        field: "actorPerson.service.name",
        headerName: "Service",
        /*         search: {
          criteria: "[actorPerson][service][name]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][equals]" },
          ],
          field: "[actorPerson][service][name]",
        }, */
      },
      {
        colId: "actorEmail",
        hide: false,
        lockPinned: true,

        field: "actorPerson.actor.email",
        headerName: "E-mail",
        search: {
          criteria: "[actorPerson][actor][email]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[actorPerson][actor][email]",
        },
      },
      {
        colId: "importance",
        hide: false,
        lockPinned: true,

        field: "actorPerson.actor.importance",
        headerName: "Importance",
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[actorPerson][actor][importance]",
          type: "number",
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
      entity: "attachedDoctorService",
      list: ["edit", "sendMsg", "delete", "addVisit"],
    });

    //pagination
    // const setItemsPerPage = async (event) => {
    //   await fetchServices(route.params.id, {
    //     skip: 0,
    //     take: parseInt(event.target.value),
    //   });
    // };

    // const currentPageChange = async (val) => {
    //   await fetchServices(route.params.id, {
    //     skip: (val - 1) * servicePagination.value.take,
    //     take: servicePagination.value.take,
    //   });
    // };
     const rowClicked =(val)=>{
      router.push({
          name: "admin-detail-contact",
          params: { type: "pds", id: val.actorPerson.id },
        });
        setActiveActorDetailTabName("Informations");
     }

    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        if (!item.selectedRow.id) {
          const service = serviceList.value.find((service)=> service.id === item.selectedRow.actorPerson.serviceId)
          deleteEmptyTeamMemberRowe(service);
        } else {
          await deleteAttachedDoctor(item.selectedRow.id);
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      }
      if (item.item === "sendMsg") {
        setModal("SendEmailModal", {
          title: "Envoyer un e-mail au contact",
          type: "actor",
          toEmail: item.selectedRow?.actorPerson?.actor?.email,
        });
      }
      // toFix
      if (item.item === "edit") {
        router.push({
          name: "admin-detail-contact",
          params: { type: "pds", id: item.selectedRow.actorPerson.id },
        });
        setActiveActorDetailTabName("Informations");
      }
      if (item.item === "addVisit") {
        setModal("VisitCreate", { actor: item.selectedRow.actorPerson.id });
      }
    };
    const validateFiltre = async (val, serviceData) => {
      filtersCriteria.value = val;
      const resp = await service.api.actorPersonServiceControllerFindMany({
        "where[service][id]": serviceData.id,
        ...filtersCriteria.value,
        ...serchCriteria.value,
      });
      setServiceTeam(resp.data?.paginatedResult, serviceData.id);
    };
    const handleSearch = async (val, serviceData) => {
      serchCriteria.value = val;
      const resp = await service.api.actorPersonServiceControllerFindMany({
        "where[service][id]": serviceData.id,
        ...filtersCriteria.value,
        ...serchCriteria.value,
      });
      setServiceTeam(resp.data?.paginatedResult, serviceData.id);
    };
    const handleAddRow = async (service) => {
      addAttachedMed(service);
    };
    onMounted(async () => {
      if (actorType.value === "healthCenter") {
        await fetchServices(route.params.id, {
          skip: 0,
          take: servicePagination.value.take,
        });
      }
    });
    onUnmounted(() => {
      setActiveCollapseService("");
    });
    return {
      columnDefs,
      defaultColDef,
      servicePagination,
      // setItemsPerPage,
      // currentPageChange,
      validateFiltre,
      contextMenuList,
      handleSearch,
      additionalTableOptions,
      popoverItemAction,
      serviceList,
      activeNames,
      handleAddRow,
      showAddBtns,
      rowClicked
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-collapse-item.odd-header .el-collapse-item__header) {
  font-weight: $font-weight-boldest;
  --el-collapse-border-color: rgba(244, 244, 246, 1) !important;
  --el-collapse-header-bg-color: rgba(244, 244, 246, 1) !important;
}
:deep(.el-collapse-item__header) {
  padding-left: 15px !important;
  font-weight: $font-weight-boldest;
  font-size: 14px;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0px;
}
.odd-header {
  :deep(.el-input__inner) {
    background-color: rgba(244, 244, 246, 1) !important;
  }
}
.dataTable_container {
  height: fit-content !important;
  max-height: 560px !important;
}
:deep(.ag-theme-alpine) {
  max-height: 450px !important;
}
:deep(.container-fluid) {
  padding: 0px !important;
}
:deep(.customPopper) {
  z-index: 1 !important;
}
</style>
