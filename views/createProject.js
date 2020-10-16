export async function renderProjectCreation() {
  const sqlCustomers = `
    SELECT * FROM personas
    `;
  const sqlProducts = `
    SELECT * FROM productos
    `;
  let customers = `
    <option value="none" selected disabled hidden> </option>
    `;
  let products = ``;

  let project = "";
  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlCustomers },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        customers += `
                <option value=${element.numero_documento}>${element.nombres} ${element.apellidos}</option>
                `;
      });
    },
  });
  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlProducts },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        products += `
                <option value=${element.id}>${element.descripcion}</option>
                `;
      });
    },
  });
  project = `
         <div class="create-project-content">
  <div class="card p-4">
    <div class="create-project-header mb-2">
      <h3>Crear Proyecto</h3>
      <div id="succesProjectCreation" class="alert alert-success" role="alert" style="width: 15em; display: none;">
  ¡Proyecto creado con éxito!
</div>
    </div>

    <form class="fit-inputs-form" action="../backend/createProject.php" id="dataProjectForm">
      <div class="creation-project-header">

        <div class="project-info-1">

          <div class="d-flex flex-wrap mb-2 ">
            <span class="">Cliente</span>
            <div>

              <select class="editableBox" id="projectCustomer_select" data-live-search="true" title="Seleccione una opción" style="font-size: 0.8rem !important;">
              ${customers} 
            </select>


            </div>

            <h6 class="newClient-project"><i class="fas fa-user-plus"></i></h6>
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Inicio</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectBeginDate" step=2 />
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Categoria</span>
            <select id="projectCategory" class="editableBox" title="Seleccione una opción">
              <option value="1">Fotografia</option>
              <option value="2">Publicidad</option>
            </select>
          </div>

        </div>

        <div class="project-info-2">


          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Fin</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectFinishDate" disabled/>
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
          <span>Observaciones</span>
          <textarea id="projectObservations" cols="1" rows="4" class="form-control" maxlength="150" style="max-height: 60px;"></textarea>
        </div>

        </div>

      </div>


      <hr>
    </form>
    <div class="d-flex" style="justify-content: flex-end;">
      <button id="btnAddNewProjectProduct" class="btn btn-primary position-sticky">Agregar Producto</button>
    </div>
    <form class="overflow-auto">
      <table class="workflow-table project-creation-table" id="project-creation-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="project-admin-table-body">
          <tr class="project-creation-table">
            <th>1</th>
            <td style="width: 20em;">
              <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true">
              ${products}
              </select>
            </td>
            <td style="width: 7em;">
              <input type="number" class="form-control" style="font-size: 0.8rem !important;" min="0" onkeypress="return isNumberKey(event)">
            </td>
            <td style="width: 5em;">
              <select name="" id="" class="form-control select-address" style="width: 7em !important; font-size: 0.8rem; ">
                <option value="2">No</option>
                <option value="1">Si</option>
              </select>
            </td>
            <td>
              <input type="text" class="form-control" style="font-size: 0.8rem;">
            </td>
            <td>
              <textarea id="projectObservations" cols="4" rows="1" class="form-control" maxlength="150" style="max-height: 80px;"></textarea>
            </td>
            <td class="text-center">
              <span><i class="fas fa-trash"></i></i></span>
            </td>
            
          </tr>
      </table>
    </form>
  </div>
</div>
<button type="submit" class="btn btn-primary form-control mt-4 mb-4" id="btnCreateProject" onclick="createProject()">Crear</button>
         `;
  document.querySelector(".container-fluid").innerHTML = project;
}

export async function renderEditableProjectCreation(projectId) {
  const sqlCustomers = `
    SELECT * FROM personas
    `;
  const sqlProducts = `
    SELECT * FROM productos
    `;
  const sqlProject = `
SELECT proyectos.id as projectNo, identificador_unico as uuid, categorias_proyecto.categoria as category,
   concat(personas.nombres, ' ' , personas.apellidos) as customer, usuarios.usuario as responsible,
    proyectos.observaciones as observations, proyectos.fecha_inicio as beginDate, proyectos.fecha_finalizacion as finishDate,
     estados_proyecto.estado as status, proyectos.fecha_creacion as creationDate
        FROM proyectos, categorias_proyecto, personas, usuarios, estados_proyecto, estados_pago
  where
        estados_proyecto.id = proyectos.fk_estado_proyecto AND
        categorias_proyecto.id = proyectos.fk_categoria_proyecto AND
        usuarios.id = proyectos.fk_responsable AND
        personas.numero_documento = proyectos.fk_cliente AND
        estados_pago.id = fk_estado_pago AND
        proyectos.id = ${projectId}
`;
  const sqlProductsRows = `
    SELECT productos_proyectos.id, proyectos.id as proyecto, productos.descripcion as name, productos_proyectos.cantidad as quantity, productos_proyectos.instrucciones as instructions, productos_instalable.instalable as installable , productos_proyectos.direccion as address, usuarios.usuario as responsible
from productos_proyectos, proyectos, usuarios, productos, productos_instalable
where productos.id = fk_producto  and proyectos.id = fk_proyecto and usuarios.id = productos_proyectos.fk_responsable
and productos_instalable.id = productos_proyectos.instalable AND
productos_proyectos.fk_proyecto = ${projectId}
    `;

  let customers = `
    <option value="none" selected disabled hidden> </option>
    `;
  let products = ``;

  let project = "";
  let projectHeader = "";
  let productRows = "";
  let productCount = 0;
  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlCustomers },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        customers += `
                <option value=${element.numero_documento}>${element.nombres} ${element.apellidos}</option>
                `;
      });
    },
  });
  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlProducts },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        products += `
                <option value=${element.id}>${element.descripcion}</option>
                `;
      });
    },
  });

  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlProject },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        projectHeader = `
                <div class="create-project-content">
  <div class="card p-4">
    <div class="create-project-header mb-2">
      <h3>Actualizar Proyecto</h3>
      <div id="succesProjectCreation" class="alert alert-success" role="alert" style="width: 15em; display: none;">
  ¡Proyecto creado con éxito!
</div>
    </div>

    <form class="fit-inputs-form" action="../backend/createProject.php" id="dataProjectForm">
      <div class="creation-project-header">

        <div class="project-info-1">

          <div class="d-flex flex-wrap mb-2 ">
            <span class="">Cliente</span>
            <div>

              <input type="text" value="${element.customer}" class="editableBox form-control" id="projectCustomer_select" style="display: inline !important;  font-size: 0.85em !important;">
                                
              

            </div>

            <h6 class="newClient-project"><i class="fas fa-user-plus"></i></h6>
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Inicio</span>
            <input placeholder="Fecha Inicio" value="${element.beginDate}" class="form-control type-date" type="text" id="projectBeginDate" />
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Categoria</span>
            <input type="text" value="${element.category}" id="projectCategory" class="form-control">
          </div>

        </div>

        <div class="project-info-2">


          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Fin</span>
            <input  placeholder="Fecha Inicio" value="${element.finishDate}" class="form-control type-date" type="text" id="projectFinishDate"/>
          </div>

        
        <div class="d-flex flex-wrap mb-2 align-items-center">
          <span>Observaciones</span>
          <textarea id="projectObservations" cols="1" rows="4" class="form-control" maxlength="150" style="max-height: 60px;">${element.observations}</textarea>
          </div>

        </div>

      </div>

      <hr>
    </form>
    <div class="d-flex" style="justify-content: flex-end;">
      <button id="btnAddNewProjectProduct" class="btn btn-primary position-sticky">Agregar Producto</button>
    </div>
                `;
      });
    },
  });

  await $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlProductsRows },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        productCount++;
        productRows += `
                <tr class="project-creation-table">
            <th>${productCount}</th>
            <td style="width: 20em;">
              <input value="${element.name}" id="" class="form-control select-table-input" style="width: 18em !important;">
            </td>
            <td style="width: 7em;">
              <input type="number" value=${element.quantity} class="form-control" style="font-size: 0.8rem !important;" min="0" onkeypress="return isNumberKey(event)">
            </td>
            <td style="width: 5em;">
              <input type"text" value="${element.installable}" name="" id="" class="form-control select-address" style="width: 7em !important; font-size: 0.8rem; ">
            </td>
            <td>
              <input type="text" value="${element.address}" class="form-control" style="font-size: 0.8rem;">
            </td>
            <td>
              <textarea id="projectObservations" value=${element.instructions} cols="4" rows="1" class="form-control" maxlength="150" style="max-height: 80px;"></textarea>
            </td>
            <td class="text-center">
              <span><i class="fas fa-trash"></i></i></span>
            </td>
            
          </tr>
                `;
      });
    },
  });
  project = `
         ${projectHeader}
    <form class="overflow-auto">
      <table class="workflow-table project-creation-table" id="project-creation-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="project-admin-table-body">
          ${productRows}
      </table>
    </form>
  </div>
</div>
<button type="submit" class="btn btn-primary form-control mt-4 mb-4" id="btnCreateProject" onclick="createProject()">Actualizar</button>
        
`;
  document.querySelector(".container-fluid").innerHTML = project;
}
