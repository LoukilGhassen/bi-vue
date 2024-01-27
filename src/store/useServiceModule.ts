import { ServiceUpdateInput, ServiceCreateInput, Service,ActorPersonServiceCreateInput } from "./../../index";
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
const initialState: Service | ServiceCreateInput | ServiceUpdateInput = {
  ids: { id: "" },
  healthCenter: { id: "" },
  name: "",
  telephone: "",
  fax: "",
  headOfDepartment: "",
};
export const useServiceStore = defineStore("service-store", {
  state: () => {
    return {
      showAddBtns: {},
      serviceList: [] as Array<Service>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      service: _.cloneDeep(initialState) as
        | Service
        | ServiceCreateInput
        | ServiceUpdateInput,
      serviceExcelFile: "" as string,
      servicePagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
        total: 0,
      },
      activeCollapseService: [] as Array<String>,
    };
  },

  getters: {},

  actions: {
    async fetchServices(id: string, payload?: IPagination, options?: any) {
      try {
        const { data } = await service.api.serviceControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          "where[healthCenterId]": id,
          ...options,
        });
        this.serviceList = data.paginatedResult;
        data.paginatedResult.map((s) => {
          this.showAddBtns[s.id] = true;
        });

        this.servicePagination = {
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
        this.serviceList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelServices() {
      try {
        const { data } = await service.api.serviceControllerFindDataForExcel();
        this.serviceExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteService(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.serviceControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchServices({
          take: this.servicePagination.take,
          skip: this.servicePagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteService(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.serviceControllerDelete(payload);
        this.serviceList = this.serviceList.filter(
          (service) => service.id !== data.id
        );
        this.servicePagination.total--;
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
    async editService(payload: { id: string; data?: ServiceUpdateInput }) {
      this.isLoading = true;
      try {
        const editServiceData: ServiceUpdateInput =
          payload.data ?? this.service;
        editServiceData.ids =
          editServiceData.ids && editServiceData.ids.id?.length > 0
            ? editServiceData.ids
            : undefined;
        editServiceData.healthCenter =
          editServiceData.healthCenter &&
          editServiceData.healthCenter.id?.length > 0
            ? editServiceData.healthCenter
            : undefined;
        const { data } = await service.api.serviceControllerUpdate(
          payload.id,
          editServiceData
        );
        this.serviceList = this.serviceList.map((item) =>
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
      async editManyService(payload: { data: ServiceUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.serviceControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.serviceList = this.serviceList.map((item) =>
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

    async getServiceById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.serviceControllerFindOne(payload);
        this.service = {
          ...data,
          ids: data.ids ? data.ids : { id: "" },
          healthCenter: data.healthCenter ? data.healthCenter : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetService();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createService(payload?: { data: ServiceCreateInput }) {
      this.isLoading = true;
      try {
        const createServiceData: ServiceCreateInput =
          payload?.data ?? (this.service as ServiceCreateInput);
        createServiceData.ids =
          createServiceData.ids && createServiceData.ids.id?.length > 0
            ? createServiceData.ids
            : undefined;
        createServiceData.healthCenter =
          createServiceData.healthCenter &&
          createServiceData.healthCenter.id?.length > 0
            ? createServiceData.healthCenter
            : undefined;
        const { data } = await service.api.serviceControllerCreate(
          createServiceData
        );
        this.serviceList = [...this.serviceList, data];
        this.servicePagination = {
          ...this.servicePagination,
          total: this.servicePagination.total + 1,
        };
        this.showAddBtns[data.id] = true;
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyService(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.serviceControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetService() {
      this.$reset();
    },
    disposeService() {
      this.$dispose();
    },
    async duplicateService(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.serviceControllerDuplicate(payload);
        this.serviceList = [...this.serviceList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    addAttachedMed(payload: Service) {
      this.serviceList = this.serviceList.map((service: Service) =>
        service.id === payload.id
          ? {
              ...service,
              team: [
                ...(service.team || []),
                {
                  actorPerson: {
                    serviceId: payload.id,
                    rpps: "",
                    actor: {
                      actorName: "",
                      email: "",
                    },
                  },
                },
              ],
            }
          : service
      );
      this.showAddBtns[payload.id] = false;
    },
    deleteEmptyTeamMemberRowe(payload: Service) {
      this.serviceList = this.serviceList.map((service: Service) => {
        if (service?.id === payload.id) {
          return {
            ...service,
            team: service?.team.slice(0, -1),
          };
        } else return service;
      });
        this.showAddBtns[payload.id] = true;
    },
    async createServiceAttachedDoctor(payload: ActorPersonServiceCreateInput) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonServiceControllerCreate(
          payload
        );
        this.serviceList = this.serviceList.map((service: Service) => {
          const serviceTeam = [...service.team];
          serviceTeam.pop();
          return service.id === data.service.id
            ? {
                ...service,
                team: [...serviceTeam, data],
              }
            : service;
        });
        this.showAddBtns[data.service.id] = true;
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteAttachedDoctor(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.actorPersonServiceControllerDelete(
          payload
        );
        this.serviceList = this.serviceList.map((s) => ({
          ...s,
          team: s.team?.filter((t) => t.id !== payload),
        }));
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
    setServiceTeam(data: any, id: string) {
      this.serviceList = this.serviceList.map((service) => {
        return service.id === id
          ? {
              ...service,
              team: data,
            }
          : service;
      });
    },
    setActiveCollapseService(service: string) {
      if (service) this.activeCollapseService.push(service);
      else this.activeCollapseService = [];
    },
  },
});
