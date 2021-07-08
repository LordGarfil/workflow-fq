import {
  activityCard,
  activitiesEmpty,
  activityImage_PopUp,
} from "../views/activities.js";
import { hidePopUp, showPopUp } from "../../js/pop-up.js";
import { activityEdit_popUp, activityNew_popUp } from "../views/activities.js";
import { playLoader } from "../../js/app.js";

export async function render() {
  const activities = await fetchByProduct_responsible_active({
    project: document.querySelector("span[name=projectNo]").textContent,
    stage: document.querySelector("span[name=stageId]").textContent,
    product: document.querySelector("span[name=productId]").textContent,
    responsible: document.querySelector("#spanUserId").textContent,
  });

  if (!activities.error) {
    activities.forEach((element) => {
      document.getElementById("activities-container").innerHTML += activityCard(
        element
      );
    });
    listenToActivityEdit();
    listenToExpandImage();
  } else {
    document.getElementById(
      "activities-container"
    ).innerHTML = activitiesEmpty();
  }
  listenToActivityAdd();
}

async function renderNewActivity() {
  const activities = await fetchByLastProduct_responsible({
    project: document.querySelector("span[name=projectNo]").textContent,
    stage: document.querySelector("span[name=stageId]").textContent,
    product: document.querySelector("span[name=productId]").textContent,
    responsible: document.querySelector("#spanUserId").textContent,
  });

  if (!activities.error) {
    if (document.querySelector(".activities_empty")) {
      activities.forEach((element) => {
        document.getElementById(
          "activities-container"
        ).innerHTML = activityCard(element);
      });
    } else {
      activities.forEach((element) => {
        document.getElementById(
          "activities-container"
        ).innerHTML += activityCard(element);
      });
    }
    listenToActivityEdit();
    listenToExpandImage();
  }
  listenToActivityAdd();
}

function listenToActivityAdd() {
  document
    .querySelectorAll("button[name=btnAddNewActivity]")
    .forEach((element) => {
      element.addEventListener("click", function (e) {
        showPopUp(activityNew_popUp()).then(listenToAdd);
      });
    });
}
async function listenToActivityEdit(id) {
  document.querySelectorAll("i[name=edit_activity]").forEach((element) => {
    element.addEventListener("click", async function (e) {
      const activityId = e.target.parentElement.querySelector(
        "span[name=activityId]"
      ).textContent;
      const res = await fetch(
        `../backend/activities.php?filterBy=id&id=${activityId}`
      );
      await res.json().then(function (activity) {
        showPopUp(activityEdit_popUp(activity)).then(() =>{
          listenToUpdate();
          listenToDelete();
        });
      });
    });
  });
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
        );
      });
    });
}

async function fetchByProduct_responsible_all(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=productResponsible_all&project=${props.project}&stage=${props.stage}&product=${props.product}&responsible=${props.responsible}`
  );
  const res = await req.json();
  return res;
}

async function fetchByProduct_responsible_active(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=productResponsible_active&project=${props.project}&stage=${props.stage}&product=${props.product}&responsible=${props.responsible}`
  );
  const res = await req.json();
  return res;
}

async function fetchByLastProduct_responsible(props) {
  const req = await fetch(
    `../backend/activities.php?filterBy=lastProductResponsible&project=${props.project}&stage=${props.stage}&product=${props.product}&responsible=${props.responsible}`
  );
  const res = await req.json();
  return res;
}

function listenToAdd() {
  document.querySelector("#btnAddActivity").addEventListener("click", (e) => {
    e.preventDefault();

    let image = new FormData(document.getElementById("frm_CreateActivity"));
    image.append("image", document.querySelector("input[type=file]").files[0]);

    let imageInfo;
    image.forEach((element) => (imageInfo = element));

    if (imageInfo != "undefined") {
      uploadFile(image);
    }
  });
}

function listenToUpdate() {
  document
    .querySelector("#frm_UpdateActivity")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const activityId = document
        .querySelector("#frm_UpdateActivity")
        .parentElement.querySelector("span[name=activityId]").textContent;

      const comments = document.querySelector("#frm_UpdateActivity textarea")
        .value;

      const previousImage_src = document.querySelector(
        "#frm_UpdateActivity label[name=previousActivityImage_label]"
      ).textContent;

      let image = new FormData(document.getElementById("frm_UpdateActivity"));
      image.append(
        "image",
        document.querySelector("input[type=file]").files[0]
      );

      let imageInfo;
      image.forEach((element) => (imageInfo = element));

      if (imageInfo != "undefined") {
        image.append("previousImage", previousImage_src);
        updateFile(image, activityId, comments);
      } else {
        playLoader();
        updateActivity({
          id: activityId,
          comments: comments,
        });
      }
    });
}

function listenToDelete() {
  document
    .querySelector("div[name=delete-activity]")
    .addEventListener("click", (e) => {
      const activityId = document
        .querySelector("#frm_UpdateActivity")
        .parentElement.querySelector("span[name=activityId]").textContent;
      deleteActivity(activityId);
    });
}

function deleteActivity(id) {
  let confirmDelete = confirm("¿Esta seguro de eliminar la actividad?");
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
      removeDeletedCard(id);
      hidePopUp();
    });
  }
}

function createActivity(activity) {
  const path = "static/img/activities/";
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
  }).done(function (res) {
    renderNewActivity();
    hidePopUp();
  });
}

function updateActivity(activity) {
  const path = "static/img/activities/";
  let image;
  activity.image ? (image = path + activity.image) : (image = null);
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
    updateActivityCard(res);
    hidePopUp();
  });
}

function updateActivityCard(activity) {
  const element = document.querySelectorAll(".list-item span[name=activityId]");
  let oldActivity;
  for (let i = 0; i < element.length; i++) {
    if (element[i].textContent == activity.id) {
      
      oldActivity = element[i].parentNode.parentNode;
      const newActivity = document.createElement("div");
      newActivity.innerHTML = activityCard(activity)
      oldActivity.replaceWith(newActivity);
      listenToActivityEdit();
    listenToExpandImage();
      break;
    } else {
    }
  }
}

function removeDeletedCard(id) {
  const cardItems = document.querySelectorAll(
    ".list-item span[name=activityId]"
  );

  cardItems.forEach((element) => {
    if (element.textContent == id) {
      const removeCard_target = element.parentNode.parentNode;
      document
        .querySelector("#activities-container")
        .removeChild(removeCard_target);
    }
  });
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
  }).done(function (res) {
    playLoader()
    createActivity({
      project: document.querySelector("span[name=projectNo]").textContent,
      stage: document.querySelector("span[name=stageId]").textContent,
      product: document.querySelector("span[name=productId]").textContent,
      image: JSON.parse(res),
      responsible: document.querySelector("#spanUserId").textContent,
      comments: document.querySelector("textarea[name=activityComments]").value,
    });
  });
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
    playLoader();
    updateActivity({
      id: id,
      image: JSON.parse(res),
      comments: comments,
    });
  });
}
