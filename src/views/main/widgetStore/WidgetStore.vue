<template>
  <div class="widget__container gap-5">
    <div
      v-for="widget in widgets"
      :key="widget.title"
      class="d-flex flex-column justify-content-between align-items-center px-3 py-6 widget__card"
    >
      <inline-svg
        width="100px"
        height="100px"
        :src="'/svg/icons/' + widget.icon"
        class="py-5"
      ></inline-svg>
      <div class="fw-boldest text-center pt-5">{{ widget.title }}</div>
      <div class="poppins pt-2 pb-5 d-flex justify-content-center text-center">
        {{ widget.description }}
      </div>
      <div
        class="poppins violet-hover p-5 cursor-pointer"
        @click="handleAddWidget(widget.comp)"
        v-if="widget.available"
      >
        <inline-svg
          height="16"
          width="16"
          src="/svg/icons/plus.svg"
          class="me-3"
        ></inline-svg
        >Ajouter ce widget
      </div>
      <div
        class="poppins rouge p-5 cursor-pointer"
        @click="deleteWidget(widget.comp)"
        v-else
      >
        <span>-</span>
        Retirer ce widget
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/useConfig";
import { useDashboardStore } from "@/store/useDashboardModule";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { setHeader } = useConfigStore();
setHeader("widgetStoreHeader");
const { addWidget , deleteWidget } = useDashboardStore();
const { config } = storeToRefs(useDashboardStore());
const handleAddWidget = (comp: string) => {
  addWidget(comp);
};
const widgets = computed(() => {
  return config.value.chachelis;
});
</script>
<style lang="scss" scoped>
.widget__ {
  &card {
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  }
  &container {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, minmax(306px, 1fr));
  }
}
</style>