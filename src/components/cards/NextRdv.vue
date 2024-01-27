<template>
  <div class="next-rdv__container w-100 h-100">
    <CardHeader
      :title="t('nextRdv.nextRdv') || ''"
      icon="/svg/icons/rdv.svg"
      :widget="props.payload"
    />
    <div class="p-5 pt-0" v-if="!props.payload?.reduced" >
      <div class="d-flex gap-5 pb-8">
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
          <div>Client A</div>
          <div class="violet-fonce fs-7">
            {{ t("nextRdv.lastVisit") }} XX/XX/XX
          </div>
          <div class="gris-fonce fs-7">
            <div>{{ t("nextRdv.importance") }} : 1</div>
            <div>X {{ t("nextRdv.nbVisit") }}</div>
            <div>X {{ t("nextRdv.productVGA") }}</div>
          </div>
        </div>
      </div>
      <div class="pb-5">
        <div class="fw-boldest fs-3 pb-2">06/01/2023 à 10h</div>
        <div class="poppins">31 rue des fleurs 13456</div>
        <div class="poppins">Toulouse Matabiau</div>
      </div>
      <div class="poppins pb-6">
        <div class="fw-boldest pb-2">{{ t("nextRdv.visitType") }}</div>
        <div>Lorem ipsum</div>
      </div>
      <div class="poppins pb-7">
        <div class="fw-boldest pb-2">{{ t("nextRdv.reason") }}</div>
        <div>adipiscing elit.</div>
      </div>
      <div class="poppins pb-6">
        <div class="fw-boldest pb-2">{{ t("nextRdv.objectif") }}</div>
        <div>Lorem ipsum dolor sit amet,</div>
        <div>consectetur adipiscing elit.</div>
      </div>
      <div class="w-100 d-flex justify-content-center mb-4">
        <el-button size="large" type="primary" class="fw-boldest ms-0">{{
          t("nextRdv.accessVisit")
        }}</el-button>
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
import { onMounted } from "vue";
const props = defineProps({
  payload:{
    required: false,
  }
})

</script>
<style lang="scss" scoped>
.next-rdv__ {
  &container {
    overflow-y:scroll;
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  }
}
</style>