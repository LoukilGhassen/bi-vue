import {
  CalendarEventUpdateInput,
  CalendarEventCreateInput,
  CalendarEvent,
} from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";
import _ from "lodash";

import { Components } from "@tekab-dev-team/storybook-devfactory";

interface IPagination {
  take?: number;
  skip?: number;
}
const { isLoading } = storeToRefs(useBodyStore());
const initialState:
  | CalendarEvent
  | CalendarEventCreateInput
  | CalendarEventUpdateInput = {
  title: "",
  description: "",
  start: new Date().toISOString(),
  end: "",
  color: "#009EFF",
  allDay: false,
  location: ""
};
export const useCalendarStore = defineStore("authCalendar", {
  state: () => {
    return {
      calendareventList: [] as Array<CalendarEvent>,
      error: null as Object | any,
      calendarevent: _.cloneDeep(initialState),
      calendareventPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20, 
        total: 0,
      },
      loading: false,
      isDuplicated: false,
      calendarDate: null as any,
      startDateSelect: null as any,
    };
  },
  actions: {
    setLoading(val: boolean) {
      this.loading = val;
    },
    setIsDuplicated(val: boolean) {
      this.isDuplicated = val;
    },
    setCalendarDate(val: any) {
      this.calendarDate = val;
    },
    setStartDate(val:any){
      this.calendarevent.start = val;
    
    },
    setCalenderEvent(event: any) {
  
      this.calendarevent = {
        id: event?._def.publicId,
        title: event?._def.title,
        start: event?._instance.range.start,
        end: event?._instance.range.end,
        description: event?._def.extendedProps.description,
        color: event?._def.ui.backgroundColor,
        location: event?._def.extendedProps.location,
        allDay: event?._def.allDay,
      }
    },
    async fetchCalendarEventsByMonth( date?: string, payload?: IPagination) {
      try {
        let tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const { data } = await service.api.calendarEventControllerFindManyByMonth(
          {
            'where[start][equals]': new Date(date.valueOf() - tzoffset)
          }
        );
        this.calendareventList = data.paginatedResult;
        this.error = null;
      } catch (err: any) {
        this.calendareventList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    
    async softDeleteCalendarEvent(payload: string) {
      isLoading.value = true;
      try {
        const {
          data,
        } = await service.api.calendarEventControllerUpdate(payload,{
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchCalendarEventsByMonth(this.calendarDate,{
          take: this.calendareventPagination.take,
          skip: this.calendareventPagination.skip,
        });
        Components.ElMessage.success("Event Deleted");
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async deleteCalendarEvent(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.calendarEventControllerDelete(
          payload
        );
        this.calendareventList = this.calendareventList.filter(
          (calendarevent) => calendarevent.id !== data.id
        );
        this.calendareventPagination.total--;
        isLoading.value = false;
        this.error = null;
        Components.ElMessage.success("Event Deleted");
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    },
    async editCalendarEvent(payload: {
      id: string;
      data?: CalendarEventUpdateInput;
    }) {
      isLoading.value = true;
      try {
        const { data } = await service.api.calendarEventControllerUpdate(
          payload.id,
          payload.data ?? this.calendarevent
        );
        this.calendareventList = this.calendareventList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
        Components.ElMessage.success("Event Saved");
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async getCalendarEventById(payload: string) {
      isLoading.value = true;
      try {
        const { data } = await service.api.calendarEventControllerFindOne(
          payload
        );
        this.calendarevent = data;
        this.error = null;
      } catch (err: any) {
        this.resetCalendarEvent();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createCalendarEvent(payload?: CalendarEventCreateInput) {
      isLoading.value = true;
      try {
        const { data } = await service.api.calendarEventControllerCreate(
          payload ?? (this.calendarevent as CalendarEventCreateInput)
        );
        this.calendareventList = [...this.calendareventList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },
    async createManyCalendarEvent(payload: any) {
      isLoading.value = true;
      try {
        const { data } = await service.api.calendarEventControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        isLoading.value = false;
      }
    },

    resetCalendarEvent() {
      this.calendarevent = _.cloneDeep(initialState);
    },
  },
});
