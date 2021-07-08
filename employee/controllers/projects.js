import { interactiveTable } from "../../js/app.js"
import { setRoute, setRouteWithValue } from "../../routes/employeeRoutes.js"
import {
  projectDetails,
  productsProjectDetail,
} from "../views/projectDetails.js"
import { render } from "../controllers/activities.js"
import {
  availableProjects_tr,
  activeProjects_tr,
  delayedProjects_tr,
  projectNotFound,
  scheduledProjects_tr,
  tableTemplate,
  availableTable,
} from "../views/projects.js"

export class project {
  constructor() {
    this.asigned = false
  }

  fetchPendingProjects() {
    $.ajax("../backend/project.php", {
      type: "get",
      data: { filterBy: "lastProject_responsible", responsible: 1 },
      success: function (res) {
        const detailData = JSON.parse(res)

        if (detailData.error) {
          console.warn(detailData)
        } else {
          if (localStorage.getItem("project") != detailData.uuid) {
            alert("¡Nuevo proyecto!")
            console.log(detailData)
            localStorage.setItem("project", detailData.uuid)
          } else {
            console.warn("Sin novedades")
          }
        }
      },
      error: function (err) {
        alert(err)
      },
    })
  }

  fetchPendingProjects2() {
    if (this.asigned) {
    } else {
      $.ajax("../backend/project.php", {
        type: "get",
        data: { filterBy: "lastProject_responsible", responsible: 1 },
        success: function (res) {
          const detailData = JSON.parse(res)

          if (detailData.error) {
            console.warn(detailData)
          } else {
            // if(localStorage.getItem('project') == )

            //   let confirmProject = confirm('Nuevo proyecto')
            console.log(detailData)
          }
        },
        error: function (err) {
          alert(err)
        },
      })
    }
  }
}

function getProjectRowId(reference) {
  var currow = $(reference).closest("tr")
  var rowSelected = currow.find(":nth-child(1)")
  return rowSelected[0].children[0].textContent
}

export const initializeProjectView = () => {
  interactiveTable("project-employee-table")

  $("#project-employee-table-body").on("click", ".fa-eye", function () {
    const idProjectSelected = getProjectRowId(this)
    setRouteWithValue("index.php?project_details", idProjectSelected)
  })
}

export const getProjectDataFromDataBase = (projectId) => {
  let productCount = 0
  const responsible = document.getElementById("spanUserId").textContent
  $.ajax("../backend/productsProject.php", {
    type: "get",
    data: {
      filterBy: "id&responsible",
      id: projectId,
      responsible: responsible,
    },
    success: function (res) {
      const detailData = JSON.parse(res)
      if (detailData.error) {
        console.log(detailData.error)
        document.getElementById("content-views").innerHTML = projectNotFound()
      } else {
        document.getElementById("content-views").innerHTML =
          projectDetails(detailData)
        render()
      }
    },
    error: function (err) {
      alert(err)
    },
  })
}

export async function renderScheduledProjects(responsible) {
  const table = tableTemplate("Agendados")
  document.querySelector(".container-fluid").innerHTML = table

  const scheduledProjectsTable = document.querySelector(
    "#project-employee-table tbody"
  )

  const scheduledProjects = await fetchScheduledProductsProject_byResponsible(
    responsible
  )

  if (scheduledProjects.length > 0) {
    scheduledProjects.forEach((element) => {
      scheduledProjectsTable.innerHTML += scheduledProjects_tr(element)
    })
  } else {
    scheduledProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

export async function renderActiveProjects(responsible) {
  const table = tableTemplate("Activos")
  document.querySelector(".container-fluid").innerHTML = table

  const activeProjectsTable = document.querySelector(
    "#project-employee-table tbody"
  )

  const activeProjects = await fetchActiveProductsProject_byResponsible(
    responsible
  )

  if (activeProjects.length > 0) {
    activeProjects.forEach((element) => {
      activeProjectsTable.innerHTML += activeProjects_tr(element)
    })
  } else {
    activeProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

export async function renderAvailableProjects(responsible) {
  const table = availableTable("Disponibles")
  document.querySelector(".container-fluid").innerHTML = table

  const activeProjectsTable = document.querySelector(
    "#project-employee-table tbody"
  )

  const activeProjects = await fetchAvailableProductsProject_byResponsible(
    responsible
  )

  if (activeProjects.length > 0) {
    activeProjects.forEach((element) => {
      activeProjectsTable.innerHTML += availableProjects_tr(element)
    })
  } else {
    activeProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

export async function renderDelayedProjects(responsible) {
  const table = tableTemplate("retrasados")
  document.querySelector(".container-fluid").innerHTML = table

  const delayedProjectsTable = document.querySelector(
    "#project-employee-table tbody"
  )

  const delayedProjects = await fetchDelayedProductsProject_byResponsible(
    responsible
  )

  if (delayedProjects.length > 0) {
    delayedProjects.forEach((element) => {
      delayedProjectsTable.innerHTML += delayedProjects_tr(element)
    })
  } else {
    delayedProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

async function fetchScheduledProductsProject_byResponsible(responsible) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=scheduledDetail_byResponsible&responsible=${responsible}`
  )
  const res = await req.json()
  return res
}

async function fetchAvailableProductsProject_byResponsible() {
  const req = await fetch(`../backend/stage.php?filterBy=available`)
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
