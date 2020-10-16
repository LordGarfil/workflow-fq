document.getElementById("loginForm").onsubmit = (e) => {
    e.preventDefault()
  const data = {
    user: document.getElementById("loginEmail").value,
    pass: document.getElementById("loginPassword").value,
  };

  if (validateLoginData(data)) {
    $.post("../backend/validateLogin.php", data, function (data, status) {
      console.log("Data: " + data + "\nStatus: " + status);
      if(data == 0){
        const loginAlert = document.getElementById('loginAlert')
        loginAlert.removeAttribute('hidden')
        setInterval(() => {
            loginAlert.setAttribute('hidden', 'true')
        }, 4500);
      }else if(data == 1){
        location.replace('../admin/index.php')
      }else if(data == 2){
        console.log("diseñador");
      }
    });
  }
};

const validateLoginData = (elementsForm = {})=>{
    let inpuEmpty = 0
    for(const element in elementsForm){
      if(elementsForm[element] == ''){
        inpuEmpty++
      }
    }
    if(inpuEmpty > 0){
      return false
    }else{
      return true
    } 
  }
