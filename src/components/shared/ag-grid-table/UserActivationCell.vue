<template>
  <el-switch v-model="active" @change="handleBannUser" @click.stop="" />
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "@/store/useUserModule";

export default {
  props: ["params"],
  setup(props) {
    const { bannUser } = useUserStore();
    const active = ref(!props.params.data.bannedUntil);
    const handleBannUser = async () => {
      let isBanned =
        props.params.data.bannedUntil === null
          ? "none"
          : props.params.data.bannedUntil;
      await bannUser({ id: props.params.data.id, isBanned });
    };
    return {
      active,
      handleBannUser,
    };
  },
};
</script>
<style lang="scss" scoped></style>
