<template>
    <span v-if="params.data?.user?.username">
      {{ params.data?.user?.username }}
    </span>
    <el-select
      v-else
      remote
      filterable
      class="w-100"
      @change="handleSelectUser"
      :remote-method="querySearch"
      value-key="id"
      clearable
      placeholder="Rechercher un utilisateur"
    >
      <el-option
        v-for="item in userList"
        :key="item.id"
        :label="item.username"
        :value="item"
      />
    </el-select>
  </template>
  
  <script>
  import { useSampleStockStore } from "@/store/useSampleStockModule";
  import { useRoute } from "vue-router";
  import service from "@/service";
  
  import { ref, onMounted } from "vue";
  
  export default {
    components: {},
  
    props: ["params"],
  
    setup(props) {
      const route = useRoute();
      const userList = ref([]);
      const { createSampleStock, setShowListAddRow } = useSampleStockStore();
  
      const querySearch = async (queryString) => {
        const { data } = await service.api.userControllerFindMany({
          skip: 0,
          take: 20,
          "where[username][contains]": queryString ? queryString : "",
          "where[username][mode]": "insensitive",
          "where[sampleStocks][none][AND][0][sampleId]":route.params.id,
          "where[sampleStocks][none][AND][1][listIdStockTypeObject][tag]": props.params?.type ,
          "where[sampleStocks][none][AND][2][ids][deletion][equals]":null,
          "where[OR][0][userTypes][some][role][tag]": "VM",
          "where[OR][1][userTypes][some][role][tag]": "DIR0",
          "where[OR][2][userTypes][some][role][tag]": "DIR1",
          "where[OR][3][userTypes][some][role][tag]": "DIR2",
          "where[OR][4][userTypes][some][role][tag]": "ADMIN",


        });
        userList.value = data.paginatedResult;
      };
  
      const handleSelectUser = async (selectedUser) => {
        await createSampleStock({
          data: {
            sample: {
              id: route.params.id,
            },
            user: {
              id: selectedUser.id,
            },
            allocatedQty:0,
            listIdStockTypeObject:{
                listTypeName_tag:{
                    listTypeName:"PackagingType",
                    tag:props.params?.type
                }
                
            }
          },
        });
  
        setShowListAddRow(true);
      };
  
      onMounted(async () => {
        if (!props?.params?.data?.user?.username) {
          querySearch("");
        }
      });
      return { userList, querySearch, handleSelectUser };
    },
  };
  </script>
  <style scoped></style>
  