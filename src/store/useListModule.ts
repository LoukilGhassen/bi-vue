import { ListUpdateInput, ListCreateInput, List } from "./../../index";
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
const initialState: List | ListCreateInput | ListUpdateInput = {
  code: "",
  tag: "",
  captionFr: "",
  sortIndex: 0,
  listTypeNameObject: { listTypeName: "" },
  listsId: "",
};
export const useListStore = defineStore("list-store", {
  state: () => {
    return {
      listList: [] as Array<List>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      list: _.cloneDeep(initialState),
      listExcelFile: "" as string,
      listPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchLists(listType: string, payload?: IPagination, options?: object) {
    
      try {
        const { data } = await service.api.listControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          "where[listTypeName]": listType,
          ...options
        });
        this.listList = data.paginatedResult;

        this.listPagination = {
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
        this.listList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelLists() {
      try {
        const { data } = await service.api.listControllerFindDataForExcel();
        this.listExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteList(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listControllerDelete(payload);
        this.listList = this.listList.filter((list) => list.id !== data.id);
        this.listPagination.total--;
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
    async editList(payload: { id: string; data?: ListUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listControllerUpdate(
          payload.id,
          {},
          payload.data ?? this.list
        );
        this.listList = this.listList.map((item) =>
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
      async editManyList(payload: { data: ListUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.listControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.listList = this.listList.map((item) =>
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

    async getListById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listControllerFindOne(payload);
        this.list = data;
        this.error = null;
      } catch (err: any) {
        this.resetList();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createList(payload?: { data: ListCreateInput }) {
      this.isLoading = true;
      const list = payload?.data ?? (this.list as ListCreateInput);
      const createdList = {
        ...list,
        listTypeNameObject: list.listTypeNameObject?.listTypeName.length
          ? list.listTypeNameObject
          : undefined,
      };
      try {
        const { data } = await service.api.listControllerCreate(createdList);
        this.listList = [...this.listList, data];
        this.listPagination = {
          ...this.listPagination,
          total: this.listPagination.total + 1, }
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyList(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.listControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetList() {
      this.list = _.cloneDeep(initialState);
    },
  },
});
