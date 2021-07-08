import { emailExists, showAlert } from "./app.js";

document.getElementById("recoverPasswordForm").onsubmit = function (e) {
  e.preventDefault();
  const email = document.getElementById("revoredEmail").value;

  emailExists(email).then((data) => {
    const res = JSON.parse(data);
    if (res == true) {
    //   const url = `../views/changePassword.php?hola=aver`;
    $.ajax("../backend/sendMail.php",{
        type: "POST",
        data: {
            to: email
        },
        success: function (res) {
            const jsonRes = JSON.parse(res);
            if (jsonRes.error) {
              console.warn(jsonRes.message);
            } else {
                document.getElementById("login-root").innerHTML = `
                <div class="alert alert-primary" role="alert" id="recoverPasswordAlert">
                Se ha enviado un correo electrónico a la dirección <strong> ${email} </strong> para restablecer su contraseña.
              </div></div>
                `;
            }
          },
          error: function (err) {
            alert(err);
          },
    })
    } else {
      showAlert(document.getElementById("recoverPasswordAlert"), res.message);
    }
  });
};

function getUserByEmail(email) {
  const url = `../backend/users.php?filterBy=email&email=${email}`;
  let res = $.get(url);
  return res;
}
