import { LogUpdateInput, LogCreateInput, Log } from "./../../index";
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
const initialState: Log | LogCreateInput | LogUpdateInput = {
  ids: { id: "" },
  anyIdObject: { id: "" },
  subject: "",
  action: "",
};
export const useLogStore = defineStore("log-store", {
  state: () => {
    return {
      logList: [] as Array<Log>,
      error: null as Object | any,
      isLoading: useBodyStore().isLoading,
      log: _.cloneDeep(initialState) as Log | LogCreateInput | LogUpdateInput,
      logExcelFile: "" as string,
      logPagination: {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 5,
        total: 0,
      },
    };
  },

  getters: {},

  actions: {
    async fetchLogs(payload?: IPagination,options?:any) {
      try {
        const { data } = await service.api.logControllerFindMany({
          skip: payload?.skip ?? undefined,
          take: payload?.take ?? undefined,
          ...options
        });
        this.logList = data.paginatedResult;

        this.logPagination = {
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
        this.logList = [];
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
      }
    },
    async fetchDataExcelLogs() {
      try {
        const { data } = await service.api.logControllerFindDataForExcel();
        this.logExcelFile = data.file;

        this.error = null;
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async softDeleteLog(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.logControllerUpdate(payload, {
          deletedAt: new Date(),
        });
        this.error = null;
        this.fetchLogs({
          take: this.logPagination.take,
          skip: this.logPagination.skip,
        });
      } catch (err: any) {
        console.error("Error loading  ITEMS", err);
        this.error = err.error;
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteLog(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.logControllerDelete(payload);
        this.logList = this.logList.filter((log) => log.id !== data.id);
        this.logPagination.total--;
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
    async editLog(payload: { id: string; data?: LogUpdateInput }) {
      this.isLoading = true;
      try {
        const editLogData: LogUpdateInput = payload.data ?? this.log;
        editLogData.ids =
          editLogData.ids && editLogData.ids.id?.length > 0
            ? editLogData.ids
            : undefined;
        editLogData.anyIdObject =
          editLogData.anyIdObject && editLogData.anyIdObject.id?.length > 0
            ? editLogData.anyIdObject
            : undefined;
        const { data } = await service.api.logControllerUpdate(
          payload.id,
          editLogData
        );
        this.logList = this.logList.map((item) =>
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
      async editManyLog(payload: { data: LogUpdateInput; where: any }) {
        this.isLoading  = true;
        try {
          const { data } = await service.api.logControllerUpdateMany(
            payload.data,
            payload.where
           
          );
          this.logList = this.logList.map((item) =>
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

    async getLogById(payload: string) {
      this.isLoading = true;
      try {
        const { data } = await service.api.logControllerFindOne(payload);
        this.log = {
          ...data,
          ids: data.ids ? data.ids : { id: "" },
          anyIdObject: data.anyIdObject ? data.anyIdObject : { id: "" },
        };
        this.error = null;
      } catch (err: any) {
        this.resetLog();
        console.error("Error Update  ITEMS", err.error);
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createLog(payload?: { data: LogCreateInput }) {
      this.isLoading = true;
      try {
        const createLogData: LogCreateInput =
          payload?.data ?? (this.log as LogCreateInput);
        createLogData.ids =
          createLogData.ids && createLogData.ids.id?.length > 0
            ? createLogData.ids
            : undefined;
        createLogData.anyIdObject =
          createLogData.anyIdObject && createLogData.anyIdObject.id?.length > 0
            ? createLogData.anyIdObject
            : undefined;
        const { data } = await service.api.logControllerCreate(createLogData);
        this.logList = [...this.logList, data];
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },
    async createManyLog(payload: any) {
      this.isLoading = true;
      try {
        const { data } = await service.api.logControllerCreateMany(payload);
        this.error = null;
      } catch (err: any) {
        this.error = err.error;
      } finally {
        this.isLoading = false;
      }
    },

    resetLog() {
      this.$reset();
    },
    disposeLog() {
      this.$dispose();
    },
    getModifiedColumns(originalData: any, newData: any, path = []) : any  {
      return _.reduce(originalData, (result: any, value: any, key: any) => {
          const currentPath = path.concat(key);
          if (_.isObject(value) && _.isObject(newData[key]) && !_.isDate(value)) {
              // If both values are objects, recursively call the function
              const nestedDifferences =
                  (Array.isArray(value) && Array.isArray(newData[key])) &&
                      (value.length !== newData[key].length) ?
                      currentPath.join('.')
                      :
                      this.getModifiedColumns(value, newData[key], currentPath);

              // If there are nested differences, concatenate them to the result
              return nestedDifferences.length ? result.concat(nestedDifferences) : result;
          } else if (!_.isEqual(value, newData[key])) {
              // If values are not equal, add the path to the result
              return result.concat(currentPath.join('.'));
          } else {
              return result;
          }
      }, []);
  }
  },
});
