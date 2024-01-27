<template>
    <el-form class="w-100" @click.stop>
      <el-select
        filterable
        class="w-100"
        @change="handleSelectAddress"
        :model-value="params.data?.address"
        placeholder="Attacher une adresse"
      >
        <el-option
          v-for="item in addressList"
          :key="item.id"
          :label="item.street"
          :value="item.id"
        />
      </el-select>
    </el-form>
  </template>
  
  <script>
  import { useRoute } from "vue-router";
  import service from "@/service";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
  import {useActorRelationshipStore} from "@/store/useActorRelationshipModule";
  
  export default {
    components: {},
  
    props: ["params"],
  
    setup(props) {
      const route = useRoute();
      const addressList = props.params.data?.actorAddresses
      const selectedAddress = ref()
      const { editActorRelationship } = useActorRelationshipStore();
      const handleSelectAddress = async (selectedItem) => {
          await editActorRelationship({
          data: props.params.data.relationSide === 1 ? {
            relation1Address: {id:selectedItem}
          }:{
            relation2Address: {id:selectedItem} 
          },
          id:props.params?.data?.id
        });  
        Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });
      };
      return { addressList,  handleSelectAddress , selectedAddress};
    },
  };
  </script>
  <style scoped></style>
  