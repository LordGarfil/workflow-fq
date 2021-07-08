import {
  activityCard,
  activitiesEmpty,
  activityImage_PopUp,
  activitiesContainer,
} from "../views/activities.js"
import { hidePopUp, showPopUp } from "../../js/pop-up.js"
import {
  activityEdit_popUp,
  activityNew_popUp_admin,
  activityFilter,
} from "../views/activities.js"
import { playLoader } from "../../js/app.js"
import { fetchProductsFromProject, fetchStages } from "./projects.js"

export async function renderAll() {
  const activities = await fetchAllActive()

  document.querySelector("#content-views").innerHTML = activitiesContainer()

  if (!activities.error) {
    activities.forEach((element) => {
      document.getElementById("activities-container").innerHTML +=
        activityCard(element)
    })
    listenToActivityEdit()
    listenToExpandImage()
  } else {
    document.getElementById("activities-container").innerHTML =
      activitiesEmpty()
  }
  listenToActivityAdd()
}

export async function renderByProject_active(project) {
  const activities = await fetchByProject_active(project)

  document.querySelector("#content-views").innerHTML =
    activitiesContainer(project)

  if (!activities.error) {
    activities.forEach((element) => {
      document.getElementById("activities-container").innerHTML +=
        activityCard(element)
    })
    listenToActivityEdit()
    listenToExpandImage()
  } else {
    document.getElementById("activities-container").innerHTML =
      activitiesEmpty()
  }
  listenToActivityAdd()
}

export async function renderByProject_activeByProducts(project) {
  document.querySelector("#content-views").innerHTML =
    activitiesContainer(project)
  filterActvitiesByProduct(project)

  listenToActivityAdd()
}

async function filterActvitiesByProduct(project) {
  const products = await fetchProductsFromProject(project.id)
  let filterActivities = []
  const activities = await fetchByProject_active(project)
  if (!activities.error) {
    activities.sort((a, b) =>
      a.fk_producto > b.fk_producto ? 1 : b.fk_producto > a.fk_producto ? -1 : 0
    )
    products.forEach((product, i) => {
      filterActivities.push(
        activities.filter(
          (element) =>
            products[i].productId === element.fk_producto &&
            element.fk_producto !== null
        )
      )
    })
    for (let i = 0; i < filterActivities.length; i++) {
      if (filterActivities[i][0] !== undefined) {
        const parentDiv = createProductFilter(filterActivities[i][0])
        let activitiesContainer = document.createElement("div")
        activitiesContainer.classList.add("list-filter")

        for (let j = 0; j < filterActivities[i].length; j++) {
          activitiesContainer.innerHTML += activityCard(filterActivities[i][j])
        }
        parentDiv.appendChild(activitiesContainer)
        document.getElementById("activities-container").appendChild(parentDiv)
      }
    }
    listenToActivityEdit()
    listenToExpandImage()
  } else {
    document.getElementById("activities-container").innerHTML =
      activitiesEmpty()
  }
}

function createProductFilter(product) {
  let parentDiv = document.createElement("div")
  parentDiv.style = "width: 100%"
  parentDiv.innerHTML = activityFilter(product)
  return parentDiv
}

async function renderNewActivity(activity) {
  const activities = await fetchByLastProduct_responsible({
    project: activity.project,
    stage: activity.stage,
    product: activity.product,
    responsible: activity.responsible,
  })
  if (!activities.error) {
    if (document.querySelector(".activities_empty")) {
      activities.forEach((element) => {
        const parentDiv = createProductFilter(element)
        let activitiesContainer = document.createElement("div")
        activitiesContainer.classList.add("list-filter")
        activitiesContainer.innerHTML += activityCard(element)
        parentDiv.appendChild(activitiesContainer)
        // document.getElementById("activities-container").appendChild(parentDiv)
        document.getElementById("activities-container").replaceChild(parentDiv, document.querySelector(".activities_empty"))
      })
    } else {
      activities.forEach((element) => {
        const divProduct = document.querySelector(
          `.activity-filter[name=product${element.fk_producto}]`
        )
        if (divProduct) {
          divProduct.nextElementSibling.innerHTML += activityCard(element)
        } else {
          const parentDiv = createProductFilter(element)
          let activitiesContainer = document.createElement("div")
          activitiesContainer.classList.add("list-filter")
          activitiesContainer.innerHTML += activityCard(element)
          parentDiv.appendChild(activitiesContainer)
          document.getElementById("activities-container").appendChild(parentDiv)
        }
      })
    }
    listenToActivityEdit()
    listenToExpandImage()
  }
  listenToActivityAdd()
}

