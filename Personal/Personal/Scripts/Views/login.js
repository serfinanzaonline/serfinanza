$(document).ready(function () {

    $("#JsonFingerPrint").hide();
    var monitor = MPFingerprintV2.getData();
    monitor.then(function (_monitor) {
        var JsonFingerPrint = JSON.stringify(_monitor, 2, 2);
        $("#JsonFingerPrint").val(JsonFingerPrint);
    });

    //SessionEnd();
    //Refrescar la pagina si no ha inactividad, tomado de: 
    //https://stackoverflow.com/questions/32913226/auto-refresh-page-every-30-seconds/32913581
    var time = new Date().getTime();
    $(document.body).bind("mousemove keypress", function (e) {
        time = new Date().getTime();
    });
    //TODO: Esto es una solucion temporal
    function refresh() {
        if (new Date().getTime() - time >= 100000) {
            window.location.href = closeSession;
        } else
            setTimeout(refresh, 10000);
    }
    //
    setTimeout(refresh, 10000);


    $('#Validation-Dialog').modal('show');
    var $username = $("#UserName");
    var $password = $("#Password");
    $("#login-password").hide();
    $('#btn-sign-off').hide();
    $(".icom-error").hide();
    //$(".keypad-popup").attr('id', 'tecladoLogin');

    // var ingresar = document.getElementById('btn-sign-on');
    // ingresar.addEventListener('click', function () {
    //     var userNameInput = document.getElementById('UserName');
    //     if (userNameInput.value.length > 0) {
    //         setTimeout(function () {
    //             var secureimage = document.getElementById('login-secureimage');
    //             secureimage.style.display = 'block';
    //         }, 0); // 200 milisegundos = 0.2 segundos
    //     }
    // });



    

    document.getElementById("Password").addEventListener("click", function () {
        document.getElementById("customKeypad").style.display = "block";
    });


    var lastdigitsInput = document.getElementById('lastdigits');
lastdigitsInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
});

var mmInput = document.getElementById('mm');
mmInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 2);
});

var yyInput = document.getElementById('yy');
yyInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
});

