import { UserUgaUpdateInput, UserUgaCreateInput, UserUga } from "./../../index";
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
const initialState: UserUga | UserUgaCreateInput | UserUgaUpdateInput = {
  listIdUga: { id: "" },
  user: { id: "" },
};
export const useUserUgaStore = defineStore("useruga-store", {
  state: () => {
    return {
      userugaList: [] as Array<UserUga>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      useruga: _.cloneDeep(initialState) as
        | UserUga
        | UserUgaCreateInput
        | UserUgaUpdateInput,
      userugaExcelFile: "" as string,
      userugaPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserUgas(payload?: IPagination) {
      try {
        const { data } = await service.api.userUgaControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.userugaList = data.paginatedResult;

        this.userugaList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.userugaPagination = {
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
        this.userugaList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserUgas() {
      try {
        const { data } = await service.api.userUgaControllerFindDataForExcel();
        this.userugaExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserUga(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userUgaControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUserUgas({
          take: this.userugaPagination.take,
          skip: this.userugaPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserUga(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userUgaControllerDelete(payload);
        this.userugaList = this.userugaList.filter(
          (useruga) => useruga.id !== data.id
        );
        this.userugaPagination.total--;
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
    async editUserUga(payload: { id: string; data?: UserUgaUpdateInput }) {
      this.isLoading = true;
      try {
        const editUserUgaData: UserUgaUpdateInput =
          payload.data ?? this.useruga;
        editUserUgaData.listIdUga =
          editUserUgaData.listIdUga && editUserUgaData.listIdUga.id?.length > 0
            ? editUserUgaData.listIdUga
            : undefined;
        editUserUgaData.user =
          editUserUgaData.user && editUserUgaData.user.id?.length > 0
            ? editUserUgaData.user
            : undefined;
        const { data } = await service.api.userUgaControllerUpdate(
          payload.id,
          editUserUgaData
        );
        this.userugaList = this.userugaList.map((item) =>
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
      async editManyUserUga(payload: { data: UserUgaUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userUgaControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userugaList = this.userugaList.map((item) =>
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

    async getUserUgaById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userUgaControllerFindOne(payload);
        this.useruga = {
          ...data,
          listIdUga: data.listIdUga ? data.listIdUga : { id: "" },
          user: data.user ? data.user : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserUga();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserUga(payload?: { data: UserUgaCreateInput }) {
      this.isLoading = true;
      try {
        const createUserUgaData: UserUgaCreateInput =
          payload?.data ?? (this.useruga as UserUgaCreateInput);
        createUserUgaData.listIdUga =
          createUserUgaData.listIdUga &&
          createUserUgaData.listIdUga.id?.length > 0
            ? createUserUgaData.listIdUga
            : undefined;
        createUserUgaData.user =
          createUserUgaData.user && createUserUgaData.user.id?.length > 0
            ? createUserUgaData.user
            : undefined;
        const { data } = await service.api.userUgaControllerCreate(
          createUserUgaData
        );
        this.userugaList = [...this.userugaList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserUga(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userUgaControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserUga() {
      this.$reset();
    },
    disposeUserUga() {
      this.$dispose();
    },
  },
});
