<template>
  <dataTable
    :data="listList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="listPagination"
    @popoverItemAction="popoverItemAction"
    entity=""
    :contextMenuList="contextMenuList"
    webElementAddress="VisitObjectives"
    @rowClick="rowClicked"
    :colsOption="false"
    :withFooter="false"
    :searchOption="false"
    :filterOption="false"
    :viewsOption="false"
    editType="fullRow"
    :fitContentHeight="true"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import ListActivationCell from "@/components/shared/ag-grid-table/ListActivationCell.vue";
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { useListStore } from "@/store/useListModule";

export default {
  components: {
    dataTable,
    CustomRowOptionsVue,
    ListActivationCell,
  },
  props: {},

  setup(props) {
    const { listList, listPagination, error } = storeToRefs(useListStore());
    const { fetchLists } = useListStore();
    const { editList } = useListStore();


    const onRowDataChanged = async (params) => {
      try {
        const  captionFr  = params.newValue;
        if(!captionFr || isNaN(captionFr) || captionFr.includes('.') || parseInt(captionFr) < 0) {

          Components.ElNotification.error({
            message: "Veuillez vérifier l'objectif saisie.",
            position: "bottom-right",
            offset: 60,
            duration: 2000,
            customClass: "error-notif",
          });
        }else{
            await editList({
                id: params.data.id,
                data: {
                  captionFr,
                  listTypeNameObject:{
                    listTypeName:'VisitObjectives'
                  }
                },
              });
              if(error.value){
                Components.ElNotification.error({
                  message: "L'objectif existe déjà.",
                  position: "bottom-right",
                  offset: 60,
                  duration: 2000,
                  customClass: "error-notif",
                });
              }else{
                Components.ElNotification.success({
                  message: "Opération effectuée avec succès",
                  position: "bottom-right",
                  offset: 60,
                  duration: 2000,
                  customClass: "success-notif",
                });
                return true
              }
        }        
      } catch (error) {
        console.log(error, "error");
      }
    };


    const columnDefs = ref([
      {
        colId: "code",
        hide: false,
        field: "code",
        headerName: "Code",
        headerComponentParams: {
          template: "default",
        },
      },
      {
        colId: "description",
        hide: false,
        field: "listsIdObject.captionFr",
        headerName: "Description",
        headerComponentParams: {
          template: "default",
        },
      },
      {
        colId: "visitObjectives",
        hide: false,
        headerComponentParams: {
          template: "default",
        },
        field: "captionFr",
        headerName: "Objectif annuel de visite",
        flex: 1 / 3,
        editable: true,
        valueSetter: onRowDataChanged
      },
    ]);

    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };

    const contextMenuList = ref({ entity: "list", list: ["edit"] });
    let isEditInlineCell = ref(false);
    const rowClicked = async (value, event) => {
      if (isEditInlineCell.value) {
        event.api.stopEditing(true);
        isEditInlineCell.value = false;
        return;
      }
      if (!isEditInlineCell.value) {
        event.api.startEditingCell({
          rowIndex: event.rowIndex,
          colKey: "visitObjectives", // Replace with your actual column key
        });
        isEditInlineCell.value = true;
      }
    };

    const popoverItemAction = (item) => {
      if (item.item === "edit") {
        item.gridApi.startEditingCell({
          rowIndex: item.selectedRowIndex,
          colKey: "visitObjectives", // Replace with your actual column key
        });
      }
    };    
    onMounted(async () => {
      await fetchLists("VisitObjectives", {
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      popoverItemAction,
      listList,
      listPagination,
      contextMenuList,
      rowClicked,
      onRowDataChanged,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>
