import {
  UserContactUpdateInput,
  UserContactCreateInput,
  UserContact,
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
  | UserContact
  | UserContactCreateInput
  | UserContactUpdateInput = {
  user: { id: "" },
  listIContactObject: { id: "" },
};
export const useUserContactStore = defineStore("usercontact-store", {
  state: () => {
    return {
      usercontactList: [] as Array<UserContact>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      usercontact: _.cloneDeep(initialState) as
        | UserContact
        | UserContactCreateInput
        | UserContactUpdateInput,
      usercontactExcelFile: "" as string,
      usercontactPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserContacts(payload?: IPagination) {
      try {
        const { data } = await service.api.userContactControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.usercontactList = data.paginatedResult;

        this.usercontactList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.usercontactPagination = {
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
        this.usercontactList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserContacts() {
      try {
        const {
          data,
        } = await service.api.userContactControllerFindDataForExcel();
        this.usercontactExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserContact(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userContactControllerUpdate(
          payload,
          { deletedAt: new Date() }
        );
        this.error = null;
        this.fetchUserContacts({
          take: this.usercontactPagination.take,
          skip: this.usercontactPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserContact(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userContactControllerDelete(payload);
        this.usercontactList = this.usercontactList.filter(
          (usercontact) => usercontact.id !== data.id
        );
        this.usercontactPagination.total--;
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
    async editUserContact(payload: {
      id: string;
      data?: UserContactUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editUserContactData: UserContactUpdateInput =
          payload.data ?? this.usercontact;
        editUserContactData.user =
          editUserContactData.user && editUserContactData.user.id?.length > 0
            ? editUserContactData.user
            : undefined;
        editUserContactData.listIContactObject =
          editUserContactData.listIContactObject &&
          editUserContactData.listIContactObject.id?.length > 0
            ? editUserContactData.listIContactObject
            : undefined;
        const { data } = await service.api.userContactControllerUpdate(
          payload.id,
          editUserContactData
        );
        this.usercontactList = this.usercontactList.map((item) =>
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
      async editManyUserContact(payload: { data: UserContactUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userContactControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.usercontactList = this.usercontactList.map((item) =>
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

    async getUserContactById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userContactControllerFindOne(
          payload
        );
        this.usercontact = {
          ...data,
          user: data.user ? data.user : { id: "" },
          listIContactObject: data.listIContactObject
            ? data.listIContactObject
            : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserContact();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserContact(payload?: { data: UserContactCreateInput }) {
      this.isLoading = true;
      try {
        const createUserContactData: UserContactCreateInput =
          payload?.data ?? (this.usercontact as UserContactCreateInput);
        createUserContactData.user =
          createUserContactData.user &&
          createUserContactData.user.id?.length > 0
            ? createUserContactData.user
            : undefined;
        createUserContactData.listIContactObject =
          createUserContactData.listIContactObject &&
          createUserContactData.listIContactObject.id?.length > 0
            ? createUserContactData.listIContactObject
            : undefined;
        const { data } = await service.api.userContactControllerCreate(
          createUserContactData
        );
        this.usercontactList = [...this.usercontactList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserContact(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userContactControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserContact() {
      this.$reset();
    },
    disposeUserContact() {
      this.$dispose();
    },
  },
});
