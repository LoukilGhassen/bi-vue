<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="25vh"
      width="65vw"
    >
      <div class="d-flex justify-content-between px-12 py-8 pt-10 noir">
        <div class="fs-1 fw-boldest noir">
          Historique log {{ payload.data?.id?.substring(0, 8) }}
        </div>
        <div class="cursor-pointer" @click="handleCloseModal">
          <inline-svg src="/svg/icons/close.svg"></inline-svg>
        </div>
      </div>
      <div class="table-wrapper d-flex w-100">
        <div
          class="col d-flex flex-column gap-10"
          v-for="col in columnDefs"
          :class="{ mxw: col.headerName !== 'Objet' }"
        >
          <div class="column-header ps-7 pt-7 fw-boldest">
            {{ col.headerName }}
          </div>
          <div class="column-value ps-7 pb-7 poppins">
            {{ col.valueGetter(payload?.data) }}
          </div>
        </div>
      </div>

      <div
        class="d-flex w-100 justify-content-between px-12 mt-10 gap-5 pb-15"
        v-if="payload?.data?.listIdActionTypeObject?.tag === 'Update'"
      >
        <div class="w-50">
          <p class="fw-boldest mb-4">Donnée initiale</p>
          <ContactChangeLog
            :payload="payload?.data?.payload"
            :contactType="
              payload?.data?.listIdEntityTypeObject?.tag?.substring(7)
            "
            type="update"
            isOld
            v-if="
              [
                'ContactPDS',
                'ContactPharmacy',
                'ContactHealthCenter',
                'ContactEntity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <VisitChangeLog
            :payload="payload?.data?.payload"
            type="update"
            isOld
            v-if="
              [
                'PdsVisit',
                'PharmacyVisit',
                'Appointment',
                'FieldActivity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <DelegateChangeLog
            :payload="payload?.data?.payload"
            type="update"
            isOld
            v-if="
              ['ContactConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ProductChangeLog
            :payload="payload?.data?.payload"
            type="update"
            isOld
            v-if="
              ['ProductManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <SampleChangeLog
            :payload="payload?.data?.payload"
            isOld
            type="update"
            v-if="
              ['SampleConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <UserChangeLog
            :payload="payload?.data?.payload"
            isOld
            type="update"
            v-if="
              ['UserParameter'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <StockChangeLog
            :payload="payload?.data?.payload"
            isOld
            type="update"
            v-if="
              ['StockConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ListChangeLog
            :payload="payload?.data?.payload"
            isOld
            type="update"
            v-if="
              [
                'OrientationConfiguration',
                'FieldActivityConfiguration',
                'ReasonConfiguration',
                'VisitConfiguration',
                'ProductCategoryConfiguration',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <RoleChangeLog
            :payload="payload?.data?.payload"
            isOld
            type="update"
            v-if="
              ['RoleManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
        </div>
        <div class="w-50">
          <p class="fw-boldest mb-4">Donnée finale</p>
          <ContactChangeLog
            :payload="payload?.data?.payload"
            :contactType="
              payload?.data?.listIdEntityTypeObject?.tag?.substring(7)
            "
            type="update"
            v-if="
              [
                'ContactPDS',
                'ContactPharmacy',
                'ContactHealthCenter',
                'ContactEntity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <VisitChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              [
                'PdsVisit',
                'PharmacyVisit',
                'Appointment',
                'FieldActivity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <DelegateChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['ContactConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ProductChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['ProductManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <SampleChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['SampleConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <UserChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['UserParameter'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <StockChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['StockConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ListChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              [
                'OrientationConfiguration',
                'FieldActivityConfiguration',
                'ReasonConfiguration',
                'VisitConfiguration',
                'ProductCategoryConfiguration',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <RoleChangeLog
            :payload="payload?.data?.payload"
            type="update"
            v-if="
              ['RoleManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
        </div>
      </div>

      <div
        class="d-flex w-100 justify-content-between px-12 mt-10 gap-5 pb-15"
        v-if="payload?.data?.listIdActionTypeObject?.tag === 'Create'"
      >
        <div class="w-100">
          <p class="fw-boldest mb-4">Données ajoutées</p>
          <ContactChangeLog
            :payload="payload?.data?.payload"
            :contactType="
              payload?.data?.listIdEntityTypeObject?.tag?.substring(7)
            "
            v-if="
              [
                'ContactPDS',
                'ContactPharmacy',
                'ContactHealthCenter',
                'ContactEntity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
            type="create"
          />
          <VisitChangeLog
            :payload="payload?.data?.payload"
            v-if="
              [
                'PdsVisit',
                'PharmacyVisit',
                'Appointment',
                'FieldActivity',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
            type="create"
          />
          <DelegateChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['ContactConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ProductChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['ProductManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <SampleChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['SampleConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <UserChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['UserParameter'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <StockChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['StockConfiguration'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
          <ListChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              [
                'OrientationConfiguration',
                'FieldActivityConfiguration',
                'ReasonConfiguration',
                'VisitConfiguration',
                'ProductCategoryConfiguration',
              ].includes(payload?.data?.listIdEntityTypeObject?.tag)
            "
          />
          <RoleChangeLog
            :payload="payload?.data?.payload"
            type="create"
            v-if="
              ['RoleManagement'].includes(
                payload?.data?.listIdEntityTypeObject?.tag
              )
            "
          />
        </div>
      </div>
      <div
        class="d-flex flex-column align-items-start px-12 mt-10 gap-5 pb-15"
        v-if="payload?.data?.listIdActionTypeObject?.tag === 'Delete'"
      >
        <p class="fw-boldest">Motif</p>
        <p>
          {{
            payload?.data?.payload?.ids?.deletionReasonObject?.captionFr ||
            " - "
          }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import VisitChangeLog from "@/views/main/historique/VisitChangeLog.vue";
import { computed, onMounted, ref } from "vue";
import lodash from "lodash";
import ContactChangeLog from "@/views/main/historique/ContactChangeLog.vue";
import DelegateChangeLog from "@/views/main/historique/DelegateChangeLog.vue";
import ProductChangeLog from "@/views/main/historique/ProductChangeLog.vue";
import SampleChangeLog from "@/views/main/historique/SampleChangeLog.vue";
import UserChangeLog from "@/views/main/historique/UserChangeLog.vue";
import StockChangeLog from "@/views/main/historique/StockChangeLog.vue";
import ListChangeLog from "@/views/main/historique/ListChangeLog.vue";
import RoleChangeLog from "@/views/main/historique/RoleChangeLog.vue";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Object,
    required: false,
  },
});
const defaultColDef = {
  sortable: false,
  filter: false,
  resizable: false,
  suppressMovable: true,
};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("FR-fr", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const objectValueGetter = (params: any) => {
  const actionType = params?.listIdActionTypeObject?.tag;
  const entityType = params?.listIdEntityTypeObject?.captionFr;
  const entityTag = params?.listIdEntityTypeObject?.tag;
  const payload = params?.payload;
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
  if (actionType === "Create") {
    return `${entityType} ${payload?.name}`;
  }
};

const columnDefs = ref([
  {
    field: "date",
    headerName: "Date",
    headerComponentParams: {
      template: "default",
    },
    valueGetter: (params) =>
      params?.ids?.creation
        ? new Date(params?.ids?.creation)?.toLocaleDateString("FR-fr", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "",
    //valueGetter: (p) => p,
    colId: "date",
    hide: false,
    lockPinned: true,
    width: 120,
  },
  {
    field: "time",
    headerName: "Heure",
    headerComponentParams: {
      template: "default",
    },
    colId: "time",
    hide: false,
    lockPinned: true,
    valueGetter: (params) =>
      params.ids?.creation
        ? new Date(params.ids?.creation).toLocaleTimeString("FR-fr", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
  },
  {
    field: "user",
    colId: "user",
    headerName: "Utilisateur",
    headerComponentParams: {
      template: "default",
    },
    hide: false,
    lockPinned: true,

    valueGetter: (params) =>
      params.ids?.creationByObject?.user
        ? params.ids?.creationByObject?.user?.firstName +
          " " +
          params.ids?.creationByObject?.user?.lastName
        : "",
  },
  {
    headerName: "Rôle(s)",
    valueGetter: (params: any) =>
      params.ids?.creationByObject?.user?.userTypes
        ?.map(
          (userType: any) =>
            userType?.role?.roleName?.charAt(0).toUpperCase() +
            userType?.role?.roleName?.slice(1)
        )
        .join(","),
  },
  {
    valueGetter: objectValueGetter,
    headerName: "Objet",
  },

  {
    valueGetter: (params) => params?.listIdActionTypeObject?.captionFr,
    headerName: "Action",
  },
]);
const handleCloseModal = () => {
  setModal("");
};

onMounted(async () => {});
</script>
<style lang="scss" scoped>
.table-wrapper {
  background-color: #f5f5f5;
  overflow-x: auto;
  .mxw {
    max-width: 150px;
  }
}
</style>
