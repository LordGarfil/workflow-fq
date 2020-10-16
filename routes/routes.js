import { renderView } from "../admin/controllers/app.js";
import { redirectFile } from "../js/app.js";
import { renderProject } from "../admin/views/projects.js";
import {
  getProjectDataFromDataBase,
  initializeProjectCreation,
} from "../admin/controllers/projects.js";
import {
  renderEditableProjectCreation,
  renderProjectCreation,
} from "../views/createProject.js";

export function router(route, value) {
  const includesValue = route.includes("=");
  switch (includesValue) {
    case false:
      switch (route) {
        case "#dashboard":
          renderView("./views/dashboard.html");
          break;

        case "#projects":
          renderProject();
          break;

        case "#create_project":
          renderProjectCreation().then(() => {
            initializeProjectCreation();
          });
          break;

        case "#logout":
          redirectFile("../backend/removeSession.php");
          break;

        default:
          redirectFile("../views/404.php");
          break;
      }
      break;

    case true:
      const hash = route.split("=")[0];
      const value = route.split("=")[1];

      if (value != "") {
        switch (hash) {
          case "#project_details":
            getProjectDataFromDataBase(value);
            break;

          case "#project_edit":
            renderEditableProjectCreation(value).then(() => {
              initializeProjectCreation();
            });
            break;

          default:
            redirectFile("../views/404.php");
            break;
        }
      } else {
        redirectFile("../views/404.php");
      }

      break;

    default:
      redirectFile("../views/404.php");
      break;
  }
}

export function router2(route, value){
  const filterRoute = route.split("src/")[1]
  console.log(filterRoute);

  switch (filterRoute) {
    case 'admin/index.php':
      console.log('index');
      renderView("./views/dashboard.html")
      break;

      case 'admin/index.php?dashboard':
        renderView("./views/dashboard.html")
      break;

      case 'admin/index.php?projects':
      renderProject();
      break;

      case 'admin/index.php?create_project':
      renderProjectCreation().then(() => {
        initializeProjectCreation();
      })
      break;

      case 'admin/index.php?logout':
      redirectFile("../backend/removeSession.php")
      break;
  
    default:
      redirectFile("../views/404.php")
      break;
  }

}

export function setRoute(route) {
  location.hash = `${route}`;
  // location.href = `${route}`;
}

export function setRouteWithValue(route, value) {
  location.hash = `${route}=${value}`;
}
