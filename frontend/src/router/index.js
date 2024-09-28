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
    component: () => import('../views/Perfil/index.vue')
  },

  {
    path: '/usuarios',
    name: "Usuarios",
    component: () => import('../views/Usuarios/index.vue')
  },

  {
    path: '/professor/:id',
    name: "Professor",
    component: () => import('../views/Professor/index.vue')
  },

  {
    path: '/orientacao/:id',
    name: "Orientacao",
    component: () => import('../views/Orientacao/index.vue')
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let confirmandoEmail = to.query?.token || null;

  const res = await checkToken(confirmandoEmail);

  if(confirmandoEmail && !res.valid){
    next({path: to.path});
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