import { setFormattedDate, defineStatusStyle } from "../../js/app.js";
import { initializeProjectView } from "../controllers/projects.js";

export function renderProject() {
  $.ajax("../backend/project.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      let project
      let projectRows = ""
      if (res.includes("Error") || res.includes("error")) {
        console.warn(res);
        project = principalTableTemplate();
      } else {
        const jsonRes = JSON.parse(res);
        project = principalTableTemplate();
        if (jsonRes.error) {
          console.warn(jsonRes.error)
          alert(jsonRes.error)
        } else {
          jsonRes.forEach(element => {
            projectRows += `<tr>
            <th>${element.id}</th>
            <td>
              <div style = ${defineStatusStyle(element.status)}>
                ${element.status}
              </div>
            </td>
            <td>${element.category}</td>
            <td>${element.responsible}</td>
            <td>${element.customer}</td>
            <td>${setFormattedDate(element.beginDate)}</td>
            <td>
              <i class="far fa-eye mr-lg-3"></i>
              <i class="fas fa-edit"></i>
            </td>
          </tr>`
          });
        }
      }
      document.querySelector(".container-fluid").innerHTML = project;
      if (projectRows) {
        console.log(projectRows);
        document.querySelector("#project-admin-table-body").innerHTML = projectRows;
      }
      initializeProjectView();
    },
    error: function (error) {
      console.warn(error);
      alert(err);
    },
  });
}

export const scheduledProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.id}</th>
          <td>
            <div style = ${defineStatusStyle(project.status)}>
            ${project.status}
            </div>
          </td>
          <td>${project.category}</td>
          <td>${project.responsible}</td>
          <td>${project.customer}</td>
          <td>${setFormattedDate(project.beginDate)}</td>
          <td>
          <i class="far fa-eye mr-lg-3"></i>
          <i class="fas fa-edit"></i>
          </td>
        </tr>
  `
}

export const activeProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.id}</th>
          <td>
            <div style = ${defineStatusStyle(project.status)}>
            ${project.status}
            </div>
          </td>
          <td>${project.category}</td>
          <td>${project.responsible}</td>
          <td>${project.customer}</td>
          <td>${setFormattedDate(project.beginDate)}</td>
          <td>
          <i class="far fa-eye mr-lg-3"></i>
          <i class="fas fa-edit"></i>
          </td>
        </tr>
  `
}

export const delayedProjects_tr = (project) => {
  return `
  <tr>
          <th>${project.id}</th>
          <td>
            <div style = ${defineStatusStyle(project.status)}>
            ${project.status}
            </div>
          </td>
          <td>${project.category}</td>
          <td>${project.responsible}</td>
          <td>${project.customer}</td>
          <td>${setFormattedDate(project.beginDate)}</td>
          <td>
          <i class="far fa-eye mr-lg-3"></i>
          <i class="fas fa-edit"></i>
          </td>
        </tr>
  `
}

const principalTableTemplate = () => {
  return `
 <div id="main-projects-content">
      <div class="header-search" id="header-search-projects">
        <div>        
            <div class="header-div-projects">
            <h2>Proyectos</h2>
            <div class="createProject-div">
            <button class="btn btn-primary" id="btnCreateProjectView">Crear</button>
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
      <table class="workflow-table" id="project-admin-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Estado</th>
            <th scope="col">Tipo</th>
            <th scope="col">Responsable</th>
            <th scope="col">Cliente</th>
            <th scope="col">Fecha Inicio</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="project-admin-table-body">
        </tbody>
  </table>
  </div>
  `
}

export const tableTemplate = (projectType) => {
  return `
  <div id="main-projects-content">
    <div class="header-search" id="header-search-projects">
      <div>
        <h2>Proyectos ${projectType}</h2>
        <div class="multipleSelection">
          <div class="header-div-projects">
            <div class="d-flex w-100">`+
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
    <table class="workflow-table" id="project-admin-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Estado</th>
          <th scope="col">Tipo</th>
          <th scope="col">Responsable</th>
          <th scope="col">Cliente</th>
          <th scope="col">Fecha Inicio</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="project-admin-table-body">



    </tbody>
</table>
</div>
  `
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