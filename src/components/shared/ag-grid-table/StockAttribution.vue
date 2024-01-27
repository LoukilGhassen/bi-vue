<template>
  <div
    v-if="showEmpty"
    class="d-flex flex-column justify-content-center align-items-center"
    style="height: 70vh"
  >
    <img
      src="/png/Thinking_Face.png"
      alt="metronic"
      style="width: 180px; height: 180px"
    />
    <p class="fw-boldest mt-20 fs-2">Aucune attribution</p>
    <div>
      <div>
        <p class="poppins px-10 text-center">
          Pour attribuer à vos visiteurs médicaux, des quantités d’échantillon à
          remettre en main propre, cliquez ci-dessous.
        </p>
        <p
          class="poppins text-center color-btn cursor-pointer"
          @click="handleAddRow"
        >
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Affecter un échantillon/visiteur médical
        </p>
      </div>
    </div>
  </div>

  <dataTable
    v-else
    :data="sampleStockList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    :contextMenuList="contextMenuList"
    :additionalTableOptions="additionalTableOptions"
    @inputChange="handleSearch"
    webElementAddress="stockAttribution"
    entity="membres"
    @addRow="handleAddRow"
    :withFooter="false"
    :rowClassRules="rowClassRules"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useSampleStockStore } from "@/store/useSampleStockModule";
import UserStockAttributionSelectCell from "@/components/shared/ag-grid-table/UserStockAttributionSelectCell.vue";
import { ref, onMounted, computed, onBeforeMount } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";

