import firebase from 'firebase'

const state = {
	account: null,
	sections: [], // obj array
	publicAccount: null,
	publicSections: [] // obj array
}

const mutations = {
	'setAccount' (state, x) {
		state.account = x
	},
	'setSections' (state, x) {
		state.sections = x
	},
	'sortSections' (state) {
		state.sections.sort((a, b) => { b.Order - a.Order })
	},
	'setSection' (state, index, x) {
		state.sections[index] = x
	},
	'removeSection' (state, index){
		state.sections.splice(index, 1)
	},
	'setPublicAccount' (state, x) {
		state.publicAccount = x
	},
	'setPublicSections' (state, x) {
		state.publicSections = x
	}
}

const actions = {	
	getPublic: (context, id) => {
		return new Promise((resolve, reject) => {
			context.rootState.accountsRef.where("Username", "==", id).get()
				.then(snap => {
					if(snap.empty){ window.location.replace("#/not-found") }

					var accData = snap.docs[0].data()
					context.commit('setPublicAccount', accData)

					context.rootState.sectionsRef.where("Account", "==", snap.docs[0].id).orderBy("Order").get()
						.then(function(snap) {
							var sections = []
							snap.forEach(function(doc) {
								var sectData = doc.data()
								sectData['id'] = doc.id
								sections.push(sectData)
							})
							context.commit("setPublicSections", sections)
						})
						resolve(null)
					}).catch(e =>{ reject(null) })
			})
	},

	autoLogin: (context) => {
		return new Promise((resolve, reject) => {
			var loginFun = (acc) => {
				if(acc){
					console.log('logging in...')
					
					function checkEmailValidation(existing){
						acc.providerData.forEach(function (profile) {
							if(profile.providerId.toLowerCase() == "password"){
								if(!acc.emailVerified){
									firebase.auth().signOut().then(() => {
										if(existing){
											context.commit('setError', 'Please verify your email.')
										}
										console.log("Email not verified...")
										context.commit('setAuth', false)
										context.commit("setAccount", null)
										resolve(true)
									})
								}
							}
						})
					}

					function grabNested(fieldName, defaultTxt){
						try{
							var res = acc[fieldName] 
								? acc[fieldName] 
								: (acc.providerData[0] 
									? (acc.providerData[0][fieldName]
										? acc.providerData[0][fieldName] 
										: defaultTxt)
									: defaultTxt)
							return res
						} catch(e) { return defaultTxt }
					}

					var docRef = context.rootState.accountsRef.doc(acc.uid)
					docRef.get()
						.then(p => {

							if(p.exists){
								console.log('existing...')
								var email = grabNested("email", "")
								email = email == "" ? accData["Email"] : email
								var accData = p.data()
								accData["id"] = acc.uid
								accData["Email"] = email
								context.commit('setAccount', accData)
								context.commit('setAuth', true)
								checkEmailValidation(true)
								resolve(true)
							} else{
								var newAccount = {
									Avatar: grabNested("photoURL", ""),
									Bio: "All in one place...",
									Email:  grabNested("email", ""),
									Location: "",
									Plan: 1,
									Title:  grabNested("displayName", "My Links"),
									Username:  grabNested("email", "").replace('@','-').replace('.','-').toLowerCase(),
									Banner:"#354378",
									BannerText: "#519DE8",
									Link: "#354378",
									LinkText: "#519DE8",
								}
								if(newAccount.Email == "") { throw "Email permission denied by provider." }
								docRef.set(newAccount).then(res => {
									newAccount["id"] = acc.uid
									context.commit('setAccount', newAccount)
									context.commit('setAuth', true)
									checkEmailValidation(false)
									resolve(true)
								})
							}
						}).catch(e => { console.log("Auth Failed: " + e); context.commit('setError',"Auth Failed: " + e); resolve(false); })		
				} else{
					resolve(false)
				}
			}

			//for 3rd party redirection
			firebase.auth().getRedirectResult()
			.then(function(res){
				var acc = res.user
				loginFun(acc)
				})
			.catch(e => { console.log("Auth Failed: " + e); context.commit('setError',"Auth Failed (redirect): " + e) })	
			//if already logged in
			firebase.auth().onAuthStateChanged(function(acc) {	
				loginFun(acc)
			})
			
		})
	},
	emailSignUp: (context, {e, p}) => {
		return new Promise((resolve, reject) => {
			firebase.auth().createUserWithEmailAndPassword(e, p)
				.then(r=>{ 
					resolve(r)
				})
				.catch(e => { 
					console.log(e)
					context.commit('setError',"" + e)
					reject(null)
				})
		})
	},
	emailLogin: (context, {e, p}) => {
		return new Promise((resolve, reject) => {
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
				.then(function() {
					firebase.auth().signInWithEmailAndPassword(e, p)
						.then(function(res) {
							resolve(res)
						})
				})
				.catch(e => { 
					console.log(e)
					context.commit('setError',"" + e)
					reject(null)
				})
		})
	},
	linkedInLogin: (context, code) => {
		var tthis = this
		return new Promise((resolve, reject) => {
			try{
				//get access token
				var rUrl = "https://www.linkedin.com/oauth/v2/accessToken"
				var q = "grant_type=authorization_code&code=" + code + "&redirect_uri="
						+ "https://linkkle.appspot.com/src/in.htm".replace('/','%2F')
						+ "&client_id=" + context.rootState.inId
						+ "&client_secret=" + context.rootState.inS
				var xhr = new XMLHttpRequest()
				xhr.open("POST", rUrl, true)
				xhr.onreadystatechange = function() {
					console.log("**"+JSON.stringify(xhr))
					if (this.readyState == 4) {
						//var accessToken = xhr.response.access_token
						//firebase.auth().signInWithCustomToken(accessToken)
						//existing //new
						
						resolve(true)
					}
				}
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
				xhr.responseType = 'json'
				xhr.send(q)
			} catch(e){
				reject("Unable to authenticate, please try agian.")
			}
		})
	},	
	passwordReset: (context, email) => {
		firebase.auth().sendPasswordResetEmail(email).then(() => {
			context.commit('setMsg', 'Password reset email sent')
		})
		.catch(e => { console.log(e) })
	},
	logout: (context) => {
		firebase.auth().signOut().then(() => {
			console.log("Signed out...")
			context.commit('setAuth', false)
			context.commit("setAccount", null)
			context.commit('setMsg', 'Signing out')
		})
		.catch(e => { console.log(e) })
	},
	deleteAccount: (context) => {
		return new Promise((resolve, reject) => {
			context.rootState.accountsRef.doc(doc).delete().then(() => {
				firebase.auth().currentUser.delete().then(() =>{
					resolve()
				})
			})
		})
	},
	updateAccount: (context, fieldSets) => {
		context.dispatch("updateFields", 
		//TEST REMOVE//
		{ 'col': "accounts", "doc": context.state.account.id, "fieldSets": fieldSets })
			.then(res => {
				context.commit("setAccount", res)
				context.commit('setMsg', 'Saved')
			}).catch(e => context.commit('setError', e+""))
	},
	commitAccount(context, x){
		context.commit("setAccount", x)
	},
	usernameCheck: (context, x) => {
		return new Promise((resolve, reject) => {
			context.rootState.sectionsRef.where("Username", "==", x.toLowerCase()).get()
				.then(function(snap) {
					resolve(snap.size > 0 ? false : true)
				})
		})
	},

	updateFields: (context, { col, doc, fieldSets }) => {
		return new Promise((resolve, reject) => {
			var docRef = null
			var obj = null
			var objIndex = null
			switch(col){
				case "accounts":
					docRef = context.rootState.accountsRef.doc(doc)
					obj = context.state.account
					break
				case "sections":
					docRef = context.rootState.sectionsRef.doc(doc)
					obj = context.state.sections.find(function(x, i){ objIndex = i; return x.id == doc; })
					break
				default:
					if(docRef == null){
					console.log(col + " invalid")
					return
				}
			}
			docRef.get()
				.then(res => {	
					if(res.exists){
						var updated = {}
						fieldSets.forEach(set => {
							// if(isArray(set[1])){ //map datatypes (not supported yet)
							// 	var map = {}
							// 	for(var mSet in set[1]){
							// 		map[mSet[0]] = mSet[1]
							// 	}
							// 	updated[set[0]] = map
							// 	obj[set[0]] = map
							// } else{ //other datatypes
								updated[set[0]] = set[1]
								obj[set[0]] = set[1]
							//}
						})
						docRef.set(updated, { merge: true })

						if(objIndex){
							obj['id'] = doc
							context.commit("setSection", objIndex, obj)
						}
						resolve(obj);
					} else {
						throw col.substring(0, col.length - 1) + " does not exist!"
					}
				})
				.catch(e => {console.log(e); reject(e);})
			})
	},
	
	getSections: (context) => {
		return new Promise((resolve, reject) => {
			context.rootState.sectionsRef.where("Account", "==", context.state.account.id).orderBy("Order").get()
				.then(function(snap) {
					var sections = []

					snap.forEach(function(doc) {
						var res = doc.data()
						res["id"] = doc.id
						sections.push(res)
					})
					
					context.commit("setSections", sections)
					resolve(null)
				})
		})
	},
	sortSections: (context) => {
		context.commit("sortSections")
	},
	addSection: (context, newSect) => {
		return new Promise((resolve, reject) => {
			var sLength = context.state.sections.length
			var end = context.state.sections.length < 1 
						? 1 : context.state.sections[sLength - 1].Order + 1

			newSect['Account'] = context.state.account.id
			newSect['Order'] = end
			newSect['Type'] = 0
			newSect['Width'] = 3
			newSect['Height'] = 1
			newSect['Clicks'] = 0

			context.rootState.sectionsRef.add(newSect).then(res =>{
				newSect["id"] = res.id
				context.commit('setMsg', 'Added')
				context.commit("setSection", sLength,  newSect)
				resolve(res.id)
			})
		})
	},
	updateSection: (context, {doc, fieldSets}) => {
		return new Promise((resolve, reject) => {
			var filterIndex = fieldSets.findIndex(x => { x[0].toLowerCase() == "clicks"} )
			if(filterIndex > -1) fieldSets.splice(filterIndex, 1)

			context.dispatch("updateFields", { 'col': "sections", "doc": doc, "fieldSets": fieldSets })
				.then(res => {
					context.commit('setMsg', 'Saved')
					context.commit("sortSections")
					resolve(null)
				}).catch(e=>reject(null))
		})
	},
	updateSectionOrders: (context, sections) => {
		return new Promise((resolve, reject) => {
			sections.forEach((sect, i) => {
				//update db
				context.dispatch("updateFields", { 'col': "sections", "doc": sect.id, "fieldSets": [['Order', i]] })
					.then(()=>{
						context.commit('setMsg', 'Order changed')
						resolve(null)
					}).catch(e=>reject(null))
			})
		})
	},
	deleteSection: (context, doc) => {
		context.rootState.sectionsRef.doc(doc).delete().then(() =>{
			context.commit('setMsg', 'Deleted')
		})
	},

	sendBug: (context, btext) => {
		var bugsRef = context.rootState.bugsRef
		var bugReport = {
			details: btext,
			account: firebase.auth().currentUser.uid,
			created: firebase.firestore.FieldValue.serverTimestamp()
		}
		bugsRef.add(bugReport).then(()=>{
			context.commit('setMsg', 'Bug reported, thanks!')
		})
		.catch(e => console.log(e));
	},
}

const getters = {
	account: state => {
		return state.account
	},
	sections: state => {
		return state.sections
	},
	publicAccount: state => {
		return state.publicAccount
	},
	publicSections: state => {
		return state.publicSections
	},
}

export default {
	state,
	mutations,
	actions, 
	getters,
}
