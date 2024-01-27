<template>
<span v-if="params.data?.distributor?.description">
    {{ params.data?.distributor?.description }}
</span>
<span v-else class="noir">
    <i v-if="params.data?.distributor?.id">Éditer une description</i>
</span>
  
</template>
<script>
export default {
   props: ["params"],
}
</script>

