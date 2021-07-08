import { showCheckboxes, onlyOneSelect } from "../../js/animateSelect.js"
import { interactiveTable } from "../../js/app.js"
import {
  projectDetails,
  productsProjectDetail,
} from "../views/projectDetails.js"
import { setRoute, setRouteWithValue } from "../../routes/adminRoutes.js"
import { clsCustomer } from "./customer.js"
import { newCustomer } from "../views/customer.js"
import { showPopUp, hidePopUp } from "../../js/pop-up.js"
import { asignPopUp } from "../views/asignStage.js"
import { showProjectStages } from "./stages.js"
import { activitiesEmpty } from "../views/activities.js"
import {
  renderAll,
  renderByProject_activeByProducts,
} from "../controllers/activities.js"
import {
  activeProjects_tr,
  delayedProjects_tr,
  projectNotFound,
  scheduledProjects_tr,
  tableTemplate,
} from "../views/projects.js"

let detailsTemp

class clsProject {
  constructor(productsCount) {
    this.productsCount = productsCount
  }

  getCreationData = () => {
    return {
      category: parseInt(document.getElementById("projectCategory").value),
      customer: document.getElementById("projectCustomer_select").value,
      responsible: parseInt(document.getElementById("spanUserId").textContent),
      value: document.getElementById("projectValue").value,
      valuePaid: "0",
      observations: document.getElementById("projectObservations").value || " ",
      beginDate: document.getElementById("projectBeginDate").value,
      finishDate: document.getElementById("projectFinishDate").value,
      status: 1,
      paymentStatus: document.getElementById("projectPaymentStatus").value,
    }
  }

