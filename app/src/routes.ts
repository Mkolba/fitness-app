import {
  createBrowserRouter,
  createPanel,
  createView,
  RoutesConfig,
} from "@vkontakte/vk-mini-apps-router";

export const routes = RoutesConfig.create([
  createView("login", [
    createPanel("login", "/login", [])
  ]),
  createView("workouts", [
    createPanel("workouts", "/", []),
    createPanel("workout", '/workout/:id', []),
    createPanel('workoutCreate', '/workout/new'),
    createPanel('workoutCreateType', '/workout/newType'),
  ]),
  createView("trainers", [
    createPanel("trainers", "/trainers", []),
    createPanel("trainer", '/trainer/:id', []),
    createPanel('trainerCreate', '/trainer/new')
  ]),
  createView("clients", [
    createPanel("clients", "/clients", []),
    createPanel("client", '/client/:id', []),
    createPanel('clientCreate', '/client/new')
  ]),
  createView('workoutTypes', [
    createPanel('workoutTypes', '/workoutTypes', []),
    createPanel('workoutType', '/workoutType/:id', []),
    createPanel('workoutTypeCreate', '/workoutType/new', []),
  ])
]);

export const router = createBrowserRouter(routes.getRoutes());

export const DEFAULT_VIEW = "workouts";