async function listenToActivityAdd() {
  document
    .querySelector("button[name=btnAddNewActivity]")
    .addEventListener("click", function (e) {
      showPopUp(activityNew_popUp_admin()).then(async () => {

        const data = {
          project: document.querySelector("span[name=projectNo]").textContent,
          product: document.querySelector("select[name=stages]").value
        }

        const onProductChange = () => {
          document.querySelector("select[name=products]").addEventListener('change', async (e) => {
            data.product = e.target.value

            document.querySelector("select[name=stages]").innerHTML = `<option disabled="" selected="" value="">Etapa</option>`
            document.querySelector("select[name=stages]").innerHTML +=
              await setStages(data)
          })
        }
        console.log(data);
        document.querySelector("select[name=products]").innerHTML +=
          await setProducts(data.project)
        onProductChange()

      })
      listenToAdd()
    })
}

async function setProducts(id) {
  const products = await fetchProductsFromProject(id)
  let productsDetail = products.map(
    (element) => `<option value=${element.productId}>${element.name}</option>`
  )
  return productsDetail
}

async function setStages(props) {
  const stages = await fetchStages(props)
  console.log(stages);
  let stagesDetail = stages.map(
    (element) => `<option value=${element.id}>${element.etapa}</option>`
  )
  return stagesDetail
}

async function listenToActivityEdit(id) {
  document.querySelectorAll("i[name=edit_activity]").forEach((element) => {
    element.addEventListener("click", async function (e) {
      const activityId = e.target.parentElement.querySelector(
        "span[name=activityId]"
      ).textContent
      const res = await fetch(
        `../backend/activities.php?filterBy=id&id=${activityId}`
      )
      await res.json().then(function (activity) {
        showPopUp(activityEdit_popUp(activity)).then(() => {
          listenToUpdate()
          listenToDelete()
        })
      })
    })
  })
}

function listenToExpandImage() {
  document
    .querySelectorAll("img[name=activityUnexpandedImage]")
    .forEach((element) => {
      element.addEventListener("click", function (e) {
        showPopUp(
          activityImage_PopUp({
            fecha: e.target.parentElement.parentElement.querySelector(
              "span[name=activityDate]"
            ).textContent,
            imagen: e.target.src,
          })
        )
      })
    })
}

function listenToHeaderTools() {
  document
}

async function fetchAll(props) {
  const req = await fetch(`../backend/activities.php?filterBy=all`)
  const res = await req.json()
  return res
}

async function fetchAllActive(props) {
  const req = await fetch(`../backend/activities.php?filterBy=allActive`)
  const res = await req.json()
  return res
}

async function fetchByProject(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=projectId&projectId=${props.projectId}`
  )
  const res = await req.json()
  return res
}

async function fetchByProject_active(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=projectId_active&projectId=${props.id}`
  )
  const res = await req.json()
  return res
}

async function fetchByProduct_responsible(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=productResponsible&project=${props.project}&stage=${props.stage}&product=${props.product}&responsible=${props.responsible}`
  )
  const res = await req.json()
  return res
}

async function fetchByLastProduct_responsible(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=lastProductResponsible&project=${props.project}&stage=${props.stage}&product=${props.product}&responsible=${props.responsible}`
  )
  const res = await req.json()
  return res
}

function listenToAdd() {
  document.querySelector("#btnAddActivity").addEventListener("click", (e) => {
    e.preventDefault()

    let image = new FormData(document.getElementById("frm_CreateActivity"))
    image.append("image", document.querySelector("input[type=file]").files[0])

    let imageInfo
    image.forEach((element) => (imageInfo = element))

    const product = document.querySelector("select[name=products]")
      .selectedOptions[0].value

    const stage = document.querySelector("select[name=stages]")
      .selectedOptions[0].value

    if (imageInfo != "undefined" && product != "" && stage != "") {
      uploadFile(image)
    } else {
    }
  })
}

