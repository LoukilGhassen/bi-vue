<template>
  <div
    class="customPopper"
    v-if="visible"
    :style="{ top: position.top + 5 + 'px', left: position.left + 5 + 'px' }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: ["visible", "position"],
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.customPopper {
  position: absolute;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 1px 9px 13px -9px rgba(107, 103, 103, 0.95);
  -webkit-box-shadow: 1px 9px 13px -9px rgba(107, 103, 103, 0.95);
  -moz-box-shadow: 1px 9px 13px -9px rgba(107, 103, 103, 0.95);
  border-radius: 10px;
}
</style>
