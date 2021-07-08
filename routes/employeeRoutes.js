import { redirectFile } from "../js/app.js"
import { renderProject } from "../employee/views/projects.js"
import {
  getProjectDataFromDataBase,
  renderActiveProjects,
  renderDelayedProjects,
  renderScheduledProjects,
  renderAvailableProjects,
} from "../employee/controllers/projects.js"
import { render } from "../employee/controllers/dashboard.js"

export function router(route, value) {
  const filterRoute = route.split("src/")[1]
  const includesValue = filterRoute.includes("=")
  const routeBeforeEquals = filterRoute.split("=")[0]

  const userId = document.getElementById("spanUserId").textContent

  if (includesValue) {
    const value = filterRoute.split("=")[1]

    if (value != "") {
      switch (routeBeforeEquals) {
        case "employee/index.php?project_details":
          getProjectDataFromDataBase(value)
          break

        default:
          // redirectFile("../views/404.php")
          break
      }
    } else {
      // redirectFile("../views/404.php")
    }
  } else {
    switch (filterRoute) {
      case "employee/index.php":
        render()
        break

      case "employee/index.php?dashboard":
        render()
        break

      case "employee/index.php?projects":
        renderProject(userId)
        break

      case "employee/index.php?availableProjects":
        renderAvailableProjects()
        break

      case "employee/index.php?scheduledProjects":
        renderScheduledProjects(userId)
        break

      case "employee/index.php?activeProjects":
        renderActiveProjects(userId)
        break

      case "employee/index.php?delayedProjects":
        renderDelayedProjects(userId)
        break

      case "employee/index.php?logout":
        redirectFile("../backend/removeSession.php")
        break

      default:
        // redirectFile("../views/404.php")
        break
    }
  }
}

export function setRoute(route) {
  location.href = `${route}`
}

export function setRouteWithValue(route, value) {
  location.href = `${route}=${value}`
}
