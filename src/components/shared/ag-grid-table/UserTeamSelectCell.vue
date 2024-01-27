<template>
  <span v-if="params.data.email">
    {{ params.data.email }}
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
import { useUserTeamStore } from "@/store/useUserTeamModule";
import { useRoute } from "vue-router";
import service from "@/service";

import { ref, onMounted } from "vue";

export default {
  components: {},

  props: ["params"],

  setup(props) {
    const route = useRoute();
    const userList = ref([]);
    const { createUserTeam, setShowListAddRow } = useUserTeamStore();

    const querySearch = async (queryString) => {
      const { data } = await service.api.userControllerFindMany({
        skip: 0,
        take: 20,
        "where[username][contains]": queryString ? queryString : "",
        "where[username][mode]": "insensitive",
        "where[id][not]": route.params.id,
        "where[user2Team][none][user1Id]": route.params.id,
        "where[user1Team][none][user2Id]": route.params.id,
        "where[OR][0][userTypes][some][role][tag]": "VM",
        "where[OR][1][userTypes][some][role][tag]": "DIR0",
        "where[OR][2][userTypes][some][role][tag]": "DIR1",
        "where[OR][3][userTypes][some][role][tag]": "DIR2",
      });
      userList.value = data.paginatedResult;
    };

    const handleSelectUser = async (selectedUser) => {
      await createUserTeam({
        data: {
          user1: {
            id: route.params.id,
          },
          user2: {
            id: selectedUser.id,
          },
        },
      });

      setShowListAddRow(true);
    };

    onMounted(async () => {
      if (!props?.params?.data?.email) {
        querySearch("");
      }
    });
    return { userList, querySearch, handleSelectUser };
  },
};
</script>
<style scoped></style>
