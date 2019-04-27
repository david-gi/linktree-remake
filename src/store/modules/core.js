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

	autoLogin: (context, uid) => {
	return new Promise((resolve, reject) => {
		//firebase.auth().onAuthStateChanged(function(acc) {
		//	if (acc) {
	//TEST REMOVE//
		var acc = {uid: 'x12rCHG2akWAUqzAdXhF22eyNpf2', data: function(){ return {Email: "Linkkle@gmx.com"} }}
                console.log('autologin...')
				var docRef = context.rootState.accountsRef.doc(acc.uid)
				docRef.get()
					.then(p => {
						if(p.exists){
							var accData = p.data()
							accData["id"] = acc.uid
							context.commit('setAccount', accData)
							context.commit('setAuth', true)
							resolve(null)
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
								resolve(null)
							})
						}
					})
			//}
		//})
		//.catch(e => { console.log("Auth Failed: " + e); context.commit('setError',"Auth Failed: " + e) })		
	})
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
		this.updateFields(context, "accounts", firebase.auth().currentUser.uid, [[field, val]])
			.then(res => {
				context.commit("setAccount", res)
				context.commit('setMsg', 'Saved')
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
				case "sections":
					docRef = context.rootState.sectionsRef.doc(doc)
					obj = context.state.sections.find(function(x, i){ objIndex = i; return x.id == doc; })
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
						throw col.substring(0, col.length - 2) + " does not exist!"
					}
				})
				.catch(e => {console.log(e); reject(null);})
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
					resolve(sections)
				})
		})
	},
	sortSections: (context) => {
		context.commit("sortSections")
	},
	addSection: (context, newSect) => {
		context.dispatch('sortSections')
			.then(() =>{
				var sLength = context.state.sections.length
				var end = context.state.sections.length < 1 
							? 1 : context.state.sections[sLength - 1].Order + 1

				newSect['Account'] = context.state.account.id
				newSect['Order'] = end
				newSect['Height'] = 1
				newSect['Clicks'] = 0

				context.rootState.sectionsRef.add(newSect).then(res =>{
					newSect["id"] = res.id
					context.commit("setSection", sLength,  newSect)
				})
			})
	},
	updateSection: (context, doc, fieldSets) => {
		this.updateFields(context, "sections", doc, fieldSets)
			.then(res => {
				context.commit('setMsg', 'Updated')
				context.commit("sortSections")
			})
	},
	updateSectionOrders: (context, sections) => {
		return new Promise((resolve, reject) => {
			sections.forEach((sect, i) => {
				//update db
				context.dispatch("updateFields", { 'col': "sections", "doc": sect.id, "fieldSets": [['Order', i]] })
					.then(()=>{
						context.dispatch("sortSections").then(()=>{
							resolve(null)
						})
					})
			})
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
