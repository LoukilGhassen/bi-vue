<template>
  <div>
    <!--begin::Card-->
    <div class="card">
      <!--begin::Card header-->
      <div class="calendar-header d-flex justify-content-between w-100 my-9">
        <div
          class="d-flex align-items-center gap-5 fit-content calendar-quick-options"
        >
          <el-button class="m-0" @click="today">Aujourd’hui</el-button>
          <el-date-picker
            v-model="datePickerValue"
            type="date"
            placeholder="Pick a day"
            :shortcuts="shortcuts"
            size="large"
            @change="getDate"
          />
          <!-- todo fixer -->
          <p class="fw-boldest w-250px m-0">{{ currentViewTitle }}</p>
        </div>
        <div class="d-flex align-items-center gap-5">
          <inline-svg
            class="cursor-pointer"
            src="/svg/icons/arr063.svg"
            @click="prev"
          />
          <el-button class="w-150px" color="rgba(244, 244, 246, 1)"
            >{{ views[currentView] }}
            {{ currentViewNumber[`${currentView}`] }}</el-button
          >
          <inline-svg
            class="cursor-pointer"
            src="/svg/icons/arr064.svg"
            @click="next"
          />
        </div>
        <div class="d-flex align-items-center gap-3 m-0">
          <el-input
            v-model="search"
            @input="handleInput($event)"
            class="w-150px"
            placeholder="Rechercher"
            clearable
          >
            <template #prefix>
              <el-icon class="el-input__icon px-3">
                <span class="svg-icon svg-icon-muted svg-icon-1">
                  <inline-svg src="/svg/icons/search.svg" />
                </span>
              </el-icon>
            </template>
          </el-input>

          <el-popover placement="bottom-start" :width="550" trigger="click">
            <template #reference>
              <div ref="filterBtn">
                <el-button class="border-0 m-0">
                  <el-icon class="me-3"
                    ><img
                      class="rounded-1"
                      src="/svg/icons/filtre.svg"
                      alt="metronic"
                  /></el-icon>
                  Filtrer
                </el-button>
              </div>
            </template>
            <div class="pb-2">
              <CustomFiltreVue
                @validate-filtre="onValidateFiltre"
                :types="columnDefs"
                :calendarFilter="true"
              />
            </div>
          </el-popover>
          <!-- todo add changing view functionality -->
          <el-dropdown class="w-150px" @command="changeView">
            <span class="el-dropdown-link noir">
              {{ views[currentView] }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="timeGridDay"
                  :style="{
                    color: currentView === 'timeGridDay' ? '#6E1AF9' : '',
                  }"
                  >Jour</el-dropdown-item
                >
                <el-dropdown-item
                  command="timeGridWeek"
                  :style="{
                    color: currentView === 'timeGridWeek' ? '#6E1AF9' : '',
                  }"
                  >Semaine</el-dropdown-item
                >
                <el-dropdown-item
                  command="dayGridMonth"
                  :style="{
                    color: currentView === 'dayGridMonth' ? '#6E1AF9' : '',
                  }"
                  >Mois</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div>
        <!--begin::Calendar-->
        <FullCalendar
          class="demo-app-calendar"
          ref="calendar"
          :options="calendarOptions"
        ></FullCalendar>
        <!--end::Calendar-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import frLocale from "@fullcalendar/core/locales/fr";
import CustomFiltreVue from "@/components/shared/ag-grid-table/CustomFiltre.vue";

import { useCalendarStore } from "@/store/useCalendarModule";
import { storeToRefs } from "pinia";
import {
  generateEventColorBasedOnType,
  formatDateToISOString,
  getDateInfo,
} from "@/core/helpers/calendarUtils";
import moment from "moment";
import { setModal } from "@/core/helpers/config";
import { useConfigStore } from "@/store/useConfig";
import { useStoryStore } from "@/store/useStoryModule";
import axios from "axios";

const todayDate = moment().startOf("day");
const TODAY = todayDate.format("YYYY-MM-DD");
const { setHeader } = useConfigStore();

const { setStartDate, setCalendarDate } = useCalendarStore();
const { calendarDate } = storeToRefs(useCalendarStore());
const datePickerValue = ref("");

const {story, calendarStoryList } = storeToRefs(
  useStoryStore()
);
const { fetchStories, setStoryById, editStory } = useStoryStore();

setHeader("CalendarHeader");
const currentView = ref("timeGridWeek");
const currentViewNumber = ref({});
const calendar = ref();
const views = {
  timeGridDay: "Jour",
  timeGridWeek: "Semaine",
  dayGridMonth: "Mois",
};
const filterBtn = ref(null);
const search = ref("");

