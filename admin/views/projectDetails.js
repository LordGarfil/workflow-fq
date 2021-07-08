import {
  setFormattedDateTime,
  setFormattedDate,
  setFormattedShortDate,
} from "../../js/app.js";

export function projectDetails({
  projectNo,
  uuid,
  category,
  customer,
  responsible,
  value,
  paidValue,
  observations,
  beginDate,
  finishDate,
  status,
  paymentStatus,
  creationDate,
}) {
  beginDate = setFormattedDate(beginDate);
  finishDate = setFormattedDate(finishDate);
  creationDate = setFormattedDate(creationDate);

  return `
  <div class="project-detailBody">
    <div class="project-detailHeader" style="align-items: center;">
      <div class="detailsHeader-options" style="">

      <div class="inline-group" name="stages">
      <i class="fas fa-bolt"></i>
      <span>Etapas</span>
      </div>
      
      <div class="inline-group" name="activities">
      <i class="fas fa-tasks"></i> 
      <span>Actividades</span>
      </div>

      <div class="inline-group" id="editOnDetail">
      <i class="far fa-edit hoverPrimary" id="editOnDetail" style=""></i>
      <span>Actualizar</span>
      </div>

      </div>
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
      <div class="row px-md-3">
      <div class="col-6">
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Facturado a:</strong></span>
          </div>
          <div class="col">
            <span name="customer">${customer}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Creado por:</strong></span>
          </div>
          <div class="col">
            <span name="responsible">${responsible}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Categoria:</strong></span>
          </div>
          <div class="col">
            <span name="category">${category}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <span><strong>Valor:</strong></span>
          </div>
          <div class="col">
            <span name="value">${value}</span>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row" name="projectNo">
          <div class="col-lg-3">
          <span><strong>Proyecto No:</strong></span>
          </div>
          <div class="col">
          <span name="projectNo">${projectNo}</span>
          </div>
        </div>

        <div class="row">
  <div class="col-lg-3">
    <span><strong>Fecha Inicio:</strong></span>
  </div>
  <div class="col">
    <span name="beginDate">${beginDate}</span>
  </div>
</div>

<div class="row">
  <div class="col-lg-3">
    <span><strong>Fecha Fin:</strong></span>
  </div>
  <div class="col">
    <span name="finishDate">${finishDate}</span>
  </div>
</div>

<div class="row">
  <div class="col-lg-3">
    <span><strong>Estado Pago:</strong></span>
  </div>
  <div class="col">
  <span name="paymentStatus">${paymentStatus}</span>
  </div>
</div>

      </div>
    </div>
        <div class="row px-md-3 py-md-3">
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
        <thead class="text-center" id="project-detail-table-header">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
          </tr>
        </thead>
        <tbody id="project-detail-table-body">
        </tbody>
      </table>
      </div>
  `;
}

export function productsProjectDetail(
  { name, quantity, installable, address, instructions, responsible },
  productCount
) {
  if ((name, quantity, installable, address, instructions)) {
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
          </tr>
  `;
  } else {
    return `Este proyecto no tiene productos asociados`;
  }
}

export const stagesOnProjectDetails = (props) => {
  let status = "border-top: 3px solid ";
  switch (props.estado) {
    case "Agendado":
      status += "#517DF5;";
      break;

    case "Iniciado":
      status += "green;";
      break;

    case "Finalizado":
      status += "#2196F3;";
      break;

    case "Cancelado":
      status += "red;";
      break;

    case "Suspendido":
      status += "orange;";
      break;

    case "Retrasado":
      status += "orange;";
      break;

    default:
      status += "#517DF5;";
      break;
  }
  return `

  <div class="list-item" style="${status}">
  <div class="list_item-header">
    <span name="productStageStatus">${props.etapa}</span>
    <span>${setFormattedShortDate(props.fecha_inicio)}</span>
  </div>
  <div class="list_item-body">
    <div style="">
      <div>
        <strong> Item: </strong>
        <span>${props.producto}</span>
      </div>
      <div>
        <strong> Estado: </strong>
        <span style="color: black; font-weight: bold">${props.estado}</span>
      </div>
      <div>
        <strong> Responsable: </strong>
        <span>${props.responsable}</span>
      </div>
    </div>

    <div style="
    color: black;
    font-weight: bold; 
    ">
    <span>#</span>
    <span name="productStage_id">${props.id}</span>
    </div>
  </div>
  <div class="list_item-footer"><i class="fas fa-expand-alt"></i></div>
</div>

  `;
};
