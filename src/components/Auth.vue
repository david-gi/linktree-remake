<template>
	<div class="ml-auto mr-auto bg-primary text-white rounded pb-1" @keyup.enter="enterSubmit"
		 style="margin-top:100px; min-width:280px; max-width:500px;">
			<div class="border-bottom text-center p-3">
				<h4 class="mt-1 font-weight-bold">
					<span v-show="showLogin && !emailRegd">Login to Linkkle</span>
					<span v-show="!showLogin && !emailRegd">Sign Up with Linkkle</span>
					<span v-show="emailRegd">Sign up successful!</span>
				</h4>
			</div>
			<div v-show="showLogin && !emailRegd" class="bg-primary row no-gutters justify-content-center pb-0 m-3 mb-n1" >
				<div class="col-12 mt-2 form-group">
					<div class="col-12 p-3 pt-4 pb-3 rounded d-inline-block emailBlock clearfix">
						
						<div class="col-12 mt-2 float-left">
							<input v-model="emailAddr" type="email" class="form-control form-control-sm"  placeholder="Email..."/>
						</div>
						<div class="col-12 mt-2 float-left">
							<input v-model="pass" type="password" class="form-control form-control-sm"  placeholder="Password..."/>
						</div>
						<div class="col-12 text-right mt-2 float-left">
							<button @click="doLogin(5)" class="w-100 btn btn-sm border border-primary btn-success font-weight-bold">Login</button>
						</div>

						<button v-show="!showPassReset" @click="togglePassReset" class="btn btn-link text-white ml-1"><i><small>Forgot your password?</small></i></button>
						<div class="col-12 p-3 border d-inline-block rounded mt-3" v-if="showPassReset">
							<label class="col-12 m-0">Send password reset email:</label>
							<div class="col-12 col-sm-10 mt-2 float-left">
								<input v-model="resetEmailAddr" type="email" class="form-control form-control-sm"  placeholder="Your email..."/>
							</div>
							<div class="col-2 offset-sm-0 col-sm-2 mt-2 float-left">
								<button @click="passReset()" class="btn btn-sm border border-primary btn-success font-weight-bold">Send</button>
							</div>
						</div>

						<div class="col-12">
							<span class="pt-1 pr-1 float-left mr-4 mt-3"><small>Or login with linked account:</small></span>
							<div class="d-inline-block">
								<div class="float-left mr-3 mt-3">
									<a id="gBtn" class="smBtn rounded border border-white" @click="doLogin(1)"></a>	
								</div>	
								<div class="float-left ml-3 mr-3 mt-3">
									<a id="fbBtn" class="smBtn rounded border border-white" @click="doLogin(2)"></a>	
								</div>	
								<div class="float-left  ml-3 mr-3x mt-3">
									<a id="twBtn" class="smBtn rounded border border-white" @click="doLogin(3)"></a>	
								</div>
								<!--div class="float-left col-1 ml-3">
									<a id="inBtn" class="smBtn rounded border border-white" @click="doLogin(4)"></a>	
								</div-->	
							</div>
						</div>

					</div>
				</div>	
			</div>

			<div v-show="showLogin && !emailRegd" class="bg-primary text-center mb-3">
				<span class="text-light">
					<i>Don't have an account?</i> 
					<br><button @click="toggleLogin()" class="mt-2 btn btn-warning font-weight-bold">Sign up now!</button>
				</span>
			</div>

			<div v-show="!showLogin && !emailRegd" class="bg-primary rounded m-auto pt-3">
				<div class="col-12 mb-3 mt-1 form-group">
					<div class="col-12 p-2 pb-3 rounded d-inline-block emailBlock">
						<form>
							<label class="pl-3">Email Sign Up</label>
							<div class="col-12 mt-2 float-left">
								<input id="emailAddrInp" v-model="emailAddrReg" type="email" class="form-control form-control-sm" placeholder="Email..."/>
							</div>
							<div class="col-12 mt-2 float-left">
								<input v-model="passReg" type="password" class="form-control form-control-sm"
									minlength="6" maxlength="28" placeholder="Password..."/>
							</div>
							<div class="col-12 mt-2 float-left">
								<input v-model="passReg2" type="password" class="form-control form-control-sm"  
									:class="{'border-danger': passReg != passReg2}" placeholder="Confirm password..."/>
							</div>
							<div class="col-12 text-right mt-2 float-left">
								<small v-show="passReg.length < 7 && passReg.length > 0 && passReg2.length > 0" 
										class="bg-danger rounded mb-2 p-1 pl-2 pr-2 float-left">Password must be at least 6 characters long</small>
								<small v-show="passReg != passReg2 && passReg2.length > 0" class="bg-danger rounded mb-2 p-1 pl-2 pr-2 float-left">Passwords must match</small>
								<button type="button" @click="emailReg" :disabled="(passReg != passReg2)" class="btn btn-sm col-12 border border-primary btn-success font-weight-bold">Sign Up</button>
							</div>
						</form>
					</div>
				</div>	
				<!--div class="col-12 mb-3">
					<button class="btn btn-outline-light w-100" @click="doLogin(1)">
						Sign Up using <strong class="d-inline-block">Google</strong>
					</button>	
				</div>	
				<div class="col-12 mb-3">
					<button class="btn btn-outline-light w-100" @click="doLogin(2)">
						Sign Up using <strong class="d-inline-block">Facebook</strong>
					</button>	
				</div>	
				<div class="col-12 mb-3">
					<button class="btn btn-outline-light w-100" @click="doLogin(3)">
						Sign Up using <strong class="d-inline-block">Twitter</strong>
					</button>	
				</div>	
				<div class="col-12 mb-3">
					<button class="btn btn-outline-light w-100" @click="doLogin(4)">
						Sign Up using <strong class="d-inline-block">LinkedIn</strong>
					</button>	
				</div-->	
			</div>
			
			<div v-show="!showLogin && !emailRegd" class="bg-primary text-center mb-3">
				<span class="text-light">
					<i>Already have an account?</i> 
					<br><button @click="toggleLogin()" class="mt-2 btn border btn-primary">Go to login</button>
				</span>
			</div>

			<div v-show="emailRegd" class="p-3 text-center">
				<br>
				<h4>Thanks for signing up with Linkkle!</h4>
				<br>
				<p>Please check your email for a Linkkle Verification email.</p>
				<p>If you don't see it after five minutes, <br>please check your Spam folder.</p>
				<br>
			</div>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import firebase from 'firebase'
