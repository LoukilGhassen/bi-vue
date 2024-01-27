import {
  PharmaceuticalDelegateUgaUpdateInput,
  PharmaceuticalDelegateUgaCreateInput,
  PharmaceuticalDelegateUga,
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
  | PharmaceuticalDelegateUga
  | PharmaceuticalDelegateUgaCreateInput
  | PharmaceuticalDelegateUgaUpdateInput = {
  pharmaceuticalDelegate: { id: "" },
  listIdUgaObject: { id: "" },
};
export const usePharmaceuticalDelegateUgaStore = defineStore(
  "pharmaceuticaldelegateuga-store",
  {
    state: () => {
      return {
        pharmaceuticaldelegateugaList: [] as Array<PharmaceuticalDelegateUga>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        pharmaceuticaldelegateuga: _.cloneDeep(initialState) as
          | PharmaceuticalDelegateUga
          | PharmaceuticalDelegateUgaCreateInput
          | PharmaceuticalDelegateUgaUpdateInput,
        pharmaceuticaldelegateugaExcelFile: "" as string,
        pharmaceuticaldelegateugaPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 5,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchPharmaceuticalDelegateUgas(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.pharmaceuticaldelegateugaList = data.paginatedResult;

          this.pharmaceuticaldelegateugaList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.pharmaceuticaldelegateugaPagination = {
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
          this.pharmaceuticaldelegateugaList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelPharmaceuticalDelegateUgas() {
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerFindDataForExcel();
          this.pharmaceuticaldelegateugaExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeletePharmaceuticalDelegateUga(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerUpdate(
            payload,
            { deletedAt: new Date() }
          );
          this.error = null;
          this.fetchPharmaceuticalDelegateUgas({
            take: this.pharmaceuticaldelegateugaPagination.take,
            skip: this.pharmaceuticaldelegateugaPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deletePharmaceuticalDelegateUga(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerDelete(
            payload
          );
          this.pharmaceuticaldelegateugaList = this.pharmaceuticaldelegateugaList.filter(
            (pharmaceuticaldelegateuga) =>
              pharmaceuticaldelegateuga.id !== data.id
          );
          this.pharmaceuticaldelegateugaPagination.total--;
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
      async editPharmaceuticalDelegateUga(payload: {
        id: string;
        data?: PharmaceuticalDelegateUgaUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editPharmaceuticalDelegateUgaData: PharmaceuticalDelegateUgaUpdateInput =
            payload.data ?? this.pharmaceuticaldelegateuga;
          editPharmaceuticalDelegateUgaData.pharmaceuticalDelegate =
            editPharmaceuticalDelegateUgaData.pharmaceuticalDelegate &&
            editPharmaceuticalDelegateUgaData.pharmaceuticalDelegate.id
              ?.length > 0
              ? editPharmaceuticalDelegateUgaData.pharmaceuticalDelegate
              : undefined;
          editPharmaceuticalDelegateUgaData.listIdUgaObject =
            editPharmaceuticalDelegateUgaData.listIdUgaObject &&
            editPharmaceuticalDelegateUgaData.listIdUgaObject.id?.length > 0
              ? editPharmaceuticalDelegateUgaData.listIdUgaObject
              : undefined;
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerUpdate(
            payload.id,
            editPharmaceuticalDelegateUgaData
          );
          this.pharmaceuticaldelegateugaList = this.pharmaceuticaldelegateugaList.map(
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
      async editManyPharmaceuticalDelegateUga(payload: { data: PharmaceuticalDelegateUgaUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.pharmaceuticalDelegateUgaControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.pharmaceuticaldelegateugaList = this.pharmaceuticaldelegateugaList.map((item) =>
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

      async getPharmaceuticalDelegateUgaById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerFindOne(
            payload
          );
          this.pharmaceuticaldelegateuga = {
            ...data,
            pharmaceuticalDelegate: data.pharmaceuticalDelegate
              ? data.pharmaceuticalDelegate
              : { id: "" },
            listIdUgaObject: data.listIdUgaObject
              ? data.listIdUgaObject
              : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetPharmaceuticalDelegateUga();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createPharmaceuticalDelegateUga(payload?: {
        data: PharmaceuticalDelegateUgaCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createPharmaceuticalDelegateUgaData: PharmaceuticalDelegateUgaCreateInput =
            payload?.data ??
            (this
              .pharmaceuticaldelegateuga as PharmaceuticalDelegateUgaCreateInput);
          createPharmaceuticalDelegateUgaData.pharmaceuticalDelegate =
            createPharmaceuticalDelegateUgaData.pharmaceuticalDelegate &&
            createPharmaceuticalDelegateUgaData.pharmaceuticalDelegate.id
              ?.length > 0
              ? createPharmaceuticalDelegateUgaData.pharmaceuticalDelegate
              : undefined;
          createPharmaceuticalDelegateUgaData.listIdUgaObject =
            createPharmaceuticalDelegateUgaData.listIdUgaObject &&
            createPharmaceuticalDelegateUgaData.listIdUgaObject.id?.length > 0
              ? createPharmaceuticalDelegateUgaData.listIdUgaObject
              : undefined;
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerCreate(
            createPharmaceuticalDelegateUgaData
          );
          this.pharmaceuticaldelegateugaList = [
            ...this.pharmaceuticaldelegateugaList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyPharmaceuticalDelegateUga(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateUgaControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetPharmaceuticalDelegateUga() {
        this.$reset();
      },
      disposePharmaceuticalDelegateUga() {
        this.$dispose();
      },
    },
  }
);
