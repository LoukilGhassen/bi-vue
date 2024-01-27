<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="Informations" name="info" v-if="$can('read','CreateModifyUser')">
      <UserForm isEdit v-if="activeName==='info' && mounted"/>
    </el-tab-pane>
    <el-tab-pane label="Documents" name="docs">
      <UserDocuments v-if="activeName==='docs'" /></el-tab-pane>
    <el-tab-pane label="Equipe rattachée" name="team" v-if="$can('access','AttachTeams')"
      ><AttachedTeam
      v-if="activeName==='team'"
      /></el-tab-pane
    >
  </el-tabs>
</template>
  
<script lang="ts" setup>
import { useConfigStore } from "@/store/useConfig";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import UserForm from "@/components/forms/UserForm.vue";
import UserDocuments from "./UserDocuments.vue";
import AttachedTeam from "./AttachedTeam.vue";


import { useUserStore } from "@/store/useUserModule";
import { useRoute } from "vue-router";
import { can } from "@/core/helpers/permission";
const route = useRoute();
const { user } = storeToRefs(useUserStore());
const { getUserById } = useUserStore();
const { setHeader } = useConfigStore();
setHeader("UserDetailHeader");

const activeName = ref(can('read','CreateModifyUser') ? "info" : "docs");
const mounted = ref(false)
const handleClick = (tab, event: Event) => {
};
onMounted(async () => {
  const id = route?.params?.id as string;
  await getUserById(id);
  mounted.value = true;
});
</script>
<style lang="scss" scoped>
:deep(.el-tabs__content) {
  overflow: initial;
  position: static;
}
:deep(.el-tabs__header) {
  margin: 0 0 20px;
}
</style>
