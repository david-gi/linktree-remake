<template>
	<div class="col-12 p-0 m-0 pt-2 pb-1 border-top text-center">
		<img class="col-12 col-sm-8 col-md-7 col-lg-5 p-0 m-0" @click="sClick" :src="currentSponsor.img" style=" cursor:pointer"/>
	</div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
	name: "Sponsor",
	data() {
		return {
			sIndex: 0,
			currentSponsor: {img:"",link:"",id:""}
		}
	},
	computed: {
		...mapGetters([
			'sponsors',
		])
	},
	methods: {
		...mapActions([
			'loadSponsors',
			'sponsorClick'
		]),
		sClick(){
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("post", "https://us-central1-glutenous.cloudfunctions.net/sponsorClick?x="+this.currentSponsor.id, true);  
			xmlHttp.send(null);

			window.open(this.currentSponsor.link, "_blank")
		}
	},
	mounted(){
		var tthis = this
		this.loadSponsors().then(() => {
			setTimeout(function() {
				tthis.sIndex = Math.floor(tthis.sponsors.length * Math.random())
				tthis.currentSponsor = tthis.sponsors[tthis.sIndex]
			}, 1200)
		});
	}
}
</script>