  isProjectDataFilled = (data) => {
    let isFilled = 0
    let length = 0

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        for (const element in data[i]) {
          if (element != "responsible" && element != "projectId") {
            length++
            if (data[i][element]) {
              isFilled++
            }
          }
        }
      }
    } else {
      for (const element in data) {
        if (
          element != "responsible" &&
          element != "projectId" &&
          element != "observations" &&
          element != "value" &&
          element != "valuePaid"
        ) {
          length++
          if (data[element]) {
            isFilled++
          }
        }
      }
    }

    if (isFilled == length) {
      return true
    } else {
      return false
    }
  }

  isStageAsigned() {
    for (let i = 0; i < document.getElementsByName("checkStage").length; i++) {
      if (document.getElementsByName("checkStage")[i].checked == true) {
        console.log("true")
      }
    }
  }

  showStageAsignment(projectObject) {
    if (this.isProjectDataFilled(this.getCreationData())) {
      if (this.isProjectDataFilled(this.getProductsProject())) {
        showPopUp(asignPopUp()).then(onlyOneSelect())
        initializeProjectCreation_popUp(projectObject)
      } else {
        alert("Llene todos los campos!")
      }
    } else {
      alert("Llene todos los campos!")
    }
  }

  createProject() {
    if (this.isProjectDataFilled(this.getCreationData())) {
      if (this.isProjectDataFilled(this.getProductsProject())) {
        const p1 = Promise.resolve(this.addProjectItems())
        p1.then((projectRes) => {
          if (projectRes) {
            const productsItems = this.getProductsProject()
            const p2 = Promise.resolve(
              this.addProductProjectItems(productsItems)
            )

            p2.then((productsRes) => {
              if (productsRes) {
                this.resetProjectInputs()
                this.resetProductsProjectInputs()
                document.getElementById("overlay").classList.remove("overlay")
                document.querySelector("#overlay").innerHTML = null

                $("html, body").animate({ scrollTop: 0 }, "slow")
                $("#succesProjectCreation").show(1500)
                setTimeout(() => {
                  $("#succesProjectCreation").hide(1500)
                }, 3000)
              } else {
                alert("¡Ocurrio un error en los productos!")
              }
            })
          } else {
            alert("¡Ocurrio un error en el proyecto!")
          }
        }).catch((res) => {
          alert("¡Ocurrio un error!")
          console.warn(res)
        })
      } else {
        alert("Llene todos los campos!")
      }
    } else {
      alert("Llene todos los campos!")
    }
  }

  addProjectItems() {
    let response
    $.ajax("../backend/project.php", {
      async: false,
      type: "post",
      data: {
        action: "create",
        category: this.getCreationData().category,
        customer: this.getCreationData().customer,
        responsible: this.getCreationData().responsible,
        value: this.getCreationData().value,
        valuePaid: this.getCreationData().valuePaid,
        observations: this.getCreationData().observations,
        beginDate: this.getCreationData().beginDate,
        finishDate: this.getCreationData().finishDate,
        status: this.getCreationData().status,
        paymentStatus: this.getCreationData().paymentStatus,
      },
      success: function (res) {
        const jsonRes = JSON.parse(res)
        if (jsonRes.error) {
          console.warn(jsonRes.message)
          response = false
        } else {
          response = true
        }
      },
      error: function (err) {
        alert(err)
        response = false
      },
    })
    return response
  }

  addProductProjectItems = (ary) => {
    let response
    const userId = document.getElementById("spanUserId").textContent
    ary.forEach((element) => {
      $.ajax("../backend/productsProject.php", {
        async: false,
        type: "post",
        data: {
          action: "create",
          projectId: null,
          productId: element.id,
          quantity: element.quantity,
          instructions: element.instructions,
          installable: element.installable,
          address: element.address,
          status: element.status,
          responsibleRecep: userId,
          responsible: element.responsible,
          stage: element.stage,
        },
        success: function (res) {
          const jsonRes = JSON.parse(res)
          if (jsonRes.error) {
            console.warn(jsonRes.message)
            response = false
          } else {
            response = true
          }
        },
        error: function (err) {
          alert(err)
          response = false
        },
      })
    })
    return response
  }

  updateProject() {
    const pCount = this.getProductsCount()
    const productsProject = this.getProductsProjectOnUpdate()

    if (this.isProjectDataFilled(this.getProjectInfoOnUpdate())) {
      if (this.isProjectDataFilled(this.getProductsProjectOnUpdate())) {
        $.ajax("../backend/project.php", {
          type: "post",
          data: {
            action: "update",
            id: this.getProjectInfoOnUpdate().id,
            category: this.getProjectInfoOnUpdate().category,
            customer: this.getProjectInfoOnUpdate().customer,
            value: this.getProjectInfoOnUpdate().value,
            valuePaid: this.getProjectInfoOnUpdate().valuePaid,
            observations: this.getProjectInfoOnUpdate().observations,
            beginDate: this.getProjectInfoOnUpdate().beginDate,
            finishDate: this.getProjectInfoOnUpdate().finishDate,
            status: this.getProjectInfoOnUpdate().status,
            paymentStatus: this.getProjectInfoOnUpdate().paymentStatus,
          },
          success: function (res) {
            const updateRes = JSON.parse(res)
            console.log(res)
            if (updateRes.error) {
              console.log(updateRes.message)
            } else {
              for (let i = 0; i < pCount; i++) {
                $.ajax("../backend/productsProject.php", {
                  type: "post",
                  data: {
                    action: productsProject[i].action,
                    projectId: productsProject[i].projectId,
                    productProjectId: productsProject[i].productProjectId,
                    productId: productsProject[i].product,
                    quantity: productsProject[i].quantity,
                    instructions: productsProject[i].instructions,
                    installable: productsProject[i].installable,
                    address: productsProject[i].address,
                    responsible: productsProject[i].responsible,
                    asignationStatus: productsProject[i].asignationStatus,
                  },
                  success: function (res) {
                    console.log(res)
                    const jsonRes = JSON.parse(res)
                    if (jsonRes.error) {
                      console.log(jsonRes.message)
                    } else {
                      $("html, body").animate({ scrollTop: 0 }, "slow")
                      $("#succesProjectEdition").show(1500)
                      setTimeout(() => {
                        $("#succesProjectEdition").hide(1500)
                      }, 3000)
                    }
                  },
                  error: function (err) {
                    alert(err)
                  },
                })
              }
            }
          },
          error: function (err) {
            alert(err)
          },
        })
      } else {
        alert("Llene todos los campos!")
      }
    } else {
      alert("Llene todos los campos!")
    }
  }

  async addNewProductOption(action) {
    this.productsCount++
    let pCount = this.getProductsCount()

    let products = ""
    let responsibles = ""
    let statuses = ""

    await $.ajax("../backend/products.php", {
      type: "get",
      data: { filterBy: "all" },
      success: function (respuesta) {
        const jsonRes = JSON.parse(respuesta)

        if (jsonRes.error) {
          console.log(jsonRes.message)
        } else {
          jsonRes.forEach((element) => {
            products += `
            <option value="${element.id}"> ${element.description} </option>
            `
          })
        }
      },
      error: function () {
        alert("No se ha podido obtener la información")
      },
    })

    await $.ajax("../backend/users.php", {
      type: "get",
      data: { filterBy: "all" },
      success: function (res) {
        const detailRes = JSON.parse(res)

        detailRes.forEach((element) => {
          responsibles += `
                  <option value=${element.id}>${element.name}</option>
                  `
        })
      },
      error: function () {
        alert("No se ha podido obtener la información")
      },
    })

    const tBody = document.getElementById("project-admin-table-body")
    let productRow = ""
    if (action) {
      productRow = `<tr class="project-creation-table">
    <th>${pCount}</th>
    <td>
    <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true" >
    ${products}
    </select>
  </td>
    <td>
      <input type="number" class="td-small form-control" style="font-size: 0.8rem !important;" min="1"
        onkeypress="return isNumberKey(event)">
    </td>
    <td>
      <select class="td-small form-control select-address" style="font-size: 0.8rem; ">
        <option value="2">No</option>
        <option value="1">Si</option>
      </select>
    </td>
    <td>
    <textarea id="projectObservations" cols="12" rows="1" class="td-area form-control" maxlength="150"></textarea>
    </td>
    <td>
         <textarea cols="4" rows="1" class="td-area form-control" maxlength="150"></textarea>
      </td>
    <td class="text-center">
      <span><i class="fas fa-trash"></i></i></span>
    </td>
  </tr>`
    } else {
      productRow = `<tr class="project-creation-table">
      <th>${pCount}</th>
      <td>
      <select class="editableBox select-table-input" title="Seleccione una opción" data-live-search="true" >
      ${products}
      </select>
    </td>
      <td>
        <input type="number" class="td-small form-control" style="font-size: 0.8rem !important;" min="1"
          onkeypress="return isNumberKey(event)">
      </td>
      <td>
        <select class="td-small form-control select-address" style="font-size: 0.8rem; ">
          <option value="2">No</option>
          <option value="1">Si</option>
        </select>
      </td>
      <td>
      <textarea id="projectObservations" cols="12" rows="1" class="td-area form-control" maxlength="150"></textarea>
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
    </tr>`
    }

    tBody.insertAdjacentHTML("beforeend", productRow)
    $(".editableBox").selectpicker()
  }

  deleteProductRow = (confirmation) => {
    if (confirmation === true) {
      $("#project-admin-table-body").on("click", ".fa-trash", function () {
        let confirmRes = confirm("¿Está seguro de eliminar?")
        if (confirmRes) {
          var currow = $(this).closest("tr")
          var rowSelected = currow.find(":nth-child(1)")
          const tBody = document.getElementById("project-admin-table-body")
          tBody.removeChild(rowSelected.prevObject[0])
        }
      })
    } else {
      $("#project-admin-table-body").on("click", ".fa-trash", function () {
        var currow = $(this).closest("tr")
        var rowSelected = currow.find(":nth-child(1)")
        const tBody = document.getElementById("project-admin-table-body")
        tBody.removeChild(rowSelected.prevObject[0])
      })
    }
  }

  getProductsProject = () => {
    const tBody = document.getElementById("project-admin-table-body")
    let products = []
    for (let i = 0; i < tBody.children.length; i++) {
      products[i] = {
        id: tBody.children[i].children[1].children.item(0).children[0].value,
        quantity: tBody.children[i].children[2].children[0].value,
        installable: tBody.children[i].children[3].children[0].value,
        address: tBody.children[i].children[4].children[0].value || " ",
        instructions: tBody.children[i].children[5].children[0].value || " ",
        status: 1,
        responsible:
          tBody.children[i].children[6].children[0].querySelector(
            ".editableBox"
          ).value || null,
        stage: getProjectStage() || "null",
      }
    }
    return products
  }

  getProjectInfoOnUpdate() {
    return {
      id: document.getElementById("projectNo").textContent,
      category: document.getElementById("projectCategory_select").value,
      customer: document.getElementById("projectCustomer_select").value,
      value: document.getElementById("projectValue").value,
      valuePaid: 0,
      observations: document.getElementById("projectObservations").value,
      beginDate: document.getElementById("projectBeginDate").value,
      finishDate: document.getElementById("projectFinishDate").value,
      status: document.getElementById("projectStatus_select").value,
      paymentStatus: document.getElementById("projectPaymentStatus").value,
    }
  }

  getProductsProjectOnUpdate() {
    const tBody = document.getElementById("project-admin-table-body")
    let productsProject = []
    for (let i = 0; i < tBody.children.length; i++) {
      let tempResponsible = null
      let asignationStatus = 2
      if (tBody.children[i].children[6].children[0].children[0].value != "") {
        tempResponsible =
          tBody.children[i].children[6].children[0].children[0].value
        asignationStatus = 1
      }

      if (tBody.children[i].children[0].children[0]) {
        productsProject[i] = {
          action: "update",
          projectId: null,
          productProjectId:
            tBody.children[i].children[0].children[0].textContent,
          product:
            tBody.children[i].children[1].children.item(0).children[0].value,
          quantity: tBody.children[i].children[2].children[0].value,
          installable: tBody.children[i].children[3].children[0].value,
          address: tBody.children[i].children[4].children[0].value,
          instructions: tBody.children[i].children[5].children[0].value,
          responsible: tempResponsible,
          asignationStatus: asignationStatus,
        }
      } else {
        productsProject[i] = {
          action: "create",
          projectId: document.getElementById("projectNo").textContent,
          productProjectId: tBody.children[i].children[0].textContent,
          product:
            tBody.children[i].children[1].children.item(0).children[0].value,
          quantity: tBody.children[i].children[2].children[0].value,
          installable: tBody.children[i].children[3].children[0].value,
          address: tBody.children[i].children[4].children[0].value || " ",
          instructions: tBody.children[i].children[5].children[0].value || " ",
          responsible: tempResponsible,
          asignationStatus: asignationStatus,
        }
      }
    }
    return productsProject
  }

  getProductsCount() {
    return this.productsCount
  }

  getFullProjectData = () => {
    return [this.getCreationData(), this.getProductsProject()]
  }

  resetProductsProjectInputs() {
    const tBody = document.getElementById("project-admin-table-body")
    for (let i = 0; i < tBody.children.length; i++) {
      tBody.children[
        i
      ].children[1].children[0].children[1].children[0].children[0].children[0].textContent =
        "Seleccione una opción"
      tBody.children[0].children[1].children[0].children[1].classList.add(
        "bs-placeholder"
      )
      tBody.children[i].children[2].children[0].value = null
      tBody.children[i].children[3].children[0].value = 2
      tBody.children[i].children[4].children[0].value = null
      tBody.children[i].children[5].children[0].value = null
    }
  }
  resetProjectInputs = () => {
    document.getElementById(
      "projectCategory"
    ).parentElement.children[1].children[0].children[0].children[0].textContent =
      "Seleccione una opción"
    document
      .getElementById("projectCategory")
      .parentElement.children[1].classList.add("bs-placeholder")
    document.getElementById(
      "projectCustomer_select"
    ).parentElement.children[1].children[0].children[0].children[0].textContent =
      "Seleccione una opción"
    document
      .getElementById("projectCustomer_select")
      .parentElement.children[1].classList.add("bs-placeholder")
    document.getElementById("projectObservations").value = null
    document.getElementById("projectBeginDate").value = null
    document.getElementById("projectFinishDate").value = null
  }

  onProductProjectStatusChange() {
    $("#project-admin-table-body").on("change", ".select-status", function () {
      var currow = $(this).closest("tr")
      var rowSelected =
        currow.find(":nth-child(1)").prevObject[0].children[7].children[0].value
      console.log(rowSelected)
      if (rowSelected == 2) {
        document.getElementById("projectStatus_select").value = 2
        document.getElementById(
          "projectStatus_select"
        ).parentNode.children[1].children[0].children[0].children[0].textContent =
          "Iniciado"
      }
    })
  }
}

