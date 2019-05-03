<template>
	<div v-if="account" class="modal fade" id="modalAccountWindow" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered"  role="document">
			<div class="modal-content bg-light border border-primary" 
				style="box-shadow: 0px 0px 20px #666; min-width:280px;">
				<div class="modal-header text-white bg-primary rounded-0">
					<strong class="modal-title">
						Account settings
					</strong>
					<button type="button" class="close text-light" @click="close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<form class="modal-body">
					<div class="bg-white text-dark clearfix">

						<div class="form-group col-6 float-left">
							<label>Avatar URL</label>
							<div class="btn btn-small btn-primary float-right p-0 pl-2 pr-2" @click="setGravitar">
								<small>Use Gravitar</small>
							</div>
							<input id="avatarInp" v-model="account.Avatar" type="text" class="form-control"  placeholder="http://www.example.com/image.jpg..."/>
						</div>

						<div class="form-group col-6 float-left">
							<label>Name</label>
							<input v-model="account.Title" type="text" class="form-control" />
						</div>

						<div class="form-group col-6 float-left">
							<label>Username</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<div class="input-group-text">@</div>
								</div>
								<input v-model="account.Username" type="text" class="form-control" @change="checkUsername" 
									:class="{'border-danger': !usernameValid && !checkingUsername, 'border-success': usernameValid, 'border-warning': checkingUsername}" />
							</div>
								<div v-show="checkingUsername" class="text-warning mb-n5 float-right"><small>Checking...</small></div>
								<div v-show="!usernameValid && !checkingUsername" class="text-danger mb-n5 float-right"><small>Already used!</small></div>
						</div>
						 
						<div class="form-group col-6 float-left">
							<label>Plan</label>
							<div class="text-muted pt-1">{{ planName }} account</div>
						</div>

						<div class="form-group col-12  float-left">
							<label>Bio</label>
							<input v-model="account.Bio" type="text" class="form-control" />
						</div>

							<label class="col-12">Color Theme</label>
						<div class="col-11 ml-3 p-0 border rounded d-inline-block pt-2">
							<div class="form-group col-12 col-sm-6 float-left">
								<label>Banner Text</label>
								<input v-model="bannerTextColor.hex" type="text" class="form-control" />
								<slider-picker v-model="bannerTextColor" class="col-12 mt-2 p-1" />
							</div>
							<div class="form-group col-12 col-sm-6 float-left">
								<label>Banner Background</label>
								<input v-model="bannerColor.hex" type="text" class="form-control" />
								<slider-picker v-model="bannerColor" class="col-12 mt-2 p-1" />
							</div>
							<div class="form-group col-12 col-sm-6 float-left">
								<label>Link Text</label>
								<input v-model="linkTextColor.hex" type="text" class="form-control" />
								<slider-picker v-model="linkTextColor" class="col-12 mt-2 p-1" />
							</div>
							<div class="form-group col-12 col-sm-6  float-left">
								<label>Link Background</label>
								<input v-model="linkColor.hex" type="text" class="form-control" />
								<slider-picker v-model="linkColor" class="col-12 mt-2 p-1" />
							</div>
						</div>
							
					</div>
					<div class="text-right row mt-3 ml-3 mr-3 justify-content-between">
						<button type="button" class="btn btn-outline-danger d-absolute col-3 mr-3" @click="remove()">Delete</button>
						<button type="button" class="btn btn-outline-secondary offset-2 col-3" @click="close()">Cancel</button>
						<button type="button" v-bind:disabled="!usernameValid || checkingUsername" class="btn btn-primary col-3" @click="save()">Save</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import {Slider} from 'vue-color'
	import {MD5} from '../../utils/md5.js'
	export default {
		data() {
			return {
				oAccount: {},
				usernameValid: true,
				checkingUsername: false,
				oUsername: "",
				linkColor: "",
				linkTextColor: "",
				bannerColor: "",
				bannerTextColor: "",
			}
		},
		created(){
			var tthis = this
			setTimeout(() => {
				for (var i in tthis.account) { tthis.oAccount[i] = tthis.account[i] } 
				tthis.oUsername = this.account.Username 
				tthis.linkColor = {hex: this.account.Link}
				tthis.linkTextColor = {hex: this.account.LinkText}
				tthis.bannerColor = {hex: this.account.Banner}
				tthis.bannerTextColor = {hex: this.account.BannerText}
				tthis.checkUsername()
			}, 1100)
		},
		components: {    
    		'slider-picker': Slider,
		},
		computed:{
			...mapGetters([
				'account'
			]),
			planName(){
				switch(this.account.Plan){
					case 1:
						return "Free"
					case 2:
						return "Ad-Free"
					case 3:
						return "Pro"
				}
			}
		},
		methods: {
			...mapActions([
				'updateAccount',
				//'deleteAccount',,
				'usernameCheck',
				'commitAccount',
				'loading1',
				'loading0'

			]),
			open(){
				$("#modalAccountWindow").modal({backdrop:false, show: true})
			},
			close(){
				this.commitAccount(this.oAccount)
				this.oAccount = {}
				$("#modalAccountWindow").modal("hide")
			},
			save(){
				if(!this.usernameValid){
					return
				}
				var tthis = this
				this.loading1()
				var updatedFieldSets = [
					["Avatar", this.account.Avatar],
					["Bio", this.account.Bio],
					["Email", this.account.Email],
					["Title", this.account.Title],
					["Username", this.account.Username.toLowerCase()],
					["Banner", this.bannerColor.hex],
					["BannerText", this.bannerTextColor.hex],
					["Link", this.linkColor.hex],
					["LinkText", this.linkTextColor.hex],
				]
				this.updateAccount(updatedFieldSets)
					.then(()=>{
							$("#modalAccountWindow").modal("hide")
							tthis.loading0()
						})
			},
			setGravitar(){
				var emailMd5 = MD5(this.account.Email)
				this.account.Avatar = "https://www.gravatar.com/avatar/" + emailMd5 + ".png?s=160"
			},
			checkUsername(){
				this.checkingUsername = true
				this.usernameValid = false
				
				if(this.account.Username.toLowerCase() === this.oUsername.toLowerCase()){ 
					this.usernameValid = true; 
					this.checkingUsername = false
					return; 
				}
				
				var tthis = this
				this.usernameCheck(this.account.Username)
					.then(res =>{
						tthis.usernameValid = res
						tthis.checkingUsername = false
					})
			},
			remove(){
				var tthis = this
				//this.loading1()
				// this.deleteAccount()
				// 	.then(()=>{
				// 		tthis.loading0()
				// 		window.location.replace('/')
				// 	})
			},
		}
	}
</script>