<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1 d-flex align-items-center gap-5">
      <span class="cursor-pointer" @click="handleBackClick">
        <inline-svg src="/svg/icons/arr063.svg" />
      </span>
      {{ user?.firstName }}
      {{ user?.lastName }}
    </div>
    <div class="d-flex gap-5">
    
      <el-switch
        v-can:edit="'CreateModifyUser'"
        v-model="active"
        active-text="Actif"
        class="mx-2"
        @change="handleBannUser"
      />
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Envoyer un message à l'utilisateur"
        placement="bottom-end"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleSendEmail"
        >
          <inline-svg src="/svg/icons/send.svg" />
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="box-item"
        effect="dark"
        content="Supprimer l'utilisateur"
        placement="bottom-end"
        v-can:edit="'CreateModifyUser'"
      >
        <el-button
          size="large"
          class="fw-boldest poppins"
          @click="handleDeleteModal"
          v-can:edit="'CreateModifyUser'"

        >
          <inline-svg src="/svg/icons/trash.svg" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";

import { useUserStore } from "@/store/useUserModule";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const handleSendEmail = () => {
  setModal("SendEmailModal", {
    type: "actor",
    toEmail: user.value.username,
  });
};
const props = defineProps({
  payload: {
    type: Object,
    required: false,
  },
});
const { user, error } = storeToRefs(useUserStore());
const id = route.params?.id;
const { bannUser } = useUserStore();
const active = ref(!user.value.bannedUntil);

const handleBannUser = async () => {
      let isBanned =
        user.value.bannedUntil === null
          ? "none"
          : user.value.bannedUntil;
      await bannUser({ id: id, isBanned });
    };
const handleDeleteContact = async (id: string, motif: string) => {
//   await deleteActor({
//     id,
//     deletedReason: motif,
//   });
  router.push({
    name: "admin-list-user",
  });
};

const handleDeleteModal = () => {
  setModal("DeleteUserModal", {
          user: {
            ...user.value,
            id: route.params.id
          },
          title: "Supprimer utilisateur",
        });
};
const handleBackClick = () => {
  router.push({
    name: "admin-list-user",
  });
};

watch(user, () => {
  active.value = !user.value?.bannedUntil;
});
</script>
<style lang="scss" scoped>
.el-button {
  margin-left: 0;
}
:deep(.el-button--large) {
  padding: 12px 15px;
}
:deep(.el-switch__label.is-active) {
  color: $noir;
}
</style>
