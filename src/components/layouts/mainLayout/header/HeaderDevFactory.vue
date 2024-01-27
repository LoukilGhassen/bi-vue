<template>
  <div id="kt_header" class="header w-100 align-items-center header-shadow">
    <component
      v-if="headerState.type !== ''"
      :is="headerState.type"
      :payload="headerState.payload"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomeHeader from "@/components/headers/HomeHeader.vue";
import ContactListHeader from "@/components/headers/ContactListHeader.vue";
import VisitListHeader from "@/components/headers/VisitListHeader.vue";
import VisitDetailHeader from "@/components/headers/VisitDetailHeader.vue";
import OffFieldActivityHeader from "@/components/headers/OffFieldActivityHeader.vue";
import ContactDetailHeader from "@/components/headers/ContactDetailHeader.vue";
import WidgetStoreHeader from "@/components/headers/WidgetStoreHeader.vue";
import CalendarHeader from "@/components/headers/CalendarHeader.vue";
import UserManagementHeader from "@/components/headers/UserManagementHeader.vue";
import UserDetailHeader from "@/components/headers/UserDetailHeader.vue";
import RoleListHeader from "@/components/headers/RoleListHeader.vue";
import UserProfilHeader from "@/components/headers/UserProfilHeader.vue";
import UgaListHeader from "@/components/headers/UgaListHeader.vue";
import ProductListHeader from "@/components/headers/ProductListHeader.vue";
import CategoryHeader from "@/components/headers/CategoryHeader.vue";
import SampleListHeader from "@/components/headers/SampleListHeader.vue";
import StockListHeader from "@/components/headers/StockListHeader.vue"
import StockDetailHeader from "@/components/headers/StockDetailHeader.vue"
import { headerWidthFluid, asideDisplay } from "@/core/helpers/config";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import ContactConfigurationHeader from "@/components/headers/ContactConfigurationHeader.vue";
import ListsHeader from "@/components/headers/ListsHeader.vue"; 
import HistoriqueHeader from "@/components/headers/HistoriqueHeader.vue"; 


export default defineComponent({
  name: "KTHeader",
  components: {
    HomeHeader,
    WidgetStoreHeader,
    VisitListHeader,
    ContactListHeader,
    ContactDetailHeader,
    VisitDetailHeader,
    CalendarHeader,
    OffFieldActivityHeader,
    UserManagementHeader,
    UserDetailHeader,
    RoleListHeader,
    UserProfilHeader,
    UgaListHeader,
    ProductListHeader,
    CategoryHeader,
    SampleListHeader,
    StockListHeader,
    StockDetailHeader,
    ContactConfigurationHeader,
    ListsHeader,HistoriqueHeader
  },
  setup() {
    const { headerState } = storeToRefs(useConfigStore());
    return {
      headerWidthFluid,
      asideDisplay,
      headerState,
    };
  },
});
</script>
<style lang="scss" scoped>
.header-shadow {
  fill: white;
  filter: drop-shadow(0px 4px 8px rgba(199, 199, 204, 0.28));
  padding: 40px;
}
</style>
