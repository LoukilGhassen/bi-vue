<template>
  <div class="h-100" >
    <el-tabs v-model="activeName"  class="demo-tabs h-100" @tab-click="handleClick">
      <el-tab-pane label="Mes informations" name="info">
        <div class="d-flex w-100 h-100 gap-20 mt-5 p-1"  v-if="activeName==='info' && mounted">
          <CardForm class="w-100" />
          <div class="mb-10 w-100">
            <CardFormActivity class="mb-20" />
            <CardParam />
          </div>
          <div class="w-100"><CardUpdatePassword/></div> 
        </div>
      </el-tab-pane>
      <el-tab-pane class="h-100 py-10" label="Mes documents" name="docs">
        <UserDocuments v-if="activeName==='docs' && mounted"/></el-tab-pane>
      <el-tab-pane label="Mon équipe" name="team"
        ><AttachedTeam v-if="activeName==='team'"/></el-tab-pane
      >
    </el-tabs>
    
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/store/useConfig";
import CardForm from "@/components/cards/CardForm.vue";
import CardFormActivity from "@/components/cards/CardFormActivity.vue";
import CardUpdatePassword from "@/components/cards/CardUpdatePassword.vue";
import CardParam from "@/components/cards/CardParam.vue";
import { ref,onMounted } from "vue";
import { storeToRefs } from "pinia";
const { setHeader } = useConfigStore();
import UserDocuments from "./UserDocuments.vue";
import AttachedTeam from "./AttachedTeam.vue";
setHeader("UserProfilHeader");
const activeName = ref("info");
const mounted = ref(false);
const { currentUser } = storeToRefs(useAuthStore());
import { useAuthStore } from '@/store/useAuth';
import { useUserStore } from "@/store/useUserModule";
const { getUserById } = useUserStore();
const handleClick = (tab, event: Event) => {
};
onMounted(async () => {

  await getUserById(currentUser.value?.id);
  mounted.value = true
  })
</script>

<style lang="scss" scoped>

:deep(.el-tabs){
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__content){
  flex:1;
}
</style>
