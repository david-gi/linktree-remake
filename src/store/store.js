import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

import user from './modules/user'
import places from './modules/places'

Vue.use(Vuex)

//firebase init
const db = firebase.initializeApp({
	apiKey: "AIzaSyAzTjASmqR-IXxxJ31I7wpOHOVpcHyhkdk",
	authDomain: "glutenous.firebaseapp.com",
	databaseURL: "https://glutenous.firebaseio.com",
	projectId: "glutenous",
	storageBucket: "glutenous.appspot.com",
	messagingSenderId: "670970270718"
}).firestore()

var store = new Vuex.Store({
	state: {
		usersRef: db.collection("users"),
		conditionsRef: db.collection("conditions"),
		placesRef: db.collection("places"),
		placeTypesRef: db.collection("place-types"),
		sponsorsRef: db.collection("sponsors"),
		reportsRef: db.collection("reports"),
		bugsRef: db.collection("bugs"),
		
		auth: false,
		msg: null,
		error: null,
		showProfile: false,
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
		toggleProfile (state) {
		  state.showProfile = !state.showProfile
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
		toggleProfile ({commit}){
			commit("toggleProfile")
		},
	},
	getters:{
		showProfile: state => {
			return state.showProfile
		},
		error: state => {
			return state.error
		},
	},
	modules: {
		user,
		places,
	},
})
export default store