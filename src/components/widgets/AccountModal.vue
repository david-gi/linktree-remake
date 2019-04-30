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
							<input v-model="account.Avatar" type="text" class="form-control"  placeholder="http://www.example.com/image.jpg..."/>
						</div>

						<div class="form-group col-6 float-left">
							<label>Name</label>
							<input v-model="account.Title" type="text" class="form-control" />
						</div>

						<div class="form-group col-6 float-left">
							<label>Username</label>
							<input v-model="account.Username" type="text" class="form-control"
								@change="checkUsername" :class="{'border-danger': !usernameValid, 'border-success': usernameValid}" />
								<div v-show="!usernameValid" class="text-danger mb-n5"><small>Already used!</small></div>
						</div>
						 
						<div class="form-group col-6 float-left">
							<label>Plan</label>
							<div class="text-muted pt-1">{{ planName }} account</div>
						</div>

						<div class="form-group col-12  float-left">
							<label>Bio</label>
							<input v-model="account.Bio" type="text" class="form-control" />
						</div>

						<div class="form-group col-6 float-left">
							<label>Banner Text Color</label>
							<input v-model="account.BannerText" type="text" class="form-control" />
						</div>
						<div class="form-group col-6 float-left">
							<label>Banner Background Color</label>
							<input v-model="account.Banner" type="text" class="form-control" />
						</div>
						<div class="form-group col-6 float-left">
							<label>Link Text Color</label>
							<input v-model="account.LinkText" type="text" class="form-control" />
						</div>
						<div class="form-group col-6 float-left">
							<label>Link Background Color</label>
							<input v-model="account.Link" type="text" class="form-control" />
						</div>
							
					</div>
					<div class="text-right row mt-3 ml-3 mr-3 justify-content-between">
						<button type="button" class="btn btn-outline-danger d-absolute col-3 mr-3" @click="remove()">Delete</button>
						<button type="button" class="btn btn-outline-secondary offset-2 col-3" @click="close()">Cancel</button>
						<button type="submit" class="btn btn-primary col-3" @click="save()">Save</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
    export default {
		data() {
			return {
				usernameValid: true,
				oUsername: ""
			}
		},
		created(){
			this.oUsername = this.account.Username
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
				'loading1',
				'loading0'

			]),
			open(){
				$("#modalAccountWindow").modal({backdrop:false, show: true})
			},
			close(){
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
					["Banner", this.account.Banner],
					["BannerText", this.account.BannerText],
					["Bio", this.account.Bio],
					["Email", this.account.Email],
					["Link", this.account.Link],
					["LinkText", this.account.LinkText],
					["Title", this.account.Title],
					["Username", this.account.Username.toLowerCase()],
				]
				this.updateAccount(updatedFieldSets)
					.then(()=>{
							$("#modalAccountWindow").modal("hide")
							tthis.loading0()
						})
			},
			checkUsername(){
				console.log(this.account.Username.toLowerCase() +"  "+ this.oUsername.toLowerCase())
				if(this.account.Username.toLowerCase() === this.oUsername.toLowerCase()){ this.usernameValid = true; return; }
				var tthis = this
				this.usernameCheck(this.account.Username)
					.then(res =>{
						tthis.usernameValid = res
					})
			},
			remove(){
				var tthis = this
				this.loading1()
				// this.deleteAccount()
				// 	.then(()=>{
				// 		tthis.loading0()
				// 		window.location.replace('/')
				// 	})
			},
		}
	}
</script>