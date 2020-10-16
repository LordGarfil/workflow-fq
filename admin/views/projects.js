import {setFormattedDate} from "../../js/app.js"
import {initializeProjectView} from "../controllers/projects.js"

export function renderProject(){
    const sqlProjectRows = `
    SELECT proyectos.id, estados_proyecto.estado, categorias_proyecto.categoria, usuarios.usuario, personas.nombres, personas.apellidos, proyectos.fecha_inicio
        FROM proyectos, categorias_proyecto, personas, usuarios, estados_proyecto where
        estados_proyecto.id = proyectos.fk_estado_proyecto AND
        categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
        usuarios.id = proyectos.fk_responsable AND
        personas.numero_documento = proyectos.fk_cliente ORDER BY proyectos.id ASC
    `
    $.ajax("../backend/fecthBd.php", {
        type: "get",
        data: { type: 2, sql: sqlProjectRows},
        success: function(res){ 
            let project = `
    <div id="main-projects-content">
    <div class="header-search" id="header-search-projects">
      <div>
        <h2>Proyectos</h2>
        <div class="multipleSelection">
          <div class="header-div-projects">
            <div class="d-flex w-100">
              <div class="form-control selectBox" id="selectBox">
                Filtros <i class="fas fa-sort-down"></i>
              </div>
              <i
                class="fas fa-filter align-self-center ml-3"
                id="filterButton"
              ></i>
            </div>
  
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
    `
    let projectRows = ''
    
          const detailData = JSON.parse(res)
          detailData.forEach(element => {
            projectRows = `
            <tr>
          <th>${element.id}</th>
          <td>${element.estado}</td>
          <td>${element.categoria}</td>
          <td>${element.usuario}</td>
          <td>${element.nombres} ${element.apellidos}</td>
          <td>${setFormattedDate(element.fecha_inicio)}</td>
          <td>
            <i class="far fa-eye mr-lg-3"></i>
            <i class="fas fa-edit"></i>
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
       
          document.querySelector(".container-fluid").innerHTML = project
          initializeProjectView()
    
        },
        error: function (){
          
        }
        })
}

