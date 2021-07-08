import { setFormattedDate, setFormattedShortDate } from "../../js/app.js"

export const activityNew_popUp = (activity) => {
  return `
    <div class="card pop-up">
    <div class="pop-up_header" style="align-items: center !important;">
        <div style="
          display: flex;
          align-items: baseline;
        ">
          <strong style="margin-right: 25px;">Nueva actividad</strong>
          <div class="spinner_loader"></div>
        </div>
        <i class="fas fa-times-circle" name="close-pop-up"></i>
    </div>
    <div class="alert alert-success" id="productStageAlertOnUpdate" role="alert" hidden>
  ¡Etapa actualizada!
  </div>
    <form class="pop-up-form" method="POST" enctype="multipart/form-data" id="frm_CreateActivity">
        <div>
            <div class="row">
            <div style="width: 100%;">
            <textarea class="form-control" name="activityComments" style="
            min-height: 90px;
            max-height: 180px;
            width: 100%;
            " placeholder="Comentarios"></textarea>
      </div>
      </div>
            <div class="row">
            <div  style="width: 100%;">
              <input type="file" class="form-control" accept="image/x-png,image/gif,image/jpeg" required> 
              <label></label>
            </div>
            </div>
        </div>
        <div class="row">
            <button type="submit" name="image" id="btnAddActivity" class="btn btn-primary form-control">Agregar</button>
        </div>
    </form>
  </div>
    `
}

export const activityNew_popUp_admin = (activity) => {
  return `
    <div class="card pop-up">
    <div class="pop-up_header" style="align-items: center !important;">
        <div style="
          display: flex;
          align-items: baseline;
        ">
          <strong style="margin-right: 25px;">Nueva actividad</strong>
          <div class="spinner_loader"></div>
        </div>
        <i class="fas fa-times-circle" name="close-pop-up"></i>
    </div>
    <div class="alert alert-success" id="productStageAlertOnUpdate" role="alert" hidden>
  ¡Etapa actualizada!
  </div>
    <form class="pop-up-form" method="POST" enctype="multipart/form-data" id="frm_CreateActivity">
        <div>
            <div class="row">
            <div style="width: 100%;">
            <select class="form-select" name="products">
              <option disabled selected value="">Producto</option>
            </select>
        </div>
        <div>
            <div class="row">
            <div style="width: 100%;">
            <select class="form-select" name="stages">
              <option disabled selected value="">Etapa</option>
            </select>
        </div>
        <div>
            <div class="row">
            <div style="width: 100%;">
            <textarea class="form-control" name="activityComments" style="
            min-height: 90px;
            max-height: 180px;
            width: 100%;
            " placeholder="Comentarios"></textarea>
      </div>
      </div>
            <div class="row">
            <div  style="width: 100%;">
              <input type="file" class="form-control" accept="image/x-png,image/gif,image/jpeg" required> 
              <label></label>
            </div>
            </div>
        </div>
        <div class="row">
            <button type="submit" name="image" id="btnAddActivity" class="btn btn-primary form-control">Agregar</button>
        </div>
    </form>
  </div>
    `
}

export const activityEdit_popUp = (activity) => {
  return `
    <div class="card pop-up">
    <div class="pop-up_header" style="align-items: center; !important">
        <div style="
          display: flex;
          justify-content: ;
          width: 100%;
          height: 100%;
          align-items: center;
        ">
          <span name="activityId" hidden>${activity.id}</span>
          <small style="margin-right: 25px;">${setFormattedDate(
    activity.fecha
  )}</small>
          <div style="margin-right: 25px;" class="btnGroup-delete" name="delete-activity">
          <i class="fas fa-trash"></i>
          <span>Eliminar</span>
          </div>
          <div class="spinner_loader"></div>
        </div>
        <i class="fas fa-times-circle" name="close-pop-up"></i>
    </div>
    <div class="alert alert-success" id="productStageAlertOnUpdate" role="alert" hidden>
  ¡Actividad actualizada!
  </div>
    <form class="pop-up-form" method="POST" enctype="multipart/form-data" id="frm_UpdateActivity">
        <div>
            <div class="row">
            <div style="width: 100%;">
            <textarea class="form-control" style="
            min-height: 90px;
            max-height: 130px;
            width: 100%;
            " placeholder="Comentarios">${activity.comentarios}</textarea>
      </div>
      </div>
            <div class="row">
            <div  style="width: 100%;">
              <input type="file" class="form-control"> 
              <label></label>
            </div>
            </div>
            <div class="row activityImage_preview">
            <img name="previousActivityImage" style="
            object-fit: cover;
            " src=../${activity.imagen}>
            <label name="previousActivityImage_label" hidden>../${activity.imagen
    }</label>
            </div>
        </div>
        <div class="row">
            <button type="submit" name="image" class="btn btn-primary form-control">Actualizar</button>
        </div>
    </form>
  </div>
    `
}

export const activitiesContainer = (project) => {
  return `
  <div class="projectActivities-header">
  <div class="inline-group" name="backward"x>
  <i class="fas fa-backward"></i>
  <span style="font-size: 15px;">Regresar</span>
  </div>
  <div style="font-size: 16px;">
  <strong>Proyecto No:</strong> <span name="projectNo">${project.id}</span>
  <span name="stageId"></span>
  </div>
  </div>
  <hr>
  <div style="display: flex; justify-content: flex-end;"><button name="btnAddNewActivity" class="btn btn-primary position-sticky mb-3">Agregar Actividad</button></div>
  <div id="activities-container" class="list-filter">

  </div>
  `
}

export const activityImage_PopUp = (props) => {
  return `
  <div class="card pop-up">
    <div class="pop-up_header">
        <div style="
          display: flex;
          align-items: baseline;
        ">
          <small>${props.fecha}</small>
        </div>
        <i class="fas fa-times-circle" name="close-pop-up"></i>
    </div>
    <div class="activityImage_expanded">
    <img name="activityExpandedImage" src=${props.imagen}> 
    </div>
  </div>
  `
}

export const activityFilter = (activity) => {
  return `
    <div class="activity-filter" name=product${activity.fk_producto} style="
    width: 100%;
    padding: 10px;
    margin: 15px 0 15px 0;
    border-left: 3px solid #4e73df
    ">
      <strong style="">${activity.producto}</strong>
      <span name="productId" hidden>${activity.id}</span>
    </div>
  `
}

export const activityCard = (activity) => {
  return `
    <div class="list-item">
        <div class="list_item-header">
        <span name="activityId" hidden>${activity.id}</span>
        <div style="font-size: 14px;">
          <strong>${activity.etapa
    }</strong> | <span name="activityDate">${setFormattedDate(
      activity.fecha
    )}</span>
        </div>
          <i class="fas fa-expand-alt" name="edit_activity"></i>
        </div>
        <div class="list_item-body">
          <img name="activityUnexpandedImage" src="../${activity.imagen}" loading="lazy"></img>
        </div>
        <div class="list_item-footer"></div>
      </div>
    `
}

export const activitiesEmpty = () => {
  return `
    <div class="activities_empty">
    <img style="
        width: 250px;
      "
      src="../static/img/add_tasks.svg">
      <p>Agrega una actividad</p>
    </div>
    
  `
}
