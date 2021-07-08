import { renderView } from "../../js/app.js";
import { setRouteWithValue } from "../../routes/employeeRoutes.js";
import {
  activeProductsProject_tr,
  activeProductsProject_empty,
  delayedProductsProject_tr,
  delayedProductsProject_empty
} from "../views/dashboard.js";

export function render() {
  renderView("./views/dashboard.html").then(() => {
    fetchProjectsResume();
    // fetchChanges()
  });
}

function listenToActiveProducts_table() {
  document
    .querySelectorAll("#activeProjects_employee tbody tr")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        const projectDetailId =
          parent.querySelector("td[name=projectNo]").children[0].textContent;
        setRouteWithValue("index.php?project_details", projectDetailId);
      });
    });
}

function listenToDelayedProducts_table() {
  document
    .querySelectorAll("#delayedProjects_employee tbody tr")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        const parent = e.target.parentElement;
        const projectDetailId =
          parent.querySelector("td[name=projectNo]").children[0].textContent;
        setRouteWithValue("index.php?project_details", projectDetailId);
      });
    });
}

async function fetchProjectsResume() {
  const responsible = document.querySelector("#spanUserId").textContent;

  const activeProjects_count = await activeProjectsByResponsible(responsible);
  document.querySelector("div[name=activeProjects_text]").textContent =
    activeProjects_count;

  const delayedProjects_count = await delayedProjectsByResponsible(responsible);
  document.querySelector("div[name=delayedProjects_text]").textContent =
    delayedProjects_count;

  const canceledProjects_count = await canceledProjectsByResponsible(
    responsible
  );
  document.querySelector("div[name=canceledProjects_text]").textContent =
    canceledProjects_count;

  const scheduledProjects_count = await scheduledProjectsByResponsible(
    responsible
  );
  document.querySelector("div[name=scheduledProjects_text]").textContent =
  scheduledProjects_count;

  renderActiveProductsProject();
  renderDelayedProductsProject();
}

async function renderActiveProductsProject() {
  const responsible = document.querySelector("#spanUserId").textContent;
  const activeProductProject_details =
    await fetchActiveProductsProject_byResponsible(responsible);

  if (activeProductProject_details.length > 0) {
    for (let i = 0; i < activeProductProject_details.length; i++) {
      if (i < 10) {
        document.querySelector("#activeProjects_employee tbody").innerHTML +=
          activeProductsProject_tr(activeProductProject_details[i]);
      }
    }

    listenToActiveProducts_table();
  } else {
    document.querySelector("#activeProjects_employee_div").innerHTML =
      activeProductsProject_empty();
  }
}

async function renderDelayedProductsProject() {
  const responsible = document.querySelector("#spanUserId").textContent;
  const delayedProductProject_details =
    await fetchDelayedProductsProject_byResponsible(responsible);

  if (delayedProductProject_details.length > 0) {
    for (let i = 0; i < delayedProductProject_details.length; i++) {
      if (i < 10) {
        document.querySelector("#delayedProjects_employee tbody").innerHTML +=
          delayedProductsProject_tr(delayedProductProject_details[i]);
      }
    }

    listenToDelayedProducts_table();
  } else {
    document.querySelector("#delayedProjects_employee_div").innerHTML = delayedProductsProject_empty();
  }
}

async function scheduledProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_scheduledByResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function activeProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_activeByResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function delayedProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_delayedByResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function canceledProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_canceledByResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function reprocessingProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_reprocessingByResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function fetchActiveProductsProject_byResponsible(responsible) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=activeDetail_byResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}

async function fetchDelayedProductsProject_byResponsible(responsible) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=delayedDetail_byResponsible&responsible=${responsible}`
  );
  const res = await req.json();
  return res;
}
