import {
  ActorActorProductUpdateInput,
  ActorActorProductCreateInput,
  ActorActorProduct,
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
  | ActorActorProduct
  | ActorActorProductCreateInput
  | ActorActorProductUpdateInput = {
  actor: { id: "" },
  actorProductObject: { id: "" },
};
export const useActorActorProductStore = defineStore(
  "actoractorproduct-store",
  {
    state: () => {
      return {
        actoractorproductList: [] as Array<ActorActorProduct>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actoractorproduct: _.cloneDeep(initialState) as
          | ActorActorProduct
          | ActorActorProductCreateInput
          | ActorActorProductUpdateInput,
        actoractorproductExcelFile: "" as string,
        showListAddRow:true,
        actoractorproductPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorActorProducts(id?: string, payload?: IPagination , options?:any) {
        try {
          const {
            data,
          } = await service.api.actorActorProductControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
            "where[actorId][equals]": id
          ? `${id}`
          : "",
          ...options
          });
          this.actoractorproductList = data.paginatedResult;

          // this.actoractorproductList.forEach((element) => {
          //   for (const [key, value] of Object.entries(element)) {
          //     if (typeof value == "object" && value) {
          //       element[key] = Object.values(value);
          //     }
          //   }
          // });
          this.actoractorproductPagination = {
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
          this.actoractorproductList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorActorProducts() {
        try {
          const {
            data,
          } = await service.api.actorActorProductControllerFindDataForExcel();
          this.actoractorproductExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeleteActorActorProduct(id?: string ,payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorProductControllerUpdate(payload, {
            deletedAt: new Date(),
          });
          this.error = null;
          this.fetchActorActorProducts(id,{
            take: this.actoractorproductPagination.take,
            skip: this.actoractorproductPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorActorProduct(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorActorProductControllerDelete(
            payload
          );
          this.actoractorproductList = this.actoractorproductList.filter(
            (actoractorproduct) => actoractorproduct.id !== data.id
          );
          this.actoractorproductPagination.total--;
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
      async editActorActorProduct(payload: {
        id: string;
        data?: ActorActorProductUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorActorProductControllerUpdate(
            payload.id,
            payload.data ?? this.actoractorproduct
          );
          this.actoractorproductList = this.actoractorproductList.map((item) =>
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
      async editManyActorActorProduct(payload: { data: ActorActorProductUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorActorProductControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actoractorproductList = this.actoractorproductList.map((item) =>
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

      async getActorActorProductById(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorActorProductControllerFindOne(
            payload
          );
          this.actoractorproduct = data;
          this.error = null;
        } catch (err: any) {
          this.resetActorActorProduct();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorActorProduct(payload?: {
        data: ActorActorProductCreateInput;
      }) {
                this.isLoading = true;
        try {
          const { data } = await service.api.actorActorProductControllerCreate(
            payload?.data ??
              (this.actoractorproduct as ActorActorProductCreateInput)
          );
          const productList = this.actoractorproductList.splice(0,this.actoractorproductList.length-1)
          this.actoractorproductList = [...productList,data]
          this.actoractorproductPagination = {
            ...this.actoractorproductPagination,
            total: this.actoractorproductPagination.total + 1,
          };
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      // async createManyActorActorProduct(payload: any) {
      //   this.isLoading = true;
      //   try {
      //     const {
      //       data,
      //     } = await service.api.actorActorProductControllerCreateMany(payload);
      //     this.error = null;
      //   } catch (err: any) {
      //     this.error = err.error;
      //   } finally {
      //     this.isLoading = false;
      //   }
      // },

      resetActorActorProduct() {
        this.actoractorproduct = _.cloneDeep(initialState);
      },
       addActorProduct(product: any){
    this.actoractorproductList = [...this.actoractorproductList , product]
    },
    deleteEmptyActorProduct(){
        this.actoractorproductList = this.actoractorproductList.slice(0, -1);
    },
    setShowListAddRow(payload:boolean){
      this.showListAddRow = payload
    }
    },
  }
);
