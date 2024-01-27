<template>
  <div class="dataTable_container" v-if="dataTableColumns.length">
    <!-- start table options -->
    <div class="d-flex justify-content-between align-items-center">
      <div class="table_options prevent-outside-click">
        <el-input
          v-model="search"
          :model-value="search"
          @input="handleInput($event)"
          class="w-150px"
          placeholder="Rechercher"
          clearable
          v-if="searchOption"
        >
          <template #prefix>
            <el-icon class="el-input__icon pe-3">
              <span class="svg-icon svg-icon-muted svg-icon-1">
                <inline-svg src="/svg/icons/search.svg" />
              </span>
            </el-icon>
          </template>
        </el-input>
        <!-- start filtre popover -->
        <el-popover
          placement="bottom-start"
          :width="550"
          trigger="click"
          v-if="filterOption"
        >
          <template #reference>
            <div ref="filterBtn">
              <el-button
                class="table_option_button"
                :color="customBg ? 'rgba(244,244, 246, 1)' : ''"
              >
                <el-icon class="me-3"
                  ><img
                    class="rounded-1"
                    src="/svg/icons/filtre.svg"
                    alt="metronic"
                /></el-icon>
                Filtrer
              </el-button>
            </div>
          </template>
          <CustomFiltreVue
            @validate-filtre="onValidateFiltre"
            :types="columnDefs"
          />
        </el-popover>
        <!-- end filtre popover -->
        <!-- start colManagement popover -->
        <el-popover
          placement="bottom-start"
          :width="250"
          trigger="click"
          v-if="colsOption"
        >
          <template #reference>
            <div ref="colsManagementBtn">
              <el-button
                :color="customBg ? 'rgba(244,244, 246, 1)' : ''"
                class="table_option_button"
              >
                <el-icon class="me-3"
                  ><img
                    class="rounded-1"
                    src="/svg/icons/gerer.svg"
                    alt="metronic"
                /></el-icon>
                Gérer les colonnes
              </el-button>
            </div>
          </template>
          <p class="my-2">Afficher les colonnes</p>
          <el-checkbox
            class="w-100"
            v-for="col in colsStates"
            :key="col.colId"
            :label="col.headerName"
            v-model="col.visible"
          />
          <div class="d-flex my-5">
            <el-button
              :color="customBg ? 'rgba(244,244, 246, 1)' : ''"
              class="table_option_button"
              @click="initDisplayedColumns"
              >Réinitialiser</el-button
            >
            <el-button
              class="table_option_button"
              type="primary"
              @click="restoreColumns"
              >Valider</el-button
            >
          </div>
        </el-popover>
        <!-- end colManagement popover -->
        <!-- start Vues popover -->
        <el-popover
          placement="bottom-start"
          :width="180"
          trigger="click"
          v-if="viewsOption"
        >
          <template #reference>
            <el-button
              :color="customBg ? 'rgba(244,244, 246, 1)' : ''"
              class="table_option_button"
            >
              <el-icon class="me-3"
                ><img
                  class="rounded-1"
                  src="/svg/icons/vues.svg"
                  alt="metronic"
              /></el-icon>
              Vues
            </el-button>
          </template>
          <p>Hauteur des lignes</p>
          <div
            class="vue-item d-flex justify-content-start gap-1 my-2 py-2 cursor-pointer"
            v-for="vue in vues"
            @click="setRowVue(vue.value)"
          >
            <el-icon class="me-3"
              ><img
                class="rounded-1"
                :src="`/svg/icons/vue-${vue.icon}.svg`"
                alt="metronic"
            /></el-icon>
            <span>{{ vue.label }}</span>
          </div>
        </el-popover>
        <!-- end Vues popover  -->
        <el-button
          class="table_option_button"
          @click="$emit('import')"
          v-if="additionalTableOptions.includes('import')"
          :color="customBg ? 'rgba(244,244, 246, 1)' : ''"
        >
          <el-icon class="me-3"
            ><img class="rounded-1" src="/svg/icons/import.svg" alt="metronic"
          /></el-icon>
          Importer
        </el-button>
        <el-button
          class="table_option_button"
          @click="exportToExcel"
          v-if="additionalTableOptions.includes('export')"
        >
          <el-icon class="me-3"
            ><img
              class="rounded-1"
              src="/svg/icons/exporter.svg"
              alt="metronic"
          /></el-icon>
          Exporter
        </el-button>
        <el-date-picker
          v-model="dateRangePicker"
          @change="handleDateRangeFilter"
          type="daterange"
          range-separator="au"
          start-placeholder="date de début"
          end-placeholder="date de fin"
          v-if="dateRangeFilterOption"
        />
      </div>
      <span class="ms-auto poppins" v-if="entity"
        >{{ rowNumbers }} {{ dataTableEntityName }}</span
      >
    </div>
    <!-- end table options -->
    <div :class="['outer']">
      <div class="grid-col">
        <ag-grid-vue
          ref="agGrid"
          :style="
            additionalTableOptions.includes('addRow') || fitContentHeight
              ? {
                  width: '100%',
                  height: 50 + rowVue * (data.length || 1) + 'px',
                  maxHeight: '85%',
                  minHeight: '22%',
                }
              : { width: '100%', height: '100%' }
          "
          class="ag-theme-alpine"
          :columnDefs="dataTableColumns"
          @grid-ready="onGridReady"
          :defaultColDef="defaultColDef"
          :rowSelection="rowSelection"
          :rowData="data"
          :rowDragManaged="true"
          :animateRows="true"
          :rowHeight="rowVue"
          :suppressDragLeaveHidesColumns="true"
          @cellContextMenu="contextCellClick"
          :suppressRowClickSelection="true"
          @contextmenu.prevent=""
          @columnVisible="onColumnVisible"
          @cellClicked="onPinnedCellClick"
          @columnMoved="handleColumnMoved"
          @cellEditingStopped="cellEditingStopped"
          overlayNoRowsTemplate="<div style='margin-top:30px'>aucune ligne à afficher</div>"
          @selectionChanged="selectionChanged"
          :rowClassRules="rowClassRules"
        >
        </ag-grid-vue>
        <el-button
          v-if="additionalTableOptions.includes('addRow')"
          :disabled="additionalTableOptions.includes('addRowDisabled')"
          class="my-3 mx-0 p-2"
          @click="$emit('addRow', dateRangePicker)"
        >
          <el-icon
            ><img class="rounded-1" src="/svg/icons/plus.svg" alt="metronic"
          /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- start popover -->
    <custom-popover
      :visible="cellPopoverVisible && contextMenuList"
      :position="popoverPosition"
    >
      <div
        class="popover_item"
        v-for="item in contextMenuList.list"
        @click="handlePopoverItemAction(item)"
      >
        <span>{{
          t(`dataTablePopover.${contextMenuList.entity}.${item}`)
        }}</span>
      </div>
    </custom-popover>
    <!-- end popover -->
    <!-- start pagination -->
    <div class="footer__wrapper" v-if="withFooter">
      <Pagination
        :itemsPerPage="pagination?.take"
        :set-items-per-page="onSetItemsPerPage"
        :page="Math.floor(pagination?.skip / pagination?.take) + 1"
        :current-page-change="onCurrentPageChange"
        :total="pagination?.total"
        :pages-array="[5, 20, 50, 100]"
      />
    </div>
    <!-- e nd pagination -->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import CustomHeader from "@/components/shared/ag-grid-table/CustomHeader.vue";
