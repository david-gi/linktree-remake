import firebase from 'firebase'

const state = {
	account = null,
	sections = [], // obj array
	publicAccount = null,
	publicSections = [] // obj array
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
		 context.rootState.accountsRef.where("username", "==", id).get()
			.then(snap => {
				if(snap.size() < 1){ window.location.replace("/not-found") }

				var accData = snap[0].data()
				context.commit('setPublicAccount', accData)

				context.rootState.sectionsRef.where("account", "==", accountId).orderBy("Order").get()
					.then(function(snap) {
						var sections = []

						snap.forEach(function(doc) {
							sections.push(doc.data())
						})
						
						context.commit("setPublicSections", sections)
					})
				})
	},

	autoLogin: (context, uid) => {
		firebase.auth().onAuthStateChanged(function(acc) {
			if (acc) {
                console.log('autologin...')
				var docRef = context.rootState.accountsRef.doc(acc.uid)
				docRef.get()
					.then(p => {
						if(p.exists){
							var accData = p.data()
							accData["id"] = acc.uid
							context.commit('setAccount', accData)
							context.commit('setAuth', true)
						} else{
							var newAccount = {
								Avatar: "",
								Bio: "",
								Email: acc.data().Email,
								Location: "",
								Plan: 1,
								Title: ""
							}
							docRef.set(newAccount).then(res => {
								newAccount["id"] = acc.uid
								context.commit('setAccount', newAccount)
								context.commit('setAuth', true)
							})
						}
					})
			}
		})
		.catch(e => { console.log("Auth Failed: " + e); context.commit('setError',"Auth Failed: " + e) })		
	},
	logout: (context) => {
		firebase.auth().signOut().then(() => {
			console.log("logged out")
			context.commit('setAuth', false)
			context.commit("setAccount", null)
			context.commit('setMsg', 'Signed out')
		})
		.catch(e => { console.log(e) })
	},
	updateAccountField: (context, field, val) => {
		this.updateField(context, "accounts", firebase.auth().currentUser.uid, [[field, val]])
			.then(res => {
				context.commit("setAccount", res)
				context.commit('setMsg', 'Saved')
			})
	},

	updateFields: (context, col, doc, fieldSets) => {
		return new Promise((resolve, reject) => {
			var docRef = null
			var obj = null
			var objIndex = null
			switch(col){
				case "accounts":
					docRef = context.rootState.accountsRef.doc(doc)
					obj = context.state.account
				case "sections":
					docRef = context.rootState.sectionsRef.doc(doc)
					obj = context.state.sections.find(x, i =>{ objIndex = i; return x.id == doc; })
			}
			docRef.get()
				.then(res => {				
					if(res.exists){
						var updated = {}
						for(var set in fieldSets){
							if(isArray(set[1])){ //map datatypes
								var map = {}
								for(var mSet in set[1]){
									map[mSet[0]] = mSet[1]
								}
								updated[set[0]] = map
								obj[set[0]] = map
							} else{ //other datatypes
								updated[set[0]] = set[1]
								obj[set[0]] = set[1]
							}
						}
						docRef.set(updated, { merge: true })

						if(objIndex){
							obj['id'] = doc
							context.commit("setSection", objIndex, obj)
						}
						resolve(obj);
					} else {
						throw col.substring(0, col.length - 2) + " does not exist!"
					}
				})
				.catch(e => {console.log(e); reject(null);})
			})
	},
	
	getSections: (context) => {
		context.rootState.sectionsRef.where("account", "==", context.state.account.id).orderBy("Order").get()
			.then(function(snap) {
				var sections = []

				snap.forEach(function(doc) {
					var res = doc.data()
					res["id"] = doc.id
					sections.push(res)
				})
				
				context.commit("setSections", sections)
				context.commit("sortSections")
			})
	},
	sortSections: (context) => {
		context.commit("sortSections")
	},
	addSection: (context) => {
		context.dispatch('sortSections')
			.then(() =>{
				var sLength = context.state.sections.length
				var end = context.state.sections[sLength - 1].Order + 1
				var newSection = {
					Account: context.state.account.id,
					Order: end
				}
				context.rootState.sectionsRef.add(newSection).then(res =>{
					newSection["id"] = res.id
					context.commit("setSection", sLength,  newSection)
				})
			})
	},
	updateSection: (context, doc, fieldSets) => {
		this.updateField(context, "sections", doc, fieldSets)
			.then(res => {
				context.commit('setMsg', 'Updated')
				context.commit("sortSections")
			})
	},
	deleteSection: (context, index, doc) => {
		context.rootState.sectionsRef.delete(doc).then(() =>{
			context.commit("removeSection", index)
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
	getters
}
