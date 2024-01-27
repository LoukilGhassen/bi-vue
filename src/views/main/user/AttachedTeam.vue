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
    <p class="fw-boldest mt-20 fs-2">Aucune équipe rattachée</p>
    <p v-if="$route.name === 'user-profil'" class="poppins px-10 text-center">
      Pour être rattaché à une équipe, veuillez contacter votre administrateur.
    </p>
    <div v-else>
      <div v-can:edit="'AttachTeams'">
        <p class="poppins px-10 text-center">
          Pour rattacher cet utilisateur à une équipe, veuillez sélectionner des
          visteurs médicaux
        </p>
        <p
          class="poppins text-center color-btn cursor-pointer"
          @click="handleAddRow"
        >
          <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
          Rattacher un visiteur médical
        </p>
      </div>
    </div>
  </div>
  <dataTable
    v-else
    :data="teamList"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    @popoverItemAction="popoverItemAction"
    @onValidateFiltre="validateFiltre"
    :contextMenuList="contextMenuList"
    :additionalTableOptions="additionalTableOptions"
    @inputChange="handleSearch"
    webElementAddress="userAttachedTeam"
    @setItemsPerPage="setItemsPerPage"
    @currentPageChange="currentPageChange"
    entity="membres"
    @addRow="handleAddRow"
    :withFooter="false"
  />
</template>

