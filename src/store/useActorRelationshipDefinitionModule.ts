import {
  ActorRelationshipDefinitionUpdateInput,
  ActorRelationshipDefinitionCreateInput,
  ActorRelationshipDefinition,
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
  | ActorRelationshipDefinition
  | ActorRelationshipDefinitionCreateInput
  | ActorRelationshipDefinitionUpdateInput = {
  tag: "",
  relationshipCaptionFr: "",
  reverseRelationshipTag: "",
  reverseRelationshipCaptionFr: "",
  
  listIdActorType1Object: { id: "" },
  listIdActorType2Object: { id: "" },
};
export const useActorRelationshipDefinitionStore = defineStore(
  "actorrelationshipdefinition-store",
  {
    state: () => {
      return {
        actorrelationshipdefinitionList: [] as Array<
          ActorRelationshipDefinition
        >,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actorrelationshipdefinition: _.cloneDeep(initialState),
        actorrelationshipdefinitionExcelFile: "" as string,
        actorrelationshipdefinitionPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorRelationshipDefinitions(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.actorrelationshipdefinitionList = data.paginatedResult;

          this.actorrelationshipdefinitionList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.actorrelationshipdefinitionPagination = {
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
          this.actorrelationshipdefinitionList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorRelationshipDefinitions() {
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerFindDataForExcel();
          this.actorrelationshipdefinitionExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorRelationshipDefinition(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerDelete(
            payload
          );
          this.actorrelationshipdefinitionList = this.actorrelationshipdefinitionList.filter(
            (actorrelationshipdefinition) =>
              actorrelationshipdefinition.id !== data.id
          );
          this.actorrelationshipdefinitionPagination.total--;
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
      async editActorRelationshipDefinition(payload: {
        id: string;
        data?: ActorRelationshipDefinitionUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerUpdate(
            payload.id,
            payload.data ?? this.actorrelationshipdefinition
          );
          this.actorrelationshipdefinitionList = this.actorrelationshipdefinitionList.map(
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
      async editManyActorRelationshipDefinition(payload: { data: ActorRelationshipDefinitionUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorRelationshipDefinitionControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorrelationshipdefinitionList = this.actorrelationshipdefinitionList.map((item) =>
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

      async getActorRelationshipDefinitionById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerFindOne(
            payload
          );
          this.actorrelationshipdefinition = data;
          this.error = null;
        } catch (err: any) {
          this.resetActorRelationshipDefinition();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorRelationshipDefinition(payload?: {
        data: ActorRelationshipDefinitionCreateInput;
      }) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerCreate(
            payload?.data ??
              (this
                .actorrelationshipdefinition as ActorRelationshipDefinitionCreateInput)
          );
          this.actorrelationshipdefinitionList = [
            ...this.actorrelationshipdefinitionList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorRelationshipDefinition(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorRelationshipDefinitionControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorRelationshipDefinition() {
        this.actorrelationshipdefinition = _.cloneDeep(initialState);
      },
    },
  }
);
