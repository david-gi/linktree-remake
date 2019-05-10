import Auth from './components/Auth.vue'
import Public from './components/Public.vue'
import Profile from './components/Profile.vue'
import W404 from './components/404.vue'

export const routes = [
	{ path: '/', component: Auth },
	{ path: '/login', component: Auth },
	{ path: '/in', component: Auth, props: (x) => { return { code: x.query.code } } },
	{ path: '/edit', component: Profile },
	{ path: '/not-found', component: W404 },
	{ path: '/:id', component: Public },
	{ path: '*', component: W404 },
]
