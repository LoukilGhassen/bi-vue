import {
  DistributorUpdateInput,
  DistributorCreateInput,
  Distributor,
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
  | Distributor
  | DistributorCreateInput
  | DistributorUpdateInput = { listIdWholesalerObject: { id: "" } };
export const useDistributorStore = defineStore("distributor-store", {
  state: () => {
    return {
      distributorList: [] as Array<Distributor>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      distributor: _.cloneDeep(initialState) as
        | Distributor
        | DistributorCreateInput
        | DistributorUpdateInput,
      distributorExcelFile: "" as string,
      distributorPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchDistributors(payload?: IPagination) {
      try {
        const { data } = await service.api.distributorControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.distributorList = data.paginatedResult;

        this.distributorList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.distributorPagination = {
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
        this.distributorList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelDistributors() {
      try {
        const {
          data,
        } = await service.api.distributorControllerFindDataForExcel();
        this.distributorExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteDistributor(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.distributorControllerUpdate(
          payload,
          { deletedAt: new Date() }
        );
        this.error = null;
        this.fetchDistributors({
          take: this.distributorPagination.take,
          skip: this.distributorPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteDistributor(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.distributorControllerDelete(payload);
        this.distributorList = this.distributorList.filter(
          (distributor) => distributor.id !== data.id
        );
        this.distributorPagination.total--;
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
    async editDistributor(payload: {
      id: string;
      data?: DistributorUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editDistributorData: DistributorUpdateInput =
          payload.data ?? this.distributor;
        editDistributorData.listIdWholesalerObject =
          editDistributorData.listIdWholesalerObject &&
          editDistributorData.listIdWholesalerObject.id?.length > 0
            ? editDistributorData.listIdWholesalerObject
            : undefined;
        const { data } = await service.api.distributorControllerUpdate(
          payload.id,
          editDistributorData
        );
        this.distributorList = this.distributorList.map((item) =>
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
      async editManyDistributor(payload: { data: DistributorUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.distributorControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.distributorList = this.distributorList.map((item) =>
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

    async getDistributorById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.distributorControllerFindOne(
          payload
        );
        this.distributor = {
          ...data,
          listIdWholesalerObject: data.listIdWholesalerObject
            ? data.listIdWholesalerObject
            : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetDistributor();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createDistributor(payload?: { data: DistributorCreateInput }) {
      this.isLoading = true;
      try {
        const createDistributorData: DistributorCreateInput =
          payload?.data ?? (this.distributor as DistributorCreateInput);
        createDistributorData.listIdWholesalerObject =
          createDistributorData.listIdWholesalerObject &&
          createDistributorData.listIdWholesalerObject.id?.length > 0
            ? createDistributorData.listIdWholesalerObject
            : undefined;
        const { data } = await service.api.distributorControllerCreate(
          createDistributorData
        );
        this.distributorList = [...this.distributorList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyDistributor(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.distributorControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetDistributor() {
      this.$reset();
    },
    disposeDistributor() {
      this.$dispose();
    },
  },
});
