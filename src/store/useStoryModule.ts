import { storyList } from "./../../../server/prisma/seed-generated-output/data/Story/Story-ts";
import { StoryUpdateInput, StoryCreateInput, Story } from "./../../index";
import { defineStore } from "pinia";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useBodyStore } from "@/store/useBodyModule";
import _ from "lodash";

interface IPagination {
  take?: number;
  skip?: number;
}
const { isLoading } = storeToRefs(useBodyStore());
const initialState: Story | StoryCreateInput | StoryUpdateInput = {
  captionFr: "",
  description: "",
  startDate: "2023-04-26T16:35:09.640Z",
  archiveDate: "2023-04-26T16:35:09.640Z",
  aboutAny: "",
};
export const useStoryStore = defineStore("story-store", {
  state: () => {
    return {
      storyList: [] as Array<Story>,
      calendarStoryList: [] as Array<Story>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      story: _.cloneDeep(initialState),
      storyExcelFile: "" as string,
      storyPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchStories(type?: string, payload?: IPagination, options?: any) {
      try {
        if (payload && payload?.skip === 0) {
          this.storyList = [];
        }
        const { data } = await service.api.storyControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          "where[aboutAny][contains]": type && type.length ? type : undefined,
          ...options,
        });
        this.storyList = data.paginatedResult;
        this.storyList.forEach((story) => {
          const newStoryEvent = story?.storyEvents.reduce((obj, item) => {
            const key = item?.listIdEventTypeObject?.tag;
            obj[key] = item;
            return obj;
          }, {});
          story.storyEvents = newStoryEvent;
        });

        this.calendarStoryList = [...this.storyList];
        this.storyPagination = {
          total: data.totalCount,
          skip: payload?.skip ?? 0,
          take: payload?.take ?? data.totalCount,
        };
        if (payload?.take) {
          localStorage.setItem(
            "take",
            payload?.take?.toString() ?? data.totalCount.toString()
          );
        }
        this.error = null;
      } catch (err: any) {
        this.storyList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelStories() {
      try {
        const { data } = await service.api.storyControllerFindDataForExcel();
        this.storyExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteStory(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyControllerDelete(payload.id, {
          id: payload.deletedReason,
        });
        this.storyList = this.storyList.filter((story) => story.id !== data.id);
        this.calendarStoryList = [...this.storyList];
        this.storyPagination.total--;
        this.isLoading = false;
        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async editStory(payload: {
      id: string;
      editFrom?: string;
      data?: StoryUpdateInput;
    }): Promise<any> {
      this.isLoading = true;
      let result = null;
      try {
        const { data } = await service.api.storyControllerUpdate(
          payload.id,
          payload.data
        );
        const newStoryEvent = data?.storyEvents?.reduce((obj, item) => {
          const key = item?.listIdEventTypeObject?.tag;
          obj[key] = item;
          return obj;
        }, {});
      this.storyList = this.storyList.map((item) =>
        item.id === payload.id
          ? { ...item, ...{ ...data, storyEvents: newStoryEvent } }
          : item
      );

      if (payload?.editFrom !== "calendarEvent") {
        this.calendarStoryList = [...this.storyList];
      }
        this.error = null;
        result = { ...data, storyEvents: newStoryEvent };
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
        return result;
      }
    } /*
      async editManyStory(payload: { data: StoryUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.storyControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.storyList = this.storyList.map((item) =>
            item.id === payload.id ? { ...item, ...payload.data } : item
          );
          this.error = null;
        } catch (err:any) {
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },*/,

    async getStoryById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyControllerFindOne(payload);
        this.story = data;
        this.error = null;
      } catch (err: any) {
        this.resetStory();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createStory(payload?: { data: StoryCreateInput }) {
      this.isLoading = true;
      let result = null;
      try {
        const story = payload?.data ?? (this.story as StoryCreateInput);
        const newStory = {
          ...story,
          actorIdByObject: story.actorIdByObject?.id.length
            ? story.actorIdByObject
            : undefined,
        };
        const { data } = await service.api.storyControllerCreate(newStory);
        const newStoryEvent = data?.storyEvents.reduce((obj, item) => {
          const key = item?.listIdEventTypeObject?.tag;
          obj[key] = item;
          return obj;
        }, {});
        data.storyEvents = newStoryEvent;
        this.storyList = [...this.storyList, data];
        this.calendarStoryList = [...this.storyList];

        this.storyPagination = {
          ...this.storyPagination,
          total: this.storyPagination.total + 1,
        };
        this.error = null;
        result = { ...data, storyEvents: newStoryEvent };
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
        return result;
      }
    },
    async createManyStory(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async duplicateStory(id: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyControllerDuplicate(id);

        const newStoryEvents = data?.storyEvents?.reduce((obj, item) => {
          const key = item?.listIdEventTypeObject?.tag;
          obj[key] = item;
          return obj;
        }, {});
        const insertIndex = this.storyList.findIndex((item) => item.id === id);
        let stories = this.storyList;
        stories.splice(insertIndex + 1, 0, {
          ...data,
          storyEvents: newStoryEvents,
        });
        this.storyList = [...stories];
        this.calendarStoryList = [...this.storyList];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetStory() {
      this.story = _.cloneDeep(initialState);
    },
    setStoryById(id: string) {
      this.story = this.storyList.find((item) => item.id === id);
    },
    async appointmentToStory(payload: { id: string; data?: StoryUpdateInput }) {
      this.isLoading = true;
      let res = null
      try {
        const { data } = await service.api.storyControllerAppointmentToVisit(
          payload.id,
          payload.data
        );
        res = _.cloneDeep(data)
        const newStoryEvent = data?.storyEvents.reduce((obj, item) => {
          const key = item?.listIdEventTypeObject?.tag;
          obj[key] = item;
          return obj;
        }, {});
        this.storyList = this.storyList.map((item) => {
          return item.id === payload.id
            ? { ...item, ...{ ...data, storyEvents: newStoryEvent } }
            : item.storyEvents &&
              item.storyEvents.NextVisit &&
              item.storyEvents.NextVisit.storyEventInvolves &&
              item.storyEvents.NextVisit.storyEventInvolves.length &&
              item.storyEvents.NextVisit.storyEventInvolves[0].anyId &&
              item.storyEvents.NextVisit.storyEventInvolves[0].anyId.story &&
              item.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                .ids &&
              item.storyEvents.NextVisit.storyEventInvolves[0].anyId.story.ids
                .id === payload.id
            ? {
                ...item,
                storyEvents: {
                  ...item.storyEvents,
                  NextVisit: {
                    ...item.storyEvents.NextVisit,
                    storyEventInvolves: [
                      {
                        ...item.storyEvents.NextVisit.storyEventInvolves[0],
                        anyId: {
                          ...item.storyEvents.NextVisit.storyEventInvolves[0]
                            .anyId,
                          story: data,
                        },
                      },
                    ],
                  },
                },
              }
            : item;
        });
        this.calendarStoryList = [...this.storyList];
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
        return res;
      }
    },
    showNewAppointment(payload: any) {
      let visit = payload
      if(Array.isArray(payload?.storyEvents)){
        const visitStoryEvents =  payload?.storyEvents?.reduce(
          (obj: any, item: any) => {
            const key = item?.listIdEventTypeObject?.tag;
            obj[key] = item;
            return obj;
          },
          {}
        );
        visit = {...payload,storyEvents:visitStoryEvents}
      }
      const newAppointment = visit.storyEvents?.NextVisit?.storyEventInvolves[0]?.anyId?.story;
      const newAppointmentStoryEvent = newAppointment?.storyEvents?.reduce(
        (obj: any, item: any) => {
          const key = item?.listIdEventTypeObject?.tag;
          obj[key] = item;
          return obj;
        },
        {}
      );
      this.storyList = [
        ...this.storyList,
        { ...newAppointment, storyEvents: newAppointmentStoryEvent },
      ];
      this.calendarStoryList = [...this.storyList];
    },
  },
});
