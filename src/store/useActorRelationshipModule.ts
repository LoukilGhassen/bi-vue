import {
  ActorRelationshipUpdateInput,
  ActorRelationshipCreateInput,
  ActorRelationship,
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
  | ActorRelationship
  | ActorRelationshipCreateInput
  | ActorRelationshipUpdateInput = {
  deleteCascade: false,
  actor1Object: { id: "" },
  actor2Object: { id: "" },

  listIdActorRelationshipTypeObject: "",
};
export const useActorRelationshipStore = defineStore(
  "actorrelationship-store",
  {
    state: () => {
      return {
        actorrelationshipList: [] as Array<ActorRelationship>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actorrelationship: _.cloneDeep(initialState),
        actorrelationshipExcelFile: "" as string,
        showListAddRow: true,
        actorrelationshipPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorRelationships(payload?: IPagination, options?: any) {
        try {
          const { data } =
            await service.api.actorRelationshipControllerFindMany({
              skip: payload?.skip ?? undefined,
              take: payload?.take ?? undefined,
              ...options,
            });
          this.actorrelationshipList = data.paginatedResult;

          this.actorrelationshipPagination = {
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
          this.actorrelationshipList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorRelationships() {
        try {
          const { data } =
            await service.api.actorRelationshipControllerFindDataForExcel();
          this.actorrelationshipExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorRelationship(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorRelationshipControllerDelete(
            payload
          );
          this.actorrelationshipList = this.actorrelationshipList.filter(
            (actorrelationship) => actorrelationship.id !== data.id
          );
          this.actorrelationshipPagination.total--;
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
      async editActorRelationship(payload: {
        id: string;
        data?: ActorRelationshipUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorRelationshipControllerUpdate(
            payload.id,
            payload.data ?? this.actorrelationship
          );
          this.actorrelationshipList = this.actorrelationshipList.map((item) =>
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
      async editManyActorRelationship(payload: { data: ActorRelationshipUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorRelationshipControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorrelationshipList = this.actorrelationshipList.map((item) =>
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

      async getActorRelationshipById(payload: string) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorRelationshipControllerFindOne(
            payload
          );
          this.actorrelationship = data;
          this.error = null;
        } catch (err: any) {
          this.resetActorRelationship();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorRelationship(payload?: {
        data: ActorRelationshipCreateInput;
      }) {
        this.isLoading = true;
        try {
          const { data } = await service.api.actorRelationshipControllerCreate(
            payload?.data ??
              (this.actorrelationship as ActorRelationshipCreateInput)
          );
          const actorRelationList = this.actorrelationshipList.splice(
            0,
            this.actorrelationshipList.length - 1
          );
          this.actorrelationshipList = [...actorRelationList, data];
          this.actorrelationshipPagination = {
            ...this.actorrelationshipPagination,
            total: this.actorrelationshipPagination.total + 1,
          };

          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorRelationship(payload: any) {
        this.isLoading = true;
        try {
          const { data } =
            await service.api.actorRelationshipControllerCreateMany(payload);
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorRelationship() {
        this.actorrelationship = _.cloneDeep(initialState);
      },
      addActorRelationShip(actorRelation: any) {
        this.actorrelationshipList = [
          ...this.actorrelationshipList,
          actorRelation,
        ];
      },

      deleteEmptyActorRelationShip() {
        this.actorrelationshipList = this.actorrelationshipList.slice(0, -1);
      },
      setShowListAddRow(payload: boolean) {
        this.showListAddRow = payload;
      },
    },
  }
);
