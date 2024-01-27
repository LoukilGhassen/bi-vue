import {
  PharmaceuticalDelegateDepartmentUpdateInput,
  PharmaceuticalDelegateDepartmentCreateInput,
  PharmaceuticalDelegateDepartment,
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
  | PharmaceuticalDelegateDepartment
  | PharmaceuticalDelegateDepartmentCreateInput
  | PharmaceuticalDelegateDepartmentUpdateInput = {
  listIdDepartmentObject: { id: "" },
  pharmaceuticalDelegate: { id: "" },
};
export const usePharmaceuticalDelegateDepartmentStore = defineStore(
  "pharmaceuticaldelegatedepartment-store",
  {
    state: () => {
      return {
        pharmaceuticaldelegatedepartmentList: [] as Array<
          PharmaceuticalDelegateDepartment
        >,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        pharmaceuticaldelegatedepartment: _.cloneDeep(initialState) as
          | PharmaceuticalDelegateDepartment
          | PharmaceuticalDelegateDepartmentCreateInput
          | PharmaceuticalDelegateDepartmentUpdateInput,
        pharmaceuticaldelegatedepartmentExcelFile: "" as string,
        pharmaceuticaldelegatedepartmentPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 5,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchPharmaceuticalDelegateDepartments(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerFindMany(
            {
              skip: payload?.skip ?? undefined,
              take: payload?.take ?? undefined,
            }
          );
          this.pharmaceuticaldelegatedepartmentList = data.paginatedResult;

          this.pharmaceuticaldelegatedepartmentList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.pharmaceuticaldelegatedepartmentPagination = {
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
          this.pharmaceuticaldelegatedepartmentList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelPharmaceuticalDelegateDepartments() {
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerFindDataForExcel();
          this.pharmaceuticaldelegatedepartmentExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async softDeletePharmaceuticalDelegateDepartment(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerUpdate(
            payload,
            { deletedAt: new Date() }
          );
          this.error = null;
          this.fetchPharmaceuticalDelegateDepartments({
            take: this.pharmaceuticaldelegatedepartmentPagination.take,
            skip: this.pharmaceuticaldelegatedepartmentPagination.skip,
          });
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
          this.isLoading = false;
        } finally {
          this.isLoading = false;
        }
      },
      async deletePharmaceuticalDelegateDepartment(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerDelete(
            payload
          );
          this.pharmaceuticaldelegatedepartmentList = this.pharmaceuticaldelegatedepartmentList.filter(
            (pharmaceuticaldelegatedepartment) =>
              pharmaceuticaldelegatedepartment.id !== data.id
          );
          this.pharmaceuticaldelegatedepartmentPagination.total--;
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
      async editPharmaceuticalDelegateDepartment(payload: {
        id: string;
        data?: PharmaceuticalDelegateDepartmentUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const editPharmaceuticalDelegateDepartmentData: PharmaceuticalDelegateDepartmentUpdateInput =
            payload.data ?? this.pharmaceuticaldelegatedepartment;
          editPharmaceuticalDelegateDepartmentData.listIdDepartmentObject =
            editPharmaceuticalDelegateDepartmentData.listIdDepartmentObject &&
            editPharmaceuticalDelegateDepartmentData.listIdDepartmentObject.id
              ?.length > 0
              ? editPharmaceuticalDelegateDepartmentData.listIdDepartmentObject
              : undefined;
          editPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate =
            editPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate &&
            editPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate.id
              ?.length > 0
              ? editPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate
              : undefined;
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerUpdate(
            payload.id,
            editPharmaceuticalDelegateDepartmentData
          );
          this.pharmaceuticaldelegatedepartmentList = this.pharmaceuticaldelegatedepartmentList.map(
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
      async editManyPharmaceuticalDelegateDepartment(payload: { data: PharmaceuticalDelegateDepartmentUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.pharmaceuticalDelegateDepartmentControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.pharmaceuticaldelegatedepartmentList = this.pharmaceuticaldelegatedepartmentList.map((item) =>
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

      async getPharmaceuticalDelegateDepartmentById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerFindOne(
            payload
          );
          this.pharmaceuticaldelegatedepartment = {
            ...data,
            listIdDepartmentObject: data.listIdDepartmentObject
              ? data.listIdDepartmentObject
              : { id: "" },
            pharmaceuticalDelegate: data.pharmaceuticalDelegate
              ? data.pharmaceuticalDelegate
              : { id: "" },
          };
          this.error = null;
        } catch (err: any) {
          this.resetPharmaceuticalDelegateDepartment();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createPharmaceuticalDelegateDepartment(payload?: {
        data: PharmaceuticalDelegateDepartmentCreateInput;
      }) {
        this.isLoading = true;
        try {
          const createPharmaceuticalDelegateDepartmentData: PharmaceuticalDelegateDepartmentCreateInput =
            payload?.data ??
            (this
              .pharmaceuticaldelegatedepartment as PharmaceuticalDelegateDepartmentCreateInput);
          createPharmaceuticalDelegateDepartmentData.listIdDepartmentObject =
            createPharmaceuticalDelegateDepartmentData.listIdDepartmentObject &&
            createPharmaceuticalDelegateDepartmentData.listIdDepartmentObject.id
              ?.length > 0
              ? createPharmaceuticalDelegateDepartmentData.listIdDepartmentObject
              : undefined;
          createPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate =
            createPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate &&
            createPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate.id
              ?.length > 0
              ? createPharmaceuticalDelegateDepartmentData.pharmaceuticalDelegate
              : undefined;
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerCreate(
            createPharmaceuticalDelegateDepartmentData
          );
          this.pharmaceuticaldelegatedepartmentList = [
            ...this.pharmaceuticaldelegatedepartmentList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyPharmaceuticalDelegateDepartment(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.pharmaceuticalDelegateDepartmentControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetPharmaceuticalDelegateDepartment() {
        this.$reset();
      },
      disposePharmaceuticalDelegateDepartment() {
        this.$dispose();
      },
    },
  }
);
