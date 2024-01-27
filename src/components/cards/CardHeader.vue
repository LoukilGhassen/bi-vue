<template>
  <div class="pb-5">
    <div class="d-flex justify-content-between py-3 px-5">
      <div class="d-flex justify-content-center align-items-center">
        <span class="pe-3 d-flex align-items-center">
          <inline-svg width="12" height="16" :src="icon"></inline-svg>
        </span>
        <div class="fw-boldest">{{ title }}</div>
      </div>
      <Dropdown :items="dropDownItems" @handleCommandAction="handleCommand">
        <template v-slot:trigger>
          <div
            class="dropdown-circle d-flex justify-content-center align-items-center p-3"
          >
            <inline-svg src="/svg/icons/dropdown.svg"></inline-svg>
          </div>
        </template>
      </Dropdown>
    </div>
    <el-divider class="m-0" />
  </div>
</template>
  <script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Dropdown from "@/components/shared/Dropdown.vue";
import { useDashboardStore } from "@/store/useDashboardModule";
export default defineComponent({
  components: { Dropdown },
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    widget: {
      required: false,
    },
  },
  setup(props, { emit }) {
    const { reduceView, extendView, deleteWidget } = useDashboardStore();
    const extendedMenu = ["seeMore", "reduceView", "deleteWidget"];
    const reducedMenu = ["seeMore", "extendView", "deleteWidget"];
    const dropDownItems = ref(
      props.widget?.reduced ? reducedMenu : extendedMenu
    );
    const handleCommand = (command: string) => {
      if (command === "reduceView") {
        dropDownItems.value = reducedMenu;
        reduceView(props.widget.comp);
      }
      if (command === "extendView") {
        dropDownItems.value = extendedMenu;
        extendView(props.widget.comp);
      }
      if (command === "deleteWidget") {
        deleteWidget(props.widget.comp);
      }
      emit(command, props.widget.comp);
    };
    return {
      dropDownItems,
      handleCommand,
    };
  },
});
</script>
<style lang="scss" scoped>
.dropdown-circle {
  border: 1px solid $gris-clair;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.dropdown-circle:hover {
  background-color: $gris-clair;
}
</style>