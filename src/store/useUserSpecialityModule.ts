import {
  UserSpecialityUpdateInput,
  UserSpecialityCreateInput,
  UserSpeciality,
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
  | UserSpeciality
  | UserSpecialityCreateInput
  | UserSpecialityUpdateInput = {
  user: { id: "" },
  listIdSpecialityObject: { id: "" },
};
export const useUserSpecialityStore = defineStore("userspeciality-store", {
  state: () => {
    return {
      userspecialityList: [] as Array<UserSpeciality>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      userspeciality: _.cloneDeep(initialState) as
        | UserSpeciality
        | UserSpecialityCreateInput
        | UserSpecialityUpdateInput,
      userspecialityExcelFile: "" as string,
      userspecialityPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserSpecialities(payload?: IPagination) {
      try {
        const { data } = await service.api.userSpecialityControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.userspecialityList = data.paginatedResult;

        this.userspecialityList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.userspecialityPagination = {
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
        this.userspecialityList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserSpecialities() {
      try {
        const {
          data,
        } = await service.api.userSpecialityControllerFindDataForExcel();
        this.userspecialityExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserSpeciality(payload: string) {
      this.isLoading = true;
      try {
        const {
          data,
        } = await service.api.userSpecialityControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUserSpecialities({
          take: this.userspecialityPagination.take,
          skip: this.userspecialityPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserSpeciality(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userSpecialityControllerDelete(
          payload
        );
        this.userspecialityList = this.userspecialityList.filter(
          (userspeciality) => userspeciality.id !== data.id
        );
        this.userspecialityPagination.total--;
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
    async editUserSpeciality(payload: {
      id: string;
      data?: UserSpecialityUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editUserSpecialityData: UserSpecialityUpdateInput =
          payload.data ?? this.userspeciality;
        editUserSpecialityData.user =
          editUserSpecialityData.user &&
          editUserSpecialityData.user.id?.length > 0
            ? editUserSpecialityData.user
            : undefined;
        editUserSpecialityData.listIdSpecialityObject =
          editUserSpecialityData.listIdSpecialityObject &&
          editUserSpecialityData.listIdSpecialityObject.id?.length > 0
            ? editUserSpecialityData.listIdSpecialityObject
            : undefined;
        const { data } = await service.api.userSpecialityControllerUpdate(
          payload.id,
          editUserSpecialityData
        );
        this.userspecialityList = this.userspecialityList.map((item) =>
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
      async editManyUserSpeciality(payload: { data: UserSpecialityUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userSpecialityControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userspecialityList = this.userspecialityList.map((item) =>
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

    async getUserSpecialityById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userSpecialityControllerFindOne(
          payload
        );
        this.userspeciality = {
          ...data,
          user: data.user ? data.user : { id: "" },
          listIdSpecialityObject: data.listIdSpecialityObject
            ? data.listIdSpecialityObject
            : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserSpeciality();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserSpeciality(payload?: { data: UserSpecialityCreateInput }) {
      this.isLoading = true;
      try {
        const createUserSpecialityData: UserSpecialityCreateInput =
          payload?.data ?? (this.userspeciality as UserSpecialityCreateInput);
        createUserSpecialityData.user =
          createUserSpecialityData.user &&
          createUserSpecialityData.user.id?.length > 0
            ? createUserSpecialityData.user
            : undefined;
        createUserSpecialityData.listIdSpecialityObject =
          createUserSpecialityData.listIdSpecialityObject &&
          createUserSpecialityData.listIdSpecialityObject.id?.length > 0
            ? createUserSpecialityData.listIdSpecialityObject
            : undefined;
        const { data } = await service.api.userSpecialityControllerCreate(
          createUserSpecialityData
        );
        this.userspecialityList = [...this.userspecialityList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserSpeciality(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userSpecialityControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserSpeciality() {
      this.$reset();
    },
    disposeUserSpeciality() {
      this.$dispose();
    },
  },
});
