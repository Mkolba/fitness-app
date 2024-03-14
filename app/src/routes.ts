import {
  createBrowserRouter,
  createPanel,
  createView,
  RoutesConfig,
} from "@vkontakte/vk-mini-apps-router";

export const routes = RoutesConfig.create([
  createView("login", [
    createPanel("login", "/login", []),
    createPanel("register", "/register", [])
  ]),
  createView("chat", [
    createPanel("main", "/", []),
    createPanel("dialog", '/dialog/:id', [])
  ]),
  createView("profile", [
    createPanel("profile", "/profile", [])
  ])
]);

export const router = createBrowserRouter(routes.getRoutes());

export const DEFAULT_VIEW = "chat";