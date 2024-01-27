<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      @close="handleCloseClick"
      top="5vh"
    >
      <CalendarEventForm calendarEvent="calendarevent" @submit-event="submit" :selectedDate="payload?.selectedDate"/>
    </el-dialog>
  </div>

</template>
<script lang="ts" setup>

import { ref } from "vue";
import CalendarEventForm from "./CalendarEventFormFields.vue";
import { useCalendarStore } from "@/store/useCalendarModule";
import { errorSweetAlert, successSweetAlert } from "./calendarEventAlerts";
import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
const { createCalendarEvent, setLoading,resetCalendarEvent } = useCalendarStore()
const { calendarevent } = storeToRefs(useCalendarStore())
const newTargetModalRef = ref<null | HTMLElement>(null);

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Object,
    required: false,
  },

})
const handleSubmitForm = async () => {
  setLoading(true);

  const newEvent = {
    title: calendarevent.value.title,
    description: calendarevent.value.description,
    location: calendarevent.value.location,
    allDay: calendarevent.value.allDay,
    start: calendarevent.value.start,
    end: calendarevent.value.end,
    color: calendarevent.value.color,
  }
  await createCalendarEvent(newEvent)
  setLoading(false);
  setModal("")
  resetCalendarEvent();
}

const submit = (formRef: any) => {

  if (!formRef) {
    return;
  }
  formRef.validate(async (valid: any) => {
    if (valid) {
      await handleSubmitForm();
    } else {
      errorSweetAlert()
      return false;
    }
  });
};
const handleCloseClick = () => {
  setModal("")
  resetCalendarEvent();
}
</script>

