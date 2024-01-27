<template>
  <dataTable
    :data="vmList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="userActorRelationshipPagination"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    @inputChange="handleSearch"
    :webElementAddress="webElementAddress"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    :entity="entityName"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";

import { ref, onMounted } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import DynamicCellRenderButton from "@/components/shared/ag-grid-table/DynamicCellRenderButton.vue";
import { useRoute } from "vue-router";
import service from "@/service";

export default {
  components: {
    dataTable,
    AvatarCellRender,
    DynamicCellRenderButton
  },
  props:{
    webElementAddress: {
      required:true,
      type:String
    },
    relationType:{
      required:true,
      type:String
    },
    entityName:{
      required:false,
      type:String,
      default:'VM'
    }
  },
  setup(props) {
    const route = useRoute()
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const userActorRelationshipList = ref([])
    const userActorRelationshipPagination = ref ({
          skip: 0,
          take:  20,
          total: 20,
        })

    const columnDefs = ref([
      {
        colId: "avatar",
        hide: false,
        field: "avatar",
        headerComponentParams: {
          template: "empty",
        },
        cellRenderer: AvatarCellRender,
        width: 80,
        pinned: "left",
      },
      {
        colId: "email",
        hide: false,
        field: "email",
        headerName: "E-mail",
        search: {
          criteria: "[userObject][username]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[userObject][username]",
        },
        lockPinned:true,
      },
      {
        colId: "lastName",
        hide: false,
        field: "lastName",
        headerName: "Nom",
        search: {
          criteria: "[userObject][lastName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[userObject][lastName]",
        },
        lockPinned:true,

      },
      {
        colId: "firstName",
        hide: false,
        field: "firstName",
        headerName: "Prénom",
        search: {
          criteria: "[userObject][firstName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[userObject][firstName]",
        },
        lockPinned:true,

      },
      {
        colId: "telephone",
        hide: false,
        field: "telephone",
        headerName: "Téléphone",
        search: {
          criteria: "[userObject][telephone]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[userObject][telephone]",
        },
        lockPinned:true,

      },
      {
        colId: "menu",
        hide: false,
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer: DynamicCellRenderButton,
        cellRendererParams: {
          cellData: {
            type: "sendMail",
          },
        },
        lockPosition: "right",
        cellClass: "locked-col",
      },
    ]);
    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
    };

    //pagination
    const setItemsPerPage = async (event) => {

      const {
            data,
          } = await service.api.userUgaControllerFindManyView({
            skip:  0,
            take: parseInt(event.target.value),
            "where[actorObject][id]":route.params.id,
            "where[userObject][userTypes][some][role][tag][equals]": props.relationType 
         });
          userActorRelationshipList.value = data.paginatedResult;
          userActorRelationshipPagination.value = {
            total: data.totalCount,
            skip:  0,
            take:  parseInt(event.target.value),
          };
          localStorage.setItem(
            "take",
            parseInt(event.target.value).toString()
          );   
    };

    const currentPageChange = async (val) => {
      const {
            data,
          } = await service.api.userUgaControllerFindManyView({
            skip: (val - 1) * userActorRelationshipPagination.value.take,
            take: userActorRelationshipPagination.value.take,
            "where[actorObject][id]":route.params.id,
            "where[userObject][userTypes][some][role][tag][equals]": props.relationType 
         });
          userActorRelationshipList.value = data.paginatedResult;

          userActorRelationshipPagination.value = {
            total: data.totalCount,
            skip:  (val - 1) * userActorRelationshipPagination.value.take,
            take:  userActorRelationshipPagination.value.take,
          };
          localStorage.setItem(
            "take",
            userActorRelationshipPagination.value.take.toString() 
          );


    };



    const popoverItemAction = (item) => {
      
    };
    const validateFiltre = async(val) => {
      filtersCriteria.value = val;
      const {
            data,
          } = await service.api.userUgaControllerFindManyView({
            skip: 0,
            take:Number(localStorage.getItem("take")) || 20,
            "where[actorObject][id]":route.params.id,
            "where[userObject][userTypes][some][role][tag][equals]": props.relationType, 
            ...serchCriteria.value,
            ...filtersCriteria.value
         });
          userActorRelationshipList.value = data.paginatedResult;
          userActorRelationshipPagination.value = {
            total: data.totalCount,
            skip:  0,
            take:  Number(localStorage.getItem("take")) || 20,
          };

    };
    const handleSearch = async(val) => {
      serchCriteria.value = val;
      const {
            data,
          } = await service.api.userUgaControllerFindManyView({
            skip: 0,
            take:Number(localStorage.getItem("take")) || 20,
            "where[actorObject][id]":route.params.id,
            "where[userObject][userTypes][some][role][tag][equals]": props.relationType, 
            ...serchCriteria.value,
            ...filtersCriteria.value
         });
          userActorRelationshipList.value = data.paginatedResult;
          userActorRelationshipPagination.value = {
            total: data.totalCount,
            skip:  0,
            take:  Number(localStorage.getItem("take")) || 20,
          };


    };

    const vmList = computed(()=>{
      return userActorRelationshipList.value.map((item)=>{
        return {
            email:item.userObject.username,
            lastName:item.userObject.lastName,
            firstName:item.userObject.firstName,
            telephone:item.userObject.telephone,
        }
      })
    })
    

    onMounted(async () => {
      const {
            data,
          } = await service.api.userUgaControllerFindManyView({
            skip: 0,
            take: 20,
            "where[actorObject][id]":route.params.id,
            "where[userObject][userTypes][some][role][tag][equals]": props.relationType 
         });
          userActorRelationshipList.value = data.paginatedResult;
          userActorRelationshipPagination.value = {
            total: data.totalCount,
            skip:  0,
            take:  20,
          };
          localStorage.setItem(
            "take",
            "20"
          );
    });
    
    return {
      columnDefs,
      defaultColDef,
      userActorRelationshipPagination,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      handleSearch,
      popoverItemAction,
      vmList
    };
  },
};
</script>
<style lang="scss" scoped></style>
