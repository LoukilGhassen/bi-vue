import {
  PackagingPriceUpdateInput,
  PackagingPriceCreateInput,
  PackagingPrice,
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
  | PackagingPrice
  | PackagingPriceCreateInput
  | PackagingPriceUpdateInput = {
  price: 0,
  validFrom: "2023-04-26T16:35:09.639Z",
  validUntil: "2023-04-26T16:35:09.639Z",
  listIdCurrencyObject: { id: "" },
  packaging: { id: "" },
};
export const usePackagingPriceStore = defineStore("packagingprice-store", {
  state: () => {
    return {
      packagingpriceList: [] as Array<PackagingPrice>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      packagingprice: _.cloneDeep(initialState),
      packagingpriceExcelFile: "" as string,
      packagingpricePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchPackagingPrices(payload?: IPagination) {
      try {
        const { data } = await service.api.packagingPriceControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.packagingpriceList = data.paginatedResult;

        this.packagingpriceList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.packagingpricePagination = {
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
        this.packagingpriceList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelPackagingPrices() {
      try {
        const {
          data,
        } = await service.api.packagingPriceControllerFindDataForExcel();
        this.packagingpriceExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deletePackagingPrice(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingPriceControllerDelete(
          payload
        );
        this.packagingpriceList = this.packagingpriceList.filter(
          (packagingprice) => packagingprice.id !== data.id
        );
        this.packagingpricePagination.total--;
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
    async editPackagingPrice(payload: {
      id: string;
      data?: PackagingPriceUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingPriceControllerUpdate(
          payload.id,
          payload.data ?? this.packagingprice
        );
        this.packagingpriceList = this.packagingpriceList.map((item) =>
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
      async editManyPackagingPrice(payload: { data: PackagingPriceUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.packagingPriceControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.packagingpriceList = this.packagingpriceList.map((item) =>
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

    async getPackagingPriceById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingPriceControllerFindOne(
          payload
        );
        this.packagingprice = data;
        this.error = null;
      } catch (err: any) {
        this.resetPackagingPrice();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createPackagingPrice(payload?: { data: PackagingPriceCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingPriceControllerCreate(
          payload?.data ?? (this.packagingprice as PackagingPriceCreateInput)
        );
        this.packagingpriceList = [...this.packagingpriceList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyPackagingPrice(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.packagingPriceControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetPackagingPrice() {
      this.packagingprice = _.cloneDeep(initialState);
    },
  },
});
