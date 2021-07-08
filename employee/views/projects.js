import { setFormattedDate, defineStatusStyle } from "../../js/app.js"
import { initializeProjectView } from "../controllers/projects.js"

export function renderProject(id) {
  $.ajax("../backend/productsProject.php", {
    type: "get",
    data: {
      filterBy: "responsible",
      responsible: id,
    },
    success: function (res) {
      const jsonRes = JSON.parse(res)
      let project =
        `
    <div id="main-projects-content">
    <div class="header-search" id="header-search-projects">
      <div>
        <h2>Proyectos</h2>
        <div class="multipleSelection">
          <div class="header-div-projects">
            <div class="d-flex w-100">` +
        `</div>
  
            <div>
              
            </div>
          </div>
  
          <div id="checkBoxes" >
            <label for="clientFilterSelect">
              <input type="checkbox" id="clientFilterSelect" />
              Cliente
            </label>
  
            <label for="responsibleFilterSelect">
              <input type="checkbox" id="responsibleFilterSelect" />
              Responsable
            </label>
            <label for="beginDateFilterSelect">
              <input type="checkbox" id="beginDateFilterSelect" />
              Fecha Inicio
            </label>
            <label for="finishDateFilterSelect">
              <input type="checkbox" id="finishDateFilterSelect" />
              Fecha Fin
            </label>
          </div>
        </div>
      </div>
      <div class="header-search-items">
        <input
          id="txtClientFilter"
          type="text"
          placeholder="Clientes"
          class="form-control"
        />
        <input
          type="text"
          id="txtResponsibleFilter"
          placeholder="Responsable"
          class="form-control"
        />
        <input
          placeholder="Fecha Inicio"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateBeginFilter"
        />
        <input
          placeholder="Fecha Fin"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateFinishFilter"
        />
      </div>
    </div>
  </div>
  <div class="overflow-auto">
    <table class="workflow-table" id="project-employee-table">
      <thead>
        <tr>
          <th scope="col">Proyecto</th>
          <th scope="col">Item</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Instalable</th>
          <th scope="col">Estado</th>
          <th scope="col">Fecha Asignacion</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="project-employee-table-body">
    `

      if (jsonRes.error) {
        project += `
      </tbody>
</table>
</div>
      `
      } else {
        let projectRows = ""

        jsonRes.forEach((element) => {
          projectRows = `
            <tr>
          <th>${element.proyecto} <span hidden>${element.id}</span> </th>
          <td>${element.descripcion}</td>
          <td>${element.cantidad}</td>
          <td>${element.instalable}</td>
          <td>
            <div style = ${defineStatusStyle(element.estado)}>
            ${element.estado}
            </div>
          </td>
          <td>${setFormattedDate(element.fecha_inicio)}</td>
          <td>
            <i class="far fa-eye mr-lg-3"></i>
          </td>
        </tr>
            `
          project += projectRows
        })
        project += `
          </tbody>
    </table>
  </div>
          `
      }
      document.querySelector(".container-fluid").innerHTML = project
      initializeProjectView()
    },
    error: function () {},
  })
}

export const scheduledProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.proyecto} <span hidden>${project.id}</span> </th>
          <td>${project.producto}</td>
          <td>${project.cantidad}</td>
          <td>${project.instalable}</td>
          <td>
            <div style = ${defineStatusStyle(project.estado)}>
            ${project.estado}
            </div>
          </td>
          <td>${setFormattedDate(project.fecha_inicio)}</td>
          <td>
            <i class="far fa-eye mr-lg-3"></i>
          </td>
        </tr>
  `
}

export const availableProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.proyecto} <span hidden>${project.id}</span> </th>
          <td>${project.producto}</td>
          <td>${project.cantidad}</td>
          <td>${project.instalable}</td>
         
          <td>${setFormattedDate(project.fecha_inicio)}</td>
          <td style="font-size: 25px;">
            <i title="Tomar" class="fas fa-check-circle mr-2 aprove"></i>
            <i title="Rechazar" class="fas fa-times-circle reject" style="color:#e02b2b"></i>
          </td>
        </tr>
  `
}

