import { showCheckboxes } from "../../js/animateSelect.js";
import { redirectFile } from "./app.js";
import {
  projectDetails,
  productsProjectDetail,
} from "../views/projectDetails.js";
import {
  renderProjectCreation,
  renderEditableProjectCreation,
} from "../../views/createProject.js";
import { setRoute, setRouteWithValue } from "../../routes/routes.js";

const currentDate = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month <= 9) {
    month = "0" + month;
  }
  let day = date.getDate();
  if (day <= 9) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
};

const currentDateTime = () => {
  const date = currentDate();
  const time = new Date();
  const hour = time.getHours();
  let minute = time.getMinutes();
  if (minute <= 9) {
    minute = "0" + minute;
  }
  let second = time.getSeconds();
  if (second <= 9) {
    second = "0" + second;
  }

  return date + "T" + hour + ":" + minute + ":" + second;
};

const getTableData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const data = await res.json();
  return data;
};

export const renderTable = async () => {
  const data = await getTableData();
  let table = "";
  data.forEach((element, index) => {
    table += `
  <tbody>
    <tr>
      <td scope="row">${data[index].id}</td>
      <td>${data[index].title} </td>
      <td>${data[index].completed}</td>
    </tr>
  </tbody>`;
  });

  document.getElementById("project-admin-table-body").innerHTML = table;
};

export const animateFilterActive = function (isFiltered) {
  document.getElementById("filterButton").onclick = () => {
    if (isFiltered) {
      document.getElementById("filterButton").classList.remove("filter-active");
      isFiltered = false;
    } else {
      document.getElementById("filterButton").classList.add("filter-active");
      filterDataTable();
      isFiltered = true;
    }
  };
};

const filterDataTable = function () {
  const txtCliente = document.getElementById("txtClientFilter").value;
  const txtResponsible = document.getElementById("txtResponsibleFilter").value;
  const dateBegin = document.getElementById("dateBeginFilter").value;
  const dateFinish = document.getElementById("dateFinishFilter").value;
  console.log(txtCliente);
  console.log(txtResponsible);
  console.log(dateBegin);
  console.log(dateFinish);
};

export const initializeProjectView = () => {
  showCheckboxes(false);
  animateFilterActive(false);

  document.getElementById("btnCreateProjectView").onclick = () => {
    setRoute('create_project')
  };

  $("#project-admin-table-body").on("click", ".fa-eye", function () {
    const idProjectSelected = getProjectRowId(this);
    setRouteWithValue('project_details', idProjectSelected)
  });

  $("#project-admin-table-body").on("click", ".fa-edit", function async() {
    const idProjectSelected = getProjectRowId(this);
    setRouteWithValue('project_edit', idProjectSelected)
  });
};

export const initializeProjectCreation = async () => {
  const project = createProject();

  document
    .getElementById("projectBeginDate")
    .setAttribute("min", currentDateTime());
  document
    .getElementById("projectFinishDate")
    .setAttribute("min", currentDateTime());

  $(".editableBox").selectpicker();

  project.deleteProductRow();

  document.getElementById("btnCreateProject").onclick = (e) => {
    if (project.isProjectDataFilled(project.getData())) {
      if (project.isProjectDataFilled(project.getProductsProject())) {
        project
          .postData("../backend/project.php", project.getData())
          .then(() => {
            setTimeout(() => {
              for (let i = 0; i < project.getProductsCount(); i++) {
                project.postData(
                  "../backend/productsProject.php",
                  project.getProductsProject()[i]
                );
              }
              $("html, body").animate({ scrollTop: 0 }, "slow");
              project.resetProductsProjectInputs()
              project.resetProjectInputs()
              $("#succesProjectCreation").show(1500);
            }, 100);
          });
      } else {
        alert("Llene todos los campos!");
      }
    } else {
      alert("Llene todos los campos!");
    }
  };

  document.getElementById("projectBeginDate").onchange = () => {
    const beginDate = document.getElementById("projectBeginDate").value;
    document.getElementById("projectFinishDate").setAttribute("min", beginDate);
    document.getElementById("projectFinishDate").removeAttribute("disabled");
  };

  document.getElementById("btnAddNewProjectProduct").onclick = () => {
    project.addNewProductRow();
  };
};

