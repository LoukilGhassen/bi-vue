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
  let delegate: any = null;
  let oldValue = {};
  let newValue = {};
  let changeLog: string[] = [];
  if (props.type === "update") {
    const oldDelegateUgaDeparment = props.payload?.oldValue.ugaList.concat(props.payload?.oldValue.departments)
    const newDelegateUgaDeparment = props.payload?.newValue.ugaList.concat(props.payload?.newValue.departments)

    oldValue = lodash.cloneDeep({...props.payload?.oldValue,delegateUgaDeparment:oldDelegateUgaDeparment});
    newValue = lodash.cloneDeep({...props.payload?.newValue,delegateUgaDeparment:newDelegateUgaDeparment});
    changeLog = getModifiedColumns(oldValue, newValue);
    delegate = props.isOld ? oldValue : newValue;
  } else {
    const delegateUgaDeparment = props.payload?.ugaList.concat(props.payload?.departments)

    delegate = {...props.payload,delegateUgaDeparment};
  }

  const showProperty = (changeLogObject: any): boolean => {
    if (props.type === "update") {
      if(changeLogObject.type === 'array'){
        return changeLog.some((e)=>e.startsWith(changeLogObject.showProp))
      }
      return changeLog.includes(changeLogObject.showProp);
    } else {
      return (
        lodash.get(delegate, changeLogObject.showProp) !== null &&
        lodash.get(delegate, changeLogObject.showProp) !== undefined &&
        lodash.get(delegate, changeLogObject.showProp) !== "" &&
        (!lodash.isArray(lodash.get(delegate, changeLogObject.showProp)) ||
          (lodash.isArray(lodash.get(delegate, changeLogObject.showProp)) &&
            lodash.get(delegate, changeLogObject.showProp).length > 0))
      );
    }
  };
  const formFields = [
  {
    label: "Nom",
    showProp: "firstName",
    value: delegate.firstName
  },
  {
    label: "Prénom",
    showProp: "lastName",
    value: delegate.lastName
  },
  {
    label: "Téléphone portable",
    showProp: "telephone",
    value: delegate.telephone
  },
  {
    label: "E-mail",
    showProp: "email",
    value: delegate.email
  },
  {
    label: "Département(s) et UGA",
    showProp: "delegateUgaDeparment",
    value: delegate.delegateUgaDeparment?.map((e)=>e.listIdUgaObject?.code || e.listIdDepartmentObject?.code).join(' , '),
    type:'array'
  },
  {
    label: "Status",
    showProp: "ids.actif",
    value: delegate?.ids?.actif === true ? 'Actif' : 'Inactif'
  }
];
console.log(changeLog)
  </script>
  

