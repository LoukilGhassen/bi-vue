<template>
  <div class="d-flex justify-content-between w-100">
    <div
      class="fw-boldest fs-1 d-flex align-items-center gap-5"
      v-if="currentHeader === 'roleList'"
    >
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      Gestion des rôles
    </div>
    <div
      class="fw-boldest fs-1 d-flex align-items-center gap-5"
      v-if="currentHeader === 'roleDetail'"
    >
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      Rôle : {{ role.roleName }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRoleStore } from "@/store/useRoleModule";
import { storeToRefs } from "pinia";

const { role } = storeToRefs(useRoleStore());
const router = useRouter();
const route = useRoute();
const currentHeader = ref(route.params.id ? "roleDetail" : "roleList");

const handleBackClick = () => {
  if (currentHeader.value === "roleList") {
    router.push({
      name: "admin-list-user",
    });
  } else {
    router.push({
      name: "admin-list-role",
    });
  }
};
watch(route, () => {
  if (route.params.id) {
    currentHeader.value = "roleDetail";
  } else currentHeader.value = "roleList";
});
</script>
<style lang="scss" scoped></style>
