import {
  CategoryMarketUpdateInput,
  CategoryMarketCreateInput,
  CategoryMarket,
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
  | CategoryMarket
  | CategoryMarketCreateInput
  | CategoryMarketUpdateInput = { market: { id: "" }, category: { id: "" } };
export const useCategoryMarketStore = defineStore("categorymarket-store", {
  state: () => {
    return {
      categorymarketList: [] as Array<CategoryMarket>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      categorymarket: _.cloneDeep(initialState) as
        | CategoryMarket
        | CategoryMarketCreateInput
        | CategoryMarketUpdateInput,
      categorymarketExcelFile: "" as string,
      categorymarketPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchCategoryMarkets(payload?: IPagination) {
      try {
        const { data } = await service.api.categoryMarketControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.categorymarketList = data.paginatedResult;

        this.categorymarketList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.categorymarketPagination = {
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
        this.categorymarketList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelCategoryMarkets() {
      try {
        const {
          data,
        } = await service.api.categoryMarketControllerFindDataForExcel();
        this.categorymarketExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteCategoryMarket(payload: string) {
      this.isLoading = true;
      try {
        const {
          data,
        } = await service.api.categoryMarketControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchCategoryMarkets({
          take: this.categorymarketPagination.take,
          skip: this.categorymarketPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCategoryMarket(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.categoryMarketControllerDelete(
          payload
        );
        this.categorymarketList = this.categorymarketList.filter(
          (categorymarket) => categorymarket.id !== data.id
        );
        this.categorymarketPagination.total--;
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
    async editCategoryMarket(payload: {
      id: string;
      data?: CategoryMarketUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editCategoryMarketData: CategoryMarketUpdateInput =
          payload.data ?? this.categorymarket;
        editCategoryMarketData.market =
          editCategoryMarketData.market &&
          editCategoryMarketData.market.id?.length > 0
            ? editCategoryMarketData.market
            : undefined;
        editCategoryMarketData.category =
          editCategoryMarketData.category &&
          editCategoryMarketData.category.id?.length > 0
            ? editCategoryMarketData.category
            : undefined;
        const { data } = await service.api.categoryMarketControllerUpdate(
          payload.id,
          editCategoryMarketData
        );
        this.categorymarketList = this.categorymarketList.map((item) =>
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
      async editManyCategoryMarket(payload: { data: CategoryMarketUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.categoryMarketControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.categorymarketList = this.categorymarketList.map((item) =>
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

    async getCategoryMarketById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.categoryMarketControllerFindOne(
          payload
        );
        this.categorymarket = {
          ...data,
          market: data.market ? data.market : { id: "" },
          category: data.category ? data.category : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetCategoryMarket();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createCategoryMarket(payload?: { data: CategoryMarketCreateInput }) {
      this.isLoading = true;
      try {
        const createCategoryMarketData: CategoryMarketCreateInput =
          payload?.data ?? (this.categorymarket as CategoryMarketCreateInput);
        createCategoryMarketData.market =
          createCategoryMarketData.market &&
          createCategoryMarketData.market.id?.length > 0
            ? createCategoryMarketData.market
            : undefined;
        createCategoryMarketData.category =
          createCategoryMarketData.category &&
          createCategoryMarketData.category.id?.length > 0
            ? createCategoryMarketData.category
            : undefined;
        const { data } = await service.api.categoryMarketControllerCreate(
          createCategoryMarketData
        );
        this.categorymarketList = [...this.categorymarketList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyCategoryMarket(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.categoryMarketControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetCategoryMarket() {
      this.$reset();
    },
    disposeCategoryMarket() {
      this.$dispose();
    },
  },
});