import DynamicCellRenderButton from "@/components/shared/ag-grid-table/DynamicCellRenderButton.vue";
import { setModal } from "@/core/helpers/config";
import { intSort } from "@/core/helpers/dataTableHelper";
export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    UserStockAttributionSelectCell,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
    },
    setup(props) {
      const route = useRoute();
      const serchCriteria = ref();
      const filtersCriteria = ref();
      const showEmpty = ref(false);
      const { sampleStockList, showListAddRow } = storeToRefs(useSampleStockStore());
      const {
        fetchSampleStocks,
        setShowListAddRow,
        addSampleStock,
        editSampleStock,
        deleteSampleStock,
        deleteEmptySampleStock
      } = useSampleStockStore();
  
      const id =  route.params.id;
      
      const handleCellEditingStopped = async (params) => {
      if(params.newValue !== undefined && params.newValue !== null && params.data?.id && !isNaN(params.newValue) && params.newValue >= 0){
        const maxStock = props.type === "inPlace" ? params.data?.sample?.stockQty :params.data?.sample?.stockToShip 
        if(parseFloat(params.newValue) > maxStock){
          Components.ElNotification.error({
            message:
              "La quantité allouée doit être inférieure ou égale à la quantité en stock.",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "error-notif",
          });
          return false;
        } else {
          await editSampleStock({
            id: params.data?.id,
            data: { allocatedQty: parseFloat(params.newValue) },
          });
          Components.ElNotification.success({
            message: "Opération effectuée avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      } else {
        Components.ElNotification.error({
          message: "Veuillez vérifier la quantité saisie.",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "error-notif",
        });
        return false;
      }
    };

    const columnDefs = ref([
      {
        colId: "avatar",
        hide: false,
        field: "avatar",
        headerName: "Utilisateur",
        cellRenderer: AvatarCellRender,
        cellRendererParams: {
          cellData: {
            type: "stockUser",
          },
            
              },
        },
        {
          colId: "email",
          hide: false,
          field: "email",
          headerName: "E-mail",
          search: {
            criteria: "[user][username]",
            insensitive: true,
          },
          cellRendererParams: {
            type: props.type,
          },
          cellRenderer: UserStockAttributionSelectCell,
          filter: {
            conditions: [
              { label: "égal", value: "[equals]" },
              { label: "contient", value: "[contains]" },
              { label: "différent", value: "[not][contains]" },
            ],
            field: "[user][username]",
          },
          lockPinned: true,
          flex:1,
          minWidth:200
        },
      {
        colId: "function",
        hide: false,
        field: "role",
        headerName: "Fonction",
        search: {
          criteria: "[user][userTypes][some][role][roleName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user][userTypes][some][role][roleName]",
        },
        lockPinned: true,
        valueGetter: (params: any) => {
          if (
            params.data?.user?.userTypes &&
            params.data?.user?.userTypes.length
          ) {
            return params.data?.user?.userTypes
              ?.map((userType: any) => {
                return userType.role?.roleName;
              })
              .join(",");
          }
          return "";
        },
      },
      {
        colId: "allocatedQty",
        hide: false,
        field: "allocatedQty",
        headerName: "Quantité allouée",
        editable: true,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[allocatedQty]",
          type: "number",
        },
        lockPinned: true,
        valueSetter: handleCellEditingStopped,
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.allocatedQty);
          const impB = parseInt(nodeB.data.allocatedQty);
          return intSort(impA, impB);
        },
      },
      {
        colId: "userUsedQty",
        hide: false,
        field: "stockView.userUsedQty",
        headerName: "Quantité utilisée",
        lockPinned: true,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[stockView][userUsedQty]",
          type: "number",
        },
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {
          const impA = parseInt(nodeA.data.stockView.userUsedQty);
          const impB = parseInt(nodeB.data.stockView.userUsedQty);
          return intSort(impA, impB);
        },
      },
      {
        colId: "userRemainingQty",
        hide: false,
        field: "stockView.userRemainingQty",
        headerName: "Quantité restante",
        lockPinned: true,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "inférieur ou égal", value: "[lte]" },
            { label: "supérieur ou égal", value: "[gte]" },
            { label: "différent", value: "[not]" },
          ],
          field: "[stockView][userRemainingQty]",
          type: "number",
        },
        comparator: (intA, intB, nodeA, nodeB, isDescending) => {

          console.log("hello");
          
          const impA = parseInt(nodeA.data.stockView.userRemainingQty);
          const impB = parseInt(nodeB.data.stockView.userRemainingQty);
          return intSort(impA, impB);
        },
      },
      {
        colId: "menu",
        hide: false,
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: CustomRowOptionsVue,
        lockPosition: "right",
        cellClass: "locked-col",
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };

    const contextMenuList = ref({
      entity: "membres",
      list: ["delete"],
    });

    const handleAddRow = () => {
      addSampleStock({});
      setShowListAddRow(false);
      showEmpty.value = false;
    };

    const additionalTableOptions = computed(() => {
      return showListAddRow.value ? ["addRow"] : ["addRow", "addRowDisabled"];
    });

    const popoverItemAction = async (item) => {
      if (item.item === "delete") {
        if (!item.selectedRow?.id) {
          deleteEmptySampleStock();
          setShowListAddRow(true);
        } else if (item.selectedRow?.stockView?.userUsedQty !== 0) {
          setModal("DeleteMemberModal", {
            user: {
              ...item.selectedRow.user,
              id: item.selectedRow.id,
            },
            title: "Supprimer une attribution",
          });
        } else {
          await deleteSampleStock(item.selectedRow.id);
          Components.ElNotification.success({
            message: "opération effectué avec succès",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "success-notif",
          });
        }
      }
    };

    const validateFiltre = async (val) => {
      filtersCriteria.value = val;
      await fetchSampleStocks(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[sample][id]": id,
          "where[listIdStockTypeObject][tag]": props.type,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchSampleStocks(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[sample][id]": id,
          "where[listIdStockTypeObject][tag]": props.type,
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };

    // add class to specific rows
    const rowClassRules = ref<any>(null);
    onBeforeMount(() => {
      rowClassRules.value = {
        // row style function
        // "bannedUser-class": (params) => {
        //   return params.data.user.bannedUntil;
        // },
        // row style expression
        "bannedUser-class": "data.user.bannedUntil",
      };
    });

    onMounted(async () => {
      setShowListAddRow(true);
      await fetchSampleStocks(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[sample][id]": id,
          "where[listIdStockTypeObject][tag]": props.type,
        }
      );
      if (sampleStockList.value.length === 0) {
        showEmpty.value = true;
      }
    });

    return {
      columnDefs,
      defaultColDef,
      validateFiltre,
      handleSearch,
      popoverItemAction,
      sampleStockList,
      contextMenuList,
      additionalTableOptions,
      showEmpty,
      handleAddRow,
      handleCellEditingStopped,
      rowClassRules,
    };
  },
};
</script>
<style lang="scss" scoped>
.dataTable_container {
  height: calc(100vh - 260px);
}

.color-btn {
  color: $violet-fonce !important;
  border-color: $violet-fonce !important;
}
:deep(.bannedUser-class) {
  background-color: #f5f5f5 !important;
}
</style>