const createProject = () => {
  let productsCount = 1;

  const getState = () => {};

  const getData = () => {
    // const isProjectPaid =
    //   document.getElementById("projectValuePaid").value ==
    //   document.getElementById("projectValue").value
    //     ? 1
    //     : 2;
    return {
      category: parseInt(document.getElementById("projectCategory").value),
      customer: document.getElementById("projectCustomer_select").value,
      responsible: parseInt(document.getElementById("spanUserId").textContent),
      // value: parseInt(document.getElementById("projectValue").value),
      value: 111,
      // valuePaid: parseInt(document.getElementById("projectValuePaid").value),
      valuePaid: 1111,
      observations: document.getElementById("projectObservations").value || " ",
      beginDate: document.getElementById("projectBeginDate").value,
      finishDate: document.getElementById("projectFinishDate").value,
      status: 1,
      paymentStatus: 1,
    };
  };

  const isProjectDataFilled = (data) => {
    let isFilled = 0;
    let length = 0;

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        for (const element in data[i]) {
          length++;
          if (data[i][element]) {
            isFilled++;
          }
        }
      }
    } else {
      for (const element in data) {
        length++;
        if (data[element]) {
          isFilled++;
        }
      }
    }

    if (isFilled == length) {
      return true;
    } else {
      return false;
    }
  };

  const postData = async (url = "", onPostData) => {
    $.post(url, onPostData, function (data, status) {});
  };

  const addNewProductRow = () => {
    $.ajax("../backend/fecthBd.php", {
      type: "get",
      data: { type: 1, table: "productos" },
      success: function (respuesta) {
        const res = JSON.parse(respuesta);

        productsCount++;
        let options = "";
        res.forEach((element) => {
          options += `
          <option value="${element.id}"> ${element.descripcion} </option>
          `;
        });

        const tBody = document.getElementById("project-admin-table-body");
        const productRow = `<tr class="project-creation-table">
    <th>${getProductsCount()}</th>
    <td style="width: 20em;">
    <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true" >
    ${options}
    </select>
  </td>
    <td style="width: 7em;">
      <input type="number" class="form-control" style="font-size: 0.8rem !important;" min="0"
        onkeypress="return isNumberKey(event)">
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
              <textarea cols="4" rows="1" class="form-control" maxlength="150" height="34px" style="max-height: 80px;"></textarea>
            </td>
    <td class="text-center">
      <span><i class="fas fa-trash"></i></i></span>
    </td>
  </tr>`;

        tBody.insertAdjacentHTML("beforeend", productRow);
        $(".editableBox").selectpicker();
      },
      error: function () {
        alert("No se ha podido obtener la información");
      },
    });
  };

  const deleteProductRow = () => {
    $("#project-admin-table-body").on("click", ".fa-trash", function () {
      var currow = $(this).closest("tr");
      var rowSelected = currow.find(":nth-child(1)");
      const tBody = document.getElementById("project-admin-table-body");
      tBody.removeChild(rowSelected.prevObject[0]);
    });
  };

  const getProductsProject = () => {
    const tBody = document.getElementById("project-admin-table-body");
    let products = [];
    for (let i = 0; i < tBody.children.length; i++) {
      products[i] = {
        id: tBody.children[i].children[1].children.item(0).children[0].value,
        quantity: tBody.children[i].children[2].children[0].value,
        installable: tBody.children[i].children[3].children[0].value,
        address: tBody.children[i].children[4].children[0].value || " ",
        instructions: tBody.children[i].children[5].children[0].value || " ",
      };
    }
    return products;
  };

  const getProductsCount = () => productsCount;

  const getFullProjectData = () => {
    return [getData(), getProductsProject()];
  };

  const resetProductsProjectInputs = () => {
    const tBody = document.getElementById("project-admin-table-body");
    for (let i = 0; i < tBody.children.length; i++) {
      tBody.children[i].children[1].children[0].children[1].children[0].children[0].children[0].textContent = "Seleccione una opción"
      tBody.children[0].children[1].children[0].children[1].classList.add('bs-placeholder')
      tBody.children[i].children[2].children[0].value = null;
      tBody.children[i].children[3].children[0].value = 2;
      tBody.children[i].children[4].children[0].value = null;
      tBody.children[i].children[5].children[0].value = null;
    }
  };
  const resetProjectInputs = () => {
    document.getElementById(
      "projectCategory"
    ).parentElement.children[1].children[0].children[0].children[0].textContent =
      "Seleccione una opción"
      document.getElementById(
        "projectCategory"
      ).parentElement.children[1].classList.add('bs-placeholder')
    document.getElementById(
      "projectCustomer_select"
    ).parentElement.children[1].children[0].children[0].children[0].textContent =
      "Seleccione una opción";
      document.getElementById(
        "projectCustomer_select"
      ).parentElement.children[1].classList.add('bs-placeholder')
    document.getElementById("projectObservations").value = null;
    document.getElementById("projectBeginDate").value = null;
    document.getElementById("projectFinishDate").value = null;
  };
  return {
    getState,
    getData,
    isProjectDataFilled,
    postData,
    addNewProductRow,
    deleteProductRow,
    getProductsProject,
    getProductsCount,
    getFullProjectData,
    resetProjectInputs,
    resetProductsProjectInputs,
  };
};

export const getProjectDataFromDataBase = (projectId) => {
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

  const sqlProductsProject = `
  SELECT productos_proyectos.id, proyectos.id as proyecto, productos.descripcion as name, productos_proyectos.cantidad as quantity, productos_proyectos.instrucciones as instructions, productos_instalable.instalable as installable , productos_proyectos.direccion as address, usuarios.usuario as responsible
from productos_proyectos, proyectos, usuarios, productos, productos_instalable
where productos.id = fk_producto  and proyectos.id = fk_proyecto and usuarios.id = productos_proyectos.fk_responsable
and productos_instalable.id = productos_proyectos.instalable AND
productos_proyectos.fk_proyecto = ${projectId}
  `;
  let productCount = 0;
  $.ajax("../backend/fecthBd.php", {
    type: "get",
    data: { type: 2, sql: sqlProject },
    success: function (res) {
      const detailData = JSON.parse(res)
      if(detailData.length==0){
        redirectFile("../views/404.php");
      }else{
        document.getElementById("content-views").innerHTML = projectDetails(
          detailData[0]
        );
        $.ajax("../backend/fecthBd.php", {
          type: "get",
          data: { type: 2, sql: sqlProductsProject },
          success: function (res) {
            const detailData = JSON.parse(res);
            detailData.forEach((element) => {
              productCount++;
              document.getElementById(
                "project-detail-table-body"
              ).innerHTML += productsProjectDetail(element, productCount);
            });
          },
          error: function () {},
        });
      }
    },
    error: function () {},
  });
};


function getProjectRowId(reference) {
  var currow = $(reference).closest("tr");
  var rowSelected = currow.find(":nth-child(1)");
  return rowSelected[0].textContent;
}
