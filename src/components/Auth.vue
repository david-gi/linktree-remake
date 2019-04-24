<template>
	<div>
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
		},
		computed: {
			...mapGetters([
			]),
		},
		methods: {
			...mapActions([
			]),
			doLogin() {
				var provider = new firebase.auth.GoogleAuthProvider()
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
					.then(function() {
						firebase.auth().signInWithRedirect(provider)
					})
			},
		}
	}
</script>

<style>

</style>