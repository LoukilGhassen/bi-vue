<template>
  <!--begin::Aside-->
  <div
    id="kt_aside"
    class="aside"
    data-kt-drawer="true"
    data-kt-drawer-name="aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="start"
    data-kt-drawer-toggle="#kt_aside_mobile_toggle"
    :data-aside-is-minimzed="isClosedAside ? 'on' : 'off'"
    style="padding-bottom: 10px;"
    v-clickOutside="handleCloseAside"
  >
    <!--begin::Aside Toolbarl-->
    <div class="aside-toolbar flex-column-auto" id="kt_aside_toolbar">
      <!--begin::Aside user-->
      <AsideToolbar :isClosedAside="isClosedAside" />
      <!--end::Aside user-->
    </div>
    <!--end::Aside Toolbarl-->
    <div @click.stop="handleAside" class="aside-toggle btn btn-icon">
      <div class="toggle-icon d-flex justify-content-center align-items-center">
          <inline-svg src="/svg/icons/arr064.svg" v-if="isClosedAside" />
          <inline-svg v-else src="/svg/icons/arr063.svg" />
      </div>
    </div>
    <!--begin::Aside menu-->
    <div
      class="aside-menu flex-column-fluid mt-2 hover-scroll-overlay-y scroll-aside"
      :data-aside-is-minimzed="isClosedAside ? 'on' : 'off'"
    >
      <KTMenu :isContracted="isClosedAside" />
    </div>
    <!--end::Aside menu-->
  </div>
  <!--end::Aside-->
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import KTMenu from "@/components/layouts/mainLayout/aside/Menu.vue";
import AsideToolbar from "@/components/layouts/mainLayout/aside/AsideToolbar.vue";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
    AsideToolbar,
  },
  props: {
    lightLogo: String,
  },
  setup(props) {
    const { t } = useI18n();
    const { isClosedAside } = storeToRefs(useConfigStore());
    const {setIsClosedAside} = useConfigStore()
    const handleCloseAside = () => {
      setIsClosedAside(true)
    }
    const handleAside = () => {
      setIsClosedAside(!isClosedAside.value);
    }

    return {
      t,
      isClosedAside,
      handleCloseAside,
      handleAside
    };
  },
});
</script>
<style lang="scss" scoped>
.isContracted {
  width: 100px !important;
}
.scroll-aside {
  flex:1; 
  margin-bottom:5px;
}
.aside-toggle {
  position: absolute;
  top: 70px;
  right: -20px;
  .toggle-icon {
    box-shadow: 1px 1px 21px 5px rgba(0, 0, 0, 0.37);
    -webkit-box-shadow: 2px 2px 21px 5px rgba(0, 0, 0, 0.37);
    -moz-box-shadow: 2px 2px 21px 5px rgba(0, 0, 0, 0.37);
    background:white;
    width:24px;
    height:24px;
    border-radius:50%;

  }
}
</style>