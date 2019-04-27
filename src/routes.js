import Auth from './components/Auth.vue'
import Public from './components/Public.vue'
import Profile from './components/Profile.vue'
import W404 from './components/404.vue'

export const routes = [
	{ path: '/login', component: Auth },
	{ path: '/edit', component: Profile },
	{ path: '/:id', component: Public },
	{ path: '*', component: W404 },
]
