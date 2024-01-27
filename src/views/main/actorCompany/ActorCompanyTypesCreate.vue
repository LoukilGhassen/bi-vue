<template>
    <div>
      <el-dialog
        v-model="$props.showModal"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        fullscreen
        >
      <ActorPharmacyForm v-if="payload.type === 'pharmacy'" :depositAddress="depositAddress" :pharmacyAddress="pharmacyAddress"/>  
      <ActorHealthCenterForm v-if="payload.type === 'eds'" :inputs="props.payload.inputs"/>
      <ActorEntityForm v-if="props.payload.type === 'entity'" :inputs="props.payload.inputs"/>
      </el-dialog>
    </div>
  </template>
    
    <script lang="ts" setup>
    import ActorPharmacyForm from "@/components/forms/ActorPharmacyForm.vue";
    import ActorHealthCenterForm from "@/components/forms/ActorHealthCenterForm.vue";
    import ActorEntityForm from "@/components/forms/ActorEntityForm.vue";
    const props = defineProps({
      showModal: {
        type: Boolean,
        required: true,
      },
      payload:{
        type:Object,
        required:true
      }
    });
    const depositAddress = ref(null)
    const pharmacyAddress = ref(null)
    if(props.payload.type === 'pharmacy'){
      depositAddress.value = props.payload.inputs.find((input)=>input.type ==='depositAddress')
      pharmacyAddress.value = props.payload.inputs.find((input)=>input.type ==='pharmacy')
    }
  </script>
  <style lang="scss" scoped>
  </style>
    