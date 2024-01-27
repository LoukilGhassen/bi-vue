import {
  RoleJPageUpdateInput,
  RoleJPageCreateInput,
  RoleJPage,
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
const initialState: RoleJPage | RoleJPageCreateInput | RoleJPageUpdateInput = {
  
  page: { id: "" },
  role: { id: "" },
};
export const useRoleJPageStore = defineStore("rolejpage-store", {
  state: () => {
    return {
      rolejpageList: [] as Array<RoleJPage>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      rolejpage: _.cloneDeep(initialState),
      rolejpageExcelFile: "" as string,
      rolejpagePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchRoleJPages(payload?: IPagination) {
      try {
        const { data } = await service.api.roleJPageControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.rolejpageList = data.paginatedResult;

        this.rolejpageList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.rolejpagePagination = {
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
        this.rolejpageList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelRoleJPages() {
      try {
        const {
          data,
        } = await service.api.roleJPageControllerFindDataForExcel();
        this.rolejpageExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteRoleJPage(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleJPageControllerDelete(payload);
        this.rolejpageList = this.rolejpageList.filter(
          (rolejpage) => rolejpage.id !== data.id
        );
        this.rolejpagePagination.total--;
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
    async editRoleJPage(payload: { id: string; data?: RoleJPageUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleJPageControllerUpdate(
          payload.id,
          payload.data ?? this.rolejpage
        );
        this.rolejpageList = this.rolejpageList.map((item) =>
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
      async editManyRoleJPage(payload: { data: RoleJPageUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.roleJPageControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.rolejpageList = this.rolejpageList.map((item) =>
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

    async getRoleJPageById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleJPageControllerFindOne(payload);
        this.rolejpage = data;
        this.error = null;
      } catch (err: any) {
        this.resetRoleJPage();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createRoleJPage(payload?: { data: RoleJPageCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleJPageControllerCreate(
          payload?.data ?? (this.rolejpage as RoleJPageCreateInput)
        );
        this.rolejpageList = [...this.rolejpageList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyRoleJPage(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleJPageControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetRoleJPage() {
      this.rolejpage = _.cloneDeep(initialState);
    },
  },
});
