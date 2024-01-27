<template>
	<div class="chacheli-designer" :class="{ dragging: dragging.active }">
		<ChacheliDesignerLayout ref="layoutComp" :layout="layout" :chachelis="chachelis" :dragging="dragging" />
<!-- 		<ChacheliChooser :chachelis="chachelis" :dragging="dragging" @mouseDown="handleMouseDown" />
 -->	</div>
</template>

<style lang="scss">
.chacheli-designer {
	flex: 1 1 auto;
	display: flex;
	flex-direction: row;
	overflow: scroll;

	&.dragging {
		cursor: move;
	}
}
</style>

<script setup>
import ChacheliDesignerLayout from './internal/ChacheliDesigner.vue'
import ChacheliChooser from "./internal/ChacheliChooser.vue"
import {ref , computed} from 'vue'
const handleMouseDown = (data) => {
	dragging.value = {...data}
}
const layoutComp = ref(null)
const props = defineProps({
	layout: {
        required: true
    },
    chachelis: {
        required: true
    }
})


const dragging = ref({
	active: false,
	cancelled: false,
	index: 0
})
const minColumns = () => {
	return layoutComp.value.minColumns()
}
const minRows = () => {
	return layoutComp.value.minRows()
}

</script>
