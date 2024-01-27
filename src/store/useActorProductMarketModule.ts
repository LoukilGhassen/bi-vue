import {
  ActorProductMarketUpdateInput,
  ActorProductMarketCreateInput,
  ActorProductMarket,
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
  | ActorProductMarket
  | ActorProductMarketCreateInput
  | ActorProductMarketUpdateInput = {
  listIdProductMarketObject: { id: "" },
  product: { id: "" },
};
export const useActorProductMarketStore = defineStore(
  "actorproductmarket-store",
  {
    state: () => {
      return {
        actorproductmarketList: [] as Array<ActorProductMarket>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actorproductmarket: _.cloneDeep(initialState) as
          | ActorProductMarket
          | ActorProductMarketCreateInput
          | ActorProductMarketUpdateInput,
        actorproductmarketExcelFile: "" as string,
        actorproductmarketPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 5,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorProductMarkets(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.actorProductMarketControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.actorproductmarketList = data.paginatedResult;

          this.actorproductmarketList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.actorproductmarketPagination = {
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
          this.actorproductmarketList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorProductMarkets() {
        try {
          const {
            data,
          } = await service.api.actorProductMarketControllerFindDataForExcel();
          this.actorproductmarketExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeleteActorProductMarket(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorProductMarketControllerUpdate(payload, {
            deletedAt: new Date(),
          });
          this.error = null;
          this.fetchActorProductMarkets({
            take: this.actorproductmarketPagination.take,
            skip: this.actorproductmarketPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorProductMarket(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorProductMarketControllerDelete(
            payload
          );
          this.actorproductmarketList = this.actorproductmarketList.filter(
            (actorproductmarket) => actorproductmarket.id !== data.id
          );
          this.actorproductmarketPagination.total--;
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
      async editActorProductMarket(payload: {
        id: string;
        data?: ActorProductMarketUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editActorProductMarketData: ActorProductMarketUpdateInput =
            payload.data ?? this.actorproductmarket;
          editActorProductMarketData.listIdProductMarketObject =
            editActorProductMarketData.listIdProductMarketObject &&
            editActorProductMarketData.listIdProductMarketObject.id?.length > 0
              ? editActorProductMarketData.listIdProductMarketObject
              : undefined;
          editActorProductMarketData.product =
            editActorProductMarketData.product &&
            editActorProductMarketData.product.id?.length > 0
              ? editActorProductMarketData.product
              : undefined;
          const { data } = await service.api.actorProductMarketControllerUpdate(
            payload.id,
            editActorProductMarketData
          );
          this.actorproductmarketList = this.actorproductmarketList.map(
            (item) => (item.id === payload.id ? { ...item, ...data } : item)
          );
          this.error = null;
        } catch (err: any) {
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      } /*
      async editManyActorProductMarket(payload: { data: ActorProductMarketUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorProductMarketControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorproductmarketList = this.actorproductmarketList.map((item) =>
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

      async getActorProductMarketById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorProductMarketControllerFindOne(payload);
          this.actorproductmarket = {
            ...data,
            listIdProductMarketObject: data.listIdProductMarketObject
              ? data.listIdProductMarketObject
              : { id: "" },
            product: data.product ? data.product : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetActorProductMarket();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorProductMarket(payload?: {
        data: ActorProductMarketCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createActorProductMarketData: ActorProductMarketCreateInput =
            payload?.data ??
            (this.actorproductmarket as ActorProductMarketCreateInput);
          createActorProductMarketData.listIdProductMarketObject =
            createActorProductMarketData.listIdProductMarketObject &&
            createActorProductMarketData.listIdProductMarketObject.id?.length >
              0
              ? createActorProductMarketData.listIdProductMarketObject
              : undefined;
          createActorProductMarketData.product =
            createActorProductMarketData.product &&
            createActorProductMarketData.product.id?.length > 0
              ? createActorProductMarketData.product
              : undefined;
          const { data } = await service.api.actorProductMarketControllerCreate(
            createActorProductMarketData
          );
          this.actorproductmarketList = [...this.actorproductmarketList, data];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorProductMarket(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorProductMarketControllerCreateMany(payload);
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorProductMarket() {
        this.$reset();
      },
      disposeActorProductMarket() {
        this.$dispose();
      },
    },
  }
);
