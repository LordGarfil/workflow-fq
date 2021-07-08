function setResponsible(element) {
  if (element.asignationStatus == 2) {
    return `<option value="" selected>${element.responsible}</option>`;
  } else {
    return `<option value="${element.asignationStatus}"selected>${element.responsible}</option>`;
  }
}

export async function renderEditableProjectCreation(projectId) {
  let project = "";
  let projectHeader = "";
  let productRows = "";
  let productCount = 0;

  let customers = "";
  let categories = "";
  let statuses = "";
  let paymentStatuses = ""

  let products = "";
  let productId = "";
  let responsibles = "";
  let installable = "";

  let statusId = "";

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
  });

  await $.ajax("../backend/projectCategories.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res);

      detailRes.forEach((element) => {
        categories += `
                  <option value=${element.id}>${element.category}</option>
                  `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });

  await $.ajax("../backend/fetchBd.php", {
    type: "get",
    data: { search: "status" },
    success: function (res) {
      const detailRes = JSON.parse(res);

      detailRes.forEach((element) => {
        statuses += `
                  <option value=${element.id}>${element.status}</option>
                  `;
      });
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });

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
  });

  await $.ajax("../backend/project.php", {
    type: "get",
    data: { filterBy: "id", id: projectId },
    success: function (res) {
      const element = JSON.parse(res);
      statusId = element.statusId;
      projectHeader = `
      <div class="create-project-content">
    <div class="card p-4">
        <div class="create-project-header mb-2">
            <h3>Actualizar Proyecto</h3>
            <div class="badge_" id="projectNo">${element.projectNo}</div>
            <div id="succesProjectEdition" class="alert alert-success" role="alert" style="width: 15em; display: none">
                ¡Proyecto actualizado con éxito!
            </div>
        </div>

        <form class="fit-inputs-form" action="../backend/createProject.php" id="dataProjectForm">
            <div class="creation-project-header">
                <div class="project-info-1">
                    <div class="mb-2">
                        <span class="">Cliente</span>
                        <div>
                            <div class="d-flex">
                                <select class="editableBox" id="projectCustomer_select" data-live-search="true"
                                    title="Seleccione una opción" style="font-size: 0.8rem !important">
                                    <option value="${element.customerId}" selected>
                                        ${element.customer}
                                    </option>
                                    ${customers}
                                </select>

                                <h6 class="newClient-project">
                                    <i class="fas fa-user-plus" id="newCustomer"></i>
                                </h6>
                            </div>
                        </div>
                    </div>

                    <div class="mb-2 align-items-center">
                        <span>Fecha Inicio</span>
                        <input placeholder="Fecha Inicio" value="${element.beginDate}" class="form-control type-date"
                            type="text" id="projectBeginDate" />
                    </div>
                </div>

                <div class="project-info-2 mr-sm-5">
                    <div class="mb-2 align-items-center">
                        <span>Categoria</span>
                        <div>
                            <select class="editableBox" id="projectCategory_select" title="Seleccione una opción"
                                style="font-size: 0.8rem !important;">
                                <option value="${element.categoryId}" selected>${element.category}</option>
                                ${categories}
                            </select>
                        </div>
                    </div>
                    <div class="mb-2 align-items-center">
                        <span>Fecha Fin</span>
                        <input placeholder="Fecha Inicio" value="${element.finishDate}" class="form-control type-date"
                            type="text" id="projectFinishDate" />
                    </div>
                </div>

                <div class="project-info-3 mr-sm-5">
                    <div class="mb-2 align-items-center">
                        <span>Estado</span>
                        <div>
                            <select class="editableBox" id="projectStatus_select" title="Seleccione una opción"
                                style="font-size: 0.8rem !important;">
                                <option value="${element.statusId}" selected>${element.status}</option>
                                ${statuses}
                            </select>
                        </div>
                    </div>

                    <div class="mb-2 align-items-center">
                        <span>Observaciones</span>
                        <textarea id="projectObservations" cols="2" rows="1" class="form-control" maxlength="150"
                            style="max-height: 80px; min-height: 38px; resize:vertical; overflow:hidden">${element.observations}</textarea>
                    </div>
                </div>

                <div class="project-info-4 mr-sm-5">

                    <div class="mb-2 align-items-center">
                        <span>Valor</span>
                        <div class="">
                            <input placeholder="Valor" value=${element.value} id="projectValue"
                                class="td-medium form-control type-date" type="text" id="projectFinishDate" />
                        </div>
                    </div>
    
                    <div class="td-medium mb-2 align-items-center">
                        <span>Estado Pago</span>
                            <select class="td-medium editableBox" id="projectPaymentStatus" title="Seleccione una opción"
                                style="font-size: 0.8rem !important;">
                                <option value="${element.paymentStatusId}" selected>${element.paymentStatus}</option>
                                ${paymentStatuses}
                            </select>
                    </div>
                </div>
                
            </div>
        </form>
        <hr>
        <div class="d-flex" style="justify-content: flex-end;">
          <button id="btnAddNewProjectProduct" class="btn btn-primary position-sticky">Agregar Producto</button>
        </div>
      `;
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });

  await $.ajax("../backend/productsProject.php", {
    type: "get",
    data: { filterBy: "project", project: projectId },
    success: function (res) {
      const detailRes = JSON.parse(res);

      if (detailRes.error) {
      } else {
        detailRes.forEach((element) => {
          let installableId = "";
          if (element.installable == "Si") {
            installable = `<option value=${2}>No</option>`;
            installableId = 1;
          } else {
            installable = `<option value=${1}>Si</option>`;
            installableId = 2;
          }
          productCount++;
          productRows += `
                    <tr class="project-creation-table">
                <th>${productCount}<span hidden>${element.id}</span></th>
                <td class="td-medium">
                <select class="editableBox" id="projectProducts_select" data-live-search="true" title="Seleccione una opción" style="font-size: 0.8rem !important;">
                <option value="${element.productId}" selected>${
            element.name
          }</option>
                ${products} 
              </select>
                </td>
                <td>
                  <input type="number" value=${
                    element.quantity
                  } class="td-small form-control" style="font-size: 0.8rem !important;" min="1" onkeypress="return isNumberKey(event)">
                </td>
                <td class="td-small">
                <select class="td-small form-control select-address" style="font-size: 0.8rem; ">
                <option value="${installableId}" selected>${
            element.installable
          }</option>
                ${installable} 
              </select>
                </td>
                <td>
                  <textarea id="projectObservations" cols="12" rows="1" class="td-medium td-area form-control" maxlength="150">${
                    element.address
                  }</textarea>
                </td>
                <td>
                  <textarea id="projectObservations" cols="12" rows="1" class="td-medium td-area form-control" maxlength="150">${
                    element.instructions
                  }</textarea>
                </td>
               
                <td class="text-center">
                  <span><i class="fas fa-trash"></i></i></span>
                </td>
                
              </tr>
                    `;
        });
      }
    },
    error: function () {
      alert("No se ha podido obtener la información");
    },
  });
  project = `
           ${projectHeader}
      <form class="overflow-auto">
        <table class="workflow-table project-creation-table" id="project-idition-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Producto</th>
              <th scope="col" class="td-small">Cantidad</th>
              <th scope="col" class="td-small">Instalable</th>
              <th scope="col">Dirección</th>
              <th scope="col">Instrucciones</th>
            </tr>
          </thead>
          <tbody id="project-admin-table-body">
            ${productRows}
        </table>
      </form>
    </div>
  </div>
  <button type="submit" class="btn btn-primary form-control mt-4 mb-4" id="btnUpdateProject" onclick="createProject()">Actualizar</button>
          
  `;
  document.querySelector(".container-fluid").innerHTML = project;
}
