import {
  UserTypeUpdateInput,
  UserTypeCreateInput,
  UserType,
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
const initialState: UserType | UserTypeCreateInput | UserTypeUpdateInput = {};
export const useUserTypeStore = defineStore("usertype-store", {
  state: () => {
    return {
      usertypeList: [] as Array<UserType>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      usertype: _.cloneDeep(initialState) as
        | UserType
        | UserTypeCreateInput
        | UserTypeUpdateInput,
      usertypeExcelFile: "" as string,
      usertypePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserTypes(payload?: IPagination) {
      try {
        const { data } = await service.api.userTypeControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.usertypeList = data.paginatedResult;

        this.usertypeList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.usertypePagination = {
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
        this.usertypeList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserTypes() {
      try {
        const { data } = await service.api.userTypeControllerFindDataForExcel();
        this.usertypeExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserType(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTypeControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUserTypes({
          take: this.usertypePagination.take,
          skip: this.usertypePagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserType(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTypeControllerDelete(payload);
        this.usertypeList = this.usertypeList.filter(
          (usertype) => usertype.id !== data.id
        );
        this.usertypePagination.total--;
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
    async editUserType(payload: { id: string; data?: UserTypeUpdateInput }) {
      this.isLoading = true;
      try {
        const editUserTypeData: UserTypeUpdateInput =
          payload.data ?? this.usertype;

        const { data } = await service.api.userTypeControllerUpdate(
          payload.id,
          editUserTypeData
        );
        this.usertypeList = this.usertypeList.map((item) =>
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
      async editManyUserType(payload: { data: UserTypeUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userTypeControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.usertypeList = this.usertypeList.map((item) =>
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

    async getUserTypeById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTypeControllerFindOne(payload);
        this.usertype = {
          ...data,
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserType();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserType(payload?: { data: UserTypeCreateInput }) {
      this.isLoading = true;
      try {
        const createUserTypeData: UserTypeCreateInput =
          payload?.data ?? (this.usertype as UserTypeCreateInput);

        const { data } = await service.api.userTypeControllerCreate(
          createUserTypeData
        );
        this.usertypeList = [...this.usertypeList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserType(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTypeControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserType() {
      this.$reset();
    },
    disposeUserType() {
      this.$dispose();
    },
  },
});