const currentDate = () => {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month <= 9) {
    month = "0" + month
  }
  let day = date.getDate()
  if (day <= 9) {
    day = "0" + day
  }
  return year + "-" + month + "-" + day
}

const currentDateTime = () => {
  const date = currentDate()
  const time = new Date()
  const hour = time.getHours()
  let minute = time.getMinutes()
  if (minute <= 9) {
    minute = "0" + minute
  }
  let second = time.getSeconds()
  if (second <= 9) {
    second = "0" + second
  }

  return date + "T" + hour + ":" + minute + ":" + second
}

export const animateFilterActive = function (isFiltered) {
  document.getElementById("filterButton").onclick = () => {
    if (isFiltered) {
      document.getElementById("filterButton").classList.remove("filter-active")
      isFiltered = false
    } else {
      document.getElementById("filterButton").classList.add("filter-active")
      filterDataTable()
      isFiltered = true
    }
  }
}

const filterDataTable = function () {
  const txtCliente = document.getElementById("txtClientFilter").value
  const txtResponsible = document.getElementById("txtResponsibleFilter").value
  const dateBegin = document.getElementById("dateBeginFilter").value
  const dateFinish = document.getElementById("dateFinishFilter").value
  console.log(txtCliente)
  console.log(txtResponsible)
  console.log(dateBegin)
  console.log(dateFinish)
}

