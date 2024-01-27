<template>
  <span
    v-if="params.cellData.type === 'sendMail'"
    class="cursor-pointer svg-icon svg-icon-1 "
    @click.stop="handleEmail"
  >
    <inline-svg src="/svg/icons/send.svg"   />
  </span>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { setModal } from "@/core/helpers/config";

export default {
  props: ["params"],

  setup(props) {
    const handleEmail = () => {
      setModal("SendEmailModal", {
        type: "actor",
        toEmail: props?.params?.data?.email,
      });

    };

    return {
      handleEmail,
    };
  },
};
</script>
<style scoped></style>
