<template>
    <div class="w-100">
      <div class="mb-5" v-if="userInfo.some((e)=>showProperty(e))">
        <div class="fst-italic noir w-100 mb-2">Information de l’utilisateur</div>
        <div class="ms-1" v-for="prop in userInfo" :key="prop.showProp">
          <div v-if="showProperty(prop)">
            <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
            <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
          </div>
        </div>
      </div>
  
      <div class="mb-5" v-if="userAffectation.some((e)=>showProperty(e))">
        <div class="fst-italic noir w-100 mb-2">Affectation </div>
        <div class="ms-1" v-for="prop in userAffectation" :key="prop.showProp">
          <div v-if="showProperty(prop)">
            <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
            <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
          </div>
        </div>
      </div>
      <div class="mb-5" v-if="userIdentifier.some((e)=>showProperty(e))">
        <div class="fst-italic noir w-100 mb-2">Identifiant utilisateur </div>
        <div class="ms-1" v-for="prop in userIdentifier" :key="prop.showProp">
          <div v-if="showProperty(prop)">
            <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
            <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
          </div>
        </div>
      </div>
      <div class="mb-5" v-if="userAddress.some((e)=>showProperty(e))">
        <div class="fst-italic noir w-100 mb-2">Adresse </div>
        <div class="ms-1" v-for="prop in userAddress" :key="prop.showProp">
          <div v-if="showProperty(prop)">
            <span class="poppins noir fw-boldest w-100">{{ prop.label }}:</span>
            <span class="poppins noir ms-2"> {{ !!prop.value && prop.value !== null && prop.value !== ''  ? prop.value : '-' }} </span>
          </div>
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
    const olduserUgaDeparment = props.payload?.oldValue.ugaList.concat(props.payload?.oldValue.departments)
    const newuserUgaDeparment = props.payload?.newValue.ugaList.concat(props.payload?.newValue.departments)
    oldValue = lodash.cloneDeep({...props.payload?.oldValue,userUgaDeparment:olduserUgaDeparment});
    newValue = lodash.cloneDeep({...props.payload?.newValue,userUgaDeparment:newuserUgaDeparment});
    changeLog = getModifiedColumns(oldValue, newValue);
    contact = props.isOld ? oldValue : newValue;
  } else {
    const userUgaDeparment = props.payload?.ugaList.concat(props.payload?.departments)
    contact = {...props.payload,userUgaDeparment};
  }
  const showProperty = (changeLogObject: any): boolean => {
    if (props.type === "update") {
      if(changeLogObject.type === 'array'){
        return changeLog.some((e)=>e.startsWith(changeLogObject.showProp))
      }

      if (
        changeLogObject.showProp === "addressOfUser" &&
        changeLog.some((e) => e.startsWith("addressOfUser"))
      ) {
        return true;
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


  
  const userInfo = [
  {
    label: "Civilité",
    showProp: "listIdGenreObject.id",
    value: contact.listIdGenreObject?.captionFr
  },
  {
    label: "Nom",
    showProp: "lastName",
    value: contact.lastName
  },
  {
    label: "Prénom",
    showProp: "firstName",
    value: contact.firstName
  },
  {
    label: "Téléphone portable",
    showProp: "telephone",
    value: contact.telephone
  },

];
const userAffectation = [
    {
    label: "UGA et départements",
    showProp: "userUgaDeparment",
    value: contact.userUgaDeparment?.length === 0 ? '-' : contact.userUgaDeparment?.map((e)=>e.listIdDepartmentObject?.captionFr ||e.listIdUgaObject?.code  ).join(' , '),
    type:'array'
  },
  {
    label: "Spécialités",
    showProp: "specialities",
    value: contact.specialities?.length === 0 ? '-' : contact.specialities?.map((e)=>e.listIdSpecialityObject?.captionFr).join(' , '),
    type:'array'
    
  },
  {
    label: "Carnet d’adresse",
    showProp: "contacts",
    value: contact.contacts?.length === 0 ? '-' : contact.contacts?.map((e)=>e.listIContactObject?.captionFr).join(' , '),
    type:'array'

  },
  {
    label: "Rôle",
    showProp: "userTypes",
    value: contact.userTypes?.length === 0 ? '-' : contact.userTypes?.map((e)=>e.role?.roleName).join(' , '),
    type:'array'

  },
  {
    label: "Equipe rattachée",
    showProp: "user1Team",
    value: contact.user1Team?.length === 0 ? '-' :  contact.user1Team?.map((e)=>e.user2?.lastName + ' ' + e.user2?.firstName ).join(' , '),
    type:'array'
  },

]
const userIdentifier = [
    {
    label: "E-mail",
    showProp: "username",
    value: contact.username,
  },
]

const userAddress = [
    {
    label: "N° Rue",
    showProp: "addressOfUser.streetNb",
    value: contact.addressOfUser?.streetNb
  },
  {
    label: "Rue",
    showProp: "addressOfUser.street",
    value: contact.addressOfUser?.street
  },
  {
    label: "Complément d'adresse",
    showProp: "addressOfUser.notes",
    value: contact.addressOfUser?.notes
  },
  {
    label: "Code postal",
    showProp: "addressOfUser.zipCode",
    value: contact.addressOfUser?.zipCode
  },
  {
    label: "Ville",
    showProp: "addressOfUser.town",
    value: contact.addressOfUser?.town
  },
  {
    label: "Pays",
    showProp: "addressOfUser.listIdCountryObject.id",
    value: contact.addressOfUser?.listIdCountryObject?.captionFr
  },
]

  </script>
  