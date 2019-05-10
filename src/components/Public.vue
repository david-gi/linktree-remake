<template>
	<div id="Container" class="col-12" v-if="dataLoaded">

		<div id="Header" class="">
			<div id="Avatar" class="col-12">
				<div class="rounded-circle" :style="avatarStyle">
				</div>
			</div>
			<div id="Banner" :style="bannerStyle" class="">
				<h1>{{publicAccount.Title}}</h1>
				<h2>
					@{{publicAccount.Username}}
					</h2>
				<p>{{publicAccount.Bio}}</p>
			</div>
		</div>

		<div id="Sections" class="row no-gutters justify-content-between">
			<a v-for="sect in publicSections" :key="sect.Order" @click="linkClick(sect.id, sect.Type, sect.Value)"
				class="section col-12 d-block" :class="{
					'h-1': (sect.Height == 1), 'h-2': (sect.Height == 2), 'h-3': (sect.Height == 3),
					'col-sm-4': (sect.Width == 1), 'col-sm-6': (sect.Width == 2), 'col-sm-12': (sect.Width == 3)
					}">
				<div :style="sectionStyle(sect)">
					{{sect.Title}}
				</div>
			</a>
		</div>

	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
		data() {
			return {
				id: this.$route.params.id,
				dataLoaded: false,
				c1: "#354378",
				c2: "#519DE8",
			}
		},
		created(){
			var tthis = this
			this.getPublic(this.id).then(res=>{
				tthis.dataLoaded = true
			})
		},
		mounted(){
		},
		computed: {
			...mapGetters([
				'publicAccount',
				'publicSections'
			]),
			avatarStyle(){
				var avatarUrl = this.publicAccount.Avatar || this.publicAccount.Avatar != ""
								? this.publicAccount.Avatar : "./src/assets/profile.jpg"
				return { backgroundImage: 'url(\''+ avatarUrl +'\')' }
			},
			bannerStyle(){
				var banner = this.publicAccount.Banner && this.publicAccount.Banner.length > 4 
							 ? this.publicAccount.Banner : this.c1
				var text = this.publicAccount.BannerText ? this.publicAccount.BannerText : "#ffffff"
				if(banner.indexOf('#') > -1){
					return { backgroundColor: banner, color: text }
				} else {
					return { backgroundImage: 'url(\''+ banner +'\')', color: text }
				}
			},
		},
		methods: {
			...mapActions([
				'getPublic'
			]),
			sectionStyle(sect) {
				var style = { } 
				style["background-color"] = this.publicAccount.Link && this.publicAccount.Link.length > 6 
						? this.publicAccount.Link :  this.c2
				style["color"] = this.publicAccount && this.publicAccount.LinkText.length > 6 
						? this.publicAccount.LinkText : "#ffffff"

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
			linkClick(id, Type, Value){
				switch(Type+""){
					case "0":
						window.open(Value, '_blank')
						break;
					case "1":
						window.open("mailto:"+Value, '_self')
						break;
					case "2":
						window.open("tel:"+Value, '_self')
						break;
					default:
						return
				}
			}
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
		background-color: #fff;
		border: 6px #fff solid;
		margin: 0 auto;
	}
#Banner{
	text-align: center;
	padding: 6px;
	padding-top: 90px;
		border: 4px #fff solid;
}
	#Banner h1{
		font-size: 1.2em;
		font-weight: bold;
	}
	#Banner h2{
		font-size: 1.1em;
	}
	#Sections .section{
		text-align: center;
		vertical-align: middle;
		border: 4px #fff solid;
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