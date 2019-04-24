import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

import core from './modules/core'

Vue.use(Vuex)

//firebase init
const db = firebase.initializeApp({
	apiKey: "AIzaSyAE1GxiOyfhik0o5Y6eNny0efrLiZbuguk",
	authDomain: "linkkle.firebaseapp.com",
	databaseURL: "https://linkkle.firebaseio.com",
	projectId: "linkkle",
	storageBucket: "linkkle.appspot.com",
	messagingSenderId: "972094059119"
}).firestore()

var store = new Vuex.Store({
	state: {
		accountsRef: db.collection("accounts"),
		sectionsRef: db.collection("sections"),
		bugsRef: db.collection("bugs"),
		
		auth: false,
		msg: null,
		error: null,
		loading: false
	},
	mutations: {
		setAuth (state, x) {
		  state.auth = x
		},
		setMsg (state, x) {
		  state.msg = x
		  setTimeout(() => {
			state.msg = null
		  }, 3000);
		},
		setError (state, x) {
		  state.error = x
		  setTimeout(() => {
			state.error = null
		  }, 8000);
		},
		setLoading (state, x) {
		  state.loading = x
		},
	},
	actions: {
		setAuth ({commit}, x){
			commit("setAuth", x)
		},
		setMsg ({commit}, x){
			commit("setMsg", x)
		},
		errorMsg ({commit}, x){
			commit("setError", x)
		},
		loading1 ({commit}){
			commit("setLoading", true)
		},
		loading0 ({commit}){
			commit("setLoading", false)
		},
	},
	getters:{
	},
	modules: {
		core
	},
})
export default store