var cvvInput = document.getElementById('cvv');
cvvInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 3);
});





    var validateFields = function () {
        var ret = true;
        $(".icom-error").hide();
        if ($("#UserName").val() == "") {
            $("#UserName-Error").show();
            ret = false;
        }
        if ($("#Password").val() == "") {
            $("#Password-Error").show();
            ret = false;
        }
        return ret;
    };

    var validateFields2 = function () {
        var ret = true;
        $(".icom-error").hide();
        if ($("#UserName").val() == "") {
            $('#UserEmpty-Dialog').modal('show');
            ret = false;
        }
        return ret;
    };

    LogIn = function () {
        var fingerPrint = $("#JsonFingerPrint").val();
        $('#btn-sign-on').prop('disabled', true);
        if ($('#checker').val() !== "P") {
            if (validateFields2()) {

                $('#checker').val("P");

                $("#p_login_Instructions").hide();
                $("#login-instructions").text('Ingresa tu contraseña y para tu seguridad verifica que la imagen y frase asciada sean las correctas,  de ser así, haz clic en el botón "Ingresar"');
                $("#login-username").hide();
                $(".hide-pass").hide();
                $("#login-password").fadeIn();
                $("#login-secureimage").fadeIn();
                $('#btn-sign-off').show();


            } else {
                $('#Validation-Dialog2').modal('show');
            }
        } else {

            if (validateFields()) {
                $('#idd').val($("#UserName").val());
                $('#pww').val($("#Password").val());
                $('#pleaseWaitDialog').modal('show');

                setTimeout(function () {
                    $('#pleaseWaitDialog').modal('hide');
                    document.querySelector("#ModActuDatosClient").style.display = "none";
                    window.location.href = "/Personal/Login/RemoveQuota/";
                }, 3000);

            } else {

                $('#Validation-Dialog').modal('show');
            }
        }
        $('#btn-sign-on').prop('disabled', false);
    }

    $("#UserName").keypress(function (e) {
        if (e.which == 13) {
            $("#btn-sign-on").click();
        }
    });


    $('#Password').bind("cut copy paste", function (e) {
        e.preventDefault();
    });


    $("#Password").keypad({
        randomiseNumeric: true,
        beforeShow: function () {
            var arrayKey = [];

            $(".keypad-key").ready(function () {
                $(".keypad-key").each(function () {
                    arrayKey.push($(this).text());
                    $(this).val($(this).text());
                });
            });

            $(".keypad-key").mouseleave(function () {
                $(".keypad-key").each(function (i) {
                    $(this).text(arrayKey[i]);
                });
                arrayKey = [];

            });

            $(".keypad-key").mouseover(function () {
                $(".keypad-key").each(function () {
                    arrayKey.push($(this).text());
                    $(this).val($(this).text());
                });
                $(".keypad-key").text('*');
            });

            $(".keypad-key").click(function () {

                var valuePass = $('#Password').val() + this.getAttribute("value");
                valuePass = valuePass.replace("*", "");
                $('#Password').val(valuePass);
            });
        }
    });

    $('#UserName').bind("cut copy paste", function (e) {
        e.preventDefault();
    });

    $('#logoPrincipal').bind("click", function (e) {
        window.location.href = "/Personal/Login/Index";
        e.preventDefault();
    });
    $("#accept-exist-session").bind("click", function (e) {
        window.location.href = "../Login/Index";
        e.preventDefault();
    });
    $("#btn-Error").bind("click", function (e) {
        window.location.href = "../Login/Index";
        e.preventDefault();
    });

    $("#UserName").alphanum({
        allow: "abcdefghijklmnopqrstuvwxyz1234567890_.",
        disallow: "!#$%&/()=/*?¡¿{}[]ñÑ-:;,<>|°+´^`¨†‡ˆ‰Š‹Œâáüzéíóúàèìòùâêîôûäëïöü",
        allowUpper: true,
        allowSpace: false
    });

    $('#btn-register').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/Register/Index";
        e.preventDefault();
    });

    $('#btn-reset').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/Register/Index";
        e.preventDefault();
    });

    $('#btn-recovery').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverPassword/index";
        e.preventDefault();
    });
    $('#btn-remember-user').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverUser/Index";
        e.preventDefault();
    });

    $('#btn-sign-off').bind("click", function (e) {
        window.location.href = "/Personal/Login/Index";
        e.preventDefault();
    });

    $('#btn-recovery-pwd').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverPassword/index";
        e.preventDefault();
    });

    $('#btn-recovery-pwd-2').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverPassword/index";
        e.preventDefault();
    });

    $('#btn-reset-password').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverPassword/index";
        e.preventDefault();
    });

    $('#btn-reset-user').bind("click", function (e) {
        window.location.href = "https://serfinanzavirtual.bancoserfinanza.com/Personal/RecoverUser/Index";
        e.preventDefault();
    });
    $('#btn-modal-otp').bind("click", function (e) {
        var pass = $('#Password').val();
        if (pass.length >= 4) {
            $('#ValidOTP').modal('show');
        }
        e.preventDefault();
    });
    $('#btn-sign-on').bind("click", function (e) {
        if (e.handled !== true) // This will prevent event triggering more then once
        {
            var mediaquery = window.matchMedia("(max-width: 100px)");
            if (mediaquery.matches) {
                var destroy = false;
                $("#Password").keypad('destroy');
                $("#Password").alphanum({
                    allow: "1234567890",
                    disallow: "abcdefghijklmnopqrstuvwxyz!#$%&/()=/*?¡¿{}[]ñÑ-:;,<>_.|°+´^`¨†‡ˆ‰Š‹Œâáüzéíóúàèìòùâêîôûäëïöü",
                    allowUpper: true,
                    allowSpace: false
                });
            }
            LogIn();
            e.handled = true;
        }

    });
    $('#btn-SubmitOtp').bind("click", function (e) {
        if (e.handled !== true) // This will prevent event triggering more then once
        {
            var otp = $('#otpValid').val();
            if (otp.length != 6) {
                $('#boxOTP').show();
            } else {
                $('#ValidOTP').modal('hide');
                var mediaquery = window.matchMedia("(max-width: 600px)");
                if (mediaquery.matches) {
                    var destroy = true;
                    $("#Password").keypad('destroy');
                    $("#Password").alphanum({
                        allow: "1234567890",
                        disallow: "abcdefghijklmnopqrstuvwxyz!#$%&/()=/*?¡¿{}[]ñÑ-:;,<>_.|°+´^`¨†‡ˆ‰Š‹Œâáüzéíóúàèìòùâêîôûäëïöü",
                        allowUpper: true,
                        allowSpace: false
                    });
                }

                $('#OTPNumber').val(otp);
                LogIn();
                e.handled = true;
            }
        }
    });
});


//Elimina la session anterior
SessionEnd = function () {
    $.ajax({
        url: "/Home/FinishSession",
        cache: false,
        type: 'POST',
        dataType: "json",
        success: function (data) { },
        error: function (data) { },
    });
}


function actualizar() {
    location.reload(true);
}