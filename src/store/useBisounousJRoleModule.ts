import {
  BisounousJRoleUpdateInput,
  BisounousJRoleCreateInput,
  BisounousJRole,
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
  | BisounousJRole
  | BisounousJRoleCreateInput
  | BisounousJRoleUpdateInput = {
  role: { id: "" },
  bisousnours: { id: "" },
  
};
export const useBisounousJRoleStore = defineStore("bisounousjrole-store", {
  state: () => {
    return {
      bisounousjroleList: [] as Array<BisounousJRole>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      bisounousjrole: _.cloneDeep(initialState),
      bisounousjroleExcelFile: "" as string,
      bisounousjrolePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchBisounousJRoles(payload?: IPagination) {
      try {
        const { data } = await service.api.bisounousJRoleControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.bisounousjroleList = data.paginatedResult;

        this.bisounousjroleList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.bisounousjrolePagination = {
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
        this.bisounousjroleList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelBisounousJRoles() {
      try {
        const {
          data,
        } = await service.api.bisounousJRoleControllerFindDataForExcel();
        this.bisounousjroleExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteBisounousJRole(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounousJRoleControllerDelete(
          payload
        );
        this.bisounousjroleList = this.bisounousjroleList.filter(
          (bisounousjrole) => bisounousjrole.id !== data.id
        );
        this.bisounousjrolePagination.total--;
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
    async editBisounousJRole(payload: {
      id: string;
      data?: BisounousJRoleUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounousJRoleControllerUpdate(
          payload.id,
          payload.data ?? this.bisounousjrole
        );
        this.bisounousjroleList = this.bisounousjroleList.map((item) =>
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
      async editManyBisounousJRole(payload: { data: BisounousJRoleUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.bisounousJRoleControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.bisounousjroleList = this.bisounousjroleList.map((item) =>
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

    async getBisounousJRoleById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounousJRoleControllerFindOne(
          payload
        );
        this.bisounousjrole = data;
        this.error = null;
      } catch (err: any) {
        this.resetBisounousJRole();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createBisounousJRole(payload?: { data: BisounousJRoleCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounousJRoleControllerCreate(
          payload?.data ?? (this.bisounousjrole as BisounousJRoleCreateInput)
        );
        this.bisounousjroleList = [...this.bisounousjroleList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyBisounousJRole(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.bisounousJRoleControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetBisounousJRole() {
      this.bisounousjrole = _.cloneDeep(initialState);
    },
  },
});
