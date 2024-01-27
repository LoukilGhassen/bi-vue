<template>
  <el-dropdown
    :placement="placement"
    trigger="click"
    @command="handleCommand"
  >
    <slot name="trigger"></slot>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in items"
          :key="item"
          :divided="index !== 0"
          :command="item"
        >
          {{ t(`dropDown.${item}`) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { defineComponent, defineProps } from "vue";
import { t } from "@/core/i18n/translate";
export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },
    placement: {
      required:false,
      type: String,
      default: "bottom-start",
    }
  },
  setup(props, { emit }) {
    const handleCommand = (command: string) => {
      emit("handleCommandAction", command);
    };
    return {
      handleCommand,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>