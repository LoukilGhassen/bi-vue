<template>
  <CalendarApp></CalendarApp>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalendarApp from "@/components/calendar/CalendarApp.vue";

export default defineComponent({
  name: "calendar",
  components: {
    CalendarApp,
  },
});
</script>
<style lang="scss">
</style>