import {
  PharmacyDistributorUpdateInput,
  PharmacyDistributorCreateInput,
  PharmacyDistributor,
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
  | PharmacyDistributor
  | PharmacyDistributorCreateInput
  | PharmacyDistributorUpdateInput = {
  distributor: { id: "" },
  pharmacy: { id: "" },
};
export const usePharmacyDistributorStore = defineStore("pharmacydistributor-store", {
  state: () => {
    return {
      pharmacydistributorList: [] as Array<PharmacyDistributor>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      pharmacydistributor: _.cloneDeep(initialState) as
        | PharmacyDistributor
        | PharmacyDistributorCreateInput
        | PharmacyDistributorUpdateInput,
      pharmacydistributorExcelFile: "" as string,
      showListAddRow: true,
      pharmacydistributorPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchPharmacyDistributors(payload?: IPagination, options?: any) {
      try {
        const { data } =
          await service.api.pharmacyDistributorControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
            ...options,
          });
        this.pharmacydistributorList = data.paginatedResult;

        this.pharmacydistributorPagination = {
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
        this.pharmacydistributorList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelPharmacyDistributors() {
      try {
        const { data } =
          await service.api.pharmacyDistributorControllerFindDataForExcel();
        this.pharmacydistributorExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeletePharmacyDistributor(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.pharmacyDistributorControllerUpdate(
          payload,
          {
            deletedAt: new Date(),
          }
        );
        this.error = null;
        this.fetchPharmacyDistributors({
          take: this.pharmacydistributorPagination.take,
          skip: this.pharmacydistributorPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deletePharmacyDistributor(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.pharmacyDistributorControllerDelete(
          payload
        );
        this.pharmacydistributorList = this.pharmacydistributorList.filter(
          (pharmacydistributor) => pharmacydistributor.id !== data.id
        );
        this.pharmacydistributorPagination.total--;
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
    async editPharmacyDistributor(payload: {
      id: string;
      data?: PharmacyDistributorUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const editPharmacyDistributorData: PharmacyDistributorUpdateInput =
          payload.data ?? this.pharmacydistributor;
        editPharmacyDistributorData.distributor =
          editPharmacyDistributorData.distributor &&
          editPharmacyDistributorData.distributor.id?.length > 0
            ? editPharmacyDistributorData.distributor
            : undefined;
        editPharmacyDistributorData.pharmacy =
          editPharmacyDistributorData.pharmacy &&
          editPharmacyDistributorData.pharmacy.id?.length > 0
            ? editPharmacyDistributorData.pharmacy
            : undefined;
        const { data } = await service.api.pharmacyDistributorControllerUpdate(
          payload.id,
          editPharmacyDistributorData
        );
        this.pharmacydistributorList = this.pharmacydistributorList.map(
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
      async editManyPharmacyDistributor(payload: { data: PharmacyDistributorUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.pharmacyDistributorControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.pharmacydistributorList = this.pharmacydistributorList.map((item) =>
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

    async getPharmacyDistributorById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.pharmacyDistributorControllerFindOne(
          payload
        );
        this.pharmacydistributor = {
          ...data,
          distributor: data.distributor ? data.distributor : { id: "" },
          pharmacy: data.pharmacy ? data.pharmacy : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetPharmacyDistributor();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createPharmacyDistributor(payload?: {
      data: PharmacyDistributorCreateInput;
    }) {
      this.isLoading = true;
      try {
        const createPharmacyDistributorData: PharmacyDistributorCreateInput =
          payload?.data ??
          (this.pharmacydistributor as PharmacyDistributorCreateInput);
        createPharmacyDistributorData.distributor =
          createPharmacyDistributorData.distributor &&
          createPharmacyDistributorData.distributor.id?.length > 0
            ? createPharmacyDistributorData.distributor
            : undefined;
        createPharmacyDistributorData.pharmacy =
          createPharmacyDistributorData.pharmacy &&
          createPharmacyDistributorData.pharmacy.id?.length > 0
            ? createPharmacyDistributorData.pharmacy
            : undefined;
        const { data } = await service.api.pharmacyDistributorControllerCreate(
          createPharmacyDistributorData
        );

        const pharmacydistributorList = this.pharmacydistributorList.splice(
          0,
          this.pharmacydistributorList.length - 1
        );
        this.pharmacydistributorList = [...pharmacydistributorList, data];
        this.pharmacydistributorPagination = {
          ...this.pharmacydistributorPagination,
          total: this.pharmacydistributorPagination.total + 1,
        };

        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyPharmacyDistributor(payload: any) {
      this.isLoading = true;
      try {
        const { data } =
          await service.api.pharmacyDistributorControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetPharmacyDistributor() {
      this.$reset();
    },
    disposePharmacyDistributor() {
      this.$dispose();
    },
    addPharmacyDistributor(pharmacyDistributor: any) {
      this.pharmacydistributorList = [
        ...this.pharmacydistributorList,
        pharmacyDistributor,
      ];
    },
    deleteEmptyPharmacyDistributor() {
      this.pharmacydistributorList = this.pharmacydistributorList.slice(0, -1);
    },
    setShowListAddRow(payload: boolean) {
      this.showListAddRow = payload;
    },
  },
});