export const initializeProjectView = () => {
  interactiveTable("project-admin-table")

  if (document.getElementById("btnCreateProjectView")) {
    document.getElementById("btnCreateProjectView").onclick = () => {
      setRoute("index.php?create_project")
    }
  }

  $("#project-admin-table-body").on("click", ".fa-eye", function () {
    const idProjectSelected = getProjectRowId(this)
    setRouteWithValue("index.php?project_details", idProjectSelected)
  })

  $("#project-admin-table-body").on("click", ".fa-edit", function async() {
    const idProjectSelected = getProjectRowId(this)
    setRouteWithValue("index.php?project_edit", idProjectSelected)
  })
}

export const initializeProjectCreation = async () => {
  const project = new clsProject(1)

  document
    .getElementById("projectBeginDate")
    .setAttribute("min", currentDateTime())
  document
    .getElementById("projectFinishDate")
    .setAttribute("min", currentDateTime())

  $(".editableBox").selectpicker()

  project.deleteProductRow(false)

  document.getElementById("newCustomer").onclick = async function (e) {
    e.preventDefault()
    showPopUp(await newCustomer()).then(
      document.getElementById("new_customer_id_input").focus()
    )
    updateCustomersList()
    document.getElementById("new_customer_button").onclick = function (e) {
      e.preventDefault()
      const customer = new clsCustomer()
      customer.addCustomer()
    }

    document.getElementById("closeCustomer-pop-up").onclick = function (e) {
      e.preventDefault()
      updateCustomersList()
      hidePopUp()
    }
  }

  document.getElementById("btnCreateProject").onclick = (e) => {
    project.showStageAsignment(project)
  }

  document.getElementById("projectBeginDate").onchange = () => {
    const beginDate = document.getElementById("projectBeginDate").value
    document.getElementById("projectFinishDate").setAttribute("min", beginDate)
    document.getElementById("projectFinishDate").removeAttribute("disabled")
  }

  document.getElementById("btnAddNewProjectProduct").onclick = () => {
    project.addNewProductOption()
  }
}

