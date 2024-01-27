import { UserUpdateInput, UserCreateInput, User } from "./../../index";
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
const initialState: User | UserCreateInput | UserUpdateInput = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  roles: "",
};
export const useUserStore = defineStore("user-store", {
  state: () => {
    return {
      userList: [] as Array<User>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      user: _.cloneDeep(initialState),
      userExcelFile: "" as string,
      userPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUsers(payload?: IPagination,options?: object) {
      let users = [] as Array<User>;
      try {
        const { data } = await service.api.userControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
           ...options
        });
        users = data.paginatedResult ?? [] as Array<User>;
        this.userList = data.paginatedResult;

       
        this.userPagination = {
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
        this.userList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        return users
      }
    },
    async fetchDataExcelUsers() {
      try {
        const { data } = await service.api.userControllerFindDataForExcel();
        this.userExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUser(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userControllerUpdate(payload, {
          deletedAt: new Date(),
          
        });
        this.error = null;
        
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },

    async bannUser(payload: any) {
      
      this.isLoading = true;
      try {
        const { data } = await service.api.authControllerChangeBanned( payload.id ,payload);
        this.error = null;
        this.fetchUsers({
          take: this.userPagination.take,
          skip: this.userPagination.skip,
        });
     // to fix update isBanned user after bann 
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteUser(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userControllerDelete(payload);
        this.userList = this.userList.filter((user) => user.id !== data.id);
        this.userPagination.total--;
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
    async editUser(payload: { id: string; data?: UserUpdateInput }) {
      this.isLoading = true;
      const user = payload?.data ?? (this.user as UserCreateInput)
      try {
        const { data } = await service.api.userControllerUpdate(
          payload.id,
          user
        );
        this.userList = this.userList.map((item) =>
          item.id === payload.id ? { ...item, ...data } : item
        );
        this.user = {...this.user , ...data}
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    } /*
      async editManyUser(payload: { data: UserUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userList = this.userList.map((item) =>
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

    async getUserById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userControllerFindOne(payload);
        const ugaList = data.ugaList?.map((e)=>e.listIdUgaObject)
        const contacts = data.contacts?.map((e)=>e.listIContactObject)
        const specialities = data.specialities?.map((e)=>e.listIdSpecialityObject)
        const user1Team = data.user1Team?.map((e)=>e.user2).concat(data.user2Team?.map((e)=>e.user1))
        const user2Team = undefined
        const userTypes = data.userTypes?.map((e)=>e.role)
        const departments = data.departments?.map((e)=>e.listIdDepartmentObject)
        this.user = {...data,ugaList,contacts,specialities,user2Team,user1Team,userTypes,departments};
        this.error = null;
      } catch (err: any) {
        this.resetUser();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUser(payload?: { data: UserCreateInput }) {
      this.isLoading = true;
      try {
        const user = payload?.data ?? (this.user as UserCreateInput)
        const { data } = await service.api.authControllerInviteUserByEmail(
          payload.data
        );
        this.userList = [...this.userList, data];
        this.userPagination = {
          ...this.userPagination,
          total: this.userPagination.total + 1
        } 
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUser(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUser() {
      this.user = _.cloneDeep(initialState);
    },
  },
});
