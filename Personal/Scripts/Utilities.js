function viewInputPass(a) {
    var x = document.getElementById(a);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
var paginationType = "full_numbers";
var dtLang = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};



var lTablas = $(".dataTables_wrapper");

for (var lIndice = 0; lIndice < lTablas.length; lIndice++) {
    var lTabla = $(lTablas[lIndice]);

    try {
        lTabla.DataTable();
        if ($.fn.DataTable.isDataTable('.dataTables_wrapper')) {
            $('.dataTables_wrapper').DataTable().destroy();
        }
        lTabla.DataTable({
            responsive: true,
            "processing": true,
            "dom": '<"wrapper"lBfrtip>',
            "oLanguage": dtLang,
            "sPaginationType": paginationType,
            fixedHeader: {
                header: true,
                footer: true
            },
            "aLengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "Todos"]
            ],
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0]
            }],
            language: {
                buttons: {
                    copyTitle: 'Copiado en el portapapeles',
                    copyKeys: 'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
                    copySuccess: {
                        _: '%d lignes copiées',
                        1: '1 ligne copiée'
                    }
                }
            },
            buttons: [

                {
                    extend: 'copyHtml5',
                    text: '<span class="Colpa-tooltip" data-show-description="Copiar"> <i class="fa fa-files-o"></i></span>',
                    titleAttr: 'Copiar',

                },
                {
                    extend: 'excelHtml5',
                    title: 'Banca Personas Serfinansa',
                    text: '<span class="Colpa-tooltip" data-show-description="Exportar Excel"> <i class="fa fa-file-excel-o"></i></span>',
                    titleAttr: 'Excel'
                },
                {
                    extend: 'csvHtml5',
                    title: 'Banca Personas Serfinansa',
                    text: '<span class="Colpa-tooltip" data-show-description="Exportar csv"> <i class="fa fa-file-text-o"></i></span>',
                    titleAttr: 'csv'
                },
                {
                    extend: 'print',
                    text: '<span class="Colpa-tooltip" data-show-description="Imprimir"> <i class="fa fa-print"></i></span>',
                    titleAttr: 'Imprimir'
                }, {
                    text: '<span class="Colpa-tooltip" data-show-description="Exportar Pdf"> <i class="fa fa-file-pdf-o"></i></span>',
                    extend: 'pdfHtml5',
                    filename: 'Banca Personas Serfinansa',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    customize: function(doc) {

                    }

                }


            ],

            select: true,

        });
        lTablas[lIndice] = lTabla;
    } catch (e) {

    }

}


function intercomRedirect(item) {
    window.location.href = item;

}


function showModalGeneric(tittle, text, urlaccept) {

    $(".modal-tittle").empty();
    $('.modal-tittle').append(tittle);

    $("#modal-instructions").empty();
    $("#modal-instructions").append(text);
    if (urlaccept == "") {
        $("#moda-btn-accept").attr("data-dismiss", "modal");
    } else {
        $('#moda-btn-accept').bind("click", function(e) {
            window.location.href = urlaccept;
            e.preventDefault();
        });
    }
    $("#Generic-Dialog").modal('show');
}

function getLayoutItemVue(items, name) {

    var valObj = items.filter(function(elem) {
        if (elem.name == name) {
            return elem.value;
        } else {
            return "";
        }
    });
    if (valObj.length > 0) {
        return valObj[0].value;
    } else {
        return "";
    }
}

function ValorMinimoMaximo(valor, min, max) {
    if (valor < min) {
        return min;
    } else if (valor > max) {
        return max;
    } else {
        return valor;
    }
}


///Funcion que permite validar campo numerico, solo deja digitar numeros
function validaNumero(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 8) {
        return true;
    }

    // Patron de entrada, en este caso solo acepta numeros
    patron = /[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}
//permite validar numero y no deja pegar letras con control+v ni tampoco permite escribir punto EJ 3.5 no sale
//recibe this al llamarlo
function validaNumeroOnInput(e) {
    e.value = e.value.replace(/[^0-9]/g, '');
    e.value = e.value.replace(/(\..*)\./g, '$1');
    return e;
}

function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-39-46";

    tecla_especial = false;
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    }
}

function maximo(campo, limite) {
    if (campo.value.length >= limite) {
        //campo.value = campo.value.substring(0, limite - 1);
        return false;
    }
}

function soloNumerosyPunto(e) {
    var key = window.event ? e.which : e.keyCode;
    if (!(key <= 13 || (key >= 48 && key <= 57) || key == 46)) {
        return false;
    }
}