const newEvent = async (e) => {
  setModal("CalendarEventAdd", { selectedDate: e.dateStr });
};
const currentYear = ref(new Date());
const infoEvent = (e) => {
  setStoryById(e.event.id);
  setModal("InfoCalendarCard");
};
const holidays = ref([]);
const searchCriteria = ref();
const filtersCriteria = ref();
const handleDatesSet = async (info) => {
  const newYear = info.view.currentStart.getFullYear();
  // Vérifiez si l'année a changé
  if (newYear !== currentYear.value) {
    currentYear.value = newYear;
    const { data } = await axios.get(
      `https://calendrier.api.gouv.fr/jours-feries/metropole/${newYear}.json`
    );
    const transformedArray = Object.entries(data).reduce(
      (acc: any, [date, label]) => {
        const transformedObject = {
          color: "#66666E",
          display: "background",
          allDay: true,
          start: date,
          end: date,
        };

        acc.push(transformedObject);
        return acc;
      },
      []
    );

    holidays.value = transformedArray;
  }
};
const currentViewTitle = ref();
const calendarEvents = computed(() => {
  return [
    ...holidays.value,
    ...calendarStoryList.value
      .filter(
        (e) =>
          e.aboutAny === "visit" ||
          (e.startDate && e.endDate && e.startTime && e.endTime)
      )
      .map((event) => {
        return event.aboutAny === "visit" && (!event.endDate || !event.endTime)
          ? {
              title: eventTitle(event),
              description: event.description,
              start: `${event.startDate.split("T")[0]}T${
                event.startTime.split("T")[1]
              }`,
              end: new Date(
                new Date(
                  `${event.startDate.split("T")[0]}T${
                    event.startTime.split("T")[1]
                  }`
                ).getTime() +
                  event.listIdDurationObject.code * 60000
              ).toISOString(),
              textColor: generateEventColorBasedOnType(event).textColor,
              color: generateEventColorBasedOnType(event).bgColor,
              id: event.id,
              allDay: false,
              editable: canEditEvent(event.ids.creation),
            }
          : {
              title: eventTitle(event),
              description: event.description,
              start: `${event.startDate.split("T")[0]}T${
                event.startTime.split("T")[1]
              }`,
              end:
                event?.endDate && event?.endTime
                  ? `${event.endDate.split("T")[0]}T${
                      event.endTime.split("T")[1]
                    }`
                  : "",
              textColor: generateEventColorBasedOnType(event).textColor,
              color: generateEventColorBasedOnType(event).bgColor,
              id: event.id,
              allDay: false,
              editable: canEditEvent(event.ids.creation),
            };
      }),
  ];
});

const canEditEvent = (creation: any) => {
  const targetDate = new Date(creation);
  return new Date(targetDate.setDate(targetDate.getDate() + 5)) > new Date();
};
const updateEvent = async (e) => {
  setStoryById(e.event.id);
  await editStory({
    id: e.event.id,
    editFrom: "calendarEvent",
    data: {
      ...story.value,
      startDate: formatDateToISOString(e?.event?._instance?.range?.start),
      startTime: formatDateToISOString(e?.event?._instance?.range?.start),
      endDate: formatDateToISOString(e?.event?._instance?.range?.end),
      endTime: formatDateToISOString(e?.event?._instance?.range?.end),
      storyEvents: Object.values(story.value.storyEvents),
    },
  });
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  titleFormat: {
    // will produce something like "Tuesday, September 18, 2018"
    month: "long",
    year: "numeric",
  },
  height: "auto",
  slotMinTime: "07:00:00",
  slotMaxTime: "19:00:00",
  datesSet: handleDatesSet,
  headerToolbar: false,
  nowIndicator: true,
  initialDate: TODAY,
  selectable: true,
  select: (args: any) => {
    setStartDate(args.start);
  },
  selectMirror: false,
  locale: "fr",
  locales: [esLocale, frLocale],
  views: {
    timeGridWeek: {
      // Customize the timeGridWeek view
      weekends: true, // display weekends or not (default : true)
      dayHeaderFormat: {
        weekday: "short",
        day: "2-digit",
        omitCommas: false,
      }, // Set the format to display the day of the week (e.g., Mon, Tue)
      dayHeaderContent: function (arg) {
        const dateToCheck = new Date(arg.date);
        const dateStringToCheck = `${dateToCheck.getFullYear()}-${(
          "0" +
          (dateToCheck.getMonth() + 1)
        ).slice(-2)}-${("0" + dateToCheck.getDate()).slice(-2)}`;
        const holidaysArr = holidays.value.map((holiday) => holiday.start);
        return holidaysArr.includes(dateStringToCheck)
          ? {
              html: `<div style="display:flex;width:100%; height:100%; justify-content: center ; align-items: center"><span class="fw-bolder">${arg.text}</span><span style="margin-left:auto; background-color:#F4F4F6; padding:7px ; color:black ">Férié</span></div>`,
            }
          : {
              html: `<div style="display:flex;width:100%;height:100%; justify-content: flex-start"><span class="fw-bolder" style="display: flex ;align-items: center ;padding:7px 0px">${arg.text}</span></div>`,
            };
      },
      allDaySlot: false,
      slotLabelFormat: {
        hour: "2-digit",
        minute: "2-digit",
        omitZeroMinute: false, // Set this to false to display leading zeros for minutes
      },
    },
    dayGridMonth: {
      displayEventEnd: true,
    },

    timeFormat: {
      agenda: "h:mm{ - h:mm}", //h:mm{ - h:mm}'
    },
  },
  initialView: "timeGridWeek",
  dayMaxEvents: true, // allow "more" link when too many events
  events: calendarEvents,
  dateClick: newEvent,
  eventClick: infoEvent,
  eventResize: updateEvent,
  eventDrop: updateEvent,
  snapDuration: "00:15:00",
  eventTimeFormat: {
    // like '14:30:00'
    hour: "2-digit",
    minute: "2-digit",
  },
});

