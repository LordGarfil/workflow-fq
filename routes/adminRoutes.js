import { redirectFile, renderView } from "../js/app.js";
import { renderProject } from "../admin/views/projects.js";
import {
  getProjectDataFromDataBase,
  initializeProjectCreation,
  initializeProjectEdition, renderActiveProjects, renderDelayedProjects, renderScheduledProjects
} from "../admin/controllers/projects.js";
import { renderProjectCreation } from "../admin/views/createProject.js";
import { renderEditableProjectCreation } from "../admin/views/updateProject.js";
import { render } from "../admin/controllers/dashboard.js";


export function router(route, value) {
  const filterRoute = route.split("src/")[1];
  const includesValue = filterRoute.includes("=");
  const routeBeforeEquals = filterRoute.split("=")[0];

  if (includesValue) {
    const value = filterRoute.split("=")[1];

    if (value != "") {
      switch (routeBeforeEquals) {
        case "admin/index.php?project_details":
          getProjectDataFromDataBase(value);
          break;

        case "admin/index.php?project_edit":
          renderEditableProjectCreation(value).then(() => {
            initializeProjectEdition();
          });
          break;

        default:
          redirectFile("../views/404.php");
          break;
      }
    } else {
      redirectFile("../views/404.php");
    }
  } else {
    switch (filterRoute) {
      case "admin/index.php":
        render()
        break;

      case "admin/index.php?dashboard":
        render()
        break;

      case "admin/index.php?projects":
        renderProject();
        break;

        case "admin/index.php?scheduledProjects":
          renderScheduledProjects()
          break;
  
        case "admin/index.php?activeProjects":
          renderActiveProjects()
          break;
  
        case "admin/index.php?delayedProjects":
          renderDelayedProjects()   
          break;

      case "admin/index.php?create_project":
        renderProjectCreation().then(() => {
          initializeProjectCreation();
        });
        break;

      case "admin/index.php?logout":
        redirectFile("../backend/removeSession.php");
        break;

      default:
        redirectFile("../views/404.php");
        break;
    }
  }
}

export function setRoute(route) {
  location.href = `${route}`;
}

export function setRouteWithValue(route, value) {
  location.href = `${route}=${value}`;
}
