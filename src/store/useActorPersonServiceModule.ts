import {
  ActorPersonServiceUpdateInput,
  ActorPersonServiceCreateInput,
  ActorPersonService,
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
  | ActorPersonService
  | ActorPersonServiceCreateInput
  | ActorPersonServiceUpdateInput = {
  actorPerson: { id: "" },
  service: { id: "" },
};
export const useActorPersonServiceStore = defineStore(
  "actorpersonservice-store",
  {
    state: () => {
      return {
        actorpersonserviceList: [] as Array<ActorPersonService>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actorpersonservice: _.cloneDeep(initialState) as
          | ActorPersonService
          | ActorPersonServiceCreateInput
          | ActorPersonServiceUpdateInput,
        actorpersonserviceExcelFile: "" as string,
        actorpersonservicePagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorPersonServices(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.actorPersonServiceControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.actorpersonserviceList = data.paginatedResult;

          this.actorpersonserviceList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.actorpersonservicePagination = {
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
          this.actorpersonserviceList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorPersonServices() {
        try {
          const {
            data,
          } = await service.api.actorPersonServiceControllerFindDataForExcel();
          this.actorpersonserviceExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeleteActorPersonService(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorPersonServiceControllerUpdate(payload, {
            deletedAt: new Date(),
          });
          this.error = null;
          this.fetchActorPersonServices({
            take: this.actorpersonservicePagination.take,
            skip: this.actorpersonservicePagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorPersonService(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorPersonServiceControllerDelete(
            payload
          );
          this.actorpersonserviceList = this.actorpersonserviceList.filter(
            (actorpersonservice) => actorpersonservice.id !== data.id
          );
          this.actorpersonservicePagination.total--;
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
      async editActorPersonService(payload: {
        id: string;
        data?: ActorPersonServiceUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editActorPersonServiceData: ActorPersonServiceUpdateInput =
            payload.data ?? this.actorpersonservice;
          editActorPersonServiceData.actorPerson =
            editActorPersonServiceData.actorPerson &&
            editActorPersonServiceData.actorPerson.id?.length > 0
              ? editActorPersonServiceData.actorPerson
              : undefined;
          editActorPersonServiceData.service =
            editActorPersonServiceData.service &&
            editActorPersonServiceData.service.id?.length > 0
              ? editActorPersonServiceData.service
              : undefined;
          const { data } = await service.api.actorPersonServiceControllerUpdate(
            payload.id,
            editActorPersonServiceData
          );
          this.actorpersonserviceList = this.actorpersonserviceList.map(
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
      async editManyActorPersonService(payload: { data: ActorPersonServiceUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorPersonServiceControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorpersonserviceList = this.actorpersonserviceList.map((item) =>
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

      async getActorPersonServiceById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorPersonServiceControllerFindOne(payload);
          this.actorpersonservice = {
            ...data,
            actorPerson: data.actorPerson ? data.actorPerson : { id: "" },
            service: data.service ? data.service : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetActorPersonService();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorPersonService(payload?: {
        data: ActorPersonServiceCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createActorPersonServiceData: ActorPersonServiceCreateInput =
            payload?.data ??
            (this.actorpersonservice as ActorPersonServiceCreateInput);
          createActorPersonServiceData.actorPerson =
            createActorPersonServiceData.actorPerson &&
            createActorPersonServiceData.actorPerson.id?.length > 0
              ? createActorPersonServiceData.actorPerson
              : undefined;
          createActorPersonServiceData.service =
            createActorPersonServiceData.service &&
            createActorPersonServiceData.service.id?.length > 0
              ? createActorPersonServiceData.service
              : undefined;
          const { data } = await service.api.actorPersonServiceControllerCreate(
            createActorPersonServiceData
          );
          this.actorpersonserviceList = [...this.actorpersonserviceList, data];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorPersonService(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorPersonServiceControllerCreateMany(payload);
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorPersonService() {
        this.$reset();
      },
      disposeActorPersonService() {
        this.$dispose();
      },
    },
  }
);