const getDate = (val) => {
  const date = new Date(val);
  calendar.value.getApi().gotoDate(date);
  currentViewTitle.value = calendar.value?.getApi().getCurrentData().viewTitle;
  currentViewNumber.value = getDateInfo(
    calendar.value?.getApi().getCurrentData().currentDate
  );
  setCalendarDate(calendar.value.getApi().getDate());
};
const weekendToggle = (val: boolean) => {
  calendarOptions.value.views.timeGridWeek.weekends = val;
  calendarOptions.value.views.dayGridMonth.weekends = val;
};
const AllDayToggle = (val: boolean) => {
  if (val) {
    calendarOptions.value.slotMinTime = "00:00:00";
    calendarOptions.value.slotMaxTime = "23:00:00";
  } else {
    calendarOptions.value.slotMinTime = "07:00:00";
    calendarOptions.value.slotMaxTime = "19:00:00";
  }
};
const shortcuts = [
  {
    text: "5 Jours",
    value: () => weekendToggle(false),
  },
  {
    text: "7 Jours",
    value: () => weekendToggle(true),
  },
  {
    text: "Toute la journée",
    value: () => AllDayToggle(true),
  },
  {
    text: "07:00->19:00",
    value: () => AllDayToggle(false),
  },
];
//begin ::Calendar events

const prev = () => {
  calendar.value.getApi().prev();
  setCalendarDate(calendar.value.getApi().getDate());
  currentViewTitle.value = calendar.value?.getApi().getCurrentData().viewTitle;
  currentViewNumber.value = getDateInfo(
    calendar.value?.getApi().getCurrentData().currentDate
  );
};
const next = () => {
  calendar.value.getApi().next();
  setCalendarDate(calendar.value.getApi().getDate());
  currentViewTitle.value = calendar.value?.getApi().getCurrentData().viewTitle;
  currentViewNumber.value = getDateInfo(
    calendar.value?.getApi().getCurrentData().currentDate
  );
};

const today = () => {
  calendar.value.getApi().today();
  setCalendarDate(calendar.value.getApi().getDate());
  currentViewNumber.value = getDateInfo(
    calendar.value?.getApi().getCurrentData().currentDate
  );
  currentViewTitle.value = calendar.value?.getApi().getCurrentData().viewTitle;
};

const changeView = (command: any) => {
  currentView.value = command;
  calendar.value.getApi().changeView(command);
};

//end ::Calendar events

const eventTitle = (event: any) => {
  if (event.aboutAny === "visit") {
    return `Visite : ${event.actorIdByObject?.actorName}`;
  }
  if (event.aboutAny === "OffFieldActivity") {
    return event.storyEvents?.OffFieldType?.listIdEventTypeValueObject
      ?.captionFr;
  }
  if (event.aboutAny === "Appointment") {
    return `RDV : ${event.actorIdByObject?.actorName}`;
  }
  return "event";
};

