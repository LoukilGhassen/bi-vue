import {
  WebElementUpdateInput,
  WebElementCreateInput,
  WebElement,
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
const initialState:
  | WebElement
  | WebElementCreateInput
  | WebElementUpdateInput = {
};
export const useWebElementStore = defineStore("webelement-store", {
  state: () => {
    return {
      webelementList: [] as Array<WebElement>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      webelement: _.cloneDeep(initialState),
      webelementExcelFile: "" as string,
      webElementPermission:{} as any,
      webelementPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchWebElements(payload?: IPagination,options?:any) {
      try {
        const { data } = await service.api.webElementControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.webelementList = data.paginatedResult;

        this.webelementPagination = {
          total: data.totalCount,
          skip: payload?.skip ?? 0,
          take: payload?.take ?? data.totalCount,
        };
        this.error = null;
      } catch (err: any) {
        this.webelementList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchWebElementsPermissions(options?:any) {
      try {
        const { data } = await service.api.webElementControllerFindMany({
          ...options
        });
        const newWebElemnts = data.paginatedResult?.reduce((obj:any, item) => {
          const key = item?.address;
          obj[key] = {permissions : item.roleJPages};
          return obj;
        }, {});
        this.webElementPermission = newWebElemnts;

        this.error = null;
      } catch (err: any) {
        this.webelementList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },

    async fetchDataExcelWebElements() {
      try {
        const {
          data,
        } = await service.api.webElementControllerFindDataForExcel();
        this.webelementExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteWebElement(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.webElementControllerDelete(payload);
        this.webelementList = this.webelementList.filter(
          (webelement) => webelement.id !== data.id
        );
        this.webelementPagination.total--;
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
    async editWebElement(payload: {
      id: string;
      data?: WebElementUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.webElementControllerUpdate(
          payload.id,
          payload.data ?? this.webelement
        );
        this.webelementList = this.webelementList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    } ,

    async getWebElementById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.webElementControllerFindOne(payload);
        this.webelement = data;
        this.error = null;
      } catch (err: any) {
        this.resetWebElement();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createWebElement(payload?: { data: WebElementCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.webElementControllerCreate(
          payload?.data ?? (this.webelement as WebElementCreateInput)
        );
        this.webelementList = [...this.webelementList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyWebElement(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.webElementControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetWebElement() {
      this.webelement = _.cloneDeep(initialState);
    },
    setWebElements(payload: any) {
      this.webelement = {...this.webelement,...payload};
    }
  },
});
