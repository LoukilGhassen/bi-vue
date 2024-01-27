<template>
    <span v-if="params.data.Nom">
        {{ params.data.Nom }}
      </span>
        <el-select
        v-else
        remote
        filterable
        class="w-100"
        @change="handleSelectDoctor"
        :remote-method="querySearch"
        v-model="doctorSearch"
        value-key="id"
        clearable
        placeholder="Rechercher un médecin"
      >
        <el-option
          v-for="item in doctorList"
          :key="item.id"
          :label="item.actorName"
          :value="item"
        />
      </el-select>
  </template>
  
  <script>
  import { useActorRelationshipStore } from "@/store/useActorRelationshipModule";
  import { useRoute } from "vue-router";
  import {useActorStore } from "@/store/useActorModule";
  import service from "@/service";
  
  import { storeToRefs } from "pinia";
  
  import { ref } from "vue";
  
  export default {
    components: {},
    
    props: ["params"],
  
    setup(props) {
      const route = useRoute();
      const {actor} = storeToRefs(useActorStore());
      const doctorSearch = ref("");
      const doctorList = ref([]);
      const { createActorRelationship,setShowListAddRow } = useActorRelationshipStore();

      const querySearch = async (queryString) => {
        const { data } = await service.api.actorControllerFindMany({
          skip: 0,
          take: 20,
          "where[actorName][contains]": queryString ? queryString : "",
          "where[actorName][mode]": "insensitive",
          "where[actorCompany]": null,
          "where[actorPerson][listIdActorPersonTypeObject][tag]": 'PDS',
          "where[id][not]": route.params.id,
          "where[actorRelationships2][none][actor1]": route.params.id,
          "where[actorRelationships2][none][listIdActorRelationshipTypeObject][tag]":"AttachedDoctor"
        });
        doctorList.value = data.paginatedResult;
      };
  
      const handleSelectDoctor = async (selectedDoctor) => {
         await createActorRelationship({data:{
          actor1Object:{
            id:route.params.id
          },
          actor2Object:{
            id:selectedDoctor.id
          },
          listIdActorRelationshipTypeObject:{
            listTypeName_tag:{
                listTypeName:'actorRelationShipType',
                tag:"AttachedDoctor"
            }
          },
          relation2Address:{
            id:selectedDoctor.addressOfActor[0].id
          },
           relation1Address:{
            id:actor.value?.actorObject?.addressOfActor[0].id
          } 
        }})
        
        setShowListAddRow(true)
      };
      return { doctorList, doctorSearch, querySearch, handleSelectDoctor };
    },
  };
  </script>
  <style scoped></style>
  