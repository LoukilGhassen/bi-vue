<template>
    <div class="w-100">
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Nom de l’échantillon : </span>
            <span class="poppins noir ms-2"> {{ contact?.sample?.name }} </span>
        </div>
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Utilisateur : </span>
            <span class="poppins noir ms-2"> {{ contact?.user?.lastName + " " + contact?.user?.firstName }} </span>
        </div>
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Type : </span>
            <span class="poppins noir ms-2"> {{ contact?.listIdStockTypeObject?.captionFr }} </span>
        </div>
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Quantité allouée : </span>
            <span class="poppins noir ms-2"> {{ contact?.allocatedQty }} </span>
        </div>
    </div>
  </template>
  <script lang="ts" setup>
  import lodash from "lodash";
  import { useLogStore } from "@/store/useLogModule";
  import { computed } from "vue";
  const { getModifiedColumns } = useLogStore();
  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    isOld: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
  let contact: any = null;
  let oldValue = {};
  let newValue = {};
  let changeLog: string[] = [];
  if (props.type === "update") {
    oldValue = lodash.cloneDeep(props.payload?.oldValue);
    newValue = lodash.cloneDeep(props.payload?.newValue);
    changeLog = getModifiedColumns(oldValue, newValue);
    contact = props.isOld ? oldValue : newValue;
  } else {
    contact = props.payload;
  }

  




  </script>
  