export const activeProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.proyecto} <span hidden>${project.id}</span> </th>
          <td>${project.producto}</td>
          <td>${project.cantidad}</td>
          <td>${project.instalable}</td>
          <td>
            <div style = ${defineStatusStyle(project.estado)}>
            ${project.estado}
            </div>
          </td>
          <td>${setFormattedDate(project.fecha_inicio)}</td>
          <td>
            <i class="far fa-eye mr-lg-3"></i>
          </td>
        </tr>
  `
}

export const delayedProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.proyecto} <span hidden>${project.id}</span> </th>
          <td>${project.producto}</td>
          <td>${project.cantidad}</td>
          <td>${project.instalable}</td>
          <td>
            <div style = ${defineStatusStyle(project.estado)}>
            ${project.estado}
            </div>
          </td>
          <td>${setFormattedDate(project.fecha_inicio)}</td>
          <td>
            <i class="far fa-eye mr-lg-3"></i>
          </td>
        </tr>
  `
}

export const tableTemplate = (projectType) => {
  return (
    `
  <div id="main-projects-content">
    <div class="header-search" id="header-search-projects">
      <div>
        <h2>Proyectos ${projectType}</h2>
        <div class="multipleSelection">
          <div class="header-div-projects">
            <div class="d-flex w-100">` +
    `</div>
  
            <div>
              
            </div>
          </div>
  
          <div id="checkBoxes" >
            <label for="clientFilterSelect">
              <input type="checkbox" id="clientFilterSelect" />
              Cliente
            </label>
  
            <label for="responsibleFilterSelect">
              <input type="checkbox" id="responsibleFilterSelect" />
              Responsable
            </label>
            <label for="beginDateFilterSelect">
              <input type="checkbox" id="beginDateFilterSelect" />
              Fecha Inicio
            </label>
            <label for="finishDateFilterSelect">
              <input type="checkbox" id="finishDateFilterSelect" />
              Fecha Fin
            </label>
          </div>
        </div>
      </div>
      <div class="header-search-items">
        <input
          id="txtClientFilter"
          type="text"
          placeholder="Clientes"
          class="form-control"
        />
        <input
          type="text"
          id="txtResponsibleFilter"
          placeholder="Responsable"
          class="form-control"
        />
        <input
          placeholder="Fecha Inicio"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateBeginFilter"
        />
        <input
          placeholder="Fecha Fin"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateFinishFilter"
        />
      </div>
    </div>
  </div>
  <div class="overflow-auto">
    <table class="workflow-table" id="project-employee-table">
      <thead>
        <tr>
          <th scope="col">Proyecto</th>
          <th scope="col">Item</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Instalable</th>
          <th scope="col">Estado</th>
          <th scope="col">Fecha Asignacion</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="project-employee-table-body">



    </tbody>
</table>
</div>
  `
  )
}

export const availableTable = (projectType) => {
  return (
    `
  <div id="main-projects-content">
    <div class="header-search" id="header-search-projects">
      <div>
        <h2>Proyectos ${projectType}</h2>
        <div class="multipleSelection">
          <div class="header-div-projects">
            <div class="d-flex w-100">` +
    `</div>
  
            <div>
              
            </div>
          </div>
  
          <div id="checkBoxes" >
            <label for="clientFilterSelect">
              <input type="checkbox" id="clientFilterSelect" />
              Cliente
            </label>
  
            <label for="responsibleFilterSelect">
              <input type="checkbox" id="responsibleFilterSelect" />
              Responsable
            </label>
            <label for="beginDateFilterSelect">
              <input type="checkbox" id="beginDateFilterSelect" />
              Fecha Inicio
            </label>
            <label for="finishDateFilterSelect">
              <input type="checkbox" id="finishDateFilterSelect" />
              Fecha Fin
            </label>
          </div>
        </div>
      </div>
      <div class="header-search-items">
        <input
          id="txtClientFilter"
          type="text"
          placeholder="Clientes"
          class="form-control"
        />
        <input
          type="text"
          id="txtResponsibleFilter"
          placeholder="Responsable"
          class="form-control"
        />
        <input
          placeholder="Fecha Inicio"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateBeginFilter"
        />
        <input
          placeholder="Fecha Fin"
          class="form-control type-date"
          type="text"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
          id="dateFinishFilter"
        />
      </div>
    </div>
  </div>
  <div class="overflow-auto">
    <table class="workflow-table" id="project-employee-table">
      <thead>
        <tr>
          <th scope="col">Proyecto</th>
          <th scope="col">Item</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Instalable</th>
          <th scope="col">Fecha Asignacion</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="project-employee-table-body">



    </tbody>
</table>
</div>
  `
  )
}

export function projectNotFound() {
  return `
  <div style="
  display: flex;
  justify-content: space-between;
  align-items: center;
">
  <span>Proyecto no encontrado</span>
  <a href="./index.php?projects" class="btn btn-primary">Volver</a>
</div>
<div class="activities_empty">
  <img style="
  width: 250px;
" src="../static/img/add_tasks.svg" alt="">
</div>
  `
}
