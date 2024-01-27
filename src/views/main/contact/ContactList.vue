<template>
  <el-tabs
    v-model="activeTabsName"
    class="demo-tabs contact"
    @tab-change="handleTabsClick"
  >
    <el-tab-pane label="Professionnels de santé" name="pds"
      ><HealthProffessionalsList
    /></el-tab-pane>
    <el-tab-pane label="Pharmacies" name="pharmacy"
      ><PharmacyList
    /></el-tab-pane>
    <el-tab-pane label="Etablissements de santé" name="healthCenter"
      ><HealthCenterList
    /></el-tab-pane>
    <el-tab-pane label="Entités" name="entity"><EntityList /></el-tab-pane>
  </el-tabs>
</template>

<script>
import { ref } from "vue";
import HealthProffessionalsList from "@/components/dataTableLists/HealthProffessionalsList.vue";
import PharmacyList from "@/components/dataTableLists/PharmacyList.vue";
import HealthCenterList from "@/components/dataTableLists/HealthCenterList.vue";
import EntityList from "@/components/dataTableLists/EntityList.vue";
import { useActorStore } from "@/store/useActorModule";
import { useConfigStore } from "@/store/useConfig";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

export default {
  components: {
    HealthProffessionalsList,
    PharmacyList,
    HealthCenterList,
    EntityList,
  },
  setup() {
    const { activeTabsName } = storeToRefs(useActorStore());
    const { fetchActorsView } = useActorStore();
    const { setHeader } = useConfigStore();
    setHeader("ContactListHeader");

    const fetchContacts = async (actorType) => {
      if (actorType === "pds") {
        await fetchActorsView(
          {
            skip: 0,
            take: Number(localStorage.getItem("take")) || 20,
          },
          "",
          {
            "where[actorObject][actorPerson][listIdActorPersonTypeObject][tag]":
              "PDS",
          }
        );
      } else {
        await fetchActorsView(
          {
            skip: 0,
            take: Number(localStorage.getItem("take")) || 20,
          },
          "",
          {
            "where[actorObject][actorCompany][listIdActorCompanyTypeObject][tag]": `${
              actorType.charAt(0).toUpperCase() + actorType.slice(1)
            }`,
          }
        );
      }
    };
    const handleTabsClick = async (name) => {
      await fetchContacts(name);
    };
    onMounted(async () => {
      await fetchContacts(activeTabsName.value);
    });
    return { handleTabsClick, activeTabsName };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  overflow: initial;
  position: static;
}
:deep(.el-tabs__header) {
  margin: 0 0 20px;
}
.contact .dataTable_container {
  height: calc(100vh - 270px);
}
</style>
