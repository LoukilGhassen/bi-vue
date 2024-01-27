<template>
  <div
    ref="el"
    class="chacheli"
    :style="style"
    @mousedown.left.prevent.stop="mousedown('drag', $event)"
  >
    <div class="chacheli-content" ref="content">
      <component :is="chacheli.comp" />
    </div>
    <div
      class="close"
      @click.prevent.stop="close"
      @mousedown.prevent.stop
    ></div>
    <div
      class="resize-handle"
      @mousedown.left.prevent.stop="mousedown('resize', $event)"
    ></div>
  </div>
</template>
  
  <style lang="scss">
.chacheli-designer-layout {
  .chacheli {
    position: absolute;
    z-index: 2;
    padding:5px;

    .chacheli-content,
    .close {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-chacheli-content: center;
    }

    .chacheli-content {
      height: 100%;
      border: 1px solid #ccc;
      background: #f4f4f4;
      overflow:scroll;
    }

    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 23px;
      height: 23px;
      background: #fff;
      border: 1px solid #ccc;
      border-bottom-left-radius: 5px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        height: 2px;
        top: 50%;
        left: 2px;
        right: 2px;
        margin-top: -1px;
        background: #ccc;
        
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);

        &::before,
        &::after {
          background: #999;
        }
      }
    }

    .resize-handle {
      position: absolute;
      right: 5px;
      bottom: 5px;
      width: 13px;
      height: 13px;
      cursor: nwse-resize;
      border: 1px solid #ccc;
      background: #fff;

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
      }
    }
  }

  &.interact .chacheli {
    transition-property: top, left, width, height;
    transition-duration: 0.4s;
  }
}
</style>
  
  <script >
import DummyBlue from "../components/DummyBlue.vue";
import {defineComponent , ref, computed} from 'vue'
export default defineComponent({
  components: {
    DummyBlue
  },

  props: {
    layout: {
      required: true,
    },
    chacheli: {
      required: true,
    },
    units: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const content = ref(null);
    const el = ref(null);

    const style = computed(() => {
      return {
        top: props.chacheli.y * 50 + "px",
        left: props.chacheli.x * props.units.h + "%",
        width: props.chacheli.w * props.units.h + "%",
        height: props.chacheli.h * 50 + "px",
      };
    });
    const mousedown = (name, e) => {
      let outer = document.defaultView.getComputedStyle(el.value);
      let inner = document.defaultView.getComputedStyle(content.value);
      emit(name, {
        chacheli: props.chacheli,
        event: e,
        initialPos: {
          left:
            parseFloat(outer.getPropertyValue("left")) +
            parseFloat(outer.getPropertyValue("padding-left")) +
            parseFloat(outer.getPropertyValue("border-left-width")),
          top:
            parseFloat(outer.getPropertyValue("top")) +
            parseFloat(outer.getPropertyValue("padding-top")) +
            parseFloat(outer.getPropertyValue("border-top-width")),
          width: parseFloat(inner.getPropertyValue("width")),
          height: parseFloat(inner.getPropertyValue("height")),
        },
      });
    };

    const close = () => {
      props.chacheli.available = true;
    };
    return {
      close,
      mousedown,
      style,
      el,
      content,
    };
  },
});
</script>
  