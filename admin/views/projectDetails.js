import {setFormattedDateTime, setFormattedDate} from "../../js/app.js"

export function projectDetails({
  projectNo, uuid, category, customer, responsible, observations, beginDate, finishDate, status, creationDate 
}){

  beginDate = setFormattedDateTime(beginDate)
  finishDate = setFormattedDateTime(finishDate)
  creationDate = setFormattedDate(creationDate)
    
  return `
  <div class="project-detailBody">
    <div class="project-detailHeader">
      <span>${creationDate}</span>
    </div>
    <div class="project-detailHeadingInfo">
      <div class="headingTitle">
      <div>
          <h5></span><strong>${uuid.toUpperCase()}</strong></h5>
        </div>
        <div class="alert alert-primary" role="alert">${status}</div>
      </div>
      <div class="headingBody">
      <div class="row px-md-5">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Facturado a:</strong></span>
          </div>
          <div class="col-lg-3">
            <span>${customer}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Creado por:</strong></span>
          </div>
          <div class="col-lg-3">
            <span>${responsible}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Categoria:</strong></span>
          </div>
          <div class="col-lg-3">
            <span>${category}</span>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row heading-items">
            <span><strong>Proyecto No:</strong></span>
            <span>${projectNo}</span>
        </div>
        <div class="row heading-items">
            <span><strong>Fecha Inicio:</strong></span>
            <span>${beginDate}</span>
        </div>
        <div class="row heading-items">
            <span><strong>Fecha Fin:</strong></span>
            <span>${finishDate}</span>
        </div>
      </div>
    </div>
        <div class="row px-md-5 py-md-3">
        <div class="col-lg-12">
        <span><strong>Observaciones:</strong></span>
        <span>${observations}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="project-popUpBody"></div>
  </div>
  <hr>
  <div class="overflow-auto">
  <table class="workflow-table project-creation-table">
        <thead class="text-center">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
            <th scope="col">Responsable</th>
          </tr>
        </thead>
        <tbody id="project-detail-table-body">
        </tbody>
      </table>
      </div>
  `
}

export function productsProjectDetail({
  name, quantity, installable, address, instructions, responsible
}, productCount){
  return `
  <tr class="project-creation-table">
            <th>${productCount}</th>
            <td>
              <span>${name}</span>
            </td>
            <td>
            <span>${quantity}</span>
            </td>
            <td>
            <span>${installable}</span>
            </td>
            <td>
            <span>${address}</span>
            </td>
            <td>
            <span>${instructions}</span>
            </td>            
            <td>
            <span>${responsible}</span>
            </td>            
          </tr>
  `
}

