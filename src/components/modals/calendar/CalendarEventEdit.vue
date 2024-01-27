<template>

  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      width="600px"
      @close="handleCloseClick"
      top="2vh"
    >
      <CalendarEventForm calendarEvent="calendarevent" @submit-event="submit" :isEdit="true"/>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useCalendarStore } from "@/store/useCalendarModule";
import { errorSweetAlert, successSweetAlert } from "./calendarEventAlerts";
import { storeToRefs } from "pinia";
import CalendarEventForm from "./CalendarEventFormFields.vue";
import { setModal } from "@/core/helpers/config";
const { editCalendarEvent, setLoading, createCalendarEvent,resetCalendarEvent } = useCalendarStore()
const { calendarevent, isDuplicated } = storeToRefs(useCalendarStore())
const newTargetModalRef = ref<null | HTMLElement>(null);
  const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  }
})
const handleSubmitForm = async () => {
  setLoading(true);
  const eventData = {
    title: calendarevent.value?.title,
    description: calendarevent.value?.description,
    location: calendarevent.value?.location,
    allDay: calendarevent.value?.allDay,
    start: calendarevent.value?.start,
    end: calendarevent.value?.end,
    color: calendarevent.value?.color,
  }
  isDuplicated.value 
      ? await createCalendarEvent(eventData)
      : await editCalendarEvent({id: calendarevent.value?.id, data: eventData})
      setLoading(false)

      setModal("")
  resetCalendarEvent();
}
const handleCloseClick = () => {
  setModal("")
  resetCalendarEvent();
}
const submit = (formRef:any) => {
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
</script>


