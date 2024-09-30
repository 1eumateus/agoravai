import { createWebHistory, createRouter } from 'vue-router'
import { checkToken } from "../stores/checkToken";

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/',
    name: "Home",
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: "Login",
    component: () => import('../views/Login.vue')
  },

  {
    path: '/perfil',
    name: "Perfil",
    component: () => import('../views/Perfil/index.vue'),
    meta: {
      breadcrumb: [{ name: "Perfil", href: "/perfil", current: true }],
    },
  },

  {
    path: '/usuarios',
    name: "Usuarios",
    component: () => import('../views/Usuarios/index.vue'),
    meta: {
      breadcrumb: [{ name: "Usuários", href: "/usuarios", current: true }],
    },
  },

  {
    path: '/professor/:id',
    name: "Professor",
    component: () => import('../views/Professor/index.vue'),
    meta: {
      breadcrumb: [ { name: "Perfil professor", href: "/professor/:id", current: true }],
    },
  },

  {
    path: '/orientacao/:id',
    name: "Orientacao",
    component: () => import('../views/Orientacao/index.vue'),
    meta: {
      breadcrumb: [
          { name: "Perfil", href: "/perfil", current: false },
          { name: "Orientação", href: "/orientacao/:id", current: true }
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

  if (to.name !== "Login" && !tokenValido) {
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