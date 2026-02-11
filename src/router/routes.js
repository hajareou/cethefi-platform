const routes = [
  // Login page (no layout, no sidebar)
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Main app with sidebar layout
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'dashboard', component: () => import('pages/AdminDashboard.vue') },
      { path: 'users', component: () => import('pages/UserManagement.vue') },
    ],
  },

  // Always keep this last
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
