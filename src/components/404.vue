<template>
	<div class="text-center col-12 pt-3 ">
		<div class="w-50 m-auto p-3 bg-primary rounded text-light">
			<h3>Page not found.</h3>
			Sorry, that user doesn't exist.<br>
		<i>redirecting...</i>
		</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
		data() {
			return {
			}
		},
		created(){
		},
		mounted(){
			setTimeout(() => {
				window.location.replace("/")
			}, 3000);
		},
	}
</script>

<style>

</style>