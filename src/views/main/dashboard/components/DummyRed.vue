<template>
	<div class="dummy-red">
		<p>
			Meta: {{ JSON.stringify(meta) }}
		</p>
		<p>
			Data: {{ JSON.stringify(data) }}
		</p>
	</div>
</template>

<style lang="scss">
.dummy-red {
	background-color: #f69e9e;
	width: 100%;
	height: 100%;
}
</style>

<script setup>
import {  defineProps } from 'vue'
  const props = defineProps({
    meta: Object,
    data: Object,
  });

</script>
