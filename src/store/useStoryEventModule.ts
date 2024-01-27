import {
  StoryEventUpdateInput,
  StoryEventCreateInput,
  StoryEvent,
} from "./../../index";
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
const initialState:
  | StoryEvent
  | StoryEventCreateInput
  | StoryEventUpdateInput = {
  eventDate: "2023-04-26T16:35:09.640Z",
  description: "",
  displayInSchedule: false,
  story: { id: "" },
  
  listIdEventTypeObject: { id: "" },
};
export const useStoryEventStore = defineStore("storyevent-store", {
  state: () => {
    return {
      storyeventList: [] as Array<StoryEvent>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      storyevent: _.cloneDeep(initialState),
      storyeventExcelFile: "" as string,
      storyeventPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchStoryEvents(payload?: IPagination) {
      try {
        const { data } = await service.api.storyEventControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.storyeventList = data.paginatedResult;

        this.storyeventList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.storyeventPagination = {
          total: data.totalCount,
          skip: payload?.skip ?? 0,
          take: payload?.take ?? data.totalCount,
        };
        localStorage.setItem(
          "take",
          payload?.take?.toString() ?? data.totalCount.toString()
        );
        this.error = null;
      } catch (err: any) {
        this.storyeventList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelStoryEvents() {
      try {
        const {
          data,
        } = await service.api.storyEventControllerFindDataForExcel();
        this.storyeventExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteStoryEvent(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyEventControllerDelete(payload);
        this.storyeventList = this.storyeventList.filter(
          (storyevent) => storyevent.id !== data.id
        );
        this.storyeventPagination.total--;
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
    async editStoryEvent(payload: {
      id: string;
      data?: StoryEventUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyEventControllerUpdate(
          payload.id,
          payload.data ?? this.storyevent
        );
        this.storyeventList = this.storyeventList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    } /*
      async editManyStoryEvent(payload: { data: StoryEventUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.storyEventControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.storyeventList = this.storyeventList.map((item) =>
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

    async getStoryEventById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyEventControllerFindOne(payload);
        this.storyevent = data;
        this.error = null;
      } catch (err: any) {
        this.resetStoryEvent();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createStoryEvent(payload?: { data: StoryEventCreateInput }) {
      this.isLoading = true;
      try {
        const storyEvent = payload?.data ?? (this.storyevent as StoryEventCreateInput)
        const newStoryEvent = {...storyEvent,listIdEventTypeObject:storyEvent.listIdEventTypeObject?.id.length ? storyEvent.listIdEventTypeObject : undefined} 

        const { data } = await service.api.storyEventControllerCreate(
          newStoryEvent
                  );
        this.storyeventList = [...this.storyeventList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyStoryEvent(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.storyEventControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetStoryEvent() {
      this.storyevent = _.cloneDeep(initialState);
    },
  },
});