export default {
		data() {
			return {
				showLogin: true,
				emailRegd: false,
				showPassReset: false,
				resetEmailAddr: "",
				emailAddr: "",
				pass: "",
				emailAddrReg: "",
				passReg: "",
				passReg2: "",
			}
		},
		props: {
			//linkin// code: { type: String, required: false },
		},
		created(){
			this.loading0()
		},
		mounted(){
			$("#Menu").show()
			this.loading1()
			var tthis = this
			function afterLogin(res){
				tthis.loading0()
				if(res){
					window.location.replace("#/edit")
				} else{
					$("#modalLoginWindow").modal({backdrop:false, show: true})
				}
			}
			if(tthis.auth){
				tthis.loading0()
				window.location.replace("#/edit")
			} else {
				if(false){ //linkedin// this.code){
					tthis.linkedInLogin(tthis.code)
						.then((res)=>{ afterLogin(res) })
				} else {
					if(window.location.search.indexOf("logout") != -1){ 
						$("#modalLoginWindow").modal({backdrop:false, show: true})
						tthis.loading0()
					} else {
						tthis.autoLogin().then((res)=>{ var r = afterLogin(res) })
					}
				}
			}
		},
		computed: {
			...mapGetters([
				'auth',
				'inId',
			]),
			emailValid(){
				var inp = document.getElementById('emailAddrInp')
				return inp ? inp.checkValidity() : false
			}
		},
		methods: {
			...mapActions([
				'autoLogin',
				'emailSignUp',
				'emailLogin',
				'linkedInLogin',
				'passwordReset',
				'loading0',
				'loading1',
				'setMsg'
			]),
			toggleLogin(){
				this.showLogin = !this.showLogin
			},
			enterSubmit(){
				if(this.showLogin && !this.emailRegd){
					this.doLogin(5)
					this.pass = ""
				} else {
					if(this.passReg == this.passReg2){
						this.emailReg()
						this.passReg = ""
						this.passReg2 = ""
					}
				}
			},
			doLogin(provId) {
				var tthis = this
				this.loading1()
				var flow = 0
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
					case 5: //email
						flow = 2
						break;
				}
				switch(flow){
					case 0:
						firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
							.then(function() {
								tthis.loading0()
								firebase.auth().signInWithRedirect(provider)
							})
						break;
					case 1:
						// var rUrl = "https://www.linkedin.com/oauth/v2/authorization?response_type=code"
						// 	+"&client_id=" + this.inId
						// 	+"&redirect_uri=" + "https://linkkle.appspot.com/src/in.htm".replace('/', '%2F')
						// 	+"&scope=r_liteprofile%20r_emailaddress"
						// window.open(rUrl, "_self")
						break;
					case 2:
						if(this.emailAddr.length < 6 && this.pass.length < 6) {
							this.loading0()
							break;
						}
						this.emailLogin({e: this.emailAddr, p: this.pass}).then(r=>{ 
							setTimeout(function(){
								tthis.loading0()
								window.location.replace("#/edit")
							}, 1000)
						}).catch(e=>{tthis.loading0()})
						break;
				}
			},
			togglePassReset(){
				this.showPassReset = !this.showPassReset
			},
			passReset(){
				var tthis = this
				this.passwordReset(this.resetEmailAddr).then(()=> {
					tthis.showPassReset = false
				})
			},
			emailReg() {
				this.loading1()
				var tthis = this
				if(this.emailValid && this.passReg){
					this.emailSignUp({e: this.emailAddrReg, p: this.passReg}).then(r=>{
						firebase.auth().currentUser.sendEmailVerification({ url: 'https://linkkle.appspot.com/#/login' })
						.then(function() {
							tthis.loading0()
							tthis.emailRegd = true
						}).catch(e =>{tthis.loading0()})
					}).catch(e =>{tthis.loading0()})
				} 
			}
		}
	}
</script>

<style>
	.emailBlock{
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px rgba(255, 255, 255, 0.2) solid;
	}
	.smBtn{
		cursor: pointer;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: cover;
		width:32px;
		height:32px;
		display: inline-block;
	}
	#gBtn{
		background-image:url("/src/assets/g.png");
	}
	#fbBtn{
		background-image:url("/src/assets/fb.png");
	}
	#twBtn{
		background-image:url("/src/assets/tw.png");
	}
	#inBtn{
		background-image:url("/src/assets/in.png");
	}
	.smBtn:hover{
		opacity: .7;
	}
	.smBtn:active{
		opacity: .7;
		border-color: blueviolet !important;
	}
</style>