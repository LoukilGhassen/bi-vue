import {
  PharmaceuticalDelegateUpdateInput,
  PharmaceuticalDelegateCreateInput,
  PharmaceuticalDelegate,
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
  | PharmaceuticalDelegate
  | PharmaceuticalDelegateCreateInput
  | PharmaceuticalDelegateUpdateInput = {
  firstName: "",
  lastName: "",
  telephone: "",
  ids: "",
};
export const usePharmaceuticalDelegateStore = defineStore(
  "pharmaceuticaldelegate-store",
  {
    state: () => {
      return {
        pharmaceuticaldelegateList: [] as Array<PharmaceuticalDelegate>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        pharmaceuticaldelegate: _.cloneDeep(initialState) as
          | PharmaceuticalDelegate
          | PharmaceuticalDelegateCreateInput
          | PharmaceuticalDelegateUpdateInput,
        pharmaceuticaldelegateExcelFile: "" as string,
        pharmaceuticaldelegatePagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 5,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchPharmaceuticalDelegates(payload?: IPagination,options?: object) {
        let delegates = [] as Array<PharmaceuticalDelegate>;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
            ...options
          });
          delegates = data.paginatedResult ?? [] as Array <PharmaceuticalDelegate>
          this.pharmaceuticaldelegateList =data.paginatedResult;
          this.pharmaceuticaldelegatePagination = {
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
          this.pharmaceuticaldelegateList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          return delegates
        }
      },
      async fetchDataExcelPharmaceuticalDelegates() {
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerFindDataForExcel();
          this.pharmaceuticaldelegateExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeletePharmaceuticalDelegate(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerUpdate(
            payload,
            { deletedAt: new Date() }
          );
          this.error = null;
          this.fetchPharmaceuticalDelegates({
            take: this.pharmaceuticaldelegatePagination.take,
            skip: this.pharmaceuticaldelegatePagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deletePharmaceuticalDelegate(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerDelete(payload);
          this.pharmaceuticaldelegateList = this.pharmaceuticaldelegateList.filter(
            (pharmaceuticaldelegate) => pharmaceuticaldelegate.id !== data.id
          );
          this.pharmaceuticaldelegatePagination.total--;
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
      async editPharmaceuticalDelegate(payload: {
        id: string;
        data?: PharmaceuticalDelegateUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editPharmaceuticalDelegateData: PharmaceuticalDelegateUpdateInput =
            payload.data ?? this.pharmaceuticaldelegate;

          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerUpdate(
            payload.id,
            editPharmaceuticalDelegateData
          );
          this.pharmaceuticaldelegateList = this.pharmaceuticaldelegateList.map(
            (item) => (item.id === payload.id ? { ...item, ...data } : item)
          );
          this.error = null;
        } catch (err: any) {
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      } /*
      async editManyPharmaceuticalDelegate(payload: { data: PharmaceuticalDelegateUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.pharmaceuticalDelegateControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.pharmaceuticaldelegateList = this.pharmaceuticaldelegateList.map((item) =>
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

      async getPharmaceuticalDelegateById(payload: string) {
        this.isLoading = true;
        try {
         
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerFindOne(
            payload
          );
         
          this.pharmaceuticaldelegate = {
            ...data
          };
          this.error = null;
        } catch (err: any) {
          this.resetPharmaceuticalDelegate();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createPharmaceuticalDelegate(payload?: {
        data: PharmaceuticalDelegateCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createPharmaceuticalDelegateData: PharmaceuticalDelegateCreateInput =
            payload?.data ??
            (this.pharmaceuticaldelegate as PharmaceuticalDelegateCreateInput);

          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerCreate(
            createPharmaceuticalDelegateData
          );
          this.pharmaceuticaldelegateList = [
            ...this.pharmaceuticaldelegateList,
            data,
          ];
          this.pharmaceuticaldelegatePagination = {
            ...this.pharmaceuticaldelegatePagination,  
            total: this.pharmaceuticaldelegatePagination.total + 1,  
        };
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyPharmaceuticalDelegate(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetPharmaceuticalDelegate() {
        this.$reset();
      },
      disposePharmaceuticalDelegate() {
        this.$dispose();
      },
    },
  }
);
