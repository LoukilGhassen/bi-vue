<template>
    <div class="w-100">
        <div class="ms-1" v-for="prop in formFields" :key="prop.showProp">
            <div v-if="showProperty(prop)">
            <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
            <span class="poppins noir ms-2"> {{ prop.value ?? '-' }} </span>
            </div>
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
  const showProperty = (changeLogObject: any): boolean => {
    if (props.type === "update") {
      if(changeLogObject.type === 'array'){
        return changeLog.some((e)=>e.startsWith(changeLogObject.showProp))
      }
      return changeLog.includes(changeLogObject.showProp);
    } else {
      return (
        lodash.get(contact, changeLogObject.showProp) !== null &&
        lodash.get(contact, changeLogObject.showProp) !== undefined &&
        lodash.get(contact, changeLogObject.showProp) !== "" &&
        (!lodash.isArray(lodash.get(contact, changeLogObject.showProp)) ||
          (lodash.isArray(lodash.get(contact, changeLogObject.showProp)) &&
            lodash.get(contact, changeLogObject.showProp).length > 0))
      );
    }
  };

  const formFields = [
  {
    label: "Nom de l’échantillon",
    showProp: "name",
    value: contact.name
  },
  {
    label: "Code externe",
    showProp: "ids.externalId",
    value: contact.ids?.externalId,
  },
  {
    label: "Code échantillon",
    showProp: "code",
    value: contact.code
  },
  {
    label: "Catégorie",
    showProp: "listIdSampleCategoryObject.id",
    value: contact.listIdSampleCategoryObject?.captionFr
  },
  {
    label: "Marché(s)",
    showProp: "markets",
    value: contact.markets?.map((e)=>e.listIdMarket?.captionFr).join(' , '),
    type:'array'
  },
  {
    label: "Quantité remise en main propre",
    showProp: "stockQty",
    value: contact.stockQty,
  },
  {
    label: "Qte. allouée à expédier",
    showProp: "stockToShip",
    value: contact.stockToShip,
  },
  {
    label: "Status",
    showProp: "ids.actif",
    value: contact?.ids?.actif === true ? 'Actif' : 'Inactif'
  }

];




  </script>
  