export function initializeProjectEdition() {
  const project = new clsProject(getEditableProductsCount())
  project.deleteProductRow(true)
  project.onProductProjectStatusChange()
  $(".editableBox").selectpicker()

  document.getElementById("newCustomer").onclick = async function (e) {
    e.preventDefault()
    showPopUp(await newCustomer())

    document.getElementById("new_customer_button").onclick = function (e) {
      e.preventDefault()
      const customer = new clsCustomer()
      customer.addCustomer()
    }

    document.getElementById("closeCustomer-pop-up").onclick = function (e) {
      e.preventDefault()
      updateCustomersList()
      hidePopUp()
    }
  }

  document.getElementById("btnUpdateProject").onclick = (e) => {
    project.updateProject()
  }

  document.getElementById("btnAddNewProjectProduct").onclick = () => {
    project.addNewProductOption("update")
  }
}

export function initializeProjectDetails() {
  listenToStage()

  listenToActivities()

  if (document.querySelector("#editOnDetail")) {
    document
      .querySelector("#editOnDetail")
      .addEventListener("click", function (e) {
        const idProject = document.querySelector(
          "span[name=projectNo]"
        ).textContent
        setRouteWithValue("index.php?project_edit", idProject)
      })
  }
}

function listenToStage() {
  if (document.querySelector("div[name=stages]")) {
    document
      .querySelector("div[name=stages]")
      .addEventListener("click", (e) => {
        detailsTemp = document.querySelector("#content-views").innerHTML
        const id =
          document.getElementsByName("projectNo")[0].children[1].textContent
        showProjectStages({ id })
      })
  } else if (document.querySelector("div[name=backward]")) {
    document
      .querySelector("div[name=backward]")
      .addEventListener("click", (e) => {
        document.querySelector("#content-views").innerHTML = detailsTemp
        initializeProjectDetails()
      })
  }
}

