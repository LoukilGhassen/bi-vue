<template>
  <!--begin::Action group-->
  <div class="d-flex align-items-stretch overflow-auto pt-3 pt-lg-0">
    <!--begin::Action wrapper-->
    <div class="d-flex align-items-center">
      <!--begin::Label-->
      <span
        class="fs-7 fw-bold text-gray-700 pe-4 text-nowrap d-none d-xxl-block"
        >Sort By:</span
      >
      <!--end::Label-->

      <!--begin::Select-->
      <select
        class="form-select form-select-sm form-select-solid w-100px w-xxl-125px"
      >
        <option value="1" selected>Latest</option>
        <option value="2">In Progress</option>
        <option value="3">Done</option>
      </select>
      <!--end::Select-->
    </div>
    <!--end::Action wrapper-->

    <!--begin::Action wrapper-->
    <div class="d-flex align-items-center">
      <!--begin::Separartor-->
      <div class="bullet bg-secondary h-35px w-1px mx-5"></div>
      <!--end::Separartor-->

      <!--begin::Label-->
      <span class="fs-7 text-gray-700 fw-bold d-none d-sm-block"
        >Impact <span class="d-none d-xxl-inline">Level</span>:</span
      >
      <!--end::Label-->

      <!--begin::Separartor-->
      <div class="bullet bg-secondary h-35px w-1px mx-5"></div>
      <!--end::Separartor-->
    </div>
    <!--end::Action wrapper-->

    <!--begin::Action wrapper-->
    <div class="d-flex align-items-center">
      <!--begin::Label-->
      <span class="fs-7 text-gray-700 fw-bold pe-3 d-none d-xxl-block"
        >Quick Tools:</span
      >
      <!--end::Label-->

      <!--begin::Actions-->
      <div class="d-flex">
        <!--begin::Action-->
        <a
          href="#"
          class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_invite_friends"
        >
          <!-- <span class="svg-icon svg-icon-1">
            <inline-svg src="media/icons/duotune/files/fil003.svg" />
          </span> -->
        </a>
        <!--end::Action-->

        <!--begin::Notifications-->
        <div class="d-flex align-items-center">
          <!--begin::Menu- wrapper-->
          <router-link
            to="/apps/subscriptions/add-subscription"
            class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
          >
            <!-- <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/files/fil005.svg" />
            </span> -->
          </router-link>
          <!--end::Menu wrapper-->
        </div>
        <!--end::Notifications-->

        <!--begin::Quick links-->
        <div class="d-flex align-items-center">
          <!--begin::Menu wrapper-->
          <a
            href="#"
            class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_create_app"
          >
            <!-- <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/files/fil010.svg" />
            </span> -->
          </a>
          <!--end::Menu wrapper-->
        </div>
        <!--end::Quick links-->
      </div>
      <div class="lang d-flex gap-2 align-items-center d-none">
        <select
          class="form-select form-select-sm form-select-solid"
          v-model="lang"
          @change="setLang(lang)"
        >
          <option value="fr" selected>FR</option>
          <option value="en">EN</option>
        </select>
        <span class="symbol symbol-20px">
          <img
            class="rounded-1"
            :src="`/svg/flags/${iconLang}.svg`"
            alt="metronic"
          />
        </span>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Action wrapper-->

    <!--begin::Theme mode-->
    <div class="d-flex align-items-center">
      <!--begin::Menu toggle-->

      <a
        href="#"
        class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <!-- <span class="svg-icon theme-light-show svg-icon-2">
          <inline-svg src="media/icons/duotune/general/gen060.svg" />
        </span>
        <span class="svg-icon theme-dark-show svg-icon-2">
          <inline-svg src="media/icons/duotune/general/gen061.svg" />
        </span> -->
      </a>
      <!--begin::Menu toggle-->
    </div>
    <!--end::Theme mode-->
  </div>
  <!--end::Action group-->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";


export default defineComponent({
  name: "layout-topbar",
  components: {},
  setup() {
    const i18n = useI18n();
    const lang = ref(localStorage.getItem("lang") || "fr");
    const iconLang = computed(() =>
      lang.value === "en" ?  "united-states": "france"
    );

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang.toLocaleLowerCase());
      i18n.locale.value = lang.toLocaleLowerCase();   
    };
    return { lang, iconLang, setLang };
  },
});
</script>
