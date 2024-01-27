<template>
  <div class="ps-4" v-if="params.template === 'default'">
    {{ params.displayName }}
  </div>

  <div v-if="params.template === 'empty'"></div>
  <div
    v-else
    class="custom-header d-flex"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="d-flex gap-3" style="flex: 1; width: 100%; overflow: hidden">
      <div
        class="ag-header-cell-menu-button d-flex align-items-center"
        v-if="visible && !params.unmovable"
      >
        <img class="rounded-1" src="/svg/icons/drag1.svg" alt="metronic" />
      </div>
      <el-tooltip :content="params.displayName" placement="top" effect="dark">
        <div class="customHeaderLabel ps-4 pe-1 w-100">
          {{ params.displayName }}
        </div>
      </el-tooltip>
    </div>
    <div class="d-flex gap-3 hide_tri_icons">
      <div v-if="visible && !params.unhidable" @click="onColumnHide">
        <img
          class="rounded-1"
          src="/svg/icons/eye-slash.svg"
          alt="metronic"
          hide
        />
      </div>
      <div
        class="ag-header-cell-menu-button d-flex flex-column"
        @click="onSortRequested($event)"
      >
        <el-icon class="h-10px"><CaretTop /></el-icon>

        <el-icon class="h-10px"><CaretBottom /></el-icon>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/service";
import { storeToRefs } from "pinia";
import { useWebElementStore } from "@/store/useWebElementModule";
import { useAuthStore } from "@/store/useAuth";

export default {
  props: ["colDef"],
  data() {
    return {
      visible: false,
      sortDirection: "asc",
      customHeaderLabelWidth: "100%",
      customHeaderLabelMaxWidth: "100%",
    };
  },
  methods: {
    async onColumnHide() {
      this.params.columnApi.setColumnVisible(
        this.params.column.colDef.colId,
        false
      );
      const { webelement } = storeToRefs(useWebElementStore());
      const { setWebElements } = useWebElementStore();
      const { currentUser } = storeToRefs(useAuthStore());
      const conf = {};
      const confColumn = webelement.value[this.params.webElementId].columns.map(
        (item) =>
          item.colId === this.params.column.colDef.colId
            ? { ...item, hide: true }
            : item
      );
      conf[this.params.webElementId] = {
        columns: confColumn,
        rowVue:
          webelement.value &&
          webelement.value[this.params.webElementId] &&
          webelement.value[this.params.webElementId].rowVue
            ? webelement.value[this.params.webElementId].rowVue
            : 42,
      };
      setWebElements(conf);
      await service.api.userWebElementControllerUpsert({
        webElement: {
          id: this.params.webElementId,
        },
        user: {
          id: currentUser.value.id,
        },
        config: { columns: confColumn },
      });
    },
    handleMouseEnter() {
      this.visible = true;
      this.customHeaderLabelWidth = "calc(100% - 20px)";
      this.customHeaderLabelMaxWidth = "65%";
    },
    handleMouseLeave() {
      this.visible = false;
      this.customHeaderLabelWidth = "100%";
      this.customHeaderLabelMaxWidth = "100%";
    },
    onSortRequested(event) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      this.params.setSort(this.sortDirection, event.shiftKey);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.customHeaderLabel {
  padding: 20px 0px;
  width: v-bind(customHeaderLabelWidth) !important;
  max-width: v-bind(customHeaderLabelMaxWidth) !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hide_tri_icons {
  width: 45px;
}
</style>