function listenToActivities() {
  if (document.querySelector("div[name=activities]")) {
    document
      .querySelector("div[name=activities]")
      .addEventListener("click", (e) => {
        const projectData = {
          id: document.querySelector("span[name=projectNo]").textContent,
          customer: document.querySelector("span[name=customer]").textContent,
          responsible: document.querySelector("span[name=responsible]")
            .textContent,
          category: document.querySelector("span[name=category]").textContent,
          value: document.querySelector("span[name=value]").textContent,
          beginDate: document.querySelector("span[name=beginDate]").textContent,
          finishDate: document.querySelector("span[name=finishDate]")
            .textContent,
          paymentStatus: document.querySelector("span[name=paymentStatus]")
            .textContent,
        }
        detailsTemp = document.querySelector("#content-views").innerHTML
        const id =
          document.getElementsByName("projectNo")[0].children[1].innerText
        renderByProject_activeByProducts(projectData).then(() => {
          document
            .querySelector("div[name=backward]")
            .addEventListener("click", (e) => {
              document.querySelector("#content-views").innerHTML = detailsTemp
              initializeProjectDetails()
            })
        })
      })
  }
}

function initializeProjectCreation_popUp(projectObject) {
  document.getElementById("finish_project_creation_btn").onclick = function () {
    let isStageAsigned = false
    for (let i = 0; i < document.getElementsByName("checkStage").length; i++) {
      if (document.getElementsByName("checkStage")[i].checked == true) {
        isStageAsigned = true
      }
    }

    if (isStageAsigned) {
      projectObject.createProject()
    } else {
      alert("Seleccione una estación")
    }
  }
}

export async function fetchProductsFromProject(id) {
  const req = await fetch(
    `../backend/productsProject.php?filterBy=project&project=${id}`
  )
  const res = await req.json()
  return res
}

export async function fetchStages(props) {
  const req = await fetch(
    `../backend/stage.php?filterBy=fromProductsProject&project=${props.project}&product=${props.product}`
  )
  const res = await req.json()
  return res
}

function getProjectStage() {
  let stage = null
  for (let i = 0; i < document.getElementsByName("checkStage").length; i++) {
    if (document.getElementsByName("checkStage")[i].checked == true) {
      stage = document.getElementsByName("checkStage")[i].value
    }
  }
  return stage
}

