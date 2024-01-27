<template>
<div>
    <VisitForm isEdit />
</div>
</template>
  
<script lang="ts" setup>
import { useConfigStore } from '@/store/useConfig';
import VisitForm  from '@/components/forms/VisitForm.vue';
const {setHeader} = useConfigStore()
setHeader('VisitDetailHeader')
</script>
  
<style lang="scss" scoped>

</style>
  