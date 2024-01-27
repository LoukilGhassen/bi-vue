import {
  ActorPersonUpdateInput,
  ActorPersonCreateInput,
  ActorPerson,
  List,
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
  | ActorPerson
  | ActorPersonCreateInput
  | ActorPersonUpdateInput = {
  firstName: "",
  nickname: "",
  birthdate: "",
  birthLocation: "",
  notes: "",
  externalUserId: "",
  actor: {
    id: "",
    listIdUgaObject: { id: "" },
    departement: "",
    listIdActorPersonSpecializationObject: {
      id: "",
    },
    importance: 0,
    phone: "",
    email: "",
    actorName: "",
    addressOfActor: [],
    rdvVisit: false,
  },
  listIdActorPersonTitleObject: { id: "" },
  listIdActorPersonTypeObject: { id: "" },
  listIdGenreObject: { id: "" },
  listIdActorPersonQualityObject: { id: "" },
  isAttached: true,
  acceptAccompagnedVisit: false,
  invitedToPC: true,
};
export const useActorPersonStore = defineStore("actorperson-store", {
  state: () => {
    return {
      actorpersonList: [] as Array<ActorPerson>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      actorperson: _.cloneDeep(initialState),
      actorpersonExcelFile: "" as string,
      actorpersonPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchActorPeople(payload?: IPagination, options?:Object) {
      try {
        const { data } = await service.api.actorPersonControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          'where[listIdActorPersonTypeObject][tag]':'PDS',
          ...options
        });
        this.actorpersonList = data.paginatedResult;

        this.actorpersonPagination = {
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
        this.actorpersonList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelActorPeople() {
      try {
        const { data } =
          await service.api.actorPersonControllerFindDataForExcel();
        this.actorpersonExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteActorPerson(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonControllerDelete(
          payload.id,
          { id: payload.deletedReason }
        );
        this.actorpersonList = this.actorpersonList.filter(
          (actorperson) => actorperson.id !== data.id
        );
        this.actorpersonPagination.total--;
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
    async editActorPerson(payload: {
      id: string;
      data?: ActorPersonUpdateInput;
    }) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonControllerUpdate(
          payload.id,
          payload.data ?? this.actorperson
        );
        this.actorpersonList = this.actorpersonList.map((item) =>
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
      async editManyActorPerson(payload: { data: ActorPersonUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.actorPersonControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.actorpersonList = this.actorpersonList.map((item) =>
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

    async getActorPersonById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonControllerFindOne(
          payload
        );
        this.actorperson = {
          ...data,
          actor: {
            ...data.actor,
            actorActorOrientations:
              data.actor?.actorActorOrientations?.map(
                (e) => e.ActorOrientationObject
              ) || ([] as List[]),
          },
        };
        this.error = null;
      } catch (err: any) {
        this.resetActorPerson();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createActorPerson(payload?: { data: ActorPersonCreateInput }) {
      this.isLoading = true;
      try {
        const actorPerson =
          payload?.data ?? (this.actorperson as ActorPersonCreateInput);
        const newActorPerson = {
          ...actorPerson,
          listIdActorPersonTitleObject: actorPerson.listIdActorPersonTitleObject
            ?.id.length
            ? actorPerson.listIdActorPersonTitleObject
            : undefined,
          listIdActorPersonTypeObject: actorPerson.listIdActorPersonTypeObject
            ?.id.length
            ? actorPerson.listIdActorPersonTypeObject
            : undefined,
        };
        const { data } = await service.api.actorPersonControllerCreate(
          newActorPerson
        );
        this.actorpersonList = [...this.actorpersonList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyActorPerson(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonControllerCreateMany(
          payload
        );
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async duplicateActorPerson(id:string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorControllerDuplicate(id)
        const actor = {...data, actorPerson:undefined}
        const actorPerson = {...data.actorPerson,actor}
        console.log([...this.actorpersonList,actorPerson])
        this.actorpersonList = [...this.actorpersonList,actorPerson];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    resetActorPerson() {
      this.actorperson = _.cloneDeep(initialState);
    },
  },
});
