import {
  ActorProductUpdateInput,
  ActorProductCreateInput,
  ActorProduct,
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
  | ActorProduct
  | ActorProductCreateInput
  | ActorProductUpdateInput = {
  name: "",
  description: "",
  listIdProductTypeObject: { id: "" },
};
export const useActorProductStore = defineStore("actorproduct-store", {
  state: () => {
    return {
      actorproductList: [] as Array<ActorProduct>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actorproduct: _.cloneDeep(initialState),
      actorproductExcelFile: "" as string,
      actorproductPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorProducts(payload?: IPagination,options?:any) {
      let actorProducts = [] as Array <ActorProduct>;
      try {
        const { data } = await service.api.actorProductControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
         ...options
        });
        actorProducts = data.paginatedResult ?? [] as Array <ActorProduct>
        this.actorproductList = data.paginatedResult;
        this.actorproductPagination = {
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
        this.actorproductList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        return actorProducts
      }
    },
    async fetchDataExcelActorProducts() {
      try {
        const {
          data,
        } = await service.api.actorProductControllerFindDataForExcel();
        this.actorproductExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorProduct(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorProductControllerDelete(
          payload
        );
        this.actorproductList = this.actorproductList.filter(
          (actorproduct) => actorproduct.id !== data.id
        );
        this.actorproductPagination.total--;
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
    async editActorProduct(payload: {
      id: string;
      data?: ActorProductUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorProductControllerUpdate(
          payload.id,
          payload.data ?? this.actorproduct
        );
        this.actorproductList = this.actorproductList.map((item) =>
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
      async editManyActorProduct(payload: { data: ActorProductUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorProductControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorproductList = this.actorproductList.map((item) =>
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

    async getActorProductById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorProductControllerFindOne(
          payload
        );
        this.actorproduct = data;
        this.error = null;
      } catch (err: any) {
        this.resetActorProduct();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorProduct(payload?: { data: ActorProductCreateInput }) {
      this.isLoading = true;
      try {
        const actorProduct = payload?.data ?? (this.actorproduct as ActorProductCreateInput)
        const newActorProduct = {...actorProduct,listIdProductTypeObject: actorProduct.listIdProductTypeObject?.id.length ? actorProduct.listIdProductTypeObject : undefined}
        const { data } = await service.api.actorProductControllerCreate(
          newActorProduct
        );
        this.actorproductList = [...this.actorproductList, data];
        this.actorproductPagination = {
          ...this.actorproductPagination,
          total: this.actorproductPagination.total + 1, }
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async duplicateActorProduct(id: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorProductControllerDuplicate(id);
        const insertIndex = this.actorproductList.findIndex((item) => item.id === id);
        let products = this.actorproductList;
        products.splice(insertIndex + 1, 0, data);
        this.actorproductList = [...products];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorProduct(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorProductControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetActorProduct() {
      this.actorproduct = _.cloneDeep(initialState);
    },
  },
});
