<template>
  <span class="cursor-pointer svg-icon svg-icon-1" >
    <inline-svg src="/svg/icons/dropdown.svg" />
  </span>
</template>

<script>
import { ref, onBeforeMount } from "vue";

export default {
  props: ["params"],

  setup(props) {
    const displayPopOver = () => {
      //console.log(props.params, "params");
    };

    return {
      displayPopOver,
    };
  },
};
</script>