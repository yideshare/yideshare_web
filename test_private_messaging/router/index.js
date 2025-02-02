import Vue from "vue";
import VueRouter from "vue-router";
import UsersPage from "@/pages/UsersPage.vue"; // Users Page component
import MessagesPage from "@/pages/MessagesPage.vue"; // Messages Page component

Vue.use(VueRouter);

const routes = [
  {
    path: "/", // Root URL
    component: UsersPage, // Render the Users Page
  },
  {
    path: "/chat/:userId", // Dynamic route for the Messages Page
    component: MessagesPage, // Render the Messages Page
    props: true, // Pass route params as props
  },
];

const router = new VueRouter({
  mode: "history", // Use clean URLs (no #)
  routes,
});

export default router;