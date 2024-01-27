import {
  BisounoursHUpdateInput,
  BisounoursHCreateInput,
  BisounoursH,
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
  | BisounoursH
  | BisounoursHCreateInput
  | BisounoursHUpdateInput = {
  creationDate: "2023-04-26T16:35:09.636Z",
  h: "",
  
  bisousnours: { id: "" },
};
export const useBisounoursHStore = defineStore("bisounoursh-store", {
  state: () => {
    return {
      bisounourshList: [] as Array<BisounoursH>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      bisounoursh: _.cloneDeep(initialState),
      bisounourshExcelFile: "" as string,
      bisounourshPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchBisounourshes(payload?: IPagination) {
      try {
        const { data } = await service.api.bisounoursHControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.bisounourshList = data.paginatedResult;

        this.bisounourshList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.bisounourshPagination = {
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
        this.bisounourshList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelBisounourshes() {
      try {
        const {
          data,
        } = await service.api.bisounoursHControllerFindDataForExcel();
        this.bisounourshExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteBisounoursH(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounoursHControllerDelete(payload);
        this.bisounourshList = this.bisounourshList.filter(
          (bisounoursh) => bisounoursh.id !== data.id
        );
        this.bisounourshPagination.total--;
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
    async editBisounoursH(payload: {
      id: string;
      data?: BisounoursHUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounoursHControllerUpdate(
          payload.id,
          payload.data ?? this.bisounoursh
        );
        this.bisounourshList = this.bisounourshList.map((item) =>
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
      async editManyBisounoursH(payload: { data: BisounoursHUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.bisounoursHControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.bisounourshList = this.bisounourshList.map((item) =>
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

    async getBisounoursHById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounoursHControllerFindOne(
          payload
        );
        this.bisounoursh = data;
        this.error = null;
      } catch (err: any) {
        this.resetBisounoursH();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createBisounoursH(payload?: { data: BisounoursHCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounoursHControllerCreate(
          payload?.data ?? (this.bisounoursh as BisounoursHCreateInput)
        );
        this.bisounourshList = [...this.bisounourshList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyBisounoursH(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounoursHControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetBisounoursH() {
      this.bisounoursh = _.cloneDeep(initialState);
    },
  },
});
