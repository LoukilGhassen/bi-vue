import {
  ActorCompanyUpdateInput,
  ActorCompanyCreateInput,
  ActorCompany,
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
  | ActorCompany
  | ActorCompanyCreateInput
  | ActorCompanyUpdateInput = {
  companyObject: "",
  shortName: "",
  listIdActorCompanyFormObject: { id: "" },
  listIdActorCompanyTypeObject: { id: "" },
  actor: { id: "" },
};
export const useActorCompanyStore = defineStore("actorcompany-store", {
  state: () => {
    return {
      actorcompanyList: [] as Array<ActorCompany>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actorcompany: _.cloneDeep(initialState),
      actorcompanyExcelFile: "" as string,
      actorcompanyPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorCompanies(payload?: IPagination) {
      try {
        const { data } = await service.api.actorCompanyControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.actorcompanyList = data.paginatedResult;

        this.actorcompanyList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.actorcompanyPagination = {
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
        this.actorcompanyList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActorCompanies() {
      try {
        const {
          data,
        } = await service.api.actorCompanyControllerFindDataForExcel();
        this.actorcompanyExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorCompany(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorCompanyControllerDelete(
          payload
        );
        this.actorcompanyList = this.actorcompanyList.filter(
          (actorcompany) => actorcompany.id !== data.id
        );
        this.actorcompanyPagination.total--;
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
    async editActorCompany(payload: {
      id: string;
      data?: ActorCompanyUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorCompanyControllerUpdate(
          payload.id,
          payload.data ?? this.actorcompany
        );
        this.actorcompanyList = this.actorcompanyList.map((item) =>
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
      async editManyActorCompany(payload: { data: ActorCompanyUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorCompanyControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorcompanyList = this.actorcompanyList.map((item) =>
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

    async getActorCompanyById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorCompanyControllerFindOne(
          payload
        );
        this.actorcompany = data;
        this.error = null;
      } catch (err: any) {
        this.resetActorCompany();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorCompany(payload?: { data: ActorCompanyCreateInput }) {
      this.isLoading = true;
      try {
        const actorCompany=  payload?.data ?? (this.actorcompany as ActorCompanyCreateInput)
        const createdActorCompany = {...actorCompany,listIdActorCompanyFormObject:actorCompany.listIdActorCompanyFormObject?.id.length ? actorCompany.listIdActorCompanyFormObject : undefined}   
        console.log(createdActorCompany)
        const { data } = await service.api.actorCompanyControllerCreate(
          createdActorCompany
        );
        this.actorcompanyList = [...this.actorcompanyList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorCompany(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorCompanyControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetActorCompany() {
      this.actorcompany = _.cloneDeep(initialState);
    },
  },
});