///permite validar correo electronico
function validar_correo_electronico(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

String.prototype.format = function(args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");


//SIS01KPR
//permite validar que los campos que pertenezcan a una clase especifica no se encuentren vacios [OJO SOLO VALIDA INPUTS] 
function Validar(textoClase) {
    let clase = $("." + textoClase);
    let validado = 0;
    $.each(clase, function(a, b) {
        if (b.id != "") {
            if ((b.value).trim() == "") {
                let label = $("label[for='" + $(this).attr("id") + "']").text();
                $('#' + b.id).focus();
                $('#' + b.id).addClass("is-invalid");
                //swal("", "El campo '" + label + "' es obligatorio.", "info");

                Swal.fire({
                    icon: '',
                    title: '',
                    text: `El campo ${label} es obligatorio.`
                });
                $('#' + b.id).focus();
                validado = 0;
                return false;
            } else {
                $('#' + b.id).removeClass("is-invalid");
                $('#' + b.id).addClass("is-valid");
                validado = 1;
            }
        }
    });

    if (validado == 1) {
        return true;
    }
}

//primitiva que permite de acuerdo a una expresion regular validar
$.fn.blockInput = function(options) {
    // find inserted or removed characters
    function findDelta(value, prevValue) {
        var delta = '';
        try {

            for (var i = 0; i < value.length; i++) {
                var str = value.substr(0, i) +
                    value.substr(i + value.length - prevValue.length);

                if (str === prevValue) delta =
                    value.substr(i, value.length - prevValue.length);
            }

        } catch (e) {
            console.log(e);
        }


        return delta;
    }

    function isValidChar(c) {
        return new RegExp(options.regex).test(c);
    }

    function isValidString(str) {
        for (var i = 0; i < str.length; i++)
            if (!isValidChar(str.substr(i, 1))) return false;

        return true;
    }

    this.filter('input,textarea').on('input', function() {
        var val = this.value,
            lastVal = $(this).data('lastVal');

        // get inserted chars
        var inserted = findDelta(val, lastVal);
        // get removed chars
        var removed = findDelta(lastVal, val);
        // determine if user pasted content
        var pasted = inserted.length > 1 || (!inserted && !removed);

        if (pasted) {
            if (!isValidString(val)) this.value = lastVal;
        } else if (!removed) {
            if (!isValidChar(inserted)) this.value = lastVal;
        }

        // store current value as last value
        $(this).data('lastVal', this.value);
    }).on('focus', function() {
        $(this).data('lastVal', this.value);
    });

    return this;
};

//se llama a la primitiva y se le pasa la exprersion regular para los campos inpu
$(document).ready(function() {
    $('.SoloLetras').blockInput({
        regex: '^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$'
    });
    $('.SoloNumerosLetras').blockInput({
        regex: '^[a-zA-Z 0-9]+$'
    });

    $(".Moneda").on({
        "focus": function(event) {
            $(event.target).select();
        },
        "keyup": function(event) {
            $(event.target).val(function(index, value) {
                return value.replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
            });
        }
    });

});

function OcultarModal(idmodal) {
    $(`#${idmodal}`).modal().hide();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').hide();
}

function LlenarSelect(idSelect, Datos, TextoSeleccione = "SELECCIONE") {
    $("#" + idSelect).empty().append(`<option selected="selected" value="">${TextoSeleccione}</option>`);
    let option
    Datos.forEach(element => {
        option = document.createElement('option');
        option.value = element.Codigo.toString();
        option.text = element.Nombre.toString();
        $("#" + idSelect)[0].appendChild(option);
    });
}

function LimpiarSelect(idSelect) {
    $(`#${idSelect} option:not(:first)`).remove();
}

function ValidarCheckBox(idCheck, mensaje) {
    if ($("#" + idCheck).prop("checked") != true) { //valida autorizacion de datos
        $("#" + idCheck).focus();
        Swal.fire({
            icon: '',
            title: '',
            text: mensaje
        });
        return false;
    } else {
        return true;
    }

}

function FormatoMoneda(numero) {
    return new Intl.NumberFormat('es-CO').format(numero);
}

function sesionVencida() {
    window.top.location.href = '/'
}

//permite tener la sesion viva, se usa keepSesionAlive("@Url.Action("Extend", "Session")");//borrar cuando termines
function keepSesionAlive(url) {
    console.log("Activando Kepp Alive")
    window.setInterval(function() {
        fetch(url)
            .then(response => response.json())
            .then(data => console.log("KeepAlive", data));
    }, 10000);
}

//sis01kpr bajar pdf base64
function downloadPDF(base64, nombreArchivo = "archivo.pdf") {
    if (base64.toString() == "") {
        return false;
    }

    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement("a");
    const fileName = nombreArchivo;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

//sis01kpr  ejemplo OrdernarPorNombreMes(array, "FechaDescrip")
function OrdernarPorNombreMes(array, nCampoMes) {
    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    let orden = [];
    let mes;
    meses.map((m) => {
        mes = array.filter(e => e[nCampoMes].toUpperCase() == m);
        orden.push(...mes);
    });
    return orden;
}

function PleaseWaitDialog() {
    $("#pleaseWaitDialog").modal('show');
}

$('.FormatoMoneda').focusout(function() {
    this.value = this.value.replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

$('.monedaV2').focusout(function() {
    this.value = "$ " + this.value.replace(/,/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
});

function formatCurrency(valor) {
    var locales = "es-CO";
    var currency = "COP";
    var fractionDigits = 2;
    var formatted = new Intl.NumberFormat(locales, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: fractionDigits
    }).format(valor);
    return formatted;
}

function ValMinMaxReemplazar(min, max, val, key) {
    if (key.length < 2 && val.length < 2 && key > 0) {
        var n = parseInt(val + key);
        if (isNaN(key)) {} else if (n < min) {
            val = min;
        } else if (n > max) {
            val = max;
        }
    }
    return val;
}