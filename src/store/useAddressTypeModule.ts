import {
  AddressTypeUpdateInput,
  AddressTypeCreateInput,
  AddressType,
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
  | AddressType
  | AddressTypeCreateInput
  | AddressTypeUpdateInput = {
  tag: "",
  captionFr: "",
  row1Tag: "",
  row1CaptionFr: "",
  row2Tag: "",
  row2CaptionFr: "",
  row3Tag: "",
  row3CaptionFr: "",
  row4Tag: "",
  row4CaptionFr: "",
  
};
export const useAddressTypeStore = defineStore("addresstype-store", {
  state: () => {
    return {
      addresstypeList: [] as Array<AddressType>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      addresstype: _.cloneDeep(initialState),
      addresstypeExcelFile: "" as string,
      addresstypePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchAddressTypes(payload?: IPagination) {
      try {
        const { data } = await service.api.addressTypeControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.addresstypeList = data.paginatedResult;

        this.addresstypeList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.addresstypePagination = {
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
        this.addresstypeList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelAddressTypes() {
      try {
        const {
          data,
        } = await service.api.addressTypeControllerFindDataForExcel();
        this.addresstypeExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteAddressType(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.addressTypeControllerDelete(payload);
        this.addresstypeList = this.addresstypeList.filter(
          (addresstype) => addresstype.id !== data.id
        );
        this.addresstypePagination.total--;
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
    async editAddressType(payload: {
      id: string;
      data?: AddressTypeUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.addressTypeControllerUpdate(
          payload.id,
          payload.data ?? this.addresstype
        );
        this.addresstypeList = this.addresstypeList.map((item) =>
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
      async editManyAddressType(payload: { data: AddressTypeUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.addressTypeControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.addresstypeList = this.addresstypeList.map((item) =>
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

    async getAddressTypeById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.addressTypeControllerFindOne(
          payload
        );
        this.addresstype = data;
        this.error = null;
      } catch (err: any) {
        this.resetAddressType();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createAddressType(payload?: { data: AddressTypeCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.addressTypeControllerCreate(
          payload?.data ?? (this.addresstype as AddressTypeCreateInput)
        );
        this.addresstypeList = [...this.addresstypeList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyAddressType(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.addressTypeControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetAddressType() {
      this.addresstype = _.cloneDeep(initialState);
    },
  },
});
