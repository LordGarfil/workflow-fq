import { setFormattedShortDate } from "../../js/app.js"

export const updateProductStage = (stage, status, responsible) => {
  let statusOptions
  let responsibleOptions

  status.forEach((element) => {
    statusOptions += `<option value=${element.id}>${element.estado}</option>`
  })

  responsible.forEach((element) => {
    responsibleOptions += `<option value=${element.id}>${element.name}</option>`
  })

  return `
    <div class="card pop-up">
        <div class="pop-up_header">
            <h3><strong>${stage.etapa}</strong></h3>
            <i class="fas fa-times-circle" name="close-pop-up"></i>
        </div>
        <div class="alert alert-success" id="productStageAlertOnUpdate" role="alert" hidden>
      ¡Etapa actualizada!
      </div>
        <form class="pop-up-form">
            <div>
                <div class="row">
                    <div class="flex">
                    <div>
                          <strong>#</strong>
                          <span name="productStage_idUpdate">${stage.id}</span>
                    </div>
                    <div>
                          <strong>Item:</strong>
                          <span>${stage.producto}</span>
                    </div>
                    <div>
                          <strong>Fecha:</strong>
                          <span>${setFormattedShortDate(
    stage.fecha_inicio
  )}</span>
                    </div>
                    </div>
                </div>
                <div class="row">
                <div class="flex">
                <div>
                  <strong>Estado</strong>
                  <select class="form-control" name="statusProductStage_select">
                    <option value="">Seleccione una opción</option>
                    ${statusOptions}
                  </select>
                </div>
                <div>
                  <strong>Responsable</strong>
                  <select class="form-control" name="responsibleProductStage_select">
                    <option value="">Seleccione una opción</option>
                    ${responsibleOptions}
                  </select>
                </div>
            </div>
                </div>
            </div>
            <div class="row center">
                <button type="button" class="btn btn-primary form-control" id="updateProductStage_btn">Actualizar</button>
            </div>
        </form>
      </div>
    `
}

export const addProductStage_popUp = () => {
  return `
    <div class="card pop-up">
        <div class="pop-up_header">
            <h3><strong>Nueva etapa</strong></h3>
            <i class="fas fa-times-circle" name="close-pop-up"></i>
        </div>
        <div class="alert alert-success" id="productStageAlertOnCreation" role="alert" hidden>
      ¡Etapa actualizada!
      </div>
        <form class="pop-up-form">
  <div class="row">
    <div class="flex">
      <div class="w-50">
        <strong>Producto</strong>
        <select class="form-control" name="product_select" required>
          <option value="">Seleccione una opción</option>
        </select>
      </div>
      <div class="w-50">
        <strong>Etapa</strong>
        <select class="form-control" name="stage_select" required>
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="flex">
      <div class="w-50">
        <strong>Responsable</strong>
        <select class="form-control" name="responsable_select" required>
          <option value="">Seleccione una opción</option>
        </select>
      </div>
      <div class="w-50">
        <strong>Estado</strong>
        <select class="form-control" name="status_select" required>
          <option value="">Seleccione una opción</option>
        </select>
      </div>
    </div>
  </div>
  <div class="row">
    <button type="submit" class="btn btn-primary" name="newStage">Agregar</button>
  </div>
</form>

      </div>  
  `
}

export const addProductStage_popUpEmpty = () => {
  return `
        <div>
          <span>
            No hay productos para este proyecto
          </span>
        </div>
      `
}

export const headerStage = (projectId) => {
  if (projectId) {
    return `
  <div class="project-detailHeader" style="align-items:center; color:gray">
  <div class="inline-group" name="backward">
  <i class="fas fa-backward"></i>
  <span style="font-size: 15px;">Regresar</span>
  </div>
  <div style="
    border-radius: 7px;
    padding: 5px 8px;
  ">
   <strong> Proyecto No: </strong>
   <span name="proyectId_stage">${projectId}</span> </div>
</div>
<hr>
  <div style="display: flex; justify-content: flex-end;"><button name="btnNewStage" class="btn btn-primary position-sticky mb-3">Agregar Etapa</button></div>
`
  } else {
    return `
  <div class="project-detailHeader" style="align-items:center; color:gray">
  <div class="inline-group" name="backward">
  <i class="fas fa-backward"></i>
  <span style="font-size: 15px;">Regresar</span>
  </div>
  <hr>
`
  }
}

export const filterStageTitle = (title) => {
  return `
    <div
    name="productFilterTitle"
    style="
    display:flex;
    align-items:center;
    padding:5px;
    margin:20px 0px 15px 0px;
    border-left: 3px solid #4e73df"
    >
    <h4 name=${title}
    style="
      font-weight: bold;
    "> ${title} </h4>
    </div>
  `
}
