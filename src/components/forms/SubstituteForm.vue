<template>
  <div>
    <InputTable
      ref="inputTableRef"
      :data="subs"
      :columns="columns"
      @inputChange="handleInput"
      @add="handleAdd"
      @delete="handleDelete"
      @name="handleSelectSub"
      @nameSuggest="handleSubSuggest"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import InputTable from "../shared/InputTable.vue";
import service from "@/service";
import { t } from "@/core/i18n/translate";
import { checkRpps } from "@/core/helpers/customValidation";
const inputTableRef= ref(null);
const columns = ref([
  { label: "Nom", prop: "lastName", type: "autoCompleteInput",valueKey:"actorName", name:"name",suggestions:[[]],rules:{required:true,message: `${t("entityForm.validation.required")}`,trigger: "blur",}},
  { label: "Prénom", prop: "firstName", type: "input", name:"firstName",rules:{message: `${t("entityForm.validation.required")}`,required:true,trigger: "blur",} },
  { label: "RPPS", prop: "rpps", type: "input" , name:"rpps",rules:[{message: `${t("entityForm.validation.required")}`,required:true,trigger: "blur",},{trigger:['change','blur'],validator:checkRpps}] },
]);
const props = defineProps({
    submit: {
        type:Boolean,
        default:false
    },
    contact: {
      type:Object,
      required:true
    }
})
const subs = ref([...props.contact.substituteds,{ lastName: "", firstName: "", rpps: "" }]);
const handleAdd = () => {
  subs.value = [...subs.value, { lastName: "", firstName: "", rpps: "" }];
};
const handleDelete = (payload) => {
  subs.value.splice(payload.index, 1);
};
const handleInput = (payload) => {
  subs.value[payload.index].subId = undefined;
  subs.value[payload.index].id = undefined;
  subs.value[payload.index][payload.column] = payload.value;
};
const emit = defineEmits(["submit","invalid"]);
watch(()=> props.submit,async()=>{
     if(props.submit){
        const valid = await inputTableRef.value?.validateForm()
        if(valid){
         emit("submit",subs.value)
        }else{
          emit("invalid")
        }
      }
})
const handleSelectSub = (payload) => {
  subs.value[payload.index] = {
    subId: payload.value.subId,
    lastName: payload.value.actorName,
    firstName: payload.value.firstName,
    rpps: payload.value.rpps,
  }
};
const handleSubSuggest = async(payload) => {


  const { data } = await service.api.actorControllerFindMany({
          "where[actorName][contains]": payload.data,
          "where[actorName][mode]": 'insensitive',
          "where[substitutes][none][substituedId]": props.contact.id,
          "where[id][not]": props.contact.id,
          "where[actorCompany]": null,
          "where[actorPerson][listIdActorPersonTypeObject][tag]": 'PDS'
        });

  payload.cb(data.paginatedResult.filter((actor) => !subs.value.some((sub) => sub.subId === actor.id))
  .map((option)=> {
    return {
    actorName:option.actorName,
      subId:option.id,
      firstName:option.actorPerson?.firstName,
      rpps : option.actorPerson?.rpps
  }
}))
};

</script>
<style lang="scss" scoped>
</style>