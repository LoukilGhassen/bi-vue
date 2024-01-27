<template>
  <!--begin::User-->
  <div
    class="aside-user d-flex align-items-sm-center justify-content-center py-7 px-6"
  >
    <!--begin::Symbol-->
   <img alt="Logo" src="/svg/logos/logo-small.svg" class="h-30px" />

    <!--end::Symbol-->

    <!--begin::Wrapper-->
    <div class="aside-user-info flex-row-fluid flex-wrap ms-5" v-if="!isClosedAside">
      <!--begin::Section-->
      <div class="d-flex">
     
        <!--begin::User menu-->
        <div class="me-n2">
          <!--begin::Action-->
          <a
            href="#"
            class="btn btn-icon btn-sm btn-active-color-primary mt-n2"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-start"
            data-kt-menu-overflow="true"
          >
            <!-- <span class="svg-icon svg-icon-muted svg-icon-1">
              <inline-svg src="/media/icons/duotune/coding/cod001.svg" />
            </span> -->
          </a>
          <UserMenu />
          <!--end::Action-->
        </div>
        <!--end::User menu-->
      </div>
      <!--end::Section-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::User-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserMenu from "@/components/layouts/mainLayout/header/partials/UserMenu.vue";
import { DfAvatar } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuth";
import { useConfigStore } from "@/store/useConfig";

export default defineComponent({
  name: "kt--aside-toolbar",
  components: {
    UserMenu,
    Avatar: DfAvatar
  },
  setup() {
    const { currentUser } = storeToRefs(useAuthStore());
    const {isClosedAside } = storeToRefs(useConfigStore())
    return {
      currentUser,
      isClosedAside
    };
  },
});
</script>
