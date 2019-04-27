<template>
	<div id="Container" class="col-12" v-if="dataLoaded">

		<div id="Header" class="">
			<div id="Avatar" class="col-12">
				<div class="rounded-circle" :style="avatarStyle">
				</div>
			</div>
			<div id="Banner" :style="bannerStyle" class="">
				<h1>{{account.Title}}</h1>
				<h2>
					@{{account.Username}}
					</h2>
				<p>{{account.Bio}}</p>
			</div>
		</div>

		<div id="Sections" v-sortable="{ onUpdate: onSort }" class="row no-gutters justify-content-between">
			<div v-for="sect in localSections" :key="sect.Order"
				class="section col-12 " :class="{
					'h-1': (sect.Height == 1), 'h-2': (sect.Height == 2), 'h-3': (sect.Height == 3),
					'col-sm-12': (sect.Width == 1), 'col-sm-12': (sect.Width == 2), 'col-sm-12': (sect.Width == 3)
					}">
				<div :style="sectionStyle(sect)">
					{{sect.Title}}
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
		data() {
			return {
				id: this.$route.params.id,
				localSections: [],
				dataLoaded: false,
				c1: "#354378",
				c2: "#519DE8",
			}
		},
		created(){
			var tthis = this
			this.autoLogin().then(()=>{
				this.getSections().then(res=>{
					var _x = tthis.sections
					this.localSections = res
					tthis.dataLoaded = true
				})
			})
		},
		mounted(){
		},
		computed: {
			...mapGetters([
				'account',
				'sections'
			]),
			avatarStyle(){
				var avatarUrl = this.account.Avatar ? this.account.Avatar : "./src/assets/profile.jpg"
				return { backgroundImage: 'url(\''+ avatarUrl +'\')' }
			},
			bannerStyle(){
				var banner = this.account.Banner && this.account.Banner.length > 4 
							 ? this.account.Banner : this.c1
				var text = this.account.BannerText ? this.account.BannerText : "#ffffff"
				if(banner.indexOf('#') > -1){
					return { backgroundColor: banner, color: text }
				} else {
					return { backgroundImage: 'url(\''+ banner +'\')', color: text }
				}
			},
		},
		methods: {
			...mapActions([
				'autoLogin',
				'getSections',
				'addSection',
				'updateSection',
				'updateSectionOrders',
				'deleteSection',
				'sortSections',
				'loading1',
				'loading0'

			]),
			onSort: function (event) {
				this.loading1()
				var tthis = this
				this.localSections.splice(event.newIndex, 0, this.localSections.splice(event.oldIndex, 1)[0])
				this.updateSectionOrders(this.localSections)
					.then(() => {
						tthis.getSections().then(res=>{
							tthis.localSections = res
							tthis.loading0()
						})
					}).catch(e => tthis.loading0())
			},
			sectionStyle(sect) {
				var style = { } 
				style["background-color"] = this.account.Link && this.account.Link.length > 6 
						? this.account.Link :  this.c2
				style["color"] = this.account && this.account.LinkText.length > 6 
						? this.account.LinkText : "#ffffff"

				if(sect.Type == 3){ //image
					style["background-position"] = "center center"
					style["background-repeat"] = "no-repeat"
					style["background-size"] = "cover"
					style["background-image"] = "url('"+ sect.Value +"')"
					style["color"] = 'transparent'
					style["text-align"] = 'right'
					style["cursor"] = 'auto !important'
				}

				return style
			},
		}
}
</script>

<style>
#Container{
	max-width: 600px;
	margin:0 auto;
}
#Avatar{
	background-color: transparent;
	margin-bottom: -80px;
	margin-top: 14px;
}
	#Avatar div{
		width: 160px;
		height: 160px;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		border: 6px #fff solid;
		margin: 0 auto;
	}
#Banner{
	text-align: center;
	padding: 6px;
	padding-top: 90px;
}
	#Banner h1{
		font-size: 1.2em;
		font-weight: bold;
	}
	#Banner h2{
		font-size: 1.1em;
	}
#Sections {

}
	#Sections .section{
		padding-top: 9px;
		text-align: center;
		vertical-align: middle;
		border: 1px #fff solid;
		float: left;
		clear:none;
	}
	#Sections .section:hover{
		opacity: .9;
	}
	#Sections .section div {
		padding: 6px;
		cursor: pointer;
		height: 100%;
	}
		#Sections .h-1 div {
			height: 36px;
		}
		#Sections .h-2 div {
			padding-top: 42px;
			height: 108px;
		}
		#Sections .h-3 div {
			padding-top: 57px;
			height: 144px;
		}
</style>