const columnDefs = [
  {
    field: "appointment",
    headerName: "RDV",
    filter: {
      field: "[appointment]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[aboutAny]",
        value: "Appointment",
      },
    ],
  },
  {
    field: "visit",
    headerName: "Visite",
    filter: {
      field: "[visit]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[aboutAny]",
        value: "visit",
      },
    ],
  },
  {
    field: "Car",
    headerName: "Voiture",
    filter: {
      field: "[Car]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Car",
      },
    ],
  },
  {
    field: "Seminar",
    headerName: "Séminaire",
    filter: {
      field: "[Seminar]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Seminar",
      },
    ],
  },
  {
    field: "Congress",
    headerName: "Congrès",
    filter: {
      field: "[Congress]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Congress",
      },
    ],
  },
  {
    field: "Leave",
    headerName: "Congés",
    filter: {
      field: "[Leave]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Leave",
      },
    ],
  },
  {
    field: "Recovery",
    headerName: "Récupération",
    filter: {
      field: "[Recovery]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Recovery",
      },
    ],
  },
  {
    field: "Illness",
    headerName: "Maladie",
    filter: {
      field: "[Illness]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Illness",
      },
    ],
  },
  {
    field: "Training",
    headerName: "Formation",
    filter: {
      field: "[Training]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "Training",
      },
    ],
  },
  {
    field: "RP/STAFF",
    headerName: "RP/STAFF",
    filter: {
      field: "[RP/STAFF]",
      type: "boolean",
    },
    prefixCriteria: [
      {
        criteria: "[storyEvents][some][listIdEventTypeValueObject][tag]",
        value: "RP/STAFF",
      },
    ],
  },
];
onMounted(async () => {
  currentViewTitle.value = calendar.value?.getApi().getCurrentData().viewTitle;
  currentViewNumber.value = await getDateInfo(
    calendar.value?.getApi().getCurrentData().currentDate
  );
  setCalendarDate(new Date());
  const month = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getMonth();
  const year = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getFullYear();
  await fetchStories(
    "",
    {},
    {
      "where[OR][0][startDate][gte]": new Date(
        year,
        month - 1,
        15
      ).toISOString(),
      "where[OR][0][startDate][lt]": new Date(
        year,
        month + 1,
        15
      ).toISOString(),
      "where[OR][1][endDate][gte]": new Date(year, month - 1, 15).toISOString(),
      "where[OR][1][endDate][lt]": new Date(year, month + 1, 15).toISOString(),
    }
  );
});

watch(calendarDate, async (newDate, oldDate) => {
  if (
    oldDate &&
    (new Date(newDate).getMonth() !== new Date(oldDate).getMonth() ||
      new Date(newDate).getFullYear() !== new Date(oldDate).getFullYear())
  ) {
    const month = new Date(newDate).getMonth();
    const year = new Date(newDate).getFullYear();
    await fetchStories(
      "",
      {},
      {
        ...filtersCriteria.value,
        ...searchCriteria.value,
        "where[AND][2][OR][0][startDate][gte]": new Date(
          year,
          month - 1,
          15
        ).toISOString(),
        "where[AND][2][OR][0][startDate][lt]": new Date(
          year,
          month + 1,
          15
        ).toISOString(),
        "where[AND][2][OR][1][endDate][gte]": new Date(
          year,
          month - 1,
          15
        ).toISOString(),
        "where[AND][2][OR][1][endDate][lt]": new Date(
          year,
          month + 1,
          15
        ).toISOString(),
      }
    );
  }
});

