import firebase from 'firebase'

const state = {
	profile: { id: null, email: "", name: "", condition: null },
	conditions: null,
}

const mutations = {
	'setProfile' (state, x) {
		state.profile = x
	},
	'addPoints' (state) {
		state.profile.points = Number(state.profile.points) + 10
	},
	'setConditions' (state, x) {
		state.conditions = x
	},
}

const actions = {	
	autoLogin: (context, uid) => {
		// firebase.auth().getRedirectResult()
		// .then(function(res){
		// 	var user = res.user
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
                console.log('autologin...')
				var docRef = context.rootState.usersRef.doc(user.uid)
				docRef.get()
					.then(p => {
						if(p.exists){
							var refreshProfile = { email: user.email, name: user.displayName, photoURL: user.photoURL, points: p.data().points, condition: p.data().condition }
							docRef.set(refreshProfile, { merge: true })
							context.commit('setProfile', refreshProfile)
							context.commit('setAuth', true)
							if(p.data().condition == null){ context.commit('toggleProfile') }
						} else{
							var newProfile = { email: user.email, name: user.displayName, photoURL: user.photoURL, points: "0", condition: null }
							docRef.set(newProfile)
							console.log("New user created")
							context.commit('setProfile', newProfile)
							context.commit('toggleProfile')
							context.commit('setAuth', true)
						}
					})
			}
		})
		.catch(e => { console.log("Auth Failed: " + e); context.commit('setError',"Auth Failed: " + e) })		
	},
	loadConditions: (context) => {
		if(state.conditions == null){
			context.rootState.conditionsRef.get()
				.then(cnds => {
					context.commit('setConditions', cnds.docs.reverse())
				})
		}
	},
	saveProfile: (context, cndId) => {
		var docRef = context.rootState.usersRef.doc(firebase.auth().currentUser.uid)
		docRef.get()
			.then(res => {				
				if(res.exists){
					var cnd = context.rootState.conditionsRef.doc(cndId)
					context.state.profile.condition = cnd
					docRef.set({condition: cnd}, { merge: true })
					context.commit("setProfile", context.state.profile)
					context.commit('setMsg', 'Saved!')
				} else {
					throw "User does not exist!"
				}
			})
		// 	.catch(e => console.log(e))
	},
	logout: (context) => {
		firebase.auth().signOut().then(() => {
			console.log("logged out")
			context.commit('setAuth', false)
			context.commit('toggleProfile')
			context.commit("setProfile", { id: null, email: "", name: "", points: "0", condition: null })
			context.commit('setMsg', 'Signed out!')
		})
		.catch(e => { console.log(e) })
	},
	sendBug: (context, btext) => {
		var bugsRef = context.rootState.bugsRef
		var user = context.rootState.usersRef.doc(firebase.auth().currentUser.uid)
			
		var bugReport = {
			text: btext,
			user: user,
			created: firebase.firestore.FieldValue.serverTimestamp()
		}
		bugsRef.add(bugReport).then(()=>{
			context.commit('setMsg', 'Bug reported, thanks!')
		})
		.catch(e => console.log(e));
	},
}

const getters = {
	profile: state => {
		return state.profile
	},
	conditions: state => {
		return state.conditions
	},
}

export default {
	state,
	mutations,
	actions, 
	getters
}
