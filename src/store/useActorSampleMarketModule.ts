import {
  ActorSampleMarketUpdateInput,
  ActorSampleMarketCreateInput,
  ActorSampleMarket,
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
  | ActorSampleMarket
  | ActorSampleMarketCreateInput
  | ActorSampleMarketUpdateInput = {
  sample: { id: "" },
  listIdMarket: { id: "" },
  ids: { id: "" },
};
export const useActorSampleMarketStore = defineStore(
  "actorsamplemarket-store",
  {
    state: () => {
      return {
        actorsamplemarketList: [] as Array<ActorSampleMarket>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actorsamplemarket: _.cloneDeep(initialState) as
          | ActorSampleMarket
          | ActorSampleMarketCreateInput
          | ActorSampleMarketUpdateInput,
        actorsamplemarketExcelFile: "" as string,
        actorsamplemarketPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 5,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorSampleMarkets(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.actorSampleMarketControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.actorsamplemarketList = data.paginatedResult;

          this.actorsamplemarketList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.actorsamplemarketPagination = {
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
          this.actorsamplemarketList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorSampleMarkets() {
        try {
          const {
            data,
          } = await service.api.actorSampleMarketControllerFindDataForExcel();
          this.actorsamplemarketExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeleteActorSampleMarket(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorSampleMarketControllerUpdate(payload, {
            deletedAt: new Date(),
          });
          this.error = null;
          this.fetchActorSampleMarkets({
            take: this.actorsamplemarketPagination.take,
            skip: this.actorsamplemarketPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorSampleMarket(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorSampleMarketControllerDelete(
            payload
          );
          this.actorsamplemarketList = this.actorsamplemarketList.filter(
            (actorsamplemarket) => actorsamplemarket.id !== data.id
          );
          this.actorsamplemarketPagination.total--;
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
      async editActorSampleMarket(payload: {
        id: string;
        data?: ActorSampleMarketUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editActorSampleMarketData: ActorSampleMarketUpdateInput =
            payload.data ?? this.actorsamplemarket;
          editActorSampleMarketData.sample =
            editActorSampleMarketData.sample &&
            editActorSampleMarketData.sample.id?.length > 0
              ? editActorSampleMarketData.sample
              : undefined;
          editActorSampleMarketData.listIdMarket =
            editActorSampleMarketData.listIdMarket &&
            editActorSampleMarketData.listIdMarket.id?.length > 0
              ? editActorSampleMarketData.listIdMarket
              : undefined;
          editActorSampleMarketData.ids =
            editActorSampleMarketData.ids &&
            editActorSampleMarketData.ids.id?.length > 0
              ? editActorSampleMarketData.ids
              : undefined;
          const { data } = await service.api.actorSampleMarketControllerUpdate(
            payload.id,
            editActorSampleMarketData
          );
          this.actorsamplemarketList = this.actorsamplemarketList.map((item) =>
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
      async editManyActorSampleMarket(payload: { data: ActorSampleMarketUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorSampleMarketControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorsamplemarketList = this.actorsamplemarketList.map((item) =>
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

      async getActorSampleMarketById(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorSampleMarketControllerFindOne(
            payload
          );
          this.actorsamplemarket = {
            ...data,
            sample: data.sample ? data.sample : { id: "" },
            listIdMarket: data.listIdMarket ? data.listIdMarket : { id: "" },
            ids: data.ids ? data.ids : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetActorSampleMarket();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorSampleMarket(payload?: {
        data: ActorSampleMarketCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createActorSampleMarketData: ActorSampleMarketCreateInput =
            payload?.data ??
            (this.actorsamplemarket as ActorSampleMarketCreateInput);
          createActorSampleMarketData.sample =
            createActorSampleMarketData.sample &&
            createActorSampleMarketData.sample.id?.length > 0
              ? createActorSampleMarketData.sample
              : undefined;
          createActorSampleMarketData.listIdMarket =
            createActorSampleMarketData.listIdMarket &&
            createActorSampleMarketData.listIdMarket.id?.length > 0
              ? createActorSampleMarketData.listIdMarket
              : undefined;
          createActorSampleMarketData.ids =
            createActorSampleMarketData.ids &&
            createActorSampleMarketData.ids.id?.length > 0
              ? createActorSampleMarketData.ids
              : undefined;
          const { data } = await service.api.actorSampleMarketControllerCreate(
            createActorSampleMarketData
          );
          this.actorsamplemarketList = [...this.actorsamplemarketList, data];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorSampleMarket(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorSampleMarketControllerCreateMany(payload);
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorSampleMarket() {
        this.$reset();
      },
      disposeActorSampleMarket() {
        this.$dispose();
      },
    },
  }
);
