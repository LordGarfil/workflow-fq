import { showAlert } from "./app.js"

document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault()
  const data = {
    user: document.getElementById("loginEmail").value,
    pass: document.getElementById("loginPassword").value,
  }

  if (validateLoginData(data)) {
    $.post("../backend/validateLogin.php", data, function (data, status) {
      const dataJson = JSON.parse(data)
      if (dataJson.error) {
        const loginAlert = document.getElementById("loginAlert")
        console.warn(dataJson)
        showAlert(loginAlert)
      } else {
        if (dataJson.role == 1) {
          location.replace("../admin/index.php")
        } else if (dataJson.role >= 2 && dataJson.role <= 4) {
          location.replace("../employee/index.php")
        }
      }
    })
  }
}

const validateLoginData = (elementsForm = {}) => {
  let inpuEmpty = 0
  for (const element in elementsForm) {
    if (elementsForm[element] == "") {
      inpuEmpty++
    }
  }
  if (inpuEmpty > 0) {
    return false
  } else {
    return true
  }
}
