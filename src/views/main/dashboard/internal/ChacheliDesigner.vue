<template>
  <div class="chacheli-designer-layout" :class="interactClass" ref="el">
    <template v-for="r in parseInt(layout.rows)">
      <template v-for="c in parseInt(layout.cols)" :key="r + '-' + c">
        <div
          class="grid"
          :class="{ right: c == layout.cols, bottom: r == layout.rows }"
          :style="{
            top: (r - 1) * units.v + 'px',
            left: (c - 1) * units.h + '%',
            width: units.h + '%',
            height: units.v + 'px',
          }"
        ></div>
      </template>
    </template>
    <div v-for="(chacheli, index) in chachelis" :key="chacheli.id">
      <chacheli
        v-if="!chacheli.available"
        :layout="layout"
        :units="units"
        :chacheli="chacheli"
        @resize="resizeStart(index, $event)"
        @drag="positionStart(index, $event)"
      >
      </chacheli>
    </div>

    <div
      v-show="!placeholder.hidden"
      class="placeholder"
      :class="{ invalid: placeholder.invalid }"
      :style="placeholderStyle"
    ></div>
  </div>
</template>
  
  <style lang="scss">
.chacheli-designer-layout {
  flex: 1 1 auto;
  position: relative;
  margin: 0;
  overflow-x: hidden;

  overflow-y: scroll;

  &,
  * {
    box-sizing: border-box;
  }

  .grid {
    position: absolute;
    z-index: 1;
    border-style: solid;
    border-color: #eee;
    border-width: 0 1px 1px 0;
    color: #ddd;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.right {
      border-right-width: 0;
    }
    &.bottom {
      border-bottom-width: 0;
    }
  }

  .placeholder {
    position: absolute;
    z-index: 3;
    border: 1px solid #ddd;
    background-color: rgba(160, 160, 160, 0.1);
    transition: background-color 0.6s;

    &.invalid {
      border-color: #ffa7a7 !important;
      background-color: rgba(255, 0, 0, 0.1) !important;
    }
  }

  &.interact {
    &.resize {
      cursor: nwse-resize;
    }

    &.drag {
      cursor: move;
    }

    &.dnd {
      .placeholder {
        border-color: transparent;
        background-color: rgba(0, 255, 0, 0.1);
        transition-property: top, left, width, height, background-color;
        transition-duration: 0.4s, 0.4s, 0.4s, 0.4s, 0.6s;
      }
    }
  }
}
</style>
  
  <script setup>
import Chacheli from "./Chacheli.vue";
import { defineProps, ref , computed,watch , onMounted} from "vue";
const props = defineProps({
  layout: {
    required: true,
  },
  chachelis: {
    required: true,
  },
  dragging: {
    required: true,
  },
});
const emit = defineEmits(["updateChacheli"]);
const placeholder = ref({
  interaction: "resize",
  hidden: true,
  invalid: false,
  unit: {
    x: "px",
    y: "px",
  },
  t: 0,
  l: 0,
  w: 1,
  h: 1,
});
const units = ref({
  v: 0,
  h: 0,
});
const placeholderStyle = computed(() => {
  return {
    top: placeholder.value.t + placeholder.value.unit.y,
    left: placeholder.value.l + placeholder.value.unit.x,
    width: placeholder.value.w + placeholder.value.unit.x,
    height: placeholder.value.h + placeholder.value.unit.y,
  };
});
const interactClass = computed(() => {
  if (placeholder.value.hidden) return "";
  return "interact " + placeholder.value.interaction;
});

watch(
  () => props.layout.cols,
  () => {
    calc();
  }
);

watch(
  () => props.layout.rows,
  () => {
    calc();
  }
);

watch(
  () => props.dragging.active,
  (v) => {
    if (v) {
      dragStart(props.dragging.index);
    } else {
      dragEnd(props.dragging.index);
    }
  }
);
const el = ref(null);
onMounted(() => {
  calc();
});
const interact = ref({
  chacheli: null,
  handler: null,
  x0: 0,
  y0: 0,
  l0: 0,
  t0: 0,
  w0: 0,
  h0: 0,
  xu: 0,
  yu: 0,
  grid: null,
  dragging: 0,
});

const calc = () => {
  units.value.v = 50;
  units.value.h = 100 / props.layout.cols;
};
const resizeStart = (index, e) => {
  interactStart(e, "resize", resizeMove);
};

