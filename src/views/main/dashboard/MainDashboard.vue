<template>
  <div class="dynamic_container"  style="height: 100%;">
    <Designer
      :edit-mode="config.editMode"
      :layout="config.layout"
      :chachelis="config.chachelis"
    />
    <Layout
      v-show="!config.editMode"
      :layout="config.layout"
      :chachelis="config.chachelis"
    />
    <chacheli-designer-control
      :layout="config.layout"
      :edit-mode="config.editMode"
      @cols="editCols"
      @rows="editRows"
      @editMode="config.editMode = $event"
    />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import Layout from "./Layout.vue";
import Designer from "./Designer.vue";
import ChacheliDesignerControl from "./ChacheliDesignerControl.vue";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "../../../store/useDashboardModule";

export default defineComponent({
  name: "home",
  components: { Layout, Designer, ChacheliDesignerControl },
  setup() {
    onMounted(async () => {
    });
    const { config } = storeToRefs(useDashboardStore());
    const { setCols, setRows } = useDashboardStore();

    const designer = ref(null);
    const editCols = (v: number) => {
      setCols(v);
    };
    const editRows = (v: number) => {
      setRows(v);
    };
    return {
      config,
      designer,
      editCols,
      editRows,
    };
  },
});
</script>
  <style lang="scss">
html,
body,
.dynamic_container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}

button {
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  line-height: 20px;

  &:hover {
    background: #f2f2f2;
    border: 1px solid #ccc;
  }
}

.button-group {
  button {
    border-radius: 0;

    &[disabled] {
      background: #118fe4;
      border-color: #118fe4;
      color: #fff;
    }

    &:not(:first-of-type) {
      margin-left: -1px;
    }

    &:first-of-type {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-of-type {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
}
</style>