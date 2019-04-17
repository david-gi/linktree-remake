<template>
		<nav class="navbar fixed-top navbar-expand-sm navbar-light bg-light border" >
		    <div class="navbar-header">
		      <span class="navbar-brand text-success"><i class="glu-font">GLUTENOUS!</i> 
						<small class="font-weight-light text-black-50 d-inline-block w-75 text-wrap align-text-top">
							<small> 
								<span class="d-sm-none" style="font-size:.8em">Gluten Maps<span style="font-size:.8em">™</span></span>
								<span class="d-none d-sm-inline">Gluten Maps<span style="font-size:.8em">™</span></span>
							</small>
						</small>
					</span>
		    </div>
		    <div class="collapse navbar-collapse clearfix mr-3 border-right" id="navCollapse">
		      	<ul class="nav navbar-nav justify-content-end col-12">
							
		      		<div class="nav-link" style="cursor:pointer">
								<a href="https://www.facebook.com/Glutenous-Gluten-Maps-281841432706483/" target="_blank" class="nav-item">
									<img title="facebook" class="mr-n1" src="/src/assets/f.png"/>
								</a>
								<a href="https://twitter.com/GlutenousMaps" target="_blank" class="nav-item ml-1">
									<img title="twitter" src="/src/assets/tw.png"/>
								</a>
								<a href="https://bit.ly/2VKBSTT" target="_blank" class="nav-item ml-0">
									<img title="Indiegogo" src="/src/assets/go.png"/>
								</a>
		      		</div>

		      		<div class="nav-link" style="cursor:pointer">
								<a @click="navAbout" class="nav-item text-muted font-weight-lighter"><small>About</small></a>
							</div>
		      		<div class="nav-link" style="cursor:pointer">
								<a @click="navLearn" class="nav-item text-muted font-weight-lighter"><small>Learn</small></a>
		      		</div>
							
		      	</ul>
		    </div>

				<button class="navbar-toggler p-0 position-absolute" :class="{'on': isLoggedIn, 'off': !isLoggedIn}" type="button" data-toggle="collapse"
				data-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				
				<span class="navbar-text float-leftx pl-1">
					<a id="loginBtn" class="border border-primary bg-white p-2 rounded btn-link text-primary" style="cursor:pointer"
						v-show="!isLoggedIn" @click="doLogin">
						<span class=" d-inline-block" :class="{gLogo: !loginLoading}">
							<small v-show="!loginLoading"><span class="ml-n1 d-inline-block">SIGN IN</span></small>
							<small v-show="loginLoading">Loading...</small>
						</span>
					</a>
					<a id="LoginIcon" href="#" v-show="isLoggedIn" @click="toggleProfile" class="align-middle"
							:class="{ active: showProfile }"	:style="{ backgroundImage: 'url('+photoUrl+')' }">
					</a>
				</span>

			<aboutModal ref="aboutNavModal"></aboutModal>
			<learnModal ref="learnNavModal"></learnModal>
		</nav>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import About from './About.vue'
	import Learn from './Learn.vue'
	import firebase from 'firebase/app'
    export default {
			...mapGetters,
    	data() {
    		return {
					loginLoading: false
    		}
    	},
			components: {
				aboutModal: About,
				learnModal: Learn
			},
			computed: {
				isLoggedIn(){
					return this.$store.state.auth != false
				},
				photoUrl(){
					return this.$store.state.auth != false ? this.$store.state.user.profile.photoURL : "";
				},
				showProfile(){
					return this.$store.state.showProfile && this.$store.state.auth
				},
			},
			methods: {
				...mapActions([
					'toggleProfile',
					'setLoading',
				]),
				doLogin() {
					var provider = new firebase.auth.GoogleAuthProvider()
					firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
						.then(function() {
							firebase.auth().signInWithRedirect(provider)
						})
				},
				navAbout(){
					this.$refs.aboutNavModal.open()
				},
				navLearn(){
					this.$refs.learnNavModal.open()
				},
			},
			created(){
				var tthis = this
			},
			mounted(){
				var tthis = this
				this.loginLoading = true
				setTimeout(function(){ tthis.loginLoading = false }, 3000)
				this.$store.dispatch("autoLogin")

				setTimeout(() => {
							if(!tthis.$store.state.auth){
								tthis.$refs.aboutNavModal.open()
							}
						}, 2500)
			}
	}
</script>
<style>
	#LoginIcon{
		border: 2px #ddd solid;
		border-radius: 100%;
		display: inline-block;
		width: 34px;
		height: 34px;
		margin: -4px 0px -3px 0px;
		background-size:contain;
	}
	#LoginIcon:hover,#LoginIcon.active{
		border: 2px #337ab7 solid;
	}
	.navbar-toggler.on{
		right: 66px;
	} 
	.navbar-toggler.off{
		right: 126px;
	}
	.gLogo{
			background-image:url("/src/assets/G.svg");
			background-repeat: no-repeat;
			padding-left:28px;
	}
</style>
