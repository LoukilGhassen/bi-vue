import {
  UserActorRelationshipUpdateInput,
  UserActorRelationshipCreateInput,
  UserActorRelationship,
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
  | UserActorRelationship
  | UserActorRelationshipCreateInput
  | UserActorRelationshipUpdateInput = {
  user: { id: "" },
  listIdUserActorRelationshipType: { id: "" },
  actor: { id: "" },
};
export const useUserActorRelationshipStore = defineStore(
  "useractorrelationship-store",
  {
    state: () => {
      return {
        useractorrelationshipList: [] as Array<UserActorRelationship>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        useractorrelationship: _.cloneDeep(initialState) as
          | UserActorRelationship
          | UserActorRelationshipCreateInput
          | UserActorRelationshipUpdateInput,
        useractorrelationshipExcelFile: "" as string,
        useractorrelationshipPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchUserActorRelationships(payload?: IPagination,options:any) {
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
            ...options
          });
          this.useractorrelationshipList = data.paginatedResult;

          this.useractorrelationshipPagination = {
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
          this.useractorrelationshipList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelUserActorRelationships() {
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerFindDataForExcel();
          this.useractorrelationshipExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeleteUserActorRelationship(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerUpdate(payload, {
            deletedAt: new Date(),
          });
          this.error = null;
          this.fetchUserActorRelationships({
            take: this.useractorrelationshipPagination.take,
            skip: this.useractorrelationshipPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteUserActorRelationship(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerDelete(payload);
          this.useractorrelationshipList = this.useractorrelationshipList.filter(
            (useractorrelationship) => useractorrelationship.id !== data.id
          );
          this.useractorrelationshipPagination.total--;
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
      async editUserActorRelationship(payload: {
        id: string;
        data?: UserActorRelationshipUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editUserActorRelationshipData: UserActorRelationshipUpdateInput =
            payload.data ?? this.useractorrelationship;
          editUserActorRelationshipData.user =
            editUserActorRelationshipData.user &&
            editUserActorRelationshipData.user.id?.length > 0
              ? editUserActorRelationshipData.user
              : undefined;
          editUserActorRelationshipData.listIdUserActorRelationshipType =
            editUserActorRelationshipData.listIdUserActorRelationshipType &&
            editUserActorRelationshipData.listIdUserActorRelationshipType.id
              ?.length > 0
              ? editUserActorRelationshipData.listIdUserActorRelationshipType
              : undefined;
          editUserActorRelationshipData.actor =
            editUserActorRelationshipData.actor &&
            editUserActorRelationshipData.actor.id?.length > 0
              ? editUserActorRelationshipData.actor
              : undefined;
          const {
            data,
          } = await service.api.userActorRelationshipControllerUpdate(
            payload.id,
            editUserActorRelationshipData
          );
          this.useractorrelationshipList = this.useractorrelationshipList.map(
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
      async editManyUserActorRelationship(payload: { data: UserActorRelationshipUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userActorRelationshipControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.useractorrelationshipList = this.useractorrelationshipList.map((item) =>
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

      async getUserActorRelationshipById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerFindOne(payload);
          this.useractorrelationship = {
            ...data,
            user: data.user ? data.user : { id: "" },
            listIdUserActorRelationshipType: data.listIdUserActorRelationshipType
              ? data.listIdUserActorRelationshipType
              : { id: "" },
            actor: data.actor ? data.actor : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetUserActorRelationship();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createUserActorRelationship(payload?: {
        data: UserActorRelationshipCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createUserActorRelationshipData: UserActorRelationshipCreateInput =
            payload?.data ??
            (this.useractorrelationship as UserActorRelationshipCreateInput);
          createUserActorRelationshipData.user =
            createUserActorRelationshipData.user &&
            createUserActorRelationshipData.user.id?.length > 0
              ? createUserActorRelationshipData.user
              : undefined;
          createUserActorRelationshipData.listIdUserActorRelationshipType =
            createUserActorRelationshipData.listIdUserActorRelationshipType &&
            createUserActorRelationshipData.listIdUserActorRelationshipType.id
              ?.length > 0
              ? createUserActorRelationshipData.listIdUserActorRelationshipType
              : undefined;
          createUserActorRelationshipData.actor =
            createUserActorRelationshipData.actor &&
            createUserActorRelationshipData.actor.id?.length > 0
              ? createUserActorRelationshipData.actor
              : undefined;
          const {
            data,
          } = await service.api.userActorRelationshipControllerCreate(
            createUserActorRelationshipData
          );
          this.useractorrelationshipList = [
            ...this.useractorrelationshipList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyUserActorRelationship(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.userActorRelationshipControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetUserActorRelationship() {
        this.$reset();
      },
      disposeUserActorRelationship() {
        this.$dispose();
      },
    },
  }
);
