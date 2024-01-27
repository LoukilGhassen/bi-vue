<template>
  <div class="chacheli-layout">
    <div
      v-for="c in availableChachelis"
      :key="c.comp"
      class="chacheli"
      :style="{
        top: c.y * 50 + 'px',
        left: c.x * h + '%',
        width: c.w * h + '%',
        height: (c.reduced ? 2 : c.h ) * 50 + 'px',
      }"
    >
      <component :is="c.comp" :payload="c"/>
    </div>
  </div>
</template>
  
  <style lang="scss">
.chacheli-layout {
  height: 100%;
  flex: 1 1 auto;
  position: relative;
  margin: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  &,
  * {
    box-sizing: border-box;
  }

  .chacheli {
    padding: 5px;
    position: absolute;

    > * {
      height: 100%;
      display: inline-block;
    }
  }
}
</style>
  
  <script>
import DummyBlue from "./components/DummyBlue.vue";
import DummyGreen from "./components/DummyGreen.vue";
import DummyRed from "./components/DummyRed.vue";
import { computed,defineComponent , ref , watch , onMounted} from "vue";
export default defineComponent({
  components: { DummyBlue, DummyGreen, DummyRed },
  props: {
    layout: {
      required: true,
    },
    chachelis: {
      required: true,
    },
  },
  setup(props) {
    const availableChachelis = computed(() => {
      return props.chachelis.filter((c) => !c.available);
    });

    const v = ref(0);
    const h = ref(0);
    const calc = () => {
      v.value = 50;
      h.value = 100 / props.layout.cols;
    };
    watch(
      () => props.layout.cols,
      () => calc()
    );
    watch(
      () => props.layout.rows,
      () => calc()
    );

    onMounted(() => {
      calc();
    });
    return {
      availableChachelis,
      h,
      v,
    };
  },
});
</script>
  