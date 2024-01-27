<template>
  <dataTable
    :data="userList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="userPagination"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    entity="utilisateurs"
    :contextMenuList="contextMenuList"
    webElementAddress="userList"
    @rowClick="rowClicked"
  />
</template>

<script lang="ts">
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import UserActivationCell from "@/components/shared/ag-grid-table/UserActivationCell.vue";
import { ref, onMounted } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute } from "vue-router";
import service from "@/service";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/useUserModule";
import { setModal } from "@/core/helpers/config";
import { useRouter } from "vue-router";
import { can } from "@/core/helpers/permission";

export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    UserActivationCell,
  },
  props: {
    webElementAddress: {
      required: true,
      type: String,
    },
    relationType: {
      required: true,
      type: String,
    },
  },

  setup(props) {
    const router = useRouter();
    const { setHeader } = useConfigStore();
    setHeader("UserManagementHeader");
    const { userList, userPagination, userExcelFile } = storeToRefs(
      useUserStore()
    );
    const { fetchUsers, bannUser, deleteUser } = useUserStore();
    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();

    const columnDefs = ref([
      {
        colId: "selection",
        hide: false,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerComponentParams: {
          template: "empty",
        },
        pinned: "left",
        width: 50,
        suppressMovable: true,
      },
      {
        colId: "active",
        hide: false,
        field: "bannedUntil",
        headerName: "Activation",
        cellRenderer: UserActivationCell,
        filter: {
          type:'boolean',
          field: "[bannedUntil]",
        },
      },
      {
        colId: "type",
        hide: false,
        field: "roles",
        headerName: "Type",
        valueGetter: (params: any) =>
          params.data.roles
            .map((role: string) => role.charAt(0).toUpperCase() + role.slice(1))
            .join(","),
        filter: {
          type:'array',
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[has]" },
          ],
          field: "[roles]",
        },
      },
      {
        colId: "name",
        hide: false,
        // add value getter name &  lastName
        field: "email",
        cellRenderer: AvatarCellRender,
        cellRendererParams: {
          cellData: {
            type: "user",
          },
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: ["[lastName]","[firstName]"],
        },
        headerName: "Utilisateur",
          search: [{
           criteria: "[firstName]",
           insensitive: true,
         },{
           criteria: "[lastName]",
           insensitive: true,
         },]
      },
      {
        colId: "role",
        hide: false,
        field: "userTypes",
        search: {
           criteria: "[userTypes][some][role][roleName]",
           insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[userTypes][some][role][roleName]",
        },
        headerName: "Rôle",
        valueGetter: (params: any) => {
          if (params.data?.userTypes && params.data?.userTypes.length) {
            return params.data?.userTypes?.map((userType: any) => {
              return userType.role?.roleName;
            }).join(",")
          }
          return "";
        },
      },
      {
        colId: "telephone",
        hide: false,
        field: "telephone",
        headerName: "Téléphone",
        search: {
          criteria: "[telephone]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[telephone]",
        },
      },
      {
        colId: "email",
        hide: false,
        field: "username",
        headerName: "E-mail",
        search: {
          criteria: "[username]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[username]",
        },
        lockPinned: true,
      },
      {
        colId: "id",
        hide: false,
        field: "id",
        headerName: "ID",

        search: {
          criteria: "[id]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[id]",
        },
        lockPinned: true,
      },
      {
        colId: "companyCode",
        hide: false,
        field: "entrepriseId",
        headerName: "Code Entreprise",
        search: {
          criteria: "[entrepriseId]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[entrepriseId]",
        },
        lockPinned: true,
         flex:1
      },
      {
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: can('edit','CreateModifyUser')? CustomRowOptionsVue : [],
        lockPosition: "right",
        cellClass: "locked-col",
        colId: "menu",
        hide: false,
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };
    const contextMenuList = ref( can('edit','CreateModifyUser')? {
      entity: "user",
      list: ["edit", "delete"],
    }:{});
     const rowClicked = (value) => {
      router.push({
        name: "admin-detail-user",
        params: { id: value.id },
      });
    };

 
    //pagination
    const setItemsPerPage = async (event: any) => {
      await fetchUsers({
        skip: 0,
        take: parseInt(event.target.value),
      },
        { ...serchCriteria.value, ...filtersCriteria.value });
    };
    const currentPageChange = async (val: number) => {
      await fetchUsers({
        skip: (val - 1) * userPagination.value.take,
        take: userPagination.value.take,
      },
        { ...serchCriteria.value, ...filtersCriteria.value });
    };
    // const handleDeleteUser = async (id, motif) => {
    //       await deleteUser(id);
    //     };
    const popoverItemAction = (item) => {
      
      if (item.item === "delete") {
        setModal("DeleteUserModal", {
          user: item.selectedRow,
          title: "Supprimer utilisateur",
        });
      }
      if (item.item === "edit") {
        router.push({
        name: "admin-detail-user",
        params: { id: item.selectedRow.id },
      });
      }
      if (item.item === "duplicate") {
        //await duplicateStory(item.selectedRow.id);
      }
    };
    function modifyKeys(obj) {
      const newObj = { ...obj }; 
      Object.keys(newObj).forEach((key) => {
        if (key.includes('[bannedUntil][equals]')) {
          if (newObj[key] == true || newObj[key] == "true") {
            newObj[key] = null;
          } else {
            const oldKey = key;
            newObj[oldKey] = undefined;
            key = key.replace('[bannedUntil][equals]', '[bannedUntil][not]');
            newObj[key] = null;
          }
        }
      });

      return newObj;
}



    const validateFiltre = async (val) => {
      filtersCriteria.value = modifyKeys(val);
      await fetchUsers(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = val;
      await fetchUsers(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        { ...serchCriteria.value, ...filtersCriteria.value }
      );
    };

     

    onMounted(async () => {
      await fetchUsers({
        skip: 0,
        take: Number(localStorage.getItem("take")) || 20,
      });
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      handleSearch,
      popoverItemAction,
      userList,
      userPagination,
      contextMenuList,
      rowClicked,
    };
  },
};
</script>
<style lang="scss" scoped>


</style>

