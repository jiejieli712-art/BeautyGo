import { createRouter, createWebHistory } from "vue-router";
import ArtistsView from "../views/ArtistsView.vue";
import DashboardView from "../views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView
    },
    {
      path: "/artists",
      name: "artists",
      component: ArtistsView
    }
  ]
});

export default router;
