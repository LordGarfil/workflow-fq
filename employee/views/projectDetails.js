import { setFormattedDateTime, setFormattedDate } from "../../js/app.js";

export const projectDetails = (product) => {
  product.fecha_inicio = setFormattedDate(product.fecha_inicio);
  if (product.fecha_finalizacion) {
    product.fecha_finalizacion = setFormattedDate(product.fecha_finalizacion);
  } else {
    product.fecha_finalizacion = "No asignada";
  }

  return `
  <div class="project-detailBody">
    <div class="project-detailHeader">
      <span>${product.fecha_inicio}</span>
    </div>
    <div class="project-detailHeadingInfo">
      <div class="headingTitle">
      <div>
          <h5></span><strong>${product.descripcion.toUpperCase()} | ${
    product.cantidad
  } |</strong></h5>
  <span name="productId" hidden>${product.productoId}</span>
        </div>
        <div class="alert alert-primary" role="alert">${product.estado}</div>
      </div>
      <div class="headingBody">
      <div class="row px-md-3">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Proyecto No:</strong></span>
          </div>
          <div class="col-lg-3">
            <span name="projectNo">${product.proyecto}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Instalable:</strong></span>
          </div>
          <div class="col-lg-3">
            <span>${product.instalable}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Dirección:</strong></span>
          </div>
          <div class="col-lg-3">
            <span>${product.direccion} </span>
          </div>
        </div>
      </div>
      <div class="col-6">
      <div class="row">
      <div class="col-lg-3">
        <span><strong>Etapa :</strong></span>
      </div>
      <div class="col">
        <span>${product.etapa}</span>
        <span name="stageId" hidden>${product.etapaId}</span>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-3">
        <span><strong>Fecha Inicio:</strong></span>
      </div>
      <div class="col">
        <span>${product.fecha_inicio}</span>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-3">
        <span><strong>Fecha Fin:</strong></span>
      </div>
      <div class="col">
        <span>${product.fecha_finalizacion}</span>
      </div>
    </div>
      </div>
    </div>
        <div class="row px-md-3 py-md-3">
        <div class="col-lg-12">
        <span><strong>Instrucciones:</strong></span>
        <span>${product.instrucciones}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="project-popUpBody"></div>
  </div>
  <hr>
  <div class="overflow-auto">
  <div class="d-flex" style="justify-content: flex-end;">
      <button name="btnAddNewActivity" class="btn btn-primary position-sticky">Agregar Actividad</button>
    </div>
  
    <div id="activities-container" class="list-filter">

        
    </div>
  </div>
  `;
};

export function productsProjectDetail(props) {
  return `
  <tr class="project-creation-table">
            <th>${props.fecha}</th>
            <td>
            <img src=${props.imagen}></img>
            </td>
            <td>        
            <span><i name="edit_activity" class="fas fa-edit"></i></span>
            </td>   
          </tr>
  `;
}
