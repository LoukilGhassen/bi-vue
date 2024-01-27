import {
  ListTypeUpdateInput,
  ListTypeCreateInput,
  ListType,
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
const initialState: ListType | ListTypeCreateInput | ListTypeUpdateInput = {
  listTypeName: "",
};
export const useListTypeStore = defineStore("listtype-store", {
  state: () => {
    return {
      listtypeList: [] as Array<ListType>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      listtype: _.cloneDeep(initialState),
      listtypeExcelFile: "" as string,
      listtypePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchListTypes(payload?: IPagination) {
      try {
        const { data } = await service.api.listTypeControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.listtypeList = data.paginatedResult;

        this.listtypeList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.listtypePagination = {
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
        this.listtypeList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelListTypes() {
      try {
        const { data } = await service.api.listTypeControllerFindDataForExcel();
        this.listtypeExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteListType(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listTypeControllerDelete(payload);
        this.listtypeList = this.listtypeList.filter(
          (listtype) => listtype.id !== data.id
        );
        this.listtypePagination.total--;
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
    async editListType(payload: { id: string; data?: ListTypeUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listTypeControllerUpdate(
          payload.id,
          payload.data ?? this.listtype
        );
        this.listtypeList = this.listtypeList.map((item) =>
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
      async editManyListType(payload: { data: ListTypeUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.listTypeControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.listtypeList = this.listtypeList.map((item) =>
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

    async getListTypeById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listTypeControllerFindOne(payload);
        this.listtype = data;
        this.error = null;
      } catch (err: any) {
        this.resetListType();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createListType(payload?: { data: ListTypeCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listTypeControllerCreate(
          payload?.data ?? (this.listtype as ListTypeCreateInput)
        );
        this.listtypeList = [...this.listtypeList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyListType(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listTypeControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetListType() {
      this.listtype = _.cloneDeep(initialState);
    },
  },
});
