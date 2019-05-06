<template>
	<div id="Container" class="col-12" v-if="dataLoaded">
		<div id="Header" class="">
			<div id="Avatar" class="col-12">
				<button class="btn btn-sm btn-outline-primary float-left" @click="preview()">View Live</button>
				<button class="btn btn-sm btn-outline-secondary float-right" @click="logOff()">Sign out</button>
				<div class="rounded-circle" :style="avatarStyle">
				</div>
				<button @click="openAccountEdit()" style="margin-top:-70px;"
					class="float-right btn btn-small bg-light btn-outline-dark text-dark p-0 pl-2 pr-2 pb-1 mr-n1 ">
					<small>Edit Profile</small>
				</button>
			</div>
			<div id="Banner" :style="bannerStyle" class="">

				<h1>{{account.Title}}</h1>
				<h2>
					@{{account.Username}}
					</h2>
				<p class="">{{account.Bio}}</p>
			</div>
		</div>

		<div id="Sections" v-sortable="{ onUpdate: onSort }" class="row no-gutters justify-content-between">
			<div v-for="(sect, index) in sections" :key="sect.Order"
				class="section col-12 " :class="{
					'h-1': (sect.Height == 1), 'h-2': (sect.Height == 2), 'h-3': (sect.Height == 3),
					'col-sm-4': (sect.Width == 1), 'col-sm-6': (sect.Width == 2), 'col-sm-12': (sect.Width == 3)
					}">
				<div v-show="!sect.edit" :style="sectionStyle(sect)">
					<button @click="openEdit(index)" style="margin-top:-3px;"
						class="float-right btn btn-small bg-light btn-outline-dark text-dark p-0 pl-2 pr-2 pb-1 mr-n1 ">
						<small>Edit</small>
					</button>
					{{sect.Title}}
				</div>
			</div>
		</div>

		<div class="">
			<div class="addBtn text-center p-0 pb-1" @click="newSection()">+</div>
		</div>

	
		<accountModal ref="accountModal"></accountModal>
		<editModal ref="editModal"></editModal>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import AccountModal from './widgets/AccountModal.vue'
import EditModal from './widgets/EditModal.vue'
export default {
		data() {
			return {
				id: this.$route.params.id,
				dataLoaded: false,
				c1: "#354378",
				c2: "#519DE8",
			}
		},
		components: {
			accountModal: AccountModal,
			editModal: EditModal
		},
		created(){
			var tthis = this
			this.loading1()
				this.autoLogin().then(res =>{
					if(!res){
						this.loading0()
						window.location.replace('#/login')
					} else {
						tthis.getSections().then(()=>{
							this.loading0()
							tthis.dataLoaded = true
						})
					}
				})
		},
		mounted(){
		},
		computed: {
			...mapGetters([
				'account',
				'auth',
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
				'logout',
				'getSections',
				'addSection',
				'updateSection',
				'updateSectionOrders',
				'deleteSection',
				'sortSections',
				'loading1',
				'loading0'

			]),
			preview(){
				window.open('#/'+this.account.Username, '_blank')
			},
			logOff(){
				this.logout().then(()=>{
					window.location.replace('#/login')
				})
			},
			refreshSections: function (){
				var tthis = this
				this.getSections().then(()=>{
					tthis.loading0()
				})
			},
			newSection: function (event) {
				this.loading1()
				var tthis = this
				this.addSection({})
					.then(newId => { 
						this.getSections().then(()=>{
							tthis.loading0()
							tthis.openEdit(tthis.sections.length - 1)
						})
					})
					.catch(e => tthis.loading0())
			},
			openAccountEdit(){
				var tthis = this
				setTimeout(function(){
						tthis.$refs.accountModal.open()
					}, 500)
			},
			openEdit(index){
				var tthis = this
				this.$refs.editModal.section = this.sections[index]
				setTimeout(function(){
						tthis.$refs.editModal.open()
					}, 500)
			},
			onSort: function (event) {
				this.loading1()
				var tthis = this
				var modSects = this.sections
				modSects.splice(event.newIndex, 0, modSects.splice(event.oldIndex, 1)[0])
				this.updateSectionOrders(modSects)
					.then(()=>{
						this.getSections().then(()=>{
							tthis.loading0()
						})
					})
					.catch(e => tthis.loading0())
			},
			sectionStyle(sect) {
				var style = { } 
				style["background-color"] = this.account.Link && this.account.Link.length > 5 
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
		background-color: #fff;
		border: 6px #fff solid;
		margin: 0 auto;
	}
#Banner{
	text-align: center;
	padding: 6px;
	border: 4px #fff solid;
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
	outline: 0;
}
	#Sections .section{
		text-align: center;
		vertical-align: middle;
		border: 4px #fff solid;
		float: left;
		clear:none;
	}
	#Sections .section div {
		padding: 6px;
		cursor: move;
		height: 100%;
	}
		.icon {
			cursor: pointer;
			border: transparent 4px solid;
			border-left-width: 6px;
			border-right-width: 6px;
		}
		.icon.move{
			cursor: move;
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
	#Sections input {
		padding: 0 6px;
		margin:0;
		outline: 0;
		border: 1px rgba(1, 1, 1, 0.3) solid;
		border-radius: 2px;
		background-color: rgba(255, 255, 255, 0.5);
	}
	.addBtn{
		cursor: pointer;
		font-size: 1.6em;
		font-weight: bold;
		color: #555;
		border: 1px #bbb solid;
		margin:3px;
	}
	.addBtn:hover {
		border: 1px #519DE8 solid;
		color: #519DE8;
	}
	.addBtn:active {
		opacity: 1;
		color: #fff;
		background-color: #519DE8;
		border: 1px #519DE8 solid;
	}
</style>