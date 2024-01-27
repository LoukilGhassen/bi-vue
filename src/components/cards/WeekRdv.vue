<template>
  <div class="week-rdv__container w-100 h-100">
    <CardHeader
      title="Rendez-vous de la semaine"
      icon="/svg/icons/agenda.svg"
      :widget="props.payload"
    />
    <div class="p-5 pt-0 d-flex gap-5" v-if="!props.payload?.reduced">
      <div>
        <el-calendar ref="calendar" :range="range">
          <template #header="{ date }">
            <div
              class="w-100 d-flex justify-content-between align-items-center poppins noir"
            >
              <inline-svg
                class="cursor-pointer"
                src="/svg/icons/arr063.svg"
                @click="previousWeek"
              ></inline-svg>
              <span>{{ date }}</span>
              <inline-svg
                class="cursor-pointer"
                src="/svg/icons/arr064.svg"
                @click="nextWeek"
              ></inline-svg>
            </div>
          </template>
        </el-calendar>
        <div
          v-for="rdv in [12, 16, 18]"
          :key="rdv"
          class="d-flex justify-content-between py-5"
        >
          <div class="d-flex gap-6 align-items-center week-rdv__day">
            <div class="px-5 fs-3">
              <span class="fw-boldest">{{ rdv }}</span>
            </div>
            <div class="poppins">
              <div class="fs-7">Client A</div>
              <div class="fs-9 gris-fonce">Type de visite A</div>
            </div>
          </div>
          <div class="fs-9 poppins fw-boldest px-6 py-3 week-rdv__date">
            10h à 12h
          </div>
        </div>
      </div>

      <div class="h-100">
        <img src="/png/illustrations/map.png" class="map" />
      </div>
    </div>
  </div>
</template>
    <script setup lang="ts">
import CardHeader from "@/components/cards/CardHeader.vue";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import { ref, computed } from "vue";
const currentWeek = computed(() => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());
  const startOfWeek = new Date(currentDate)
  currentDate.setDate(currentDate.getDate() + 6);
  const endOfWeek = new Date(currentDate)
  return {
    startOfWeek,
    endOfWeek,
  };
});

const range = ref([currentWeek.value.startOfWeek, currentWeek.value.endOfWeek]);
const calendar = ref<CalendarInstance>();
const nextWeek = () => {
  const newWeek = range.value[0]
  newWeek.setDate(newWeek.getDate() - newWeek.getDay() + 7)
  newWeek.setDate(newWeek.getDate() + 6);
  const endOfWeek = new Date(newWeek)
  range.value = [newWeek, endOfWeek];
};
const previousWeek = () => {
  const newWeek = range.value[0]
  newWeek.setDate(newWeek.getDate() - 1)
  const endOfWeek = newWeek
  newWeek.setDate(newWeek.getDate() - 6)
  range.value = [newWeek, endOfWeek];
};
const props = defineProps({
  payload:{
    required: false,
  }
})

</script>
    <style lang="scss" scoped>
.week-rdv__ {
  &container {
    border-radius: 10px;
    box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
    overflow-y:scroll;
  }
  &day {
    border-left: 4px solid $turquoise;
  }
  &date {
    background: rgba(0, 182, 203, 0.3);
    border: 1px solid $turquoise-hover;
  }
}

:deep(.el-calendar) {
  background: transparent;
}
:deep(.el-calendar__header) {
  padding: 12px 0px;
  border-bottom: none;
}
:deep(.el-calendar__body) {
  padding: 12px 0px 35px;
  border: none;
}
:deep(.el-calendar-table thead) {
  color: $gris-fonce-2;
  font-size: 12.804px;
  font-family: Montserrat;
  text-align: center;
}
:deep(.el-calendar-table td) {
  border: none !important;
  text-align: center !important;
}
:deep(.el-calendar-table td:first-child) {
  background: rgb(232, 233, 237);
  font-weight: 700;
  color: $gris-fonce;
}

:deep(.el-calendar-table td:last-child) {
  background: rgb(232, 233, 237);
  font-weight: 700;
  color: $gris-fonce;
}
:deep(.is-today) {
  border-radius: 6px;
  background: $turquoise !important;
  color: white !important;
  font-weight: 700;
}
:deep(.el-calendar-table .el-calendar-day) {
  height: fit-content;
}
</style>