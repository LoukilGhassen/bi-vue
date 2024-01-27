import {
  WebElementJListFilterUpdateInput,
  WebElementJListFilterCreateInput,
  WebElementJListFilter,
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
  | WebElementJListFilter
  | WebElementJListFilterCreateInput
  | WebElementJListFilterUpdateInput = {
  htmlControlName: "",
  listTypeNameObject: { listTypeName: "" },
  
  webElement: { id: "" },
};
export const useWebElementJListFilterStore = defineStore(
  "webelementjlistfilter-store",
  {
    state: () => {
      return {
        webelementjlistfilterList: [] as Array<WebElementJListFilter>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        webelementjlistfilter: _.cloneDeep(initialState),
        webelementjlistfilterExcelFile: "" as string,
        webelementjlistfilterPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchWebElementJListFilters(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.webelementjlistfilterList = data.paginatedResult;

          this.webelementjlistfilterList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.webelementjlistfilterPagination = {
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
          this.webelementjlistfilterList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelWebElementJListFilters() {
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerFindDataForExcel();
          this.webelementjlistfilterExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteWebElementJListFilter(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerDelete(payload);
          this.webelementjlistfilterList = this.webelementjlistfilterList.filter(
            (webelementjlistfilter) => webelementjlistfilter.id !== data.id
          );
          this.webelementjlistfilterPagination.total--;
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
      async editWebElementJListFilter(payload: {
        id: string;
        data?: WebElementJListFilterUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerUpdate(
            payload.id,
            payload.data ?? this.webelementjlistfilter
          );
          this.webelementjlistfilterList = this.webelementjlistfilterList.map(
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
      async editManyWebElementJListFilter(payload: { data: WebElementJListFilterUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.webElementJListFilterControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.webelementjlistfilterList = this.webelementjlistfilterList.map((item) =>
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

      async getWebElementJListFilterById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerFindOne(payload);
          this.webelementjlistfilter = data;
          this.error = null;
        } catch (err: any) {
          this.resetWebElementJListFilter();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createWebElementJListFilter(payload?: {
        data: WebElementJListFilterCreateInput;
      }) {
        this.isLoading = true;
        try {
          const webElementJListFilter = payload?.data ?? (this.webelementjlistfilter as WebElementJListFilterCreateInput)
          const newWebElementJListFilter = {...webElementJListFilter,listTypeNameObject:webElementJListFilter.listTypeNameObject?.listTypeName.length ? webElementJListFilter.listTypeNameObject : undefined}
          const {
            data,
          } = await service.api.webElementJListFilterControllerCreate(
            newWebElementJListFilter
          );
          this.webelementjlistfilterList = [
            ...this.webelementjlistfilterList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyWebElementJListFilter(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.webElementJListFilterControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetWebElementJListFilter() {
        this.webelementjlistfilter = _.cloneDeep(initialState);
      },
    },
  }
);
