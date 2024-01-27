import { IdsUpdateInput, IdsCreateInput, Ids } from "./../../index";
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
const initialState: Ids | IdsCreateInput | IdsUpdateInput = {
  creation: "2023-04-26T16:35:09.638Z",
  update: "2023-04-26T16:35:09.638Z",
  deletion: "2023-04-26T16:35:09.638Z",
  actor: { id: "" },
  actorRelationship: { id: "" },
  actorRelationshipDefinition: { id: "" },
  actorTelecom: { id: "" },
  actorVehicule: { id: "" },
  address: { id: "" },
  addressType: { id: "" },
  bisounoursH: { id: "" },
  story: { id: "" },
  storyEvent: { id: "" },
  bisounousJRole: { id: "" },
  bisousnour: { id: "" },
  list: { id: "" },
  role: { id: "" },
  storyEventInvolve: { id: "" },
  packaging: { id: "" },
  roleJPage: { id: "" },
  webElement: { id: "" },
  webElementJListFilter: { id: "" },
  creationBy: "",
  updatedBy: "",
  deletionBy: "",
};
export const useIdsStore = defineStore("ids-store", {
  state: () => {
    return {
      idsList: [] as Array<Ids>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      ids: _.cloneDeep(initialState),
      idsExcelFile: "" as string,
      idsPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchIds(payload?: IPagination) {
      try {
        const { data } = await service.api.idsControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
        });
        this.idsList = data.paginatedResult;

        this.idsList.forEach((element) => {
          for (const [key, value] of Object.entries(element)) {
            if (typeof value == "object" && value) {
              element[key] = Object.values(value);
            }
          }
        });
        this.idsPagination = {
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
        this.idsList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelIds() {
      try {
        const { data } = await service.api.idsControllerFindDataForExcel();
        this.idsExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteIds(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.idsControllerDelete(payload);
        this.idsList = this.idsList.filter((ids) => ids.id !== data.id);
        this.idsPagination.total--;
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
    async editIds(payload: { id: string; data?: IdsUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.idsControllerUpdate(
          payload.id,
          payload.data ?? this.ids
        );
        this.idsList = this.idsList.map((item) =>
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
      async editManyIds(payload: { data: IdsUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.idsControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.idsList = this.idsList.map((item) =>
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

    async getIdsById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.idsControllerFindOne(payload);
        this.ids = data;
        this.error = null;
      } catch (err: any) {
        this.resetIds();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createIds(payload?: { data: IdsCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.idsControllerCreate(
          payload?.data ?? (this.ids as IdsCreateInput)
        );
        this.idsList = [...this.idsList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyIds(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.idsControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetIds() {
      this.ids = _.cloneDeep(initialState);
    },
  },
});
