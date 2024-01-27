import {
  BisousnourUpdateInput,
  BisousnourCreateInput,
  Bisousnour,
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
  | Bisousnour
  | BisousnourCreateInput
  | BisousnourUpdateInput = {
  login: "",
  actorPersonIdObject: { id: "" },
  
  listsIdUserTypeObject: { id: "" },
};
export const useBisousnourStore = defineStore("bisousnour-store", {
  state: () => {
    return {
      bisousnourList: [] as Array<Bisousnour>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      bisousnour: _.cloneDeep(initialState),
      bisousnourExcelFile: "" as string,
      bisousnourPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchBisousnours(payload?: IPagination) {
      try {
        const { data } = await service.api.bisousnourControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.bisousnourList = data.paginatedResult;

        this.bisousnourList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.bisousnourPagination = {
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
        this.bisousnourList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelBisousnours() {
      try {
        const {
          data,
        } = await service.api.bisousnourControllerFindDataForExcel();
        this.bisousnourExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteBisousnour(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisousnourControllerDelete(payload);
        this.bisousnourList = this.bisousnourList.filter(
          (bisousnour) => bisousnour.id !== data.id
        );
        this.bisousnourPagination.total--;
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
    async editBisousnour(payload: {
      id: string;
      data?: BisousnourUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisousnourControllerUpdate(
          payload.id,
          payload.data ?? this.bisousnour
        );
        this.bisousnourList = this.bisousnourList.map((item) =>
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
      async editManyBisousnour(payload: { data: BisousnourUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.bisousnourControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.bisousnourList = this.bisousnourList.map((item) =>
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

    async getBisousnourById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisousnourControllerFindOne(payload);
        this.bisousnour = data;
        this.error = null;
      } catch (err: any) {
        this.resetBisousnour();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createBisousnour(payload?: { data: BisousnourCreateInput }) {
      this.isLoading = true;
      try {
        const actorPerson = payload?.data ?? (this.bisousnour as BisousnourCreateInput)
        const newActorPerson = {...actorPerson,actorPersonIdObject:actorPerson.actorPersonIdObject.id.length? actorPerson.actorPersonIdObject: undefined}
        const { data } = await service.api.bisousnourControllerCreate(
          newActorPerson
        );
        this.bisousnourList = [...this.bisousnourList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyBisousnour(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisousnourControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetBisousnour() {
      this.bisousnour = _.cloneDeep(initialState);
    },
  },
});
