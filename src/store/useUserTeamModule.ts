import {
  UserTeamUpdateInput,
  UserTeamCreateInput,
  UserTeam,
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
const initialState: UserTeam | UserTeamCreateInput | UserTeamUpdateInput = {
  user1: { id: "" },
  user2: { id: "" },
};
export const useUserTeamStore = defineStore("userteam-store", {
  state: () => {
    return {
      userteamList: [] as Array<UserTeam>,
      error: null as Object | any,
      showListAddRow: true,
      isLoading: useBodyStore().isLoading,
      userteam: _.cloneDeep(initialState) as
        | UserTeam
        | UserTeamCreateInput
        | UserTeamUpdateInput,
      userteamExcelFile: "" as string,
      userteamPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchUserTeams(payload?: IPagination , options?: any) {
      try {
        const { data } = await service.api.userTeamControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options,
        });
        this.userteamList = data.paginatedResult;

        this.userteamPagination = {
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
        this.userteamList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelUserTeams() {
      try {
        const { data } = await service.api.userTeamControllerFindDataForExcel();
        this.userteamExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteUserTeam(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTeamControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchUserTeams({
          take: this.userteamPagination.take,
          skip: this.userteamPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteUserTeam(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTeamControllerDelete(payload);
        this.userteamList = this.userteamList.filter(
          (userteam) => userteam.id !== data.id
        );
        this.userteamPagination.total--;
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
    async editUserTeam(payload: { id: string; data?: UserTeamUpdateInput }) {
      this.isLoading = true;
      try {
        const editUserTeamData: UserTeamUpdateInput =
          payload.data ?? this.userteam;
        editUserTeamData.user1 =
          editUserTeamData.user1 && editUserTeamData.user1.id?.length > 0
            ? editUserTeamData.user1
            : undefined;
        editUserTeamData.user2 =
          editUserTeamData.user2 && editUserTeamData.user2.id?.length > 0
            ? editUserTeamData.user2
            : undefined;
        const { data } = await service.api.userTeamControllerUpdate(
          payload.id,
          editUserTeamData
        );
        this.userteamList = this.userteamList.map((item) =>
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
      async editManyUserTeam(payload: { data: UserTeamUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.userTeamControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.userteamList = this.userteamList.map((item) =>
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

    async getUserTeamById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTeamControllerFindOne(payload);
        this.userteam = {
          ...data,
          user1: data.user1 ? data.user1 : { id: "" },
          user2: data.user2 ? data.user2 : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetUserTeam();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createUserTeam(payload?: { data: UserTeamCreateInput }) {
      this.isLoading = true;
      try {
        const createUserTeamData: UserTeamCreateInput =
          payload?.data ?? (this.userteam as UserTeamCreateInput);
        createUserTeamData.user1 =
          createUserTeamData.user1 && createUserTeamData.user1.id?.length > 0
            ? createUserTeamData.user1
            : undefined;
        createUserTeamData.user2 =
          createUserTeamData.user2 && createUserTeamData.user2.id?.length > 0
            ? createUserTeamData.user2
            : undefined;
        const { data } = await service.api.userTeamControllerCreate(
          createUserTeamData
        );
        const userteamList = this.userteamList.slice(0,-1);

        this.userteamList = [...userteamList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyUserTeam(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.userTeamControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetUserTeam() {
      this.$reset();
    },
    disposeUserTeam() {
      this.$dispose();
    },
    setShowListAddRow(payload: boolean) {
      this.showListAddRow = payload;
    },
    addUserTeam(userTeam: any) {
      this.userteamList = [
        ...this.userteamList,
        userTeam,
      ];
    },

    deleteEmptyUserTeam() {
      this.userteamList = this.userteamList.slice(0, -1);
    },
  },
});