import Pagination from "@/components/shared/pagination/Pagination.vue";
import CustomPopover from "@/components/modals/CustomPopover.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import CustomFiltreVue from "@/components/shared/ag-grid-table/CustomFiltre.vue";
import DeleteContactModal from "@/components/modals/DeleteContactModal.vue";
import { useAuthStore } from "@/store/useAuth";
import { storeToRefs } from "pinia";
import service from "@/service";
import { useWebElementStore } from "@/store/useWebElementModule";
import loadash from "lodash";

import { useUserWebElementStore } from "@/store/useUserWebElementModule";
import XLSX from "xlsx";

import { t } from "@/core/i18n/translate";
const ConfirmModal = defineAsyncComponent(() =>
  import("@/components/modals/ConfirmModal.vue")
);
export default {
  name: "table-column-example",
  components: {
    "ag-grid-vue": AgGridVue,
    agColumnHeader: CustomHeader,
    Pagination,
    CustomPopover,
    CustomRowOptionsVue,
    ConfirmModal,
    CustomFiltreVue,
    t,
    DeleteContactModal,
  },
  props: {
    data: Array,
    pagination: Object,
    columnDefs: Array,
    defaultColDef: Object,
    contextMenuList: Object,
    additionalTableOptions: {
      required: false,
      type: Array,
      default: [],
    },
    withFooter: {
      default: true,
      required: false,
      type: Boolean,
    },
    customBg: {
      default: false,
      required: false,
      type: Boolean,
    },
    webElementAddress: {
      required: true,
      type: String,
    },
    entity: {
      required: false,
      type: String,
    },
    isService: {
      required: false,
      type: Boolean,
      default: false,
    },
    exportEntityName: {
      required: false,
      type: String,
    },
    exportFilter: {
      required: false,
    },
    exportedfromClient: {
      required: false,
      default: false,
    },
    searchOption: {
      required: false,
      default: true,
    },
    filterOption: {
      required: false,
      default: true,
    },
    colsOption: {
      required: false,
      default: true,
    },
    viewsOption: {
      required: false,
      default: true,
    },
    fitContentHeight: {
      required: false,
      default: false,
    },
    rowClassRules: {
      required: false,
      default: null,
    },
    dateRangeFilterOption: {
      required: false,
      default: null,
    },
  },
  emits: [
    "inputChange",
    "setItemsPerPage",
    "currentPageChange",
    "onValidateFiltre",
    "popoverItemAction",
    "import",
    "export",
    "addRow",
    "cellEditingStopped",
    "confirmDateRangePicker",
  ],
  setup(props, { emit }) {
    const { setWebElements } = useWebElementStore();
    const { webelement } = storeToRefs(useWebElementStore());
    const dataTableColumns = ref([]);
    const cellEditingStopped = (params) => {
      emit("cellEditingStopped", params);
    };
    const dateRangePicker = ref(null);
    const gridApi = ref(null);
    const gridColumnApi = ref(null);
    const rowSelection = ref("multiple");
    const selectedRow = ref(null);
    const cellPopoverVisible = ref(false);
    const popoverPosition = ref({ top: 0, left: 0 });
    const colsStates = ref([]);
    const search = ref("");
    const colsManagementBtn = ref(null);
    const filterBtn = ref(null);
    const webElementId = ref("");
    const rowVue = ref(42);
    const { currentUser } = storeToRefs(useAuthStore());
    const conf = {};
    const onlySelectedRows = ref(false);
    const userwebElementId = ref("");
    const columnConfig = ref(
      props.columnDefs.map((item, index) => ({
        colId: item.colId,
        hide: item.hide,
      }))
    );
    const vues = [
      { label: "Simple", icon: "simple", value: 42 },
      { label: "Double", icon: "double", value: 55 },
      { label: "Triple", icon: "triple", value: 70 },
    ];
    const rowNumbers = computed(() => {
      if (
        props.webElementAddress === "pdsInPlaceSampleList" ||
        props.webElementAddress === "pdsToSendSampleList"
      ) {
        const names = props.data.map((spl) => spl.name);
        return Array.from(new Set(names)).length - 1;
      }
      return props.pagination ? props.pagination.total : props.data.length;
    });
    const dataTableEntityName = computed(() => {
      if (props.data.length < 2) {
        return props.entity
          .split(" ")
          .map((str) => (str.endsWith("s") ? str.slice(0, -1) : str))
          .join(" ");
      } else {
        return props.entity;
      }
    });
    const motifs = ref([
      {
        value: "motif1",
        label: "motif1",
      },
      {
        value: "motif2",
        label: "motif2",
      },
      {
        value: "motif3",
        label: "motif3",
      },
    ]);
    const onGridReady = (params) => {
      gridApi.value = params.api;
      gridColumnApi.value = params.columnApi;
      // params.api.sizeColumnsToFit();
      // gridColumnApi.value.autoSizeAllColumns(false);
      colsStates.value = params.columnApi.columnModel.gridColumns
        .filter((col) => {
          return (
            !col.pinned &&
            !col.lockPosition &&
            (!col?.colDef?.headerComponentParams ||
              (col.colDef.headerComponentParams &&
                !col.colDef?.headerComponentParams?.unhidable))
          );
        })
        .map((col) => {
          return {
            colId: col.colId,
            visible: col.visible,
            headerName: col.colDef.headerName,
          };
        });
    };

    // conttextMenu click
    const contextCellClick = (event) => {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const adjustedTop = event.event.clientY + scrollY;
      const adjustedLeft = event.event.clientX + scrollX;
      popoverPosition.value = {
        top: adjustedTop,
        left: adjustedLeft,
      };
      selectedRow.value = event.data;
      cellPopoverVisible.value = true;
    };
    // hide custom popover table
    const handleClickOutside = (event) => {
      if (event.target !== "span") {
        cellPopoverVisible.value = false;
      }
    };

    const restoreColumns = async () => {
      colsStates.value.forEach((col) => {
        gridColumnApi.value.applyColumnState({
          state: [{ colId: col.colId, hide: !col.visible }],
        });
      });
      const columns = webelement.value[webElementId.value].columns;
      const conf = {};
      const confColumn = columns.map((item) => {
        const col = colsStates.value.find((col) => col.colId === item.colId);
        if (col) {
          return { ...item, hide: !col.visible };
        }
        return item;
      });
      conf[webElementId.value] = {
        columns: confColumn,
        rowVue:
          webelement.value &&
          webelement.value[webElementId.value] &&
          webelement.value[webElementId.value].rowVue
            ? webelement.value[webElementId.value].rowVue
            : 42,
      };
      colsManagementBtn.value.click();
      setWebElements(conf);
      await service.api.userWebElementControllerUpsert({
        webElement: {
          id: webElementId.value,
        },
        user: {
          id: currentUser.value.id,
        },
        config: conf[webElementId.value],
      });
    };

    const initDisplayedColumns = async () => {
      colsStates.value = gridColumnApi.value.columnModel.gridColumns
        .filter(
          (col) =>
            !col.pinned &&
            !col.lockPosition &&
            (!col?.colDef?.headerComponentParams ||
              (col.colDef.headerComponentParams &&
                !col.colDef?.headerComponentParams?.unhidable))
        )
        .map((col) => {
          return {
            colId: col.colId,
            visible: true,
            headerName: col.colDef.headerName,
          };
        });
      getDefaultColDefs();
      conf[webElementId.value] = {
        columns: dataTableColumns.value.map((item) => ({
          colId: item.colId,
          hide: item.hide,
        })),
        rowVue: rowVue.value,
      };
      await service.api.userWebElementControllerUpsert({
        webElement: {
          id: webElementId.value,
        },
        user: {
          id: currentUser.value.id,
        },
        config: conf[webElementId.value],
      });
      setWebElements(conf);
    };
    const onColumnVisible = (event) => {
      colsStates.value = event.columnApi.columnModel.gridColumns
        .filter(
          (col) =>
            !col.pinned &&
            !col.lockPosition &&
            (!col?.colDef?.headerComponentParams ||
              (col.colDef.headerComponentParams &&
                !col.colDef?.headerComponentParams?.unhidable))
        )
        .map((col) => {
          return {
            colId: col.colId,
            visible: col.visible,
            headerName: col.colDef.headerName,
          };
        });
    };

    const onPinnedCellClick = (event) => {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const adjustedTop = event.event.clientY + scrollY;
      const adjustedLeft = event.event.clientX + scrollX;
      if (event.column.colDef?.pinned === "right") {
        popoverPosition.value = {
          top: adjustedTop,
          left: adjustedLeft - 180,
        };
        selectedRow.value = event.data;
        cellPopoverVisible.value = true;
      } else {
        emit("rowClick", event.data, event);
      }
    };
    const setRowVue = async (val) => {
      gridApi.value.rowModel.rowsToDisplay.forEach((row) => {
        row.setRowHeight(val);
      });
      gridApi.value.onRowHeightChanged();
      const conf = {};
      conf[webElementId.value] = {
        columns: webelement.value[webElementId.value].columns,
        rowVue: val,
      };
      setWebElements(conf);
      rowVue.value = val;
      await service.api.userWebElementControllerUpsert({
        webElement: {
          id: webElementId.value,
        },
        user: {
          id: currentUser.value.id,
        },
        config: conf[webElementId.value],
      });
    };

    // Emits events
    const onSetItemsPerPage = async (event) => {
      emit("setItemsPerPage", event);
    };

    const onCurrentPageChange = async (val) => {
      emit("currentPageChange", val);
    };

    const handleInput = (value) => {
      let orIndex = 0;
      const searchCriteria = props.columnDefs.reduce((result, item) => {
        if (item.search) {
          if (Array.isArray(item.search)) {
            item.prefixCriteria?.map((prefix) => {
              result[`where[OR][${orIndex}]${prefix.criteria}`] = prefix.value;
            });
            item.search.map((search) => {
              const criteria = search.criteria;
              const mode = search.insensitive ? "insensitive" : undefined;
              result[`where[OR][${orIndex}]${criteria}[contains]`] = value;
              if (mode) {
                result[`where[OR][${orIndex}]${criteria}[mode]`] = mode;
              }
              orIndex = orIndex + 1;
            });
          } else if (typeof item.search === "object") {
            const criteria = item.search.criteria;
            const mode = item.search.insensitive ? "insensitive" : undefined;
            item.prefixCriteria?.map((prefix) => {
              result[`where[OR][${orIndex}]${prefix.criteria}`] = prefix.value;
            });
            result[`where[OR][${orIndex}]${criteria}[contains]`] = value;
            if (mode) {
              result[`where[OR][${orIndex}]${criteria}[mode]`] = mode;
            }
            orIndex = orIndex + 1;
          }
        }
        return result;
      }, {});
      emit("inputChange", searchCriteria);
    };

    const onValidateFiltre = (value) => {
      let andIndex = 0;
      const searchCriteria = value.reduce((result, item, index) => {
        if (
          item.type &&
          item.condition &&
          item.value !== undefined &&
          item.value !== null
        ) {
          const field = item.type;
          const criteria = item.condition;
          const value =
            item.colType && item.colType === "date"
              ? item.value.split("/")[2] +
                "/" +
                item.value.split("/")[1] +
                "/" +
                item.value.split("/")[0]
              : item.value;
          item.prefixCriteria?.map((prefix) => {
            result[`where[AND][${andIndex}]${prefix.criteria}`] = prefix.value;
          });
          if (Array.isArray(field)) {
            field.map((f, orIndex) => {
              result[`where[AND][${andIndex}][OR][${orIndex}]${f}${criteria}`] =
                value;
              result[`where[AND][${andIndex}][OR][${orIndex}]${f}[mode]`] =
                item.colType && item.colType !== "string"
                  ? undefined
                  : "insensitive";
            });
          } else {
            console.log("dsqdsqdsq", item.field);
            result[`where[AND][${andIndex}]${field}${criteria}`] = value;
            result[`where[AND][${andIndex}]${field}[mode]`] =
              item.colType && item.colType !== "string"
                ? undefined
                : "insensitive";
          }

          andIndex += 1;
        }
        return result;
      }, {});
      emit("onValidateFiltre", searchCriteria);
      filterBtn.value.click();
    };

    const handlePopoverItemAction = (item) => {
      emit("popoverItemAction", { item, selectedRow: selectedRow.value });
    };
    const handleDateRangeFilter = (range) => {
      emit("confirmDateRangePicker", range);
    };

    const handleColumnMoved = async (data) => {
      if (data.finished && data.column) {
        columnConfig.value = webelement.value[webElementId.value].columns;
        const colId = data.column.colId;
        const oldColumnIndex = columnConfig.value.findIndex(
          (col) => col.colId === colId
        );
        const elementToMove = columnConfig.value.splice(oldColumnIndex, 1)[0];
        columnConfig.value.splice(data.toIndex, 0, elementToMove);
        const key = webElementId.value;
        const conf = {
          [key]: {
            columns: columnConfig.value,
            rowVue:
              webelement.value &&
              webelement.value[webElementId.value] &&
              webelement.value[webElementId.value].rowVue
                ? webelement.value[webElementId.value].rowVue
                : 42,
          },
        };
        setWebElements(conf);
        await service.api.userWebElementControllerUpsert({
          webElement: {
            id: webElementId.value,
          },
          user: {
            id: currentUser.value.id,
          },
          config: conf[webElementId.value],
        });
      }
    };
    onMounted(async () => {
      document.addEventListener("click", handleClickOutside);
      const args = props.isService
        ? {
            "where[service][id]": props.webElementAddress,
          }
        : {
            "where[address]": props.webElementAddress,
          };
      const resp = await service.api.webElementControllerFindMany(args);
      webElementId.value = resp.data?.paginatedResult[0]?.id;
      if (
        resp.data.paginatedResult.length &&
        resp.data.paginatedResult[0].userWebElements?.length
      ) {
        rowVue.value =
          resp.data.paginatedResult[0].userWebElements[0].config.rowVue;
        dataTableColumns.value =
          resp.data.paginatedResult[0].userWebElements[0].config.columns.map(
            (item, index) => {
              const c = props.columnDefs.find(
                (col) => col.colId === item.colId
              );
              return {
                ...c,
                hide: item.hide,
                headerComponentParams: {
                  ...c.headerComponentParams,
                  webElementId: webElementId.value,
                },
              };
            }
          );
      }
      if (!dataTableColumns.value.length) {
        getDefaultColDefs();
      }
      conf[webElementId.value] = {
        columns: dataTableColumns.value.map((item) => ({
          colId: item.colId,
          hide: item.hide,
        })),
        rowVue: rowVue.value,
      };
      setWebElements(conf);
    });
    const getDefaultColDefs = () => {
      dataTableColumns.value = props.columnDefs.map((col) => {
        return {
          ...col,
          headerComponentParams: {
            ...col.headerComponentParams,
            webElementId: webElementId.value,
          },
        };
      });
    };
    const selectionChanged = () => {
      onlySelectedRows.value = gridApi.value.getSelectedRows().length !== 0;
    };
    const exportToExcel = async () => {
      if (onlySelectedRows.value) {
        gridApi.value.exportDataAsCsv({ onlySelected: onlySelectedRows.value });
      } else if (props.exportedfromClient) {
        gridApi.value.exportDataAsCsv();
      } else {
        const columns = props.columnDefs
          .filter((e) => e.field)
          .map((e) => {
            return {
              headerName: e.headerName,
              field: e.field,
              valueGetterType: e.valueGetterType ?? undefined,
            };
          });
        console.log(props.exportFilter);
        const { data } = await service.api.exportControllerFindDataForExcel(
          {
            columnDef: columns,
            entity: props.exportEntityName,
          },
          props.exportFilter
        );
        const workbook = XLSX.read(data.file.toString());
        XLSX.writeFile(workbook, props.entity + ".csv");

        //emit("export");
      }

      /*  try {
        const { data } = await service.api.exportControllerFindDataForExcel({
          columnDef:[
            { field: 'id', headerName: 'id' },
            { field: 'actorName', headerName: 'nom' },
            { field: 'actorPerson.firstName', headerName: 'prenom' },
            { field: 'actorPerson.actor.age', headerName: 'age' },
          ],entity:'actorView'
        }); */
      /*   const workbook = XLSX.read(data.file.toString());

        // Assuming the custom headers are in an array
        const customHeaders = ['Custom Header 1', 'Custom Header 2', 'Custom Header 3'];

        // Assuming the header row is in the first row (Sheet 1, A1 to Z1)
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Update the entire first row with custom headers
        customHeaders.forEach((header, index) => {
          const cellAddress = String.fromCharCode(65 + index) + '1'; // A1, B1, C1, ...
          worksheet[cellAddress] = { v: header };
        });

        XLSX.writeFile(workbook, "clientData.csv", {}); */
      /*   } catch (error) {
        console.error("Error downloading file:", error);
      } */
      // let excelData = props.data.map((row) => {
      //   const newRow = {};
      //   props.columnDefs
      //     .filter((col) => !col.pinned)
      //     .map((col) => {
      //       const value = col.valueGetter
      //         ? valueGetter(col, row)
      //         : loadash.get(row, col.field);
      //       newRow[col.headerName] =
      //         typeof value === "boolean" ? (value ? "oui" : "non") : value;
      //     });
      //   return newRow;
      // });
      // // todo optimisate the code
      // // Convert the array of objects to a 2D array
      // const dataArray = [Object.keys(excelData[0])]; // Create the header row
      // excelData.forEach((item) => {
      //   dataArray.push(Object.values(item));
      // });

      // // Create a new workbook
      // const workbook = XLSX.utils.book_new();
      // const worksheet = XLSX.utils.aoa_to_sheet(dataArray);

      // worksheet["!cols"] = Object.keys(excelData[0]).map(() => ({ wch: 20 }));

      // // Add the worksheet to the workbook
      // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

      // // Convert the workbook to an array buffer
      // const arrayBuffer = XLSX.write(workbook, {
      //   bookType: "xlsx",
      //   type: "array",
      // });
      // // Create a blob from the array buffer
      // const blob = new Blob([arrayBuffer], {
      //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // });
      // // Create a download link for the Excel file
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "data.xlsx";
      // a.click();
      // URL.revokeObjectURL(url);
    };
    const valueGetter = (payload, row) => {
      const getter = eval(payload.valueGetter);
      const res = getter({ data: row });
      return res;
    };
    return {
      onGridReady,
      gridColumnApi,
      onSetItemsPerPage,
      onCurrentPageChange,
      contextCellClick,
      rowSelection,
      cellPopoverVisible,
      popoverPosition,
      colsStates,
      restoreColumns,
      onColumnVisible,
      onPinnedCellClick,
      selectedRow,
      motifs,
      search,
      initDisplayedColumns,
      onValidateFiltre,
      vues,
      setRowVue,
      handleInput,
      t,
      handlePopoverItemAction,
      handleColumnMoved,
      rowVue,
      dataTableColumns,
      colsManagementBtn,
      filterBtn,
      dataTableEntityName,
      exportToExcel,
      rowNumbers,
      selectionChanged,
      cellEditingStopped,
      dateRangePicker,
      handleDateRangeFilter,
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container {
  height: calc(100vh - 210px);
}
.footer__wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-inline: 20px;
  height: 50px;
  margin-bottom: 20px;
  border: solid 1px rgb(241, 241, 241);
  background-color: white;
  border-radius: 0 0 7px 7px;
}
.table_options {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
  margin-bottom: 10px;
  .table_option {
    padding: 6px 10px;
    border-radius: 5px;
    &:hover {
      background-color: rgb(235, 235, 235);
    }
  }
  .table_option_button {
    border: none;
    color: $noir;
    margin: 0;
    padding: 8px 15px 8px 8px;
  }
  :deep(.el-input) {
    --el-input-border-color: none !important;
    --el-input-text-color: $noir;
  }
  :deep(.el-input__inner) {
    padding-left: 35px !important;
  }
  :deep(.el-input__inner::placeholder) {
    color: $noir;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
.vue-item:hover {
  background-color: rgb(235, 235, 235);
}
:deep(.ag-center-cols-clipper) {
  min-height: 50px !important;
  max-height: 100vh !important;
}
:deep(.ag-overlay-no-rows-center) {
  margin-top: 3% !important;
}
:deep(.el-date-editor) {
  --el-border-color: none !important;
  --el-text-color-placeholder: $noir !important;
  .el-range__icon svg {
    transform: scale(1.3);
  }
}
</style>
