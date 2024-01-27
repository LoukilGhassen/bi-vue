import {
  PackagingUpdateInput,
  PackagingCreateInput,
  Packaging,
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
const initialState: Packaging | PackagingCreateInput | PackagingUpdateInput = {
  captionFr: "",
  qty: 0,
  product: { id: "" },
  
  isASample: false,
};
export const usePackagingStore = defineStore("packaging-store", {
  state: () => {
    return {
      packagingList: [] as Array<Packaging>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      packaging: _.cloneDeep(initialState),
      packagingExcelFile: "" as string,
      packagingPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchPackagings(payload?: IPagination) {
      try {
        const { data } = await service.api.packagingControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.packagingList = data.paginatedResult;

        this.packagingList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.packagingPagination = {
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
        this.packagingList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelPackagings() {
      try {
        const {
          data,
        } = await service.api.packagingControllerFindDataForExcel();
        this.packagingExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deletePackaging(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingControllerDelete(payload);
        this.packagingList = this.packagingList.filter(
          (packaging) => packaging.id !== data.id
        );
        this.packagingPagination.total--;
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
    async editPackaging(payload: { id: string; data?: PackagingUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingControllerUpdate(
          payload.id,
          payload.data ?? this.packaging
        );
        this.packagingList = this.packagingList.map((item) =>
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
      async editManyPackaging(payload: { data: PackagingUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.packagingControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.packagingList = this.packagingList.map((item) =>
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

    async getPackagingById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingControllerFindOne(payload);
        this.packaging = data;
        this.error = null;
      } catch (err: any) {
        this.resetPackaging();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createPackaging(payload?: { data: PackagingCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingControllerCreate(
          payload?.data ?? (this.packaging as PackagingCreateInput)
        );
        this.packagingList = [...this.packagingList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyPackaging(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetPackaging() {
      this.packaging = _.cloneDeep(initialState);
    },
  },
});