const resizeMove = (e) => {
  placeholder.value.w = interact.value.w0 + e.clientX - interact.value.x0;
  placeholder.value.h = interact.value.h0 + e.clientY - interact.value.y0;
  maybeUpdateChacheli(
    interact.value.chacheli.x,
    interact.value.chacheli.y,
    Math.max(1, Math.round(placeholder.value.w / interact.value.xu)),
    Math.max(1, Math.round(placeholder.value.h / interact.value.yu))
  );
};
const positionStart = (index, e) => {
  interactStart(e, "drag", positionMove);
};
const positionMove = (e) => {
  placeholder.value.l = interact.value.l0 + e.clientX - interact.value.x0;
  placeholder.value.t = interact.value.t0 + e.clientY - interact.value.y0;

  maybeUpdateChacheli(
    Math.round(placeholder.value.l / interact.value.xu),
    Math.round(placeholder.value.t / interact.value.yu),
    interact.value.chacheli.w,
    interact.value.chacheli.h
  );
};
const dragStart = () => {
  interact.value.dragging = false;
  el.value.addEventListener("mouseenter", dragEnter, false);
  el.value.addEventListener("mouseleave", dragLeave, false);
  el.value.addEventListener("mousemove", dragOver, false);
};
const dragEnter = (e) => {
  if (!props.dragging.active) return;
  interact.value.dragging = true;
  interact.value.x0 = interact.value.y0 = -1;
  placeholder.value.unit.x = "%";
  placeholder.value.unit.y = "px";
  placeholder.value.hidden = false;
  placeholder.value.interaction = "dnd";
  placeholder.value.invalid = false;
  placeholder.value.w = units.value.h;
  placeholder.value.h = units.value.v;
  createValidationGrid(null);
  calcInteractUnits();

  dragOver(e, index);
};
const dragOver = (e, index) => {
  let bounds = el.value.getBoundingClientRect();
  let x = Math.floor((e.clientX - bounds.left) / interact.value.xu);
  let y = Math.floor((e.clientY - bounds.top) / interact.value.yu);
  if (x == interact.value.x0 && y == interact.value.y0) return;

  interact.value.x0 = x;
  interact.value.y0 = y;
  placeholder.value.l = x * units.value.h;
  placeholder.value.t = y * units.value.v;

  placeholder.value.invalid = !validateChacheli(x, y, 1, 1);
};

const dragLeave = () => {
  placeholder.value.hidden = true;
  interact.value.dragging = false;
};
const dragEnd = () => {
  el.value.removeEventListener("mouseenter", dragEnter, false);
  el.value.removeEventListener("mouseleave", dragLeave, false);
  el.value.removeEventListener("mousemove", dragOver, false);
  interactCleanup();

  if (
    !interact.value.dragging ||
    props.dragging.cancelled ||
    placeholder.value.invalid
  )
    return;

  let c = props.chachelis[props.dragging.index];
  if (c && c.available) {
    c.available = false;
    c.x = interact.value.x0;
    c.y = interact.value.y0;
    c.w = c.h = 1;
  }
};
const interactStart = (e, type, handler) => {
  placeholder.value.unit.x = "px";
  placeholder.value.unit.y = "px";
  placeholder.value.hidden = false;
  placeholder.value.invalid = false;
  placeholder.value.interaction = type;
  placeholder.value.t = interact.value.t0 = e.initialPos.top;
  placeholder.value.l = interact.value.l0 = e.initialPos.left;
  placeholder.value.w = interact.value.w0 = e.initialPos.width;
  placeholder.value.h = interact.value.h0 = e.initialPos.height;
  interact.value.x0 = e.event.clientX;
  interact.value.y0 = e.event.clientY;
  interact.value.chacheli = e.chacheli;
  interact.value.handler = handler;
  calcInteractUnits();
  createValidationGrid(e.chacheli);

  document.documentElement.addEventListener(
    "mousemove",
    interact.value.handler,
    false
  );
  document.documentElement.addEventListener("mouseup", interactStop, false);
};
const interactStop = () => {
  document.documentElement.removeEventListener(
    "mousemove",
    interact.value.handler,
    false
  );
  document.documentElement.removeEventListener("mouseup", interactStop, false);
  interactCleanup();
};
const calcInteractUnits = () => {
  let cs = document.defaultView.getComputedStyle(el.value);
  interact.value.xu = Math.floor(parseInt(cs.width) / props.layout.cols);
  interact.value.yu = 50;
};

const createValidationGrid = (ref) => {
  let rows = parseInt(props.layout.rows);
  let cols = parseInt(props.layout.cols);
  interact.value.grid = new Array(rows);
  for (let r = 0; r < rows; r++) {
    let a = (interact.value.grid[r] = new Array(cols));
    for (let c = 0; c < cols; c++) a[c] = 1;
  }

  for (let i = 0; i < props.chachelis.length; i++) {
    let c = props.chachelis[i];
    if (c === ref || c.available) continue;
    for (let j = 0; j < c.h; j++) {
      for (let k = 0; k < c.w; k++) interact.value.grid[c.y + j][c.x + k] = 0;
    }
  }
};

const validateChacheli = (x, y, w, h) => {
  if (w === 1 || h === 1) return false;
  for (let j = 0; j < h; j++) {
    for (let k = 0; k < w; k++) {
      let r = interact.value.grid[y + j];
      if (!r || !r[x + k]) return false;
    }
  }
  return true;
};

const maybeUpdateChacheli = (x, y, w, h) => {
  let c = interact.value.chacheli;
  if (c.x == x && c.y == y && c.w == w && c.h == h) {
    placeholder.value.invalid = false;
    return;
  }
  if (validateChacheli(x, y, w, h)) {
    c.x = x;
    c.y = y;
    c.w = w;
    c.h = h;
    placeholder.value.invalid = false;
  } else {
    placeholder.value.invalid = true;
  }
};

const interactCleanup = () => {
  placeholder.value.hidden = true;
  interact.value.chacheli = null;
  interact.value.grid = null;
};

const minColumns = () => {
  let min = 1;
  for (let i = 0; i < props.chachelis.length; i++) {
    let c = props.chachelis[i];
    if (!c.available) min = Math.max(min, c.x + c.w);
  }
  return min;
};
const minRows = () => {
  let min = 1;
  for (let i = 0; i < props.chachelis.length; i++) {
    let c = props.chachelis[i];
    if (!c.available) min = Math.max(min, c.y + c.h);
  }
  return min;
};
</script>
  