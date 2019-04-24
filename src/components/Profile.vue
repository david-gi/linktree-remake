<template>
	<div>

		<div id="Header">
			<div id="Avatar" class="text-center">
				<div class="rounded-circle" :style="avatarStyle">
				</div>
			</div>
			<div id="Banner" :style="bannerStyle">
			</div>
		</div>

		<div id="Sections">
			<div v-for="sect in publicSections" :key="sect.Order"
				:class="sectionSize">

			</div>
		</div>

		<div id="Footer">Linkkle</div>

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
			this.getPublic(this.id)
		},
		mounted(){
		},
		computed: {
			...mapGetters([
				'publicAccount',
				'publicSections'
			]),
			avatarStyle(){
				var avatarUrl = this.publicAccount.Avatar ? publicAccount.Avatar : "./src/assets/star.svg"
				return { backgroundImage: 'url(\''+ avatarUrl +'\')' }
			},
			bannerStyle(){
				if(this.publicAccount.Banner || this.publicAccount.Banner.length < 6) return

				var isHex = this.publicAccount.Banner.indexOf('#')
				if(!isHex){
					return { backgroundImage: 'url(\''+ this.publicAccount.Banner +'\')' }
				} else {
					return { backgroundColor: this.publicAccount.Banner }
				}
			},
			sectionSize(sect){
				var style = { 'col-1': true, 'vid': sect.Video.Url }
				style["col-sm-" + (4 * sect.width)] = true

				return style 
			},
		},
		methods: {
			...mapActions([
				'getPublic'
			]),
		}
	}
</script>

<style>
#Header{

}
#Avatar{
	
}
	#Avatar div{
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		border: 5px #fff solid;
	}
#Banner{
	
}
#Sections {

}
	#Sections .vid {
	}
#Footer{
	
}
</style>