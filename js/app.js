export function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false

  return true
}

export function playLoader() {
  document.querySelector(".spinner_loader").style.display = "block"
  document.querySelector(".spinner_loader").style.webkitAnimationPlayState =
    "running"
}

function editableSelectValue_asign(input, select) {
  input.value = select.selectedOptions[0].text
  console.log(input.value)
}

export function setFormattedDate(date) {
  let formattedDate = date.split("-", 3)
  let year = formattedDate[0]
  let month = formattedDate[1]
  let day = formattedDate[2].split(" ", 1)[0]

  switch (month) {
    case "01":
      month = "Enero"
      break
    case "02":
      month = "Febrero"
      break
    case "03":
      month = "Marzo"
      break
    case "04":
      month = "Abril"
      break
    case "05":
      month = "Mayo"
      break
    case "06":
      month = "Junio"
      break
    case "07":
      month = "Julio"
      break
    case "08":
      month = "Agosto"
      break
    case "09":
      month = "Septiembre"
      break
    case "10":
      month = "Octubre"
      break
    case "11":
      month = "Noviembre"
      break
    case "12":
      month = "Diciembre"
      break

    default:
      break
  }
  return `${day} de ${month.toLowerCase()} del ${year}`
}

export function setFormattedShortDate(date) {
  let formattedDate = date.split("-", 3)
  let year = formattedDate[0]
  let month = formattedDate[1]
  let day = formattedDate[2].split(" ", 1)[0]

  switch (month) {
    case "01":
      month = "Ene"
      break
    case "02":
      month = "Feb"
      break
    case "03":
      month = "Mar"
      break
    case "04":
      month = "Abr"
      break
    case "05":
      month = "May"
      break
    case "06":
      month = "Jun"
      break
    case "07":
      month = "Jul"
      break
    case "08":
      month = "Ago"
      break
    case "09":
      month = "Sep"
      break
    case "10":
      month = "Oct"
      break
    case "11":
      month = "Nov"
      break
    case "12":
      month = "Dic"
      break

    default:
      break
  }
  return `${day} ${month} ${year}`
}

export function setFormattedDateTime(date) {
  let formattedDate = date.split("-", 3)
  let year = formattedDate[0]
  let month = formattedDate[1]
  let day = formattedDate[2].split(" ", 1)[0]
  let time = formattedDate[2].slice(3, 8)

  switch (month) {
    case "01":
      month = "Enero"
      break
    case "02":
      month = "Febrero"
      break
    case "03":
      month = "Marzo"
      break
    case "04":
      month = "Abril"
      break
    case "05":
      month = "Mayo"
      break
    case "06":
      month = "Junio"
      break
    case "07":
      month = "Julio"
      break
    case "08":
      month = "Agosto"
      break
    case "09":
      month = "Septiembre"
      break
    case "10":
      month = "Octubre"
      break
    case "11":
      month = "Noviembre"
      break
    case "12":
      month = "Diciembre"
      break

    default:
      break
  }
  return `${day} de ${month.toLowerCase()} del ${year} (${time})`
}

export function getFormattedDateTime() {
  const tempDate = new Date()

  let year = tempDate.getFullYear()
  let month = tempDate.getMonth() + 1
  if (month <= 9) {
    month = `0${month}`
  }
  let day = tempDate.getDay()
  if (day <= 9) {
    day = `0${day}`
  }

  const date = ` ${year}-${month}-${day}`

  let hour = tempDate.getHours()
  if (hour <= 9) {
    hour = `0${hour}`
  }
  let minutes = tempDate.getMinutes()
  if (minutes <= 9) {
    minutes = `0${minutes}`
  }
  let seconds = tempDate.getSeconds()
  if (seconds <= 9) {
    seconds = `0${seconds}`
  }

  const time = `${hour}:${minutes}:${seconds}`

  return `${date} ${time}`
}

export const redirectFile = (file) => {
  window.location.href = file
}

export const renderView = async (view, renderContent) => {
  const res = await fetch(view)
  const data = await res.text()

  document.querySelector(".container-fluid").innerHTML = ""
  const div = document.createElement("div")

  div.innerHTML = data
  document.querySelector(".container-fluid").append(div)
  if (renderContent) {
    renderContent()
  }
}

export function showAlert(element, text) {
  element.removeAttribute("hidden")
  setInterval(() => {
    element.setAttribute("hidden", "true")
  }, 4500)
  if (text) {
    element.textContent = text
  }
}

export function emailExists(email) {
  const url = `../backend/validateEmail.php?email=${email}`
  let res = $.get(url)

  return res
}

export function interactiveTable(table, extra) {
  $(document).ready(function () {
    $("#" + table).DataTable({
      info: false,
      language: {
        decimal: "",
        emptyTable: "Hmm, no hay datos :/",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 a 0 de 0 registros",
        infoFiltered: "(filtered from _MAX_ total entries)",
        infoPostFix: "",
        thousands: ",",
        lengthMenu: "Mostrar _MENU_ registros",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        search: "Buscar",
        zeroRecords: "Sin coincidencias",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior",
        },
        aria: {
          sortAscending: ": activate to sort column ascending",
          sortDescending: ": activate to sort column descending",
        },
      },
      responsive: true,
      order: [[0, "des"]],
    })
  })
}

export function defineStatusStyle(status) {
  if (status === "Agendado" || status === "Sin iniciar") {
    return `"
        background-color: #dce3f9;
        border-color: #cdd8f6;
        border-radius: 3px;
        padding: 6px 8px;
        width: auto;"`
  } else if (status === "Iniciado" || status === "Iniciada") {
    return `"
          background-color: #4BCA81;
          border-radius: 3px;
          padding: 6px 8px;
          width: auto;"`
  } else if (status === "Finalizado" || status === "Finalizada") {
    return `"
          background-color: #2196F3;
          border-radius: 3px;
          padding: 6px 8px;
          width: auto;"`
  } else if (status === "Cancelado" || status === "Cancelada") {
    return `"
          background-color: #FBB6BC;
          border-color: #f5c6cb;
          border-radius: 3px;
          padding: 6px 8px;
          width: auto;"`
  } else if (status === "Suspendido" || status === "Suspendida") {
    return `"
          background-color: #F9BD50;
          border-radius: 3px;
          padding: 6px 8px;
          width: auto;"`
  } else if (status === "Retrasado") {
    return `"
          background-color: #F9BD50;
          border-radius: 3px;
          padding: 6px 8px;
          width: auto;"`
  } else {
    return `"
      background-color: #dce3f9;
      border-color: #cdd8f6;
      border-radius: 3px;
      padding: 6px 8px;
      width: auto;"`
  }
}