<script>
import dataTable from "@/components/shared/ag-grid-table/dataTable.vue";
import CustomRowOptionsVue from "@/components/shared/ag-grid-table/CustomRowOptions.vue";
import { useUserTeamStore } from "@/store/useUserTeamModule";
import UserTeamSelectCell from "@/components/shared/ag-grid-table/UserTeamSelectCell.vue";
import { ref, onMounted } from "vue";
import AvatarCellRender from "@/components/shared/ag-grid-table/AvatarCellRender.vue";
import { useRoute } from "vue-router";
import service from "@/service";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuth";
import { transformObject, replaceKeys } from "@/core/helpers/dataTableHelper";
import DynamicCellRenderButton from "@/components/shared/ag-grid-table/DynamicCellRenderButton.vue";
import { can } from "@/core/helpers/permission";
export default {
  components: {
    dataTable,
    AvatarCellRender,
    CustomRowOptionsVue,
    UserTeamSelectCell,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const serchCriteria = ref();
    const filtersCriteria = ref();
    const showEmpty = ref(false);
    const { currentUser } = storeToRefs(useAuthStore());
    const { userteamList, showListAddRow } = storeToRefs(useUserTeamStore());
    const {
      fetchUserTeams,
      setShowListAddRow,
      addUserTeam,
      deleteEmptyUserTeam,
      deleteUserTeam,
    } = useUserTeamStore();

    function modifyKeys(obj) {
      const newObj = { ...obj };
      Object.keys(newObj).forEach((key) => {
        if (key.includes("[bannedUntil][equals]")) {
          if (newObj[key] == true || newObj[key] == "true") {
            newObj[key] = null;
          } else {
            const oldKey = key;
            newObj[oldKey] = undefined;
            key = key.replace("[bannedUntil][equals]", "[bannedUntil][not]");
            newObj[key] = null;
          }
        }
      });

      return newObj;
    }
    const id = computed(() => {
      return route.name === "user-profil"
        ? currentUser.value.id
        : route.params.id;
    });

    const columnDefs = ref([
      {
        colId: "avatar",
        hide: false,
        field: "avatar",
        headerComponentParams: {
          template: "empty",
        },
        cellRenderer: AvatarCellRender,
        cellRendererParams: {
          cellData: {
            type: "sendMail",
          },
        },
        width: 80,
        pinned: "left",
      },
      {
        colId: "email",
        hide: false,
        field: "email",
        headerName: "E-mail",
        search: {
          criteria: "[user1][username]",
          insensitive: true,
        },
        cellRenderer: UserTeamSelectCell,
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user1][username]",
        },
        lockPinned: true,
        flex: 1,
        minWidth: 200,
      },
      {
        colId: "lastName",
        hide: false,
        field: "lastName",
        headerName: "Nom",
        search: {
          criteria: "[user1][lastName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user1][lastName]",
        },
        lockPinned: true,
        flex: 1,
        minWidth: 200,
      },
      {
        colId: "firstName",
        hide: false,
        field: "firstName",
        headerName: "Prénom",
        search: {
          criteria: "[user1][firstName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user1][firstName]",
        },
        lockPinned: true,
        flex: 1,
        minWidth: 200,
      },
      {
        colId: "role",
        hide: false,
        field: "role",
        headerName: "Rôle",
        search: {
          criteria: "[user1][userTypes][some][role][roleName]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user1][userTypes][some][role][roleName]",
        },
        lockPinned: true,
      },
      {
        colId: "telephone",
        hide: false,
        field: "telephone",
        headerName: "Téléphone portable",
        search: {
          criteria: "[user1][telephone]",
          insensitive: true,
        },
        filter: {
          conditions: [
            { label: "égal", value: "[equals]" },
            { label: "contient", value: "[contains]" },
            { label: "différent", value: "[not][contains]" },
          ],
          field: "[user1][telephone]",
        },
        lockPinned: true,
        flex: 1,
        minWidth: 200,
      },
      {
        colId: "status",
        hide: false,
        field: "active",
        headerName: "Statut",
        filter: {
          type: "boolean",
          field: "[user1][bannedUntil]",
        },
        lockPinned: true,
      },
      {
        colId: "menu",
        hide: false,
        headerComponentParams: {
          template: "empty",
        },
        maxWidth: 50,
        pinned: "right",
        cellRenderer:
          route.name === "user-profil"
            ? DynamicCellRenderButton
            : can("edit", "AttachTeams")
            ? CustomRowOptionsVue
            : null,
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
    const contextMenuList = ref(
      can("edit", "AttachTeams")
        ? {
            entity: "userTeam",
            list: route.name === "user-profil" ? [] : ["delete"],
          }
        : {}
    );

    const additionalTableOptions = computed(() => {
      if (route.name === "user-profil" || !can("edit", "AttachTeams"))
        return [];
      return showListAddRow.value ? ["addRow"] : ["addRow", "addRowDisabled"];
    });

    //pagination
    const setItemsPerPage = async (event) => {
      //   const {
      //         data,
      //       } = await service.api.userUgaControllerFindManyView({
      //         skip:  0,
      //         take: parseInt(event.target.value),
      //         "where[actorObject][id]":route.params.id,
      //         "where[userObject][roles][equals]": props.relationType
      //      });
      //       userActorRelationshipList.value = data.paginatedResult;
      //       userActorRelationshipPagination.value = {
      //         total: data.totalCount,
      //         skip:  0,
      //         take:  parseInt(event.target.value),
      //       };
      //       localStorage.setItem(
      //         "take",
      //         parseInt(event.target.value).toString()
      //       );
    };

    const currentPageChange = async (val) => {
      //   const {
      //         data,
      //       } = await service.api.userUgaControllerFindManyView({
      //         skip: (val - 1) * userActorRelationshipPagination.value.take,
      //         take: userActorRelationshipPagination.value.take,
      //         "where[actorObject][id]":route.params.id,
      //         "where[userObject][roles][equals]": props.relationType
      //      });
      //       userActorRelationshipList.value = data.paginatedResult;
      //       userActorRelationshipPagination.value = {
      //         total: data.totalCount,
      //         skip:  (val - 1) * userActorRelationshipPagination.value.take,
      //         take:  userActorRelationshipPagination.value.take,
      //       };
      //       localStorage.setItem(
      //         "take",
      //         userActorRelationshipPagination.value.take.toString()
      //       );
    };

    const handleAddRow = () => {
      addUserTeam({
        id: "",
        user1: { id: "", firstName: " ", lastName: " " },
        user2: { id: "", firstName: " ", lastName: " " },
      });
      setShowListAddRow(false);
      showEmpty.value = false;
    };

    const popoverItemAction = async (item) => {
      if (!item.selectedRow.id) {
        deleteEmptyUserTeam();
        setShowListAddRow(true);
      } else await deleteUserTeam(item.selectedRow?.relationId);
    };
    const validateFiltre = async (val) => {
      const modifiedVal = modifyKeys(val);
      filtersCriteria.value = {
        "where[OR][0][user2][id]": id.value,
        ...transformObject(modifiedVal, 0),
        "where[OR][1][user1][id]": id.value,
        ...transformObject(replaceKeys(modifiedVal, "user1", "user2"), 1),
      };
      await fetchUserTeams(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
          ...filtersCriteria.value,
        }
      );
    };
    const handleSearch = async (val) => {
      serchCriteria.value = {
        "where[OR][0][user2][id]": id.value,
        ...transformObject(val, 0),
        "where[OR][1][user1][id]": id.value,
        ...transformObject(replaceKeys(val, "user1", "user2"), 1),
      };
      await fetchUserTeams(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          ...serchCriteria.value,
        }
      );
    };

    const teamList = computed(() => {
      return userteamList.value.map((user) => {
        return user.user2.id !== route.params.id
          ? {
              relationId: user.id,
              id: user?.user2?.id,
              email: user?.user2?.username,
              lastName: user?.user2?.lastName,
              firstName: user?.user2?.firstName,
              telephone: user?.user2?.telephone,
              active: user?.user2?.bannedUntil ? "Inactif" : "Actif",
              role: user?.user2?.userTypes
                ?.map((type) => type?.role?.roleName)
                .join(","),
            }
          : {
              relationId: user.id,
              id: user?.user1?.id,
              email: user?.user1?.username,
              lastName: user?.user1?.lastName,
              firstName: user?.user1?.firstName,
              telephone: user?.user1?.telephone,
              active: user?.user1?.bannedUntil ? "Inactif" : "Actif",
              role: user?.user1?.userTypes
                ?.map((type) => type?.role?.roleName)
                .join(","),
            };
      });
    });

    onMounted(async () => {
      setShowListAddRow(true);
      await fetchUserTeams(
        {
          skip: 0,
          take: Number(localStorage.getItem("take")) || 20,
        },
        {
          "where[OR][0][user1][id]": id.value,
          "where[OR][1][user2][id]": id.value,
        }
      );
      if (teamList.value.length === 0) {
        showEmpty.value = true;
      }
    });

    return {
      columnDefs,
      defaultColDef,
      setItemsPerPage,
      currentPageChange,
      validateFiltre,
      handleSearch,
      popoverItemAction,
      teamList,
      handleAddRow,
      contextMenuList,
      additionalTableOptions,
      showEmpty,
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
</style>
