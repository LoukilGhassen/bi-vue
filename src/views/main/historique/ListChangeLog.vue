<template>
    <div class="w-100">
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Code : </span>
            <span class="poppins noir ms-2"> {{ contact?.code }} </span>
        </div>
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">description : </span>
            <span class="poppins noir ms-2"> {{ contact?.captionFr }} </span>
        </div>
        <div class="ms-1">
            <span class="poppins noir fw-boldest w-100">Status : </span>
            <span class="poppins noir ms-2"> {{ contact?.ids?.actif ? 'Actif' : 'Inactif'}} </span>
        </div>
        <div class="ms-1" v-if="contact?.listTypeName === 'ProductCategory'">
          <span class="poppins noir fw-boldest w-100" >Marché(s) : </span>
          <span v-if="contact?.markets?.length === 0 ">-</span>
          <span v-else class="poppins noir ms-2"> {{ contact?.markets?.map((e)=>e.market?.captionFr).join(' , ')}} </span>
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
  
