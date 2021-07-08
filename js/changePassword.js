import { showAlert } from "./app.js";

document.getElementById("changePasswordForm").onsubmit = function (e) {
    e.preventDefault();
    const pass1 = document.getElementById("newPassword").value;
    const pass2 = document.getElementById("newConfirmedPassword").value;
  
    if(validatePasswords(pass1, pass2)){

        $.ajax("../backend/changePassword.php",{
            type: "POST",
            data: {
                pass: pass1
            },
            success: function (res) {
                const jsonRes = JSON.parse(res);
                if (jsonRes.error) {
                  console.warn(jsonRes.message);
                } else {
                    document.getElementById("login-root").innerHTML = `
                    <div class="alert alert-success" role="alert" id="recoverPasswordAlert">
                    ¡Contraseña modificada correctamente, <a href="../views/login.php">Inicie sesión</a>!
                  </div></div>
                    `;
                }
              },
              error: function (err) {
                alert(err);
              },
        })
        
    }else{
        showAlert(document.getElementById('changePasswordAlert'), "Las contraseñas no coinciden")
    }
    
  };

  function validatePasswords(pass1, pass2){
    if(pass1 === pass2){
        return true
    }else{
        return false
    }
  }