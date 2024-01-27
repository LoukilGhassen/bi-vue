import {
  ActorActorOrientationUpdateInput,
  ActorActorOrientationCreateInput,
  ActorActorOrientation,
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
  | ActorActorOrientation
  | ActorActorOrientationCreateInput
  | ActorActorOrientationUpdateInput = {
  comment: "",
  actor: { id: "" },
  ActorOrientationObject: { id: "" },
};
export const useActorActorOrientationStore = defineStore(
  "actoractororientation-store",
  {
    state: () => {
      return {
        actoractororientationList: [] as Array<ActorActorOrientation>,
        error: null as Object | any,
        isLoading: useBodyStore().isLoading,
        actoractororientation: _.cloneDeep(initialState),
        actoractororientationExcelFile: "" as string,
        actoractororientationPagination: {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
          total: 0,
        },
      };
    },

    getters: {},

    actions: {
      async fetchActorActorOrientations(payload?: IPagination) {
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerFindMany({
            skip: payload?.skip ?? undefined,
            take: payload?.take ?? undefined,
          });
          this.actoractororientationList = data.paginatedResult;

          this.actoractororientationList.forEach((element) => {
            for (const [key, value] of Object.entries(element)) {
              if (typeof value == "object" && value) {
                element[key] = Object.values(value);
              }
            }
          });
          this.actoractororientationPagination = {
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
          this.actoractororientationList = [];
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
        }
      },
      async fetchDataExcelActorActorOrientations() {
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerFindDataForExcel();
          this.actoractororientationExcelFile = data.file;

          this.error = null;
        } catch (err: any) {
          console.error("Error loading  ITEMS", err);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async deleteActorActorOrientation(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerDelete(payload);
          this.actoractororientationList = this.actoractororientationList.filter(
            (actoractororientation) => actoractororientation.id !== data.id
          );
          this.actoractororientationPagination.total--;
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
      async editActorActorOrientation(payload: {
        id: string;
        data?: ActorActorOrientationUpdateInput;
      }) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerUpdate(
            payload.id,
            payload.data ?? this.actoractororientation
          );
          this.actoractororientationList = this.actoractororientationList.map(
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
      async editManyActorActorOrientation(payload: { data: ActorActorOrientationUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorActorOrientationControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actoractororientationList = this.actoractororientationList.map((item) =>
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

      async getActorActorOrientationById(payload: string) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerFindOne(payload);
          this.actoractororientation = data;
          this.error = null;
        } catch (err: any) {
          this.resetActorActorOrientation();
          console.error("Error Update  ITEMS", err.error);
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createActorActorOrientation(payload?: {
        data: ActorActorOrientationCreateInput;
      }) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerCreate(
            payload?.data ??
              (this.actoractororientation as ActorActorOrientationCreateInput)
          );
          this.actoractororientationList = [
            ...this.actoractororientationList,
            data,
          ];
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },
      async createManyActorActorOrientation(payload: any) {
        this.isLoading = true;
        try {
          const {
            data,
          } = await service.api.actorActorOrientationControllerCreateMany(
            payload
          );
          this.error = null;
        } catch (err: any) {
          this.error = err.error;
        } finally {
          this.isLoading = false;
        }
      },

      resetActorActorOrientation() {
        this.actoractororientation = _.cloneDeep(initialState);
      },
    },
  }
);
