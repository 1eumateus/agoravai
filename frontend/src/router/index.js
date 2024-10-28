import { createWebHistory, createRouter } from 'vue-router'
import { checkToken } from "../stores/checkToken";

const routes = [
  {
    path: '/ui/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/ui/',
    name: "Home",
    component: () => import('../views/Home.vue')
  },
  {
    path: '/ui/login',
    name: "Login",
    component: () => import('../views/Login.vue')
  },
  {
    path: '/ui/redefinir/:id',
    name: "Redefinir",
    component: () => import('../views/Usuarios/redefinir.vue')
  },
  {
    path: '/ui/perfil',
    name: "Perfil",
    component: () => import('../views/Perfil/index.vue'),
    meta: {
      breadcrumb: [{ name: "Perfil", href: "ui/perfil", current: true }],
    },
  },
  {
    path: '/ui/usuarios',
    name: "Usuarios",
    component: () => import('../views/Usuarios/index.vue'),
    meta: {
      breadcrumb: [{ name: "Usuários", href: "ui/usuarios", current: true }],
    },
  },
  {
    path: '/ui/professor/:id',
    name: "Professor",
    component: () => import('../views/Professor/index.vue'),
    meta: {
      breadcrumb: [ { name: "Perfil professor", href: "ui/professor/:id", current: true }],
    },
  },
  {
    path: '/ui/orientacao/:id',
    name: "Orientacao",
    component: () => import('../views/Orientacao/index.vue'),
    meta: {
      breadcrumb: [
          { name: "Perfil", href: "/ui/perfil", current: false },
          { name: "Orientação", href: "/ui/orientacao/:id", current: true }
      ],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let confirmandoEmail = to.query?.user || null;

  const res = await checkToken(confirmandoEmail);

  if (confirmandoEmail) {
    next({ path: to.path, query: {} }); 
    return; 
  }

  const tokenValido = res.valid;
  const userType = res.tipo;

  if (to.name === 'Redefinir') {
    next();
  }
  else  if (to.name !== "Login" && !tokenValido) {
    next({ name: "Login" });
  }
  else if (tokenValido && to.name === "Login") {
    next({ name: "Home" });
  }
  else if (tokenValido && userType !== 'admin') {
    let routesForUser = [
      'Home',
      'Perfil',
      'Professor',
      'Orientacao',
      'NotFound',
    ];
    if (routesForUser.includes(to.name)) {
      next();
    } else {
      next({ name: "NotFound" });
    }
  }
  else {
    next();
  }
});

export default router;