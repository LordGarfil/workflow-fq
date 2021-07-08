import { hidePopUp, showPopUp } from "../../js/pop-up.js"
import { stagesOnProjectDetails } from "../views/projectDetails.js"
import { initializeProjectDetails } from "./projects.js"
import {
  updateProductStage,
  filterStageTitle,
  headerStage,
  addProductStage_popUp,
  addProductStage_popUpEmpty,
} from "../views/stage.js"
import { showAlert } from "../../js/app.js"

export const showProjectStages = (project) => {
  fetch(`../backend/project.php?filterBy=stages&project=${project.id}`)
    .then(function (req) {
      return req.text()
    })
    .then(function (res) {
      res = JSON.parse(res)
      if (res.error) {
        renderErrorOnStage(project.id)
      } else {
        renderHeaderStage(res[0].proyecto)
        for (let i = 0; i < res.length; i++) {
          if (i > 0) {
            if (res[i].producto == res[i - 1].producto) {
              renderUniqueProductOnStage(res[i])
            } else {
              renderProductsOnStage(res[i])
            }
          } else {
            renderProductsOnStage(res[i])
          }
        }
        initializeStageView()
      }
    })
}

const renderHeaderStage = (projectId) => {
  const switchFilter = headerStage(projectId)
  document.getElementById("content-views").innerHTML = switchFilter
  initializeProjectDetails()
}

const renderUniqueProductOnStage = (res) => {
  const listFilterLength = document.querySelectorAll(".list-filter").length
  const listFilter =
    document.querySelectorAll(".list-filter")[listFilterLength - 1]
  listFilter.innerHTML += stagesOnProjectDetails(res)
  document.getElementById("content-views").appendChild(listFilter)
}

const renderProductsOnStage = (res) => {
  const listFilter = document.createElement("div")
  listFilter.classList.add("list-filter")
  let pDescription = filterStageTitle(res.producto)
  document
    .getElementById("content-views")
    .insertAdjacentHTML("beforeend", pDescription)
  listFilter.innerHTML += stagesOnProjectDetails(res)
  document.getElementById("content-views").appendChild(listFilter)
}

const renderErrorOnStage = (id) => {
  document.querySelector('#content-views').innerHTML = headerStage(id)
  initializeProjectDetails()
  initializeStageView()
}

const renderProductStageOnUpdate = (id) => {
  fetch(`../backend/stage.php?filterBy=id&id=${id}`)
    .then((req) => {
      return req.text()
    })
    .then((res) => {
      res = JSON.parse(res)

      fetch("../backend/stage.php?filterBy=stageStatus")
        .then((statusReq) => {
          return statusReq.text()
        })
        .then((statusRes) => {
          statusRes = JSON.parse(statusRes)
          fetch("../backend/users.php?filterBy=all")
            .then((responsibleReq) => {
              return responsibleReq.text()
            })
            .then((responsibleRes) => {
              responsibleRes = JSON.parse(responsibleRes)
              showPopUp(
                updateProductStage(res, statusRes, responsibleRes)
              ).then(() => {
                initializeUpdateState()
              })
            })
        })
    })
}

const onUpdate = (props) => {
  $.ajax("../backend/stage.php", {
    type: "post",
    data: {
      action: "update",
      id: props.id,
      status: props.status,
      responsible: props.responsible,
    },
    success: function (res) {
      const jsonRes = JSON.parse(res)

      if (jsonRes.error) {
        alert(jsonRes.error)
        console.log(jsonRes.error)
      } else {
        let alertElement = document.querySelector("#productStageAlertOnUpdate")
        showAlert(alertElement)
        const id = document.querySelector(
          'span[name="proyectId_stage"]'
        ).textContent
        showProjectStages({ id })
      }
    },
    error: function (err) {
      alert(err)
    },
  })
}

const initializeUpdateState = () => {
  document
    .querySelector("#updateProductStage_btn")
    .addEventListener("click", (e) => {
      const id = document.querySelector(
        'span[name="productStage_idUpdate"]'
      ).textContent
      const status = document.querySelector(
        'select[name="statusProductStage_select"]'
      ).value
      const responsible = document.querySelector(
        'select[name="responsibleProductStage_select"]'
      ).value
      onUpdate({ id, responsible, status })
    })
}

