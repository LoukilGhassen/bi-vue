import {
  UserWebElementUpdateInput,
  UserWebElementCreateInput,
  UserWebElement,
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
  | UserWebElement
  | UserWebElementCreateInput
  | UserWebElementUpdateInput = { user: { id: "" }, webElement: { id: "" } };
export const useUserWebElementStore = defineStore("userwebelement-store", {
  state: () => {
    return {
      userwebelementList: [] as Array<UserWebElement>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      userwebelement: _.cloneDeep(initialState) as
        | UserWebElement
        | UserWebElementCreateInput
        | UserWebElementUpdateInput,
      userwebelementExcelFile: "" as string,
      userwebelementPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserWebElements(payload?: IPagination) {
      try {
        const { data } = await service.api.userWebElementControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.userwebelementList = data.paginatedResult;

        this.userwebelementList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.userwebelementPagination = {
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
        this.userwebelementList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserWebElements() {
      try {
        const {
          data,
        } = await service.api.userWebElementControllerFindDataForExcel();
        this.userwebelementExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserWebElement(payload: string) {
      this.isLoading = true;
      try {
        const {
          data,
        } = await service.api.userWebElementControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUserWebElements({
          take: this.userwebelementPagination.take,
          skip: this.userwebelementPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserWebElement(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userWebElementControllerDelete(
          payload
        );
        this.userwebelementList = this.userwebelementList.filter(
          (userwebelement) => userwebelement.id !== data.id
        );
        this.userwebelementPagination.total--;
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
    async editUserWebElement(payload: {
      id: string;
      data?: UserWebElementUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editUserWebElementData: UserWebElementUpdateInput =
          payload.data ?? this.userwebelement;
        editUserWebElementData.user =
          editUserWebElementData.user &&
          editUserWebElementData.user.id?.length > 0
            ? editUserWebElementData.user
            : undefined;
        editUserWebElementData.webElement =
          editUserWebElementData.webElement &&
          editUserWebElementData.webElement.id?.length > 0
            ? editUserWebElementData.webElement
            : undefined;
        const { data } = await service.api.userWebElementControllerUpdate(
          payload.id,
          editUserWebElementData
        );
        this.userwebelementList = this.userwebelementList.map((item) =>
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
      async editManyUserWebElement(payload: { data: UserWebElementUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userWebElementControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userwebelementList = this.userwebelementList.map((item) =>
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

    async getUserWebElementById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userWebElementControllerFindOne(
          payload
        );
        this.userwebelement = {
          ...data,
          user: data.user ? data.user : { id: "" },
          webElement: data.webElement ? data.webElement : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserWebElement();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserWebElement(payload?: { data: UserWebElementCreateInput }) {
      this.isLoading = true;
      try {
        const createUserWebElementData: UserWebElementCreateInput =
          payload?.data ?? (this.userwebelement as UserWebElementCreateInput);
        createUserWebElementData.user =
          createUserWebElementData.user &&
          createUserWebElementData.user.id?.length > 0
            ? createUserWebElementData.user
            : undefined;
        createUserWebElementData.webElement =
          createUserWebElementData.webElement &&
          createUserWebElementData.webElement.id?.length > 0
            ? createUserWebElementData.webElement
            : undefined;
        const { data } = await service.api.userWebElementControllerCreate(
          createUserWebElementData
        );
        this.userwebelementList = [...this.userwebelementList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserWebElement(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userWebElementControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserWebElement() {
      this.$reset();
    },
    disposeUserWebElement() {
      this.$dispose();
    },
  },
});
