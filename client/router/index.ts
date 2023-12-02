import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import FeedView from "../views/FeedView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import NotificationView from "../views/NotificationView.vue";
import PeopleView from "../views/PeopleView.vue";
import ScreenTimeView from "../views/ScreenTimeView.vue";
import SettingView from "../views/SettingView.vue";



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/notifications",
      name: "Notifications",
      component: NotificationView,
      meta: { requiresAuth: true },
    },
    {
      path: "/people",
      name: "People",
      component: PeopleView,
      meta: { requiresAuth: true },
    },
    {
      path: "/feed",
      name: "Feed",
      component: FeedView,
      meta: { requiresAuth: true },
    },
    {
      path: "/screenTime",
      name: "ScreenTime",
      component: ScreenTimeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
