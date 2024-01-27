<template>
  <div class="mt-5" >
    <dataTable
    :data="roleList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :contextMenuList="contextMenuList"
    @popoverItemAction="popoverItemAction"
    @inputChange="handleSearch"
    :withFooter="false"
    @rowClick="rowClicked"
    webElementAddress="roleList"
    entity="roles"
    :colsOption="false"
    :filterOptions="false"
    />
  </div>
  </template>

<script lang="ts" setup>
import { onMounted, ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRoleStore } from "@/store/useRoleModule";
import { useBodyStore } from "@/store/useBodyModule";
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import { useConfigStore } from "@/store/useConfig";
import { useRouter } from "vue-router";

const CustomRowOptions = defineAsyncComponent(
  () => import("@/components/shared/ag-grid-table/CustomRowOptions.vue")
);

const serchCriteria = ref();
    const router = useRouter();

const { isLoading } = storeToRefs(useBodyStore());
const { roleList} = storeToRefs(useRoleStore());
const { fetchRoles } = useRoleStore();
const { setHeader } = useConfigStore();
setHeader("RoleListHeader");
const columnDefs = ref([
  {
    colId: "name",
    hide: false,
    field: "roleName",
    headerName: "Nom du rôle",
    headerComponentParams: {
      template: "default",
    },
    search: {
      criteria: "[roleName]",
      insensitive: true,
    },

    lockPosition: "left",
    pinned: "left",
    suppressMovable: true,
    lockPinned: true,
  },
  {
    colId: "description",
    hide: false,
    field: "description",
    headerComponentParams: {
      template: "default",
    },
    headerName: "Description",
    flex: 1 / 3,
    search: {
      criteria: "[description]",
      insensitive: true,
    },
    lockPinned: true,
    suppressMovable: true,
  },
  {
    colId: "lastEdit",
    headerComponentParams: {
      template: "default",
    },
    hide: false,
    field: "ids.update",
    headerName: "Dernière modification",
    // search: {
    //   criteria: "[ids][editBy]",
    //   insensitive: true,
    // },
    lockPinned: true,
    suppressMovable: true,
  },

  {
    colId: "menu",
    hide: false,
    headerComponentParams: {
      template: "empty",
    },
    maxWidth: 50,
    pinned: "right",
    cellRenderer: CustomRowOptions,
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
  entity: "role",
  list: ["edit"],
});
const rowClicked = (value) => {
      router.push({
        name: "admin-detail-role",
        params: { id: value.id },
      });
    };
const popoverItemAction = async (item: any) => {
  console.log(item,"item")
  if (item.item === "edit") {
    router.push({
        name: "admin-detail-role",
        params: {id: item.selectedRow.id },
      });
  }
};


const handleSearch = async (val) => {
  serchCriteria.value = val;
  await fetchRoles({},{
    ...serchCriteria.value
  });
};
onMounted(async () => {
  await fetchRoles({});
  isLoading.value = false;
});
</script>

<style scoped lang="scss"></style>
