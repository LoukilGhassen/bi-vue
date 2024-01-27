import {
  ActorTelecomUpdateInput,
  ActorTelecomCreateInput,
  ActorTelecom,
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
  | ActorTelecom
  | ActorTelecomCreateInput
  | ActorTelecomUpdateInput = {
  value: "",
  listIdActorTelecomFamillyObject: { id: "" },
  
};
export const useActorTelecomStore = defineStore("actortelecom-store", {
  state: () => {
    return {
      actortelecomList: [] as Array<ActorTelecom>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actortelecom: _.cloneDeep(initialState),
      actortelecomExcelFile: "" as string,
      actortelecomPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorTelecoms(payload?: IPagination) {
      try {
        const { data } = await service.api.actorTelecomControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.actortelecomList = data.paginatedResult;

        this.actortelecomList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.actortelecomPagination = {
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
        this.actortelecomList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActorTelecoms() {
      try {
        const {
          data,
        } = await service.api.actorTelecomControllerFindDataForExcel();
        this.actortelecomExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorTelecom(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorTelecomControllerDelete(
          payload
        );
        this.actortelecomList = this.actortelecomList.filter(
          (actortelecom) => actortelecom.id !== data.id
        );
        this.actortelecomPagination.total--;
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
    async editActorTelecom(payload: {
      id: string;
      data?: ActorTelecomUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorTelecomControllerUpdate(
          payload.id,
          payload.data ?? this.actortelecom
        );
        this.actortelecomList = this.actortelecomList.map((item) =>
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
      async editManyActorTelecom(payload: { data: ActorTelecomUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorTelecomControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actortelecomList = this.actortelecomList.map((item) =>
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

    async getActorTelecomById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorTelecomControllerFindOne(
          payload
        );
        this.actortelecom = data;
        this.error = null;
      } catch (err: any) {
        this.resetActorTelecom();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorTelecom(payload?: { data: ActorTelecomCreateInput }) {
      this.isLoading = true;
      try {
        const actorTelecom = payload?.data ?? (this.actortelecom as ActorTelecomCreateInput)
        const newActorTelecom = {...actorTelecom,listIdActorTelecomFamillyObject : actorTelecom.listIdActorTelecomFamillyObject?.id.length ? actorTelecom.listIdActorTelecomFamillyObject : undefined }        

        const { data } = await service.api.actorTelecomControllerCreate(
          newActorTelecom
        );
        this.actortelecomList = [...this.actortelecomList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorTelecom(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorTelecomControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetActorTelecom() {
      this.actortelecom = _.cloneDeep(initialState);
    },
  },
});
