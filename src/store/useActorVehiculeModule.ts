import {
  ActorVehiculeUpdateInput,
  ActorVehiculeCreateInput,
  ActorVehicule,
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
  | ActorVehicule
  | ActorVehiculeCreateInput
  | ActorVehiculeUpdateInput = {
  immatriculation: "",
  description: "",
  
  listIdVehiculeTypeObject: { id: "" },
};
export const useActorVehiculeStore = defineStore("actorvehicule-store", {
  state: () => {
    return {
      actorvehiculeList: [] as Array<ActorVehicule>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actorvehicule: _.cloneDeep(initialState),
      actorvehiculeExcelFile: "" as string,
      actorvehiculePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorVehicules(payload?: IPagination) {
      try {
        const { data } = await service.api.actorVehiculeControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.actorvehiculeList = data.paginatedResult;

        this.actorvehiculeList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.actorvehiculePagination = {
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
        this.actorvehiculeList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActorVehicules() {
      try {
        const {
          data,
        } = await service.api.actorVehiculeControllerFindDataForExcel();
        this.actorvehiculeExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorVehicule(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorVehiculeControllerDelete(
          payload
        );
        this.actorvehiculeList = this.actorvehiculeList.filter(
          (actorvehicule) => actorvehicule.id !== data.id
        );
        this.actorvehiculePagination.total--;
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
    async editActorVehicule(payload: {
      id: string;
      data?: ActorVehiculeUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorVehiculeControllerUpdate(
          payload.id,
          payload.data ?? this.actorvehicule
        );
        this.actorvehiculeList = this.actorvehiculeList.map((item) =>
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
      async editManyActorVehicule(payload: { data: ActorVehiculeUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorVehiculeControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorvehiculeList = this.actorvehiculeList.map((item) =>
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

    async getActorVehiculeById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorVehiculeControllerFindOne(
          payload
        );
        this.actorvehicule = data;
        this.error = null;
      } catch (err: any) {
        this.resetActorVehicule();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorVehicule(payload?: { data: ActorVehiculeCreateInput }) {
      this.isLoading = true;
      try {
        const actorVehicule =  payload?.data ?? (this.actorvehicule as ActorVehiculeCreateInput)
        const newActorVehicule = {...actorVehicule,listIdVehiculeTypeObject:actorVehicule.listIdVehiculeTypeObject?.id.length ? actorVehicule.listIdVehiculeTypeObject : undefined}
        const { data } = await service.api.actorVehiculeControllerCreate(
          newActorVehicule
        );
        this.actorvehiculeList = [...this.actorvehiculeList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorVehicule(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorVehiculeControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetActorVehicule() {
      this.actorvehicule = _.cloneDeep(initialState);
    },
  },
});