export const getProjectDataFromDataBase = (projectId) => {
  let productCount = 0
  $.ajax("../backend/project.php", {
    type: "get",
    data: { filterBy: "id", id: projectId },
    success: function (res) {
      if (res.includes("Error")) {
        console.warn(res)
        document.getElementById("content-views").innerHTML = res
      } else {
        const detailData = JSON.parse(res)
        if (detailData.error) {
          location.replace("../views/404.php")
        } else {
          document.getElementById("content-views").innerHTML =
            projectDetails(detailData)
          $.ajax("../backend/productsProject.php", {
            type: "get",
            data: { filterBy: "project", project: projectId },
            success: function (res) {
              if (res.includes("Error")) {
                console.warn(res)
                document.getElementById("content-views").innerHTML = res
              } else {
                const detailData = JSON.parse(res)

                if (detailData.error) {
                  document.getElementById(
                    "project-detail-table-header"
                  ).innerHTML = detailData.message
                } else {
                  detailData.forEach((element) => {
                    productCount++
                    document.getElementById(
                      "project-detail-table-body"
                    ).innerHTML += productsProjectDetail(element, productCount)
                  })
                  initializeProjectDetails()
                }
              }
            },
            error: function (err) {
              alert(err)
            },
          })
        }
      }
    },
    error: function (err) {
      alert(err)
    },
  })
}

export async function renderScheduledProjects(responsible) {
  const table = tableTemplate("Agendados")
  document.querySelector(".container-fluid").innerHTML = table

  const scheduledProjectsTable = document.querySelector(
    "#project-admin-table tbody"
  )

  const scheduledProjects = await fetchAllScheduled(responsible)

  if (scheduledProjects.length > 0) {
    scheduledProjects.forEach((element) => {
      scheduledProjectsTable.innerHTML += scheduledProjects_tr(element)
    })
  } else {
    scheduledProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

export async function renderActiveProjects(responsible) {
  const table = tableTemplate("Activos")
  document.querySelector(".container-fluid").innerHTML = table

  const activeProjectsTable = document.querySelector(
    "#project-admin-table tbody"
  )

  const activeProjects = await fetchAllActive()

  if (activeProjects.length > 0) {
    activeProjects.forEach((element) => {
      activeProjectsTable.innerHTML += activeProjects_tr(element)
    })
  } else {
    activeProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

export async function renderDelayedProjects(responsible) {
  const table = tableTemplate("retrasados")
  document.querySelector(".container-fluid").innerHTML = table

  const delayedProjectsTable = document.querySelector(
    "#project-admin-table tbody"
  )

  const delayedProjects = await fetchAllDelayed(responsible)

  if (delayedProjects.length > 0) {
    delayedProjects.forEach((element) => {
      delayedProjectsTable.innerHTML += delayedProjects_tr(element)
    })
  } else {
    delayedProjectsTable.innerHTML = ""
  }
  initializeProjectView()
}

async function fetchAllScheduled() {
  const req = await fetch(`../backend/project.php?filterBy=allScheduled`)
  const res = await req.json()
  return res
}

async function fetchAllActive() {
  const req = await fetch(`../backend/project.php?filterBy=allActive`)
  const res = await req.json()
  return res
}

async function fetchAllDelayed() {
  const req = await fetch(`../backend/project.php?filterBy=allDelayed`)
  const res = await req.json()
  return res
}

function getProjectRowId(reference) {
  var currow = $(reference).closest("tr")
  var rowSelected = currow.find(":nth-child(1)")
  return rowSelected[0].textContent
}

function getEditableProductsCount() {
  return document.getElementById("project-idition-table").children[1].children
    .length
}

function updateCustomersList() {
  document
    .querySelector(".project-info-1")
    .querySelector("div .d-flex").children[0].innerHTML = ""
  let customers = ""
  $.ajax("../backend/customers.php", {
    type: "get",
    data: { filterBy: "all" },
    success: function (res) {
      const detailRes = JSON.parse(res)

      detailRes.forEach((element) => {
        customers += `
                  <option value=${element.id}>${element.name} ${element.lastName}</option>
                  `
      })
      const div = document.createElement("div")
      div.innerHTML = `
      <select class="editableBox" id="projectCustomer_select" data-live-search="true"
      title="Seleccione una opción" style="font-size: 0.8rem !important">
      ${customers}
  </select>
      `
      document
        .querySelector(".project-info-1")
        .querySelector("div .d-flex")
        .replaceChild(
          div,
          document.querySelector(".project-info-1").querySelector("div .d-flex")
            .children[0]
        )
      $(".editableBox").selectpicker()
    },
    error: function () {
      alert("No se ha podido obtener la información")
    },
  })
}