function newStage_listener() {

  let stages

  const initialize = async (projectId) => {
    const productReq = await fetch(`../backend/products.php?filterBy=fromProject&id=${projectId}`)
    const productRes = await productReq.json()

    if (!productRes.error) {
      const productOptions = productRes.map(element => `<option value=${element.id} >${element.producto}</option>`)
      document.querySelector("select[name=product_select]").innerHTML += productOptions

      const stageReq = await fetch(`../backend/stage.php?filterBy=projectStages`)
      const stageRes = await stageReq.json()
      const stageOptions = stageRes.map(element => `<option value=${element.id} >${element.etapa}</option>`)
      document.querySelector("select[name=stage_select]").innerHTML += stageOptions

      const responsableReq = await fetch(`../backend/users.php?filterBy=all`)
      const responsableRes = await responsableReq.json()
      const responsableOptions = responsableRes.map(element => `<option value=${element.id} >${element.name}</option>`)
      document.querySelector("select[name=responsable_select]").innerHTML += responsableOptions

      const statusReq = await fetch(`../backend/status.php?filterBy=project`)
      const statusRes = await statusReq.json()
      const statusOptions = statusRes.map(element => `<option value=${element.id} >${element.estado}</option>`)
      document.querySelector("select[name=status_select]").innerHTML += statusOptions
      stages = stageRes

    } else {
      document.querySelector('.pop-up-form').innerHTML = addProductStage_popUpEmpty()
    }


  }

  const addNewStage = () => {
    const newStage = {
      projectId: document.querySelector("span[name=proyectId_stage]").textContent,
      productId: document.querySelector("select[name=product_select]").selectedOptions[0].value,
      productDesc: document.querySelector("select[name=product_select]").selectedOptions[0].text,
      stageId: document.querySelector("select[name=stage_select]").selectedOptions[0].value,
      stageDesc: document.querySelector("select[name=stage_select]").selectedOptions[0].text,
      responsableId: document.querySelector("select[name=responsable_select]").selectedOptions[0].value,
      responsableDesc: document.querySelector("select[name=responsable_select]").selectedOptions[0].text,
      statusId: document.querySelector("select[name=status_select]").selectedOptions[0].value,
      statusDesc: document.querySelector("select[name=status_select]").selectedOptions[0].text,
    }
    if (newStage.productId != "" && newStage.stageId != "" && newStage.responsableId != "" && newStage.statusId != "") {
      uploadNewStage(newStage)
    }

  }

  const uploadNewStage = (stage) => {
    $.ajax("../backend/stage.php", {
      type: "post",
      data: {
        action: "add",
        project: stage.projectId,
        stage: stage.stageId,
        stageStatus: stage.statusId,
        product: stage.productId,
        responsible: stage.responsableId
      },
      success: function (res) {
        const jsonRes = JSON.parse(res);
        if (jsonRes.error) {
          console.warn(jsonRes.message);
          alert(jsonRes.message)
        } else {
          const productsFilterDiv = document.querySelector(`div[name=productFilterTitle] > h4[name=${stage.productDesc}]`).parentElement.nextElementSibling
          productsFilterDiv.innerHTML += stagesOnProjectDetails(jsonRes[0])
          hidePopUp()
        }
      },
      error: function (err) {
        alert(err);
      },
    });
  }

  const listenToProductChange = (context) => {
    const product = {
      id: context.target.selectedOptions[0].value,
      name: context.target.selectedOptions[0].textContent
    }
    reasignDefaultOptions()
    filterStagesFromProduct(product)
  }

  const reasignDefaultOptions = () => {
    document.querySelector("select[name=stage_select]").innerHTML = `<option value="">Seleccione una opción</option>`
    stages.forEach(element => {
      document.querySelector("select[name=stage_select]").innerHTML += `
    <option value=${element.id}>${element.etapa}</option>
    `
    })
  }

  const filterStagesFromProduct = (product) => {
    if (product.id != "") {

      if (document.querySelector(`div[name=productFilterTitle] > h4[name=${product.name}]`)) {
        const productsFilterDiv = document.querySelector(`div[name=productFilterTitle] > h4[name=${product.name}]`).parentElement.nextElementSibling
        let stagesFromProduct = Array.from(productsFilterDiv.querySelectorAll('span[name=productStageStatus]'))
        stagesFromProduct = stagesFromProduct.map(element => element.textContent)

        let filtered = []

        stagesFromProduct.forEach((stageProduct, index) => {
          const stagesFilter = (stages.filter(
            element => stageProduct == element.etapa
          ))
          filtered.push(stagesFilter[0])

          let selectIndex = stages.indexOf(filtered[index])

          if (index == 0) {
            selectIndex = stages.indexOf(filtered[index]) + 1
          }
          document.querySelector("select[name=stage_select]").remove(selectIndex)
        })
      }
    }
  }

  initialize(
    document.querySelector('span[name=proyectId_stage]').textContent
  )

  document
    .querySelector("button[name=newStage]")
    .addEventListener("click", (e) => {
      e.preventDefault()
      addNewStage()
    })

  document
    .querySelector("select[name=product_select]")
    .addEventListener("change", (e) => {
      listenToProductChange(e)
    })
}

const initializeStageView = () => {
  document.querySelectorAll(".fa-expand-alt").forEach((element) => {
    element.addEventListener("click", (e) => {
      const parentElement = e.target.parentElement.parentElement
      const id = parentElement.querySelector(
        'span[name="productStage_id"]'
      ).textContent
      renderProductStageOnUpdate(id)
    })
  })

  document
    .querySelector("button[name=btnNewStage]")
    .addEventListener("click", (e) => {
      showPopUp(addProductStage_popUp()).then(() => {
        newStage_listener()
      })
    })
}
