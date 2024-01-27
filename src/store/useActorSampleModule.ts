import {
  ActorSampleUpdateInput,
  ActorSampleCreateInput,
  ActorSample,
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
  | ActorSample
  | ActorSampleCreateInput
  | ActorSampleUpdateInput = {
  stockToShip: 0,
  name: "",
  stockQty: 0,
  ids: { id: "" },
};
export const useActorSampleStore = defineStore("actorsample-store", {
  state: () => {
    return {
      actorSampleList: [] as Array<ActorSample>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actorSample: _.cloneDeep(initialState) as
        | ActorSample
        | ActorSampleCreateInput
        | ActorSampleUpdateInput,
      actorSampleExcelFile: "" as string,
      actorSamplePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorSamples(payload?: IPagination,options?:any) {
      try {
        const { data } = await service.api.actorSampleControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.actorSampleList = data.paginatedResult;

        this.actorSamplePagination = {
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
        this.actorSampleList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActorSamples() {
      try {
        const {
          data,
        } = await service.api.actorSampleControllerFindDataForExcel();
        this.actorSampleExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteActorSample(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorSampleControllerUpdate(
          payload,
          { deletedAt: new Date() }
        );
        this.error = null;
        this.fetchActorSamples({
          take: this.actorSamplePagination.take,
          skip: this.actorSamplePagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorSample(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorSampleControllerDelete(payload);
        this.actorSampleList = this.actorSampleList.filter(
          (actorSample) => actorSample.id !== data.id
        );
        this.actorSamplePagination.total--;
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
    async editActorSample(payload: {
      id: string;
      data?: ActorSampleUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editActorSampleData: ActorSampleUpdateInput =
          payload.data ?? this.actorSample;
        editActorSampleData.ids =
          editActorSampleData.ids && editActorSampleData.ids.id?.length > 0
            ? editActorSampleData.ids
            : undefined;
        const { data } = await service.api.actorSampleControllerUpdate(
          payload.id,
          editActorSampleData
        );
        this.actorSampleList = this.actorSampleList.map((item) =>
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
      async editManyActorSample(payload: { data: ActorSampleUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorSampleControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorSampleList = this.actorSampleList.map((item) =>
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

    async getActorSampleById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorSampleControllerFindOne(
          payload
        );
        this.actorSample = {
          ...data,
          ids: data.ids ? data.ids : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetActorSample();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorSample(payload?: { data: ActorSampleCreateInput }) {
      this.isLoading = true;
      try {
        const createActorSampleData: ActorSampleCreateInput =
          payload?.data ?? (this.actorSample as ActorSampleCreateInput);
        createActorSampleData.ids =
          createActorSampleData.ids && createActorSampleData.ids.id?.length > 0
            ? createActorSampleData.ids
            : undefined;
        const { data } = await service.api.actorSampleControllerCreate(
          createActorSampleData
        );
        this.actorSampleList = [...this.actorSampleList, data];
        this.actorSamplePagination = {
          ...this.actorSamplePagination,
          total: this.actorSamplePagination.total + 1,
        };
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorSample(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorSampleControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetActorSample() {
      this.$reset();
    },
    disposeActorSample() {
      this.$dispose();
    },

    toggleActif(val: boolean){
       this.actorSample ={
        ...this.actorSample,
           ids: {
            ...this.actorSample,
            actif: val
           }
 
       }
         
      
     
  }
  },
});
