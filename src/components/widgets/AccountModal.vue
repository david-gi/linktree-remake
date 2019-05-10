<template>
	<div v-if="account" class="modal fade" id="modalAccountWindow" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered"  role="document" style=" max-width:600px;">
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
						<div class="row no-gutters ml-3">
							<div class="form-group col-12 col-sm-6 float-left">
								<label>Email</label>
								<div class="text-muted pt-1">
									{{ account.Email }}
									<button type="button" class="btn btn-sm btn-secondary ml-2" @click="passReset()"><small>Reset Password</small></button>
								</div>
							</div>
							
							<div class="form-group col-12 col-sm-6 float-left">
								<label>Plan</label>
								<div class="text-success pt-1">
									{{ planName }} account
									<button v-show="account.Plan < 3" class="btn btn-sm btn-success mt-n1 ml-2">
										<small class="font-weight-bold">Upgrade now!</small></button>
								</div>
							</div>
						</div>

						<div class="form-group col-12 col-sm-4 float-left mt-4">
							<label>Link this account to:</label>
						</div>
						<div class="form-group col-12 col-sm-8 float-left">
								<div class="float-left mr-3 mt-3">
									<div id="gBtn" class="smBtn rounded border border-white" @click="doLinking(1)"></div>	
								</div>	
								<div class="float-left ml-3 mr-3 mt-3">
									<div id="fbBtn" class="smBtn rounded border border-white" @click="doLinking(2)"></div>	
								</div>	
								<div class="float-left  ml-3 mr-3x mt-3">
									<div id="twBtn" class="smBtn rounded border border-white" @click="doLinking(3)"></div>	
								</div>
								<!--div class="float-left col-1 ml-3">
									<div id="inBtn" class="smBtn rounded border border-white" @click="doLinking(4)"></div>	
								</div-->
						</div>
							
					</div>
					<div class="text-rightx row ml-3 mr-3 justify-content-betweenx">
						<button v-show="predelete" type="button" class="btn btn-outline-danger col-12 col-sm-6 mt-3" @click="predeleteClick()">Delete Acccount</button>
						<button v-show="!predelete" :disabled="deleteWait" type="button" class="btn btn-sm btn-danger border-warning text-warning font-weight-bold float-right col-12 col-sm-6 mt-3" 
							@dblclick="remove()">
							<span v-show="deleteWait">Wait...</span>
							<span v-show="!deleteWait">Double-click to permanently Delete!</span>
							</button>
						<button type="button" class="btn btn-outline-secondary offset-sm-3 col-12 col-sm-3 mt-3" @click="close()">Close</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import firebase from 'firebase'
	export default {
		data() {
			return {
				predelete: true,
				deleteWait: true
			}
		},
		created(){
			var tthis = this
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
				'deleteAccount',,
				'passwordReset',
				'loading1',
				'loading0'

			]),
			open(){
				$("#modalAccountWindow").modal({backdrop:false, show: true})
			},
			close(){
				$("#modalAccountWindow").modal("hide")
			},
			passReset(){
				this.passwordReset(this.account.Email)
			},
			doLinking(provId){
				var provider = null
				switch(provId){
					case 1:
						provider = new firebase.auth.GoogleAuthProvider()
						break;
					case 2:
						provider = new firebase.auth.FacebookAuthProvider()
						break;
					case 3:
						provider = new firebase.auth.TwitterAuthProvider()
						break;
					case 4: //linkedin
						flow = 1
						break;
				}
				firebase.auth().currentUser.linkWithRedirect(provider).then(() =>{
					tthis.loading0()
				})
			},
			predeleteClick(){
				var tthis = this
				setTimeout(() =>{
					tthis.predelete = false
					setTimeout(() =>{
						tthis.deleteWait = false
					}, 5000)
					setTimeout(() =>{
						tthis.predelete = true
					}, 9000)
				}, 200)
			},
			remove(){
				this.loading1()
				this.deleteAccount()
			},
		}
	}
</script>