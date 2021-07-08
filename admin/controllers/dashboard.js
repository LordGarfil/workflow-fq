import { renderView } from "../../js/app.js"
import { setRouteWithValue } from "../../routes/adminRoutes.js"
import {
  activeProjects_tr,
  activeProjects_empty,
  delayedProjects_tr,
  delayedProjects_empty,
} from "../views/dashboard.js"

export function render() {
  renderView("./views/dashboard.html").then(() => {
    fetchProjectsResume()
  })
}

function listenToActiveProjects_table() {
  document
    .querySelectorAll("#activeProjects_admin tbody tr")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        const parent = e.target.parentElement
        const projectDetailId =
          parent.querySelector("td[name=projectNo]").textContent
        setRouteWithValue("index.php?project_details", projectDetailId)
      })
    })
}

function listenToDelayedProjects_table() {
  document
    .querySelectorAll("#delayedProjects_admin tbody tr")
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        const parent = e.target.parentElement
        const projectDetailId =
          parent.querySelector("td[name=projectNo]").textContent
        setRouteWithValue("index.php?project_details", projectDetailId)
      })
    })
}

async function fetchProjectsResume() {
  const responsible = document.querySelector("#spanUserId").textContent

  const activeProjects_count = await allActiveProjects_count()
  document.querySelector("div[name=activeProjects_text]").textContent =
    activeProjects_count

  const delayedProjects_count = await allDelayedProjects_count()
  document.querySelector("div[name=delayedProjects_text]").textContent =
    delayedProjects_count

  const canceledProjects_count = await allCanceledProjects_count()
  document.querySelector("div[name=canceledProjects_text]").textContent =
    canceledProjects_count

  const scheduledProjects_count = await allScheduledProjects_count()
  document.querySelector("div[name=scheduledProjects_text]").textContent =
    scheduledProjects_count

  renderActiveProductsProject()
  renderDelayedProductsProject()
}

async function renderActiveProductsProject() {
  const responsible = document.querySelector("#spanUserId").textContent
  const activeProductProject_details = await fetchAllActiveProjects(responsible)

  if (activeProductProject_details.length > 0) {
    for (let i = 0; i < activeProductProject_details.length; i++) {
      if (i < 10) {
        document.querySelector("#activeProjects_admin tbody").innerHTML +=
          activeProjects_tr(activeProductProject_details[i])
      }
    }

    listenToActiveProjects_table()
  } else {
    document.querySelector("#activeProjects_admin_div").innerHTML =
      activeProjects_empty()
  }
}

async function renderDelayedProductsProject() {
  const responsible = document.querySelector("#spanUserId").textContent
  const delayedProductProject_details = await fetchAllDelayedProjects(
    responsible
  )

  if (delayedProductProject_details.length > 0) {
    for (let i = 0; i < delayedProductProject_details.length; i++) {
      if (i < 10) {
        document.querySelector("#delayedProjects_admin tbody").innerHTML +=
          delayedProjects_tr(delayedProductProject_details[i])
      }
    }

    listenToDelayedProjects_table()
  } else {
    document.querySelector("#delayedProjects_admin_div").innerHTML =
      delayedProjects_empty()
  }
}

async function allScheduledProjects_count() {
  const req = await fetch(`../backend/project.php?filterBy=count_allScheduled`)
  const res = await req.json()
  return res
}

async function allActiveProjects_count() {
  const req = await fetch(`../backend/project.php?filterBy=count_allActive`)
  const res = await req.json()
  return res
}

async function allDelayedProjects_count() {
  const req = await fetch(`../backend/project.php?filterBy=count_allDelayed`)
  const res = await req.json()
  return res
}

async function allCanceledProjects_count() {
  const req = await fetch(`../backend/project.php?filterBy=count_allCanceled`)
  const res = await req.json()
  return res
}

async function scheduledProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_scheduledByResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function activeProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_activeByResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function delayedProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_delayedByResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function canceledProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_canceledByResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function reprocessingProjectsByResponsible(responsible) {
  const req = await fetch(
    `../backend/project.php?filterBy=count_reprocessingByResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function fetchAllActiveProjects() {
  const req = await fetch(`../backend/project.php?filterBy=allActive`)
  const res = await req.json()
  return res
}

async function fetchAllDelayedProjects() {
  const req = await fetch(`../backend/project.php?filterBy=allDelayed`)
  const res = await req.json()
  return res
}

async function fetchActiveProductsProject_byResponsible(responsible) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=activeDetail_byResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function fetchDelayedProductsProject_byResponsible(responsible) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=delayedDetail_byResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}
