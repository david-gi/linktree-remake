import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Sortable from 'vue-sortable'

import App from './App.vue'
import { routes } from './routes'
import store from './store/store'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Sortable)

const router = new VueRouter({ routes: routes })

Vue.config.errorHandler = function (err, vm, info) {
	console.log("Global Handler: "+err + " | " + info)
  }

window.app = new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
