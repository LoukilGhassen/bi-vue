import { ActorUpdateInput, ActorCreateInput, Actor } from "./../../index";
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
const initialState: Actor | ActorCreateInput | ActorUpdateInput = {
  actorName: "",
  externalId: "",
};
export const useActorStore = defineStore("actor-store", {
  state: () => {
    return {
      actorList: [] as Array<Actor>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actor: _.cloneDeep(initialState),
      actorExcelFile: "" as string,
      activeTabsName: "pds",
      activeActorDetailTabName: "Informations",
      actorPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
      productList: [
        {
          id: "64534sd",
          product: "Suvéal Duo",
          Market: "Marché 2",
          Category: "Catégorie 2",
        },
        {
          id: "7j8h3k2",
          product: "Product X",
          Market: "Market 1",
          Category: "Category 1",
        },
      ],
    };
  },

  getters: {},

  actions: {
    async fetchActors(
      payload?: IPagination,
      searchInput?: string,
      options?: object
    ) {
      try {
        const { data } = await service.api.actorControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          "where[actorName][contains]": searchInput ? `${searchInput}` : "",
          ...options,
        });
        this.actorList = data.paginatedResult;

        this.actorPagination = {
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
        this.actorList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActors() {
      try {
        const { data } = await service.api.actorControllerFindDataForExcel();
        this.actorExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActor(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerDelete(payload.id, {
          id: payload.deletedReason,
        });
        this.actorList = this.actorList.filter((actor) => actor.id !== data.id);
        this.actorPagination.total--;
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
    async editActor(payload: { id: string; data?: ActorUpdateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerUpdate(
          payload.id,
          payload.data ?? this.actor
        );
        this.actor = _.cloneDeep({
          ...this.actor,
          actorObject: { ...this.actor.actorObject, ...payload?.data },
        });
        this.actorList = this.actorList.map((item) =>
          item.id === payload.id ? { ...item, ...payload?.data } : item
        );
        this.error = null;
      } catch (err: any) {
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    } /*
      async editManyActor(payload: { data: ActorUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorList = this.actorList.map((item) =>
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

    async getActorById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerFindOne(payload);
        this.actor = {
          ...data,
          actorActorOrientations:
            data?.actorActorOrientations?.map(
              (e) => e.ActorOrientationObject
            ) || ([] as List[]),
        };
        this.error = null;
      } catch (err: any) {
        this.resetActor();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActor(payload?: { data: ActorCreateInput }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerCreate(
          payload?.data ?? (this.actor as ActorCreateInput)
        );
        this.actorList = [...this.actorList, data.actorView];
        this.actorPagination = {
          ...this.actorPagination,
          total: this.actorPagination.total + 1,
        };
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActor(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async duplicateActor(id: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerDuplicate(id);
        const insertIndex = this.actorList.findIndex((item) => item.id === id);
        let actors = this.actorList;
        actors.splice(insertIndex + 1, 0, data.actorView);
        this.actorList = [...actors];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    resetActor() {
      this.actor = _.cloneDeep(initialState);
    },
    async fetchActorsView(
      payload?: IPagination,
      searchInput?: string,
      options?: object
    ) {
      try {
        if (payload.skip === 0) {
          this.actorList = [];
        }
        const { data } = await service.api.actorControllerFindManyView({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          "where[actorObject][actorName][contains]": searchInput
            ? `${searchInput}`
            : "",
          "where[actorObject][actorName][mode]": "insensitive",
          ...options,
        });
        this.actorList = data.paginatedResult;

        this.actorPagination = {
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
        this.actorList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async getActorViewById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerFindOneView(payload);
        this.actor = {
          ...data,
          actorObject: {
            ...data.actorObject,
            actorActorOrientations:
              data?.actorObject?.actorActorOrientations?.map(
                (e) => e.ActorOrientationObject
              ) || ([] as List[]),
          },
        };
        this.error = null;
      } catch (err: any) {
        this.resetActor();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    setActiveTabsName(activeTab: string) {
      this.activeTabsName = activeTab;
    },
    setActiveActorDetailTabName(activeDetailTab: string) {
      this.activeActorDetailTabName = activeDetailTab;
    },
    updateProductCount(payload: number) {
      if (
        (this.actor && this.actor?.productCount) ||
        (this.actor &&
          !this.actor?.productCount &&
          this.actor.productCount === 0)
      ) {
        this.actor.productCount += payload;
      }
    },
    updateWholeSalerCount(payload: number) {
      if (this.actor) {
        this.actor.wholeSalerCount += payload;
      }
    },
    updateServicesCount(payload: number) {
      if (this.actor ) {
        this.actor.servicesCount += payload;
      } 
    },
    setActif(val: Boolean) {
      this.actor.actorObject.actif = val;
    },
    /*     updateSubstituteCount(payload : number){
      if(this.actor && this.actor?.substituteCount){
        this.actor.substituteCount += payload 
      }

/*     updateSubstituteCount(payload : number){
      if(this.actor && this.actor?.substituteCount){
        this.actor.substituteCount += payload 
      }
    },
    updateVisitCount(payload : number){
      if(this.actor && this.actor?.storyCount){
        this.actor.storyCount += payload 
      }
    },
    updateAttachedDoctorCount(payload : number){
      if(this.actor && this.actor?.storyCount){
        this.actor.storyCount += payload 
      }
    },
    updateHealthCenterTeamCount(payload : number){
      if(this.actor && this.actor?.storyCount){
        this.actor.storyCount += payload 
      }
    },
    updateServicesCount(payload : number){
      if(this.actor && this.actor?.storyCount){
        this.actor.storyCount += payload 
      }
    },
 */
  },
});