const onValidateFiltre = async (val) => {
  let orIndex = 0;

  const filterCriteria = val.reduce(
    (result: any, item: any, index: any): any => {
      const field = item.colDef.prefixCriteria[0].criteria;
      const criteria = "[equals]";
      const value = item.colDef.prefixCriteria[0].value;
      result[`where[AND][0][OR][${orIndex}]${field}${criteria}`] = value;
      orIndex = orIndex + 1;

      return result;
    },
    {}
  );
  const month = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getMonth();
  const year = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getFullYear();
  filtersCriteria.value = filterCriteria;
  const finalCriteria: any = {
    ...filtersCriteria.value,
    ...searchCriteria.value,
    "where[AND][2][OR][0][startDate][gte]": new Date(
      year,
      month - 1,
      15
    ).toISOString(),
    "where[AND][2][OR][0][startDate][lt]": new Date(
      year,
      month + 1,
      15
    ).toISOString(),
    "where[AND][2][OR][1][endDate][gte]": new Date(
      year,
      month - 1,
      15
    ).toISOString(),
    "where[AND][2][OR][1][endDate][lt]": new Date(
      year,
      month + 1,
      15
    ).toISOString(),
  };

  await fetchStories("", {}, finalCriteria);

  filterBtn.value?.click();
};
const handleInput = async (val) => {
  changeView("dayGridMonth");
  const month = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getMonth();
  const year = new Date(
    calendar.value?.getApi().getCurrentData().currentDate
  ).getFullYear();
  searchCriteria.value = {
    "where[AND][1][OR][0][captionFr][contains]": val,
    "where[AND][1][OR][0][captionFr][mode]": "insensitive",
    "where[AND][1][OR][1][description][contains]": val,
    "where[AND][1][OR][1][description][mode]": "insensitive",
    "where[AND][1][OR][2][actorIdByObject][actorPerson][firstName][contains]":
      val,
    "where[AND][1][OR][2][actorIdByObject][actorPerson][firstName][mode]":
      "insensitive",
    "where[AND][1][OR][3][actorIdByObject][actorName][contains]": val,
    "where[AND][1][OR][3][actorIdByObject][actorName][mode]": "insensitive",
  };
  await fetchStories(
    "",
    {},
    {
      ...filtersCriteria.value,
      ...searchCriteria.value,
      "where[AND][2][OR][0][startDate][gte]": new Date(
        year,
        month - 1,
        15
      ).toISOString(),
      "where[AND][2][OR][0][startDate][lt]": new Date(
        year,
        month + 1,
        15
      ).toISOString(),
      "where[AND][2][OR][1][endDate][gte]": new Date(
        year,
        month - 1,
        15
      ).toISOString(),
      "where[AND][2][OR][1][endDate][lt]": new Date(
        year,
        month + 1,
        15
      ).toISOString(),
    }
  );
};
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}

.fc .fc-col-header-cell .fc-col-header-cell-cushion {
  font-size: 14px;
  color: #3f4254;
  text-transform: uppercase;
  font-weight: $font-weight-bolder !important;
  min-height: 33px !important;
  display: flex !important;
  justify-content: center!important;
  align-items : center !important
}
</style>
<style lang="scss" scoped>
@import "./src/assets/sass/core/vendors/plugins/_fullcalendar.scss";
:deep(.fc-timegrid-now-indicator-arrow) {
  display: none !important;
}
:deep(.fc-timegrid-now-indicator-line) {
  border-width: 2px 0 0;
  &:before {
    content: " " !important;
    width: 14px !important;
    height: 14px !important;
    background: red !important;
    border-radius: 50% !important;
    position: absolute;
    top: -9px;
  }
}
:deep(.fc-event-past) {
  opacity: 0.6;
  .fc-event-main-frame {
    color: #20202080 !important;
  }
}
:deep(.fc-event-main-frame) {
  padding-left: 15px;
  padding-top: 3px;
}
:deep(.fc-daygrid-event) {
  font-weight: 700;
}
:deep(.fc-toolbar-chunk) {
  &:first-of-type {
    width: 30%;
  }
  div {
    display: flex !important;
    align-items: center;
    h2 {
      font-size: medium;
    }
  }
}
.calendar-quick-options {
  border: none;

  :deep(.el-input__inner) {
    display: none;
  }
  :deep(.el-input) {
    width: auto !important;
    margin-right: 2.5em;
  }
  :deep(.el-input__prefix) {
    transform: scale(1.5);
    color: $noir;
  }
}
:deep(.fc-direction-ltr .fc-timegrid-slot-label-frame),
:deep(.fc .fc-col-header-cell .fc-col-header-cell-cushion) {
  color: $gris-fonce;
  font-weight: 400;
  font-size: 13px;
} 
:deep(.fc-col-header){
  width:100%!important;
}
:deep(.fc-timegrid-body){
  width:100%!important;
}
:deep(.fc-timegrid-slots table){
  width:100%!important;
}
:deep(.fc-timegrid-cols table){
  width:100%!important;
}
:deep(.fc-col-header-cell-cushion) {
  width: 100%;
  height: 100%;
}
:deep(.fc-scrollgrid-sync-inner) {
  height: 100%;
}


:deep(.demo-app-calendar) {
  --fc-border-color: #C7C7CC;
  --fc-event-bg-color: #ffffff;
  --fc-event-border-color: #e7e4e4cc;
  --fc-event-text-color: $noir;
  --fc-today-bg-color: none;
}
:deep(.el-input) {
  --el-input-border-color: none !important;
}

:deep(.fc .fc-timegrid-slot-minor){
  border-top-style:none
}
:deep(.fc .fc-timegrid-col-frame ){
  background-color: #F4F4F6;
}
:deep(colgroup){
  background-color: white !important
}
:deep(table.fc-scrollgrid){
  border:none !important;
}

</style>
