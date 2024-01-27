<template>
    <div class="d-flex">
    <avatar
    shape="circle"
    :first-name="params?.data?.firstName || 'John'"
    :last-name="params?.data?.lastName || 'Doe'"
    :size="30"
    :background-color="getRandomHexColor()"
    text-color="#fff"
    src=""
    class="d-inline-flex"
  />
  <span v-if="params?.cellData?.type === 'user'"  class="ms-2">{{params?.data?.firstName}} {{params?.data?.lastName}}</span>
  <span v-if="params?.cellData?.type === 'stockUser'"  class="ms-2">{{params?.data?.user?.firstName}} {{params?.data?.user?.lastName}}</span>  
  <span v-if="params?.cellData?.type === 'logUser'"  class="ms-2">{{params?.data?.ids?.creationByObject?.user?.firstName}} {{params?.data?.ids?.creationByObject?.user?.lastName}}</span>  
  
</div>
</template> 

<script>
import { ref, onBeforeMount } from "vue";
import { DfAvatar as Avatar } from "@tekab-dev-team/storybook-devfactory";

export default {
  components: { Avatar },

  props: ["params"],

  setup(props) {
    const getRandomHexColor=()=> {
 let colors = ['#FFC200','#00B6CB','#9A5AFF','#66666E']
  return colors[Math.floor(Math.random() * 4)];
}
    return {getRandomHexColor};
  },
};
</script>
<style scoped></style>
