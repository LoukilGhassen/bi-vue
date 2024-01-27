import {
  SubstituteUpdateInput,
  SubstituteCreateInput,
  Substitute,
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
  | Substitute
  | SubstituteCreateInput
  | SubstituteUpdateInput = {
  substitute: { id: "" },
  substituted: { id: "" },
  firstName: "",
  lastName: "",
  rpps: "",
};
export const useSubstituteStore = defineStore("substitute-store", {
  state: () => {
    return {
      substituteList: [] as Array<Substitute>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      substitute: _.cloneDeep(initialState) as
        | Substitute
        | SubstituteCreateInput
        | SubstituteUpdateInput,
      substituteExcelFile: "" as string,
      substitutePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
      showListAddRow:true
    };
  },

  getters: {},

  actions: {
    async fetchSubstitutes(payload?: IPagination,options?:any) {
      try {      
        const { data } = await service.api.substituteControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.substituteList = data.paginatedResult;
        this.substitutePagination = {
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
        this.substituteList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelSubstitutes() {
      try {
        const {
          data,
        } = await service.api.substituteControllerFindDataForExcel();
        this.substituteExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteSubstitute(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.substituteControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchSubstitutes({
          take: this.substitutePagination.take,
          skip: this.substitutePagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSubstitute(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.substituteControllerDelete(payload);
        this.substituteList = this.substituteList.filter(
          (substitute) => substitute.id !== data.id
        );
        this.substitutePagination.total--;
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
    async editSubstitute(payload: {
      id: string;
      data?: SubstituteUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editSubstituteData: SubstituteUpdateInput =
          payload.data ?? this.substitute;
        editSubstituteData.substitute =
          editSubstituteData.substitute &&
          editSubstituteData.substitute.id?.length > 0
            ? editSubstituteData.substitute
            : undefined;
        editSubstituteData.substituted =
          editSubstituteData.substituted &&
          editSubstituteData.substituted.id?.length > 0
            ? editSubstituteData.substituted
            : undefined;
        const { data } = await service.api.substituteControllerUpdate(
          payload.id,
          editSubstituteData
        );
        this.substituteList = this.substituteList.map((item) =>
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
      async editManySubstitute(payload: { data: SubstituteUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.substituteControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.substituteList = this.substituteList.map((item) =>
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

    async getSubstituteById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.substituteControllerFindOne(payload);
        this.substitute = {
          ...data,
          substitute: data.substitute ? data.substitute : { id: "" },
          substituted: data.substituted ? data.substituted : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetSubstitute();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createSubstitute(payload?: { data: SubstituteCreateInput }) {
      this.isLoading = true;
      try {
        const createSubstituteData: SubstituteCreateInput =
          payload?.data ?? (this.substitute as SubstituteCreateInput);
        createSubstituteData.substitute =
          createSubstituteData.substitute &&
          createSubstituteData.substitute.id?.length > 0
            ? createSubstituteData.substitute
            : undefined;
        createSubstituteData.substituted =
          createSubstituteData.substituted &&
          createSubstituteData.substituted.id?.length > 0
            ? createSubstituteData.substituted
            : undefined;
        const { data } = await service.api.substituteControllerCreate(
          createSubstituteData
        );
        this.substituteList = [...this.substituteList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManySubstitute(payload: any , id: string) {
      this.isLoading = true;
      try {
        const subs = payload.map((sub:any) => {
          return {
            id: sub.id ?? undefined,
            substitute: sub.subId
              ? {
                  id: sub.subId,
                }
              : undefined,
            firstName: sub.firstName,
            lastName: sub.lastName,
            rpps: sub.rpps,
            substituted: {
              id: id,
            },
          };
        });
        const resp = await service.api.substituteControllerCreateMany(
          id,
          subs
        );  
        this.substitutePagination = {
          ...this.substitutePagination,
          total: resp.data.length 
        };  
        this.substituteList = resp.data ?? [];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetSubstitute() {
      this.$reset();
    },
    disposeSubstitute() {
      this.$dispose();
    },
    setShowListAddRow(payload:boolean){
      this.showListAddRow = payload
    },
    addSubstitute(payload:any) {
      this.substituteList = [...this.substituteList ,payload]
    }
  },
});
