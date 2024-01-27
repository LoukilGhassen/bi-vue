import {
  SampleStockUpdateInput,
  SampleStockCreateInput,
  SampleStock,
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
  | SampleStock
  | SampleStockCreateInput
  | SampleStockUpdateInput = {
  allocatedQty: 0,
  user: { id: "" },
  sample: { id: "" },
};
export const useSampleStockStore = defineStore("samplestock-store", {
  state: () => {
    return {
      sampleStockList: [] as Array<SampleStock>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      sampleStock: _.cloneDeep(initialState) as
        | SampleStock
        | SampleStockCreateInput
        | SampleStockUpdateInput,
      samplestockExcelFile: "" as string,
      showListAddRow:true,
      sampleStockPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchSampleStocks(payload?: IPagination,options:any) {
      try {
        const { data } = await service.api.sampleStockControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.sampleStockList = data.paginatedResult;

        this.sampleStockPagination = {
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
        this.sampleStockList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelSampleStocks() {
      try {
        const {
          data,
        } = await service.api.sampleStockControllerFindDataForExcel();
        this.samplestockExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteSampleStock(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.sampleStockControllerUpdate(
          payload,
          { deletedAt: new Date() }
        );
        this.error = null;
        this.fetchSampleStocks({
          take: this.sampleStockPagination.take,
          skip: this.sampleStockPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSampleStock(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.sampleStockControllerDelete(payload);
        this.sampleStockList = this.sampleStockList.filter(
          (sampleStock) => sampleStock.id !== data.id
        );
        this.sampleStockPagination.total--;
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
    async editSampleStock(payload: {
      id: string;
      data?: SampleStockUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editSampleStockData: SampleStockUpdateInput =
          payload.data ?? this.sampleStock;
        editSampleStockData.user =
          editSampleStockData.user && editSampleStockData.user.id?.length > 0
            ? editSampleStockData.user
            : undefined;
        editSampleStockData.sample =
          editSampleStockData.sample &&
          editSampleStockData.sample.id?.length > 0
            ? editSampleStockData.sample
            : undefined;
        const { data } = await service.api.sampleStockControllerUpdate(
          payload.id,
          editSampleStockData
        );
        this.sampleStockList = this.sampleStockList.map((item) =>
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
      async editManySampleStock(payload: { data: SampleStockUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.sampleStockControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.samplestockList = this.samplestockList.map((item) =>
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

    async getSampleStockById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.sampleStockControllerFindOne(
          payload
        );
        this.sampleStock = {
          ...data,
          user: data.user ? data.user : { id: "" },
          sample: data.sample ? data.sample : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetSampleStock();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createSampleStock(payload?: { data: SampleStockCreateInput }) {
      this.isLoading = true;
      try {
        const createSampleStockData: SampleStockCreateInput =
          payload?.data ?? (this.sampleStock as SampleStockCreateInput);
        createSampleStockData.user =
          createSampleStockData.user &&
          createSampleStockData.user.id?.length > 0
            ? createSampleStockData.user
            : undefined;
        createSampleStockData.sample =
          createSampleStockData.sample &&
          createSampleStockData.sample.id?.length > 0
            ? createSampleStockData.sample
            : undefined;
        const { data } = await service.api.sampleStockControllerCreate(
          createSampleStockData
        );
        const stock = this.sampleStockList.splice(0,this.sampleStockList.length-1)
        this.sampleStockList = [...stock,data]
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManySampleStock(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.sampleStockControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetSampleStock() {
      this.$reset();
    },
    disposeSampleStock() {
      this.$dispose();
    },
    addSampleStock(payload:any){
      this.sampleStockList = [...this.sampleStockList,payload]
    },
    setShowListAddRow(payload: boolean) {
      this.showListAddRow = payload
    },
    deleteEmptySampleStock(){
      this.sampleStockList = this.sampleStockList.slice(0, -1);
   },

  },
});
