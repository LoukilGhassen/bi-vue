<template>
  <span v-if="params.data?.actorPerson?.actor?.actorName">
    {{ params.data?.actorPerson?.actor?.actorName }}
  </span>
  <el-select
    v-else
    remote
    filterable
    class="w-100"
    @change="handleSelectDoctor"
    :remote-method="querySearch"
    v-model="doctorSearch"
    value-key="name"
    clearable
    placeholder="Rechercher un médecin"
  >
    <el-option
      v-for="item in doctorList"
      :key="item.id"
      :label="item.actorName"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { useServiceStore } from "@/store/useServiceModule";
import { useRoute } from "vue-router";
import service from "@/service";

import { storeToRefs } from "pinia";

import { computed, ref } from "vue";

export default {
  components: {},

  props: ["params"],

  setup(props) {
    const route = useRoute();
    const doctorSearch = ref("");
    const doctorList = ref([]);
    const { createServiceAttachedDoctor } = useServiceStore();
    const { error } = storeToRefs(useServiceStore());
    const querySearch = async (queryString) => {
      const { data } = await service.api.actorControllerFindMany({
        skip: 0,
        take: 20,
        "where[actorName][contains]": queryString ? queryString : "",
        "where[actorName][mode]": "insensitive",
        "where[actorCompany]": null,
        "where[actorPerson][listIdActorPersonTypeObject][tag]": "PDS",
        "where[id][not]": route.params.id,
        "where[actorPerson][actorPersonServices][none][service][healthCenterId]":
          route.params.id,
      });
      doctorList.value = data.paginatedResult;
    };
    const handleSelectDoctor = async (selectedDoctor) => {
      await createServiceAttachedDoctor({
        service: {
          id: props.params.data.actorPerson.serviceId,
        },
        actorPerson: {
          id: selectedDoctor,
        },
      });
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 3000,
          customClass: "success-notif",
        });
      }
    };
    return { doctorList, doctorSearch, querySearch, handleSelectDoctor };
  },
};
</script>
<style scoped></style>
