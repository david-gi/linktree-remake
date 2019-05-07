<template>
	<div class="modal fade" id="modalLoginWindow" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog modal-lg rounded mt-5 pt-3"  role="document">
			<div class="modal-content bg-primary text-white rounded" 
				style="min-width:280px;">
				<div class="border-bottom text-center bg-primary p-3">
					<h4 class="modal-title">
						Login 
					</h4>
				</div>
				<div class="modal-body bg-primary row no-gutters justify-content-center">
						<span class="text-center col-12 pb-3">Sign in with:</span> 
						<div class="float-left col-1 mr-2">
							<div id="gBtn" class="rounded border border-white" @click="doLogin(1)"></div>	
						</div>	
						<div class="float-left col-1 ml-2 mr-2">
							<div id="fbBtn" class="rounded border border-white" @click="doLogin(2)"></div>	
						</div>	
						<div class="float-left col-1 ml-2 mr-2">
							<div id="twBtn" class="rounded border border-white" @click="doLogin(3)"></div>	
						</div>
						<div class="float-left col-1 ml-2">
							<div id="inBtn" class="rounded border border-white" @click="doLogin(4)"></div>	
						</div>	
				</div>
				<div class="bg-primary text-center mt-3">
					<span class="text-light">
						<i>Don't have an account?</i> 
						<br><strong>Sign up now below:</strong>
					</span>
				</div>
				<div class="modal-body bg-primary rounded">
					<div class="col-12 mb-3">
						<button class="btn btn-outline-light w-100" @click="doLogin(1)">
							Sign Up with your <strong class="d-inline-block">Google account</strong>
						</button>	
					</div>	
					<div class="col-12 mb-3">
						<button class="btn btn-outline-light w-100" @click="doLogin(2)">
							Sign Up with your <strong class="d-inline-block">Facebook account</strong>
						</button>	
					</div>	
					<div class="col-12 mb-3">
						<button class="btn btn-outline-light w-100" @click="doLogin(3)">
							Sign Up with your <strong class="d-inline-block">Twitter account</strong>
						</button>	
					</div>	
					<div class="col-12 mb-3">
						<button class="btn btn-outline-light w-100" @click="doLogin(4)">
							Sign Up with your <strong class="d-inline-block">LinkedIn account</strong>
						</button>	
					</div>	
				</div>
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
			}
		},
		created(){
		},
		mounted(){
			this.loading1()
			var tthis = this
			if(this.isLoggedIn){
				this.loading0()
				window.location.replace("#/edit")
			} else {
				this.autoLogin().then(res => {
					tthis.loading0()
					if(res){
						window.location.replace("#/edit")
					} else{
						$("#modalLoginWindow").modal({backdrop:false, show: true})
					}
				})
			}
		},
		computed: {
			...mapGetters([
				'auth',
			]),
			isLoggedIn(){
				return this.auth
			}
		},
		methods: {
			...mapActions([
				'autoLogin',
				'linkedInLogin',
				'loading0',
				'loading1'
			]),
			doLogin(provId) {
				var isLinkedIn = false
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
					case 4:
						isLinkedIn = true
						break;
				}
				if(!isLinkedIn){
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
						.then(function() {
							firebase.auth().signInWithRedirect(provider)
						})
				} else {
					this.linkedInLogin()
				}
			},
		}
	}
</script>

<style>
	#gBtn{
		cursor: pointer;
		background-image:url("/src/assets/g.png");
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		width:32px;
		height:32px;
	}
	#fbBtn{
		cursor: pointer;
		background-image:url("/src/assets/fb.png");
		background-repeat: no-repeat;
		background-position: left center;
		background-size: cover;
		width:32px;
		height:32px;
	}
	#twBtn{
		cursor: pointer;
		background-image:url("/src/assets/tw.png");
		background-repeat: no-repeat;
		background-position: left center;
		background-size: cover;
		width:32px;
		height:32px;
	}
	#inBtn{
		cursor: pointer;
		background-image:url("/src/assets/in.png");
		background-repeat: no-repeat;
		background-position: left center;
		background-size: cover;
		width:32px;
		height:32px;
	}
	#gBtn:hover, #inBtn:hover, #twBtn:hover, #fbBtn:hover{
		opacity: .7;
	}
	#gBtn:active, #inBtn:active, #twBtn:active, #fbBtn:active{
		opacity: .7;
		border-color: blueviolet !important;
	}
</style>