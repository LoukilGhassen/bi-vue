<template>
  <component
    :is="modalState.type"
    v-if="modalState.type !== ''"
    :payload="modalState.payload"
    :show-modal="modalState.type !== ''"
    @close-modal="setModal('')"
  />
</template>

<script lang="ts">
import { setModal } from "@/core/helpers/config";

import { defineComponent } from "vue";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
// Modals
import VisitCreate from "@/views/main/visites/VisitCreate.vue";
import ActorPersonCreate from "@/views/main/actorPerson/ActorPersonCreate.vue";
import SendEmailModal from "@/components/modals/SendEmailModal.vue";
import ImportDocumentModal from "@/components/modals/ImportDocumentModal.vue";
import DeleteContactModal from "@/components/modals/DeleteContactModal.vue";
import ActorCompanyTypesCreate from "@/views/main/actorCompany/ActorCompanyTypesCreate.vue";
import CalendarEventAdd from "@/components/modals/calendar/CalendarEventAdd.vue";
import CalendarEventEdit from "@/components/modals/calendar/CalendarEventEdit.vue";
import InfoCalendarCard from "@/components/calendar/InfoCalendarCard.vue";
import OffFieldActivityFormModal from "@/views/main/offFieldActivity/OffFieldActivityFormModal.vue";
import AttachContact from "@/components/calendar/AttachContact.vue"
import ServiceCreate from "@/views/main/service/ServiceCreate.vue"
import UserCreate from "@/views/main/user/UserCreate.vue"
import VisitUpdate from "@/views/main/visites/VisitUpdate.vue";
import DeleteUserModal from "@/components/modals/DeleteUserModal.vue";
import DisableContactModal from "@/components/modals/DisableContactModal.vue";
import UpdateUserRole from "@/components/modals/UpdateUserRole.vue"
import UgaFormModal from "@/views/main/list/UgaFormModal.vue"
import ActorProductModal from "@/views/main/actorProduct/ActorProductModal.vue"
import CategoryModal from "@/views/main/categories/CategoryModal.vue"
import ActorSampleModal from "@/views/main/actorSample/ActorSampleModal.vue"
import PharmaceuticalDelegateModal from "@/components/modals/PharmaceuticalDelegateModal.vue";
import DeleteMemberModal from "@/components/modals/DeleteMemberModal.vue";
import HistoriqueDetailModal from "@/views/main/historique/HistoriqueDetailModal.vue";
import ListsFormModal from "@/views/main/list/ListsFormModal.vue";
export default defineComponent({
  components: {
    VisitCreate,
    ActorPersonCreate,
    SendEmailModal,
    ImportDocumentModal,
    DeleteContactModal,
    ActorCompanyTypesCreate,
    CalendarEventAdd,
    CalendarEventEdit,
    InfoCalendarCard,
    OffFieldActivityFormModal,
    AttachContact,
    ServiceCreate,
    UserCreate,
    VisitUpdate,
    DeleteUserModal,
    DisableContactModal,
    UpdateUserRole,
    UgaFormModal,
    ActorProductModal,
    CategoryModal,
    ActorSampleModal,
    PharmaceuticalDelegateModal,
    DeleteMemberModal,
    ListsFormModal,
    HistoriqueDetailModal
  },
  setup() {
    const { modalState } = storeToRefs(useConfigStore());
    return { modalState, setModal };
  },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active,
.fade-enter-to {
  opacity: 1;
}
</style>
