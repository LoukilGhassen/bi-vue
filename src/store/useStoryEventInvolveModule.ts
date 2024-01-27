import {
  StoryEventInvolveUpdateInput,
  StoryEventInvolveCreateInput,
  StoryEventInvolve,
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
  | StoryEventInvolve
  | StoryEventInvolveCreateInput
  | StoryEventInvolveUpdateInput = {
  
  anyId: { id: "" },
  storyEvent: { id: "" },
};
export const useStoryEventInvolveStore = defineStore(
  "storyeventinvolve-store",
  {
    state: () => {
      return {
        storyeventinvolveList: [] as Array<StoryEventInvolve>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        storyeventinvolve: _.cloneDeep(initialState),
        storyeventinvolveExcelFile: "" as string,
        storyeventinvolvePagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchStoryEventInvolves(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.storyEventInvolveControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.storyeventinvolveList = data.paginatedResult;

          this.storyeventinvolveList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.storyeventinvolvePagination = {
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
          this.storyeventinvolveList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelStoryEventInvolves() {
        try {
          const {
            data,
          } = await service.api.storyEventInvolveControllerFindDataForExcel();
          this.storyeventinvolveExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteStoryEventInvolve(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.storyEventInvolveControllerDelete(
            payload
          );
          this.storyeventinvolveList = this.storyeventinvolveList.filter(
            (storyeventinvolve) => storyeventinvolve.id !== data.id
          );
          this.storyeventinvolvePagination.total--;
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
      async editStoryEventInvolve(payload: {
        id: string;
        data?: StoryEventInvolveUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const { data } = await service.api.storyEventInvolveControllerUpdate(
            payload.id,
            payload.data ?? this.storyeventinvolve
          );
          this.storyeventinvolveList = this.storyeventinvolveList.map((item) =>
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
      async editManyStoryEventInvolve(payload: { data: StoryEventInvolveUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.storyEventInvolveControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.storyeventinvolveList = this.storyeventinvolveList.map((item) =>
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

      async getStoryEventInvolveById(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.storyEventInvolveControllerFindOne(
            payload
          );
          this.storyeventinvolve = data;
          this.error = null;
        } catch (err: any) {
          this.resetStoryEventInvolve();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createStoryEventInvolve(payload?: {
        data: StoryEventInvolveCreateInput;
      }) {
        this.isLoading = true;
        try {
          const storyEventInvolve = payload?.data ?? (this.storyeventinvolve as StoryEventInvolveCreateInput)
          const newStoryEventInvolve = {...storyEventInvolve,anyId:storyEventInvolve.anyId?.id.length ? storyEventInvolve.anyId : undefined}   
          const { data } = await service.api.storyEventInvolveControllerCreate(
            newStoryEventInvolve
          );
          this.storyeventinvolveList = [...this.storyeventinvolveList, data];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyStoryEventInvolve(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.storyEventInvolveControllerCreateMany(payload);
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetStoryEventInvolve() {
        this.storyeventinvolve = _.cloneDeep(initialState);
      },
    },
  }
);