function listenToUpdate() {
  document
    .querySelector("#frm_UpdateActivity")
    .addEventListener("submit", (e) => {
      e.preventDefault()
      const activityId = document
        .querySelector("#frm_UpdateActivity")
        .parentElement.querySelector("span[name=activityId]").textContent

      const comments = document.querySelector(
        "#frm_UpdateActivity textarea"
      ).value

      const previousImage_src = document.querySelector(
        "#frm_UpdateActivity label[name=previousActivityImage_label]"
      ).textContent

      let image = new FormData(document.getElementById("frm_UpdateActivity"))
      image.append("image", document.querySelector("input[type=file]").files[0])

      let imageInfo
      image.forEach((element) => (imageInfo = element))

      if (imageInfo != "undefined") {
        image.append("previousImage", previousImage_src)
        updateFile(image, activityId, comments)
      } else {
        playLoader()
        updateActivity({
          id: activityId,
          comments: comments,
        })
      }
    })
}

function listenToDelete() {
  document
    .querySelector("div[name=delete-activity]")
    .addEventListener("click", (e) => {
      const activityId = document
        .querySelector("#frm_UpdateActivity")
        .parentElement.querySelector("span[name=activityId]").textContent
      deleteActivity(activityId)
    })
}

function deleteActivity(id) {
  let confirmDelete = confirm("¿Esta seguro de eliminar la actividad?")
  if (confirmDelete) {
    $.ajax({
      url: "../backend/activities.php",
      type: "post",
      dataType: "json",
      data: {
        action: "delete",
        id: id,
      },
    }).done(function (res) {
      removeDeletedCard(id)
      hidePopUp()
    })
  }
}

function createActivity(activity) {
  if (activity.product != "" && activity.stage != "") {
    const path = "static/img/activities/"
    $.ajax({
      url: "../backend/activities.php",
      type: "post",
      dataType: "json",
      data: {
        action: "add",
        project: activity.project,
        stage: activity.stage,
        product: activity.product,
        image: path + activity.image,
        responsible: activity.responsible,
        comments: activity.comments,
      },
    })
      .done(function (res) {
        renderNewActivity({
          project: activity.project,
          stage: activity.stage,
          product: activity.product,
          responsible: activity.responsible,
        })
        hidePopUp()
      })
      .fail(function (error) {
        console.warn(error)
      })
  } else {
  }
}

function updateActivity(activity) {
  const path = "static/img/activities/"
  let image
  activity.image ? (image = path + activity.image) : (image = null)
  $.ajax({
    url: "../backend/activities.php",
    type: "post",
    dataType: "json",
    data: {
      action: "update",
      id: activity.id,
      image: image,
      comments: activity.comments,
    },
  }).done(function (res) {
    updateActivityCard(res)
    hidePopUp()
  })
}

function updateActivityCard(activity) {
  const element = document.querySelectorAll(".list-item span[name=activityId]")
  let oldActivity
  for (let i = 0; i < element.length; i++) {
    if (element[i].textContent == activity.id) {
      oldActivity = element[i].parentNode.parentNode
      const newActivity = document.createElement("div")
      newActivity.innerHTML = activityCard(activity)
      oldActivity.replaceWith(newActivity)
      listenToActivityEdit()
      listenToExpandImage()
      break
    }
  }
}

function removeDeletedCard(id) {
  const cardItems = document.querySelectorAll(
    ".list-item span[name=activityId]"
  )

  cardItems.forEach((element) => {
    if (element.textContent == id) {
      const parentDiv = element.parentNode.parentNode.parentNode
      const removeCard_target = element.parentNode.parentNode
      parentDiv.removeChild(removeCard_target)
    }
  })
}

function uploadFile(file) {
  $.ajax({
    url: "../backend/createFile.php",
    type: "post",
    dataType: "html",
    data: file,
    cache: false,
    contentType: false,
    processData: false,
  })
    .done(function (res) {
      playLoader()
      createActivity({
        project: document.querySelector("span[name=projectNo]").textContent,
        stage: document.querySelector("select[name=stages]").selectedOptions[0]
          .value,
        product: document.querySelector("select[name=products]")
          .selectedOptions[0].value,
        image: JSON.parse(res),
        responsible: document.querySelector("#spanUserId").textContent,
        comments: document.querySelector("textarea[name=activityComments]")
          .value,
      })
    })
    .fail(function (error) {
      console.warn(error)
    })
}

function updateFile(formData, id, comments) {
  $.ajax({
    url: "../backend/updateFile.php",
    type: "post",
    dataType: "html",
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
  }).done(function (res) {
    playLoader()
    updateActivity({
      id: id,
      image: JSON.parse(res),
      comments: comments,
    })
  })
}
