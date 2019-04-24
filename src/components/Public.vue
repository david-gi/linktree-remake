<template>
	<div>
		<div id="avatar" class="text-center rounded-circle border border-white"></div>
		Hello
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import H from './utils/helpers';

export default {
		data() {
			return {
				id: $route.params.id
			}
		},
		created(){
		},
		mounted(){
		},
		computed: {
			...mapGetters([
			]),
		},
		methods: {
			...mapActions([
			]),
		}
	}
</script>

<style>

</style>