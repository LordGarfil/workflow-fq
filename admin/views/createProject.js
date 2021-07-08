export async function renderProjectCreation() {
  let customers = `
    <option value="none" selected disabled hidden> </option>
    `;
  let products = ``;
  let projectCategories = "";
  let project = "";
  let paymentStatuses = ""

  let responsibles = ""

  await $.ajax("../backend/customers.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        customers += `
                <option value=${element.id}>${element.name} ${element.lastName}</option>
                `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  })

  await $.ajax("../backend/projectCategories.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        projectCategories += `
                <option value=${element.id}>${element.category}</option>
                `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });

  await $.ajax("../backend/products.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res);
      detailRes.forEach((element) => {
        products += `
                <option value=${element.id}>${element.description}</option>
                `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });

  await $.ajax("../backend/users.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res);

      detailRes.forEach((element) => {

        responsibles += `
                <option value=${element.id}>${element.name}</option>
                `;
      });

    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  })

  await $.ajax("../backend/fetchBd.php", {
    type: "get",
    data: { search: "paymentStatus" },
    success: function (res) {
      const detailRes = JSON.parse(res);

      detailRes.forEach((element) => {
        paymentStatuses += `
                  <option value=${element.id}>${element.status}</option>
                  `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
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

          <div class="mb-2 ">
            <span class="">Cliente</span>
            <div class="d-flex">
              <select class="editableBox" id="projectCustomer_select" data-live-search="true" multiple data-max-options="1" title="Seleccione una opción" style="font-size: 0.8rem !important;">
              ${customers} 
              
            </select>
            <h6 class="newClient-project"><i class="fas fa-user-plus" id="newCustomer"></i></h6>

            </div>

            
          </div>

          <div class="mb-2 align-items-center">
            <span>Fecha Inicio</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectBeginDate" step=2 />
          </div>

        </div>

        <div class="project-info-2">

          <div class="d-block mb-2 align-items-center">
            <span>Categoria</span>
            <select id="projectCategory" class="editableBox d-block" title="Seleccione una opción">
            ${projectCategories}
            </select>
          </div>


          <div class="mb-2 align-items-center">
            <span>Fecha Fin</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectFinishDate" disabled/>
          </div>

          

        </div>

        <div class="project-info-3">
 
        <div class="mb-2 align-items-center">
        <span>Valor</span>
        <input placeholder="Valor" class="td-medium form-control" type="text" id="projectValue"/>
         </div>

         <div class="mb-2 align-items-center">
         <span>Estado Pago</span>
         <select id="projectPaymentStatus" class="td-medium editableBox d-block" title="Seleccione una opción">
             ${paymentStatuses}
             </select>
         </div>
        
        </div>

        

        <div class="project-info-6">
          <div class="mb-2 align-items-center">
            <span>Observaciones</span>
            <textarea id="projectObservations" cols="22" rows="4" class="form-control" maxlength="150" style="max-height: 110px;"></textarea>
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
            <th scope="col" class="td-medium">Producto</th>
            <th scope="col" class="td-small">Cantidad</th>
            <th scope="col" class="td-small">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
            <th scope="col">Responsable</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="project-admin-table-body">
          <tr class="project-creation-table">
            <th>1</th>
            <td>
              <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true">
              ${products}
              </select>
            </td>
            <td>
              <input type="number" class="td-small form-control" style="font-size: 0.8rem !important;" min="1" onkeypress="return isNumberKey(event)">
            </td>
            <td>
              <select class="td-small form-control select-address" style="font-size: 0.8rem; ">
                <option value="2">No</option>
                <option value="1">Si</option>
              </select>
            </td>
            <td>
            <textarea cols="12" rows="1" class="td-area form-control" maxlength="150"></textarea>
            </td>
            <td>
              <textarea cols="4" rows="1" class="td-area form-control" maxlength="150"></textarea>
            </td>
            <td> 
            <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true">
              ${responsibles}
              </select>
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

