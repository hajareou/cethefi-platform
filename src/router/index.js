import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, _from, next) => {
    const publicPaths = ['/login', '/auth/callback']
    const token = localStorage.getItem('authToken')
    const rawSession = localStorage.getItem('authSession')

    let hasValidSession = false
    let isGuestSession = false
    let permissions = []
    if (token && rawSession) {
      try {
        const parsed = JSON.parse(rawSession)
        hasValidSession = Boolean(parsed && (parsed.user || parsed.type))
        isGuestSession = Boolean(parsed && (parsed.type === 'guest' || parsed?.user?.role === 'guest'))
        permissions = Array.isArray(parsed?.permissions) ? parsed.permissions : []
      } catch {
        hasValidSession = false
        isGuestSession = false
        permissions = []
      }
    }

    const hasPermission = (permission) =>
      permissions.includes('*') || permissions.includes(permission)

    if (!publicPaths.includes(to.path) && !hasValidSession) return next('/login')
    if (to.path === '/users' && !hasPermission('users:manage')) return next('/dashboard')
    if (to.path === '/login' && hasValidSession && !isGuestSession) return next('/dashboard')
    next()
  })

  return Router
})
