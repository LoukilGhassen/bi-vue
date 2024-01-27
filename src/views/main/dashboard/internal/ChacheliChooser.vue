<template>
    <div class="chacheli-chooser">
      <div class="inner">
        <div class="chacheli-outer" v-for="(c, idx) in chachelis" :key="c.id">
          <div
            v-if="c.available"
            class="chacheli"
            :class="{ dragging: dragging.active && idx === dragging.index }"
            @mousedown.left.prevent.stop="mousedown(idx, $event)"
          >
            {{ c.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss">
  .chacheli-chooser {
    padding: 0 10px;
    border-left: 1px solid #bbb;
    flex: 0 0 200px;
    position: relative;
  
    .inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px 10px 0;
      overflow: auto;
    }
  
    .chacheli-outer {
      margin: 0 0 10px;
    }
  
    .chacheli {
      padding: 15px 10px;
      border: 1px solid #ccc;
      background: #f4f4f4;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
  
      &.dragging {
        pointer-events: none;
        position: fixed;
        z-index: 1000;
        opacity: 0.8;
      }
    }
  }
  </style>
  
  <script setup>
  const props = defineProps({
    chachelis: {
      type: Array,
    },
    dragging: {
      type: Object,
    },
  });
  const emit = defineEmits(["mouseDown"]);
  const dX = ref("");
  const dY = ref("");
  const dragElement = ref();
  const mousedown = (idx, e) => {
    let cs = document.defaultView.getComputedStyle(e.target);
    let bounds = e.target.getBoundingClientRect();
  
    dX.value = bounds.left - e.clientX;
    dY.value = bounds.top - e.clientY;
    dragElement.value = e.target;
    dragElement.value.style.width = parseFloat(cs.width) + "px";
    dragElement.value.style.height =
      dragElement.value.parentElement.style.height = parseFloat(cs.height) + "px";
  
    dragMove(e);
  
    document.documentElement.addEventListener("mousemove", dragMove, false);
    document.documentElement.addEventListener("mouseup", dragStop, false);
    document.documentElement.addEventListener("keydown", keyDown, false);
    emit("mouseDown", {
      active: true,
      cancelled: false,
      index: idx,
    });
  };
  
  const keyDown = (e) => {
    if (e.keyCode === 27) {
      dragging.cancelled = true;
      dragStop();
    }
  };
  
  const dragMove = (e) => {
    dragElement.value.style.left = e.clientX + dX.value + "px";
    dragElement.value.style.top = e.clientY + dY.value + "px";
  };
  
  const dragStop = () => {
    document.documentElement.removeEventListener("mousemove", dragMove, false);
    document.documentElement.removeEventListener("mouseup", dragStop, false);
    document.documentElement.removeEventListener("keydown", keyDown, false);
    dragElement.value.parentElement.removeAttribute("style");
    dragElement.value.removeAttribute("style");
    dragElement.value = null;
    props.dragging.active = false;
  };
  </script>
  