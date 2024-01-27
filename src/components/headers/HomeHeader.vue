

<template>
  <div class="w-100 d-flex justify-content-between align-items-center">
    <div class="fw-boldest fs-1">Bonjour {{ userName }} 👋</div>
    <div class="d-flex gap-5 align-items-center">
      <el-button size="large"  class="fw-boldest poppins px-5 py-7 m-0" @click="handleWidgetClick">
        <inline-svg  src="/svg/icons/widgets.svg"></inline-svg>
      </el-button>
      <Dropdown
        :items="dropDownItems"
        @handleCommandAction="handleCommand"
        placement="bottom-end"
      >
        <template v-slot:trigger>
          <el-button size="large" type="primary" class="fw-boldest poppins py-7 m-0" >
        <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
        Ajouter 
      </el-button>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Dropdown from "@/components/shared/Dropdown.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuth";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";

const router = useRouter();
const handleWidgetClick = () => {
  router.push({ name: "widgets" });
};
const { currentUser } = storeToRefs(useAuthStore());
const dropDownItems = [
  "rdv",
  "visit",
  "contact",
  "administratifEvent",
  "otherEvent",
];
const handleCommand = (command:string) => {
  switch(command){
    case "visit":
      setModal("VisitCreate")
      break;
    case "contact":
      break;
    
  }
};
const userName = computed(() => {
  return (
    currentUser.value?.user_metadata?.firstName?.charAt(0).toUpperCase() +
    currentUser.value?.user_metadata?.firstName?.slice(1)
  );
});
</script>
<style lang="scss" scoped>
.widget-icon {
  border-radius: 6px;
  border: 1px solid $gris-clair;
  padding: 15px;
}
.home-header__ {
  &add-btn {
    padding: 15px 20px;
    background-color: $violet-hover;
    color: $white;
    border-radius: 10px;
  }
}
</style>