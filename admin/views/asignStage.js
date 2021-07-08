export function asignPopUp(){
    const popUp = `
    <div class="card pop-up">
    <div class="pop-up_header">
        <h3>Asignar estación</h3>
        <i class="fas fa-times-circle" id="close-pop-up"></i>
    </div>
    <div class="alert alert-success" id="customerAlert" role="alert" style="display: none;">
  ¡Cliente creado!
</div>
    <form class="pop-up-form">
        <div>
            <div class="row">
                <div class="col">
                    <label> <input type="checkbox"  value="2" name="checkStage"> Fotografia</label>
                </div>
                <div class="col">
                    <label> <input type="checkbox"  value="3" name="checkStage"> Edición y diseño</label>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label> <input type="checkbox" value="4" name="checkStage"> Impresión</label>
                </div>
                <div class="col">
                    <label> <input type="checkbox" value="5" name="checkStage"> Producción</label>
                </div>
            </div>
        </div>
        <div class="row center">
            <button type="button" class="btn btn-primary form-control" id="finish_project_creation_btn">Finalizar</button>
        </div>
    </form>
</div>
    `
    return popUp
}