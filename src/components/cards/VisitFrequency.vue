<template>
  <div class="visitFrequency__container w-100 h-100">
    <CardHeader
      :title="t('visitFrequency.title') || ''"
      icon="/svg/icons/adress.svg"
      :widget="props.payload"
    />
    <div class="p-5 pt-0 d-flex gap-5" v-if="!props.payload?.reduced">
      <div class="me-9">
        <div class="poppins pb-3 gris-fonce">
          {{ t("visitFrequency.expect") }}
        </div>
        <div
          class="d-flex gap-5 pb-6"
          v-for="item in ['A', 'B', 'C', 'D']"
          :key="item"
        >
          <!--begin::Avatar-->
          <div class="symbol symbol-56px">
            <avatar
              shape="circle"
              :first-name="currentUser?.user_metadata.firstName ?? 'John'"
              :last-name="currentUser?.user_metadata.lastName ?? 'Doe'"
              :size="36"
              background-color="#FFC200"
              text-color="#363636"
              src=""
            />
          </div>
          <!--end::Avatar-->
          <div class="poppins">
            <div>Client {{ item }}</div>
            <div class="violet-fonce fs-7">
              {{ t("visitFrequency.lastVisit") }} XX/XX/XX
            </div>
            <div class="gris-fonce fs-7">
              <div>X {{ t("visitFrequency.monthVisit") }}</div>
              <div>X {{ t("visitFrequency.yearVisit") }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider ms-9"></div>

      <div>
        <div class="poppins pb-3 gris-fonce">
          {{ t("visitFrequency.avoid") }}
        </div>
        <div
          class="d-flex gap-5 pb-6"
          v-for="item in ['E', 'F', 'G']"
          :key="item"
        >
          <!--begin::Avatar-->
          <div class="symbol symbol-56px">
            <avatar
              shape="circle"
              :first-name="currentUser?.user_metadata.firstName ?? 'John'"
              :last-name="currentUser?.user_metadata.lastName ?? 'Doe'"
              :size="36"
              background-color="#FFC200"
              text-color="#363636"
              src=""
            />
          </div>
          <!--end::Avatar-->
          <div class="poppins">
            <div>Client {{ item }}</div>
            <div class="violet-fonce fs-7">
              {{ t("visitFrequency.lastVisit") }} XX/XX/XX
            </div>
            <div class="gris-fonce fs-7">
              <div>X {{ t("visitFrequency.monthVisit") }}</div>
              <div>X {{ t("visitFrequency.yearVisit") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script setup lang="ts">
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";
const { currentUser } = storeToRefs(useAuthStore());
import { DfAvatar as Avatar } from "@tekab-dev-team/storybook-devfactory";
import CardHeader from "@/components/cards/CardHeader.vue";
import { t } from "@/core/i18n/translate";
const props = defineProps({
  payload:{
    required: false,
  }
})

</script>
  <style lang="scss" scoped>
.visitFrequency__ {
  &container {
    overflow-y:scroll;
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  }
}
.divider {
  border: 1px solid $gris-clair;
}
</style>