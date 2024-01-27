<template>
  <div
    class="d-flex justify-content-between w-100"
    v-if="payload.headerType === 'wholeSalerDetail'"
  >
    <div class="fw-boldest fs-1">
      <span class="cursor-pointer me-5" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" /> </span
      >{{ list.captionFr }}
    </div>
    <div class="d-flex gap-5">
      <el-switch v-model="status" @change="editStatus" @click.stop="" />
    </div>
  </div>
  <div class="d-flex justify-content-between w-100" v-else>
    <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
      <span class="cursor-pointer" @click="goBack">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      {{ headerTitle() }}</div>
    <div class="d-flex gap-5" v-if="payload?.listType !== 'VisitObjectives'">
      <el-button
        size="large"
        type="primary"
        class="fw-boldest poppins"
        @click="handleAdd"
      >
        <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
        {{ btnTitle() }}
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import { useRoute, useRouter } from "vue-router";
import { useListStore } from "@/store/useListModule";
import { storeToRefs } from "pinia";
import service from "@/service";
import { ref, watch } from "vue";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  payload: {
    type: Object,
    required: false,
  },
});
const { list } = storeToRefs(useListStore());

const status = ref(list?.value?.ids?.actif);
//const status = ref(true);

const editStatus = async (val) => {
  await service.api.idsControllerUpdate(route.params.id, { actif: val });
};
watch(
  () => list?.value?.ids?.actif,
  (val) => {
    status.value = val;
  }
);

const btnTitle = () => {
  switch (props.payload?.listType) {
    case "ActorPersoOrientation":
      return "Ajouter une orientation";

    case "ProductWholesaler":
      return "Ajouter un grossiste";

    case "ActorPersonQuality":
      return "Ajouter une qualité";

    case "ActorPersonSpecialization":
      return "Ajouter une spécialité";

    case "ActorCompanyObject":
      return "Ajouter un objet social";
    case "OffFieldTypes":
      return "Ajouter une activité hors terrain";
    case "DeleteReason":
      return "Ajouter un motif";
    case "VisitType":
      return "Ajouter un type";
    case "VisitReasons":
      return "Ajouter un motif";
    default:
      return "Ajouter une orientation";
  }
};

const headerTitle = () => {
  switch (props.payload?.listType) {
    case "OffFieldTypes":
      return "Configuration des activités hors terrain";
    case "DeleteReason":
      return "Configuration des motifs";
    case "VisitType":
      return "Configuration des visites";
    case "VisitReasons":
      return "Configuration des visites";
    case "VisitObjectives":
      return "Configuration des visites";

    default:
      return "Configuration des contacts";
  }
};
const handleBackClick = () => {
  router.push({
    name: "admin-lists-contactsConfig",
  });
};
const handleAdd = () => {
  setModal("ListsFormModal", { listType: props.payload?.listType });
};
const goBack = () => {
  router.back();
};
</script>
<style lang="scss" scoped></style>
