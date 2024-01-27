import { RoleUpdateInput, RoleCreateInput, Role } from "./../../index";
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
const initialState: Role | RoleCreateInput | RoleUpdateInput = {
  deleteDate: "2023-04-26T16:35:09.640Z",
  
  roleName: "",
  creationDate: "2023-04-26T16:35:09.640Z",
};
export const useRoleStore = defineStore("role-store", {
  state: () => {
    return {
      roleList: [] as Array<Role>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      role: _.cloneDeep(initialState),
      roleExcelFile: "" as string,
      rolePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchRoles(payload?: IPagination,options?:Object) {
      try {
        const { data } = await service.api.roleControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.roleList = data.paginatedResult;

        this.roleList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.rolePagination = {
          total: data.totalCount,
          skip: payload?.skip ?? 0,
          take: payload?.take ?? data.totalCount,
        };
        this.error = null;
      } catch (err: any) {
        this.roleList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelRoles() {
      try {
        const { data } = await service.api.roleControllerFindDataForExcel();
        this.roleExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteRole(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleControllerDelete(payload);
        this.roleList = this.roleList.filter((role) => role.id !== data.id);
        this.rolePagination.total--;
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
    async editRole(payload: { id: string; data?: RoleUpdateInput }) {
      this.isLoading = true;
      const editedRole = {
        ...payload.data,
        roleJPages: Object.values(payload.data.roleJPages),
      };   
      try {
        const { data } = await service.api.roleControllerUpdate(
          payload.id,
          editedRole ?? this.role
        );
        this.roleList = this.roleList.map((item) =>
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
      async editManyRole(payload: { data: RoleUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.roleControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.roleList = this.roleList.map((item) =>
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

    async getRoleById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleControllerFindOne(payload);
        this.role = data;
        const rolePages = this.role?.roleJPages?.reduce((obj, item)=>{
          const key = item.page.address;
          obj[key]= item
          return obj
        },{})
        this.role.roleJPages = rolePages
        this.error = null;
      } catch (err: any) {
        this.resetRole();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createRole(payload?: { data: RoleCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleControllerCreate(
          payload?.data ?? (this.role as RoleCreateInput)
        );
        this.roleList = [...this.roleList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyRole(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.roleControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetRole() {
      this.role = _.cloneDeep(initialState);
    },
  },
});
