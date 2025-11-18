const patrones = {
    nombre: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/,
    apellidos: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/,
    dni: /^\d{8}[A-Z]$/,
    fechaNacimiento: /^(?:31\/(0[13578]|1[02])\/(19|20)\d{2}|(29|30)\/(0[13-9]|1[0-2])\/(19|20)\d{2}|29\/02\/((19|20)(?:0[48]|[2468][048]|[13579][26]))|(?:0[1-9]|1\d|2[0-8])\/(0[1-9]|1[0-2])\/(19|20)\d{2})$/,
    codigoPostal: /^(0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/,
    email: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,7}$/,
    telefonoFijo: /^(?:\+34|0034)?[89]\d{8}$/,
    telefonoMovil: /^(?:\+34|0034)?[67]\d{8}$/,
    iban: /^ES\d{22}$/,
    tarjeta: /^\d{16}$/,
    contrasena: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/
};

const datosUsuario = {};
let passReal = "";
let passReal2 = "";

function validarCampo(input, regex, mensajeError) {
    const valor = input.value.trim();
    const valido = regex.test(valor);
    const errorSpan = input.nextElementSibling;

    if (!valido) {
        input.classList.add('incorrecto');
        input.classList.remove('correcto');
        errorSpan.textContent = mensajeError;
    } else {
        input.classList.remove('incorrecto');
        input.classList.add('correcto');
        errorSpan.textContent = "";
    }
    return valido;
}

// VALIDACIÓN DE CONTRASEÑAS
function validarContrasenas() {
    const pass1 = document.querySelector("#contrasena");
    const pass2 = document.querySelector("#repetirContrasena");
    const error2 = pass2.nextElementSibling;

    if (passReal !== passReal2 || !patrones.contrasena.test(passReal)) {
        pass1.classList.add('incorrecto');
        pass2.classList.add('incorrecto');
        pass1.classList.remove('correcto');
        pass2.classList.remove('correcto');
        error2.textContent = "Las contraseñas no coinciden o no cumplen requisitos.(12 caracteres, letra, número y símbolo; no se permiten estos simbolos .?=*)";
        return false;
    } else {
        pass1.classList.add('correcto');
        pass2.classList.add('correcto');
        pass1.classList.remove('incorrecto');
        pass2.classList.remove('incorrecto');
        error2.textContent = "";
        return true;
    }
}
function ocultarContrasena(input, almacen) {
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const valorAnterior = input.dataset.real || "";
    let real = valorAnterior;

    // Si se ha seleccionado texto y se pulsa DEL o se escribe algo
    if (start !== end) {
        // borrar en la contraseña real
        real = real.slice(0, start) + real.slice(end);
        almacen = real;
    }

    const valorVisible = input.value;

    // Determinar si se añadió o eliminó
    if (valorVisible.length > almacen.length) {
        // Añadido un carácter nuevo
        const nuevoCaracter = valorVisible.charAt(valorVisible.length - 1);
        almacen += nuevoCaracter;
    } else if (valorVisible.length < almacen.length) {
        // Eliminado desde final
        almacen = almacen.slice(0, -1);
    }

    // Guardar contraseña real en DATASET
    input.dataset.real = almacen;

    // Mostrar asteriscos
    input.value = "*".repeat(almacen.length);

    return almacen;
}


document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formulario");
    const inputs = formulario.querySelectorAll("input");

    // === VALIDACIÓN EN TIEMPO REAL ===
    inputs.forEach(input => {
        input.addEventListener("keyup", () => {

            if (input.id === "contrasena") {
                passReal = ocultarContrasena(input, passReal);
                validarContrasenas();
                return;
            }

            if (input.id === "repetirContrasena") {
                passReal2 = ocultarContrasena(input, passReal2);
                validarContrasenas();
                return;
            }

            switch (input.id) {
                case "nombre":
                    validarCampo(input, patrones.nombre, "Debe empezar con mayúscula y sólo contener letras.");
                    break;
                case "apellidos":
                    validarCampo(input, patrones.apellidos, "Máx. dos apellidos con mayúscula inicial.");
                    break;
                case "dni":
                    validarCampo(input, patrones.dni, "Formato DNI incorrecto.");
                    break;
                case "fechaNacimiento":
                    validarCampo(input, patrones.fechaNacimiento, "Formato DD/MM/AAAA.");
                    break;
                case "codigoPostal":
                    validarCampo(input, patrones.codigoPostal, "Código postal español.");
                    break;
                case "email":
                    validarCampo(input, patrones.email, "Correo electrónico inválido.");
                    break;
                case "telefonoFijo":
                    validarCampo(input, patrones.telefonoFijo, "Debe empezar por 9 u 8.");
                    break;
                case "telefonoMovil":
                    validarCampo(input, patrones.telefonoMovil, "Debe empezar por 6 o 7.");
                    break;
                case "iban":
                    validarCampo(input, patrones.iban, "IBAN español: ES + 22 dígitos.");
                    break;
                case "tarjeta":
                    validarCampo(input, patrones.tarjeta, "Debe tener 16 dígitos.");
                    break;
            }
        });
    });

    // === BOTÓN GUARDAR ===
    document.querySelector("#guardar").addEventListener("click", () => {
        let valido = true;

        inputs.forEach(input => {
            if (input.id === "contrasena" || input.id === "repetirContrasena") return;

            const regex = patrones[input.id];
            if (regex) {
                if (!validarCampo(input, regex, "Campo inválido.")) valido = false;
            }
        });

        if (!validarContrasenas()) valido = false;

        if (valido) {
            inputs.forEach(input => {
                if (input.id === "contrasena") datosUsuario.contrasena = passReal;
                else if (input.id === "repetirContrasena") datosUsuario.repetirContrasena = passReal2;
                else datosUsuario[input.id] = input.value.trim();
            });

            sessionStorage.setItem("usuario", JSON.stringify(datosUsuario));
            alert("Datos guardados en SessionStorage.");
        } else {
            alert("Corrige los errores antes de guardar.");
        }
    });

    // === BOTÓN RECUPERAR ===
    document.querySelector("#recuperar").addEventListener("click", () => {
        const recuperado = sessionStorage.getItem("usuario");
        if (!recuperado) {
            alert("No hay datos guardados.");
            return;
        }

        const datos = JSON.parse(recuperado);

        passReal = datos.contrasena || "";
        passReal2 = datos.repetirContrasena || "";

        inputs.forEach(input => {
            if (input.id === "contrasena") input.value = "*".repeat(passReal.length);
            else if (input.id === "repetirContrasena") input.value = "*".repeat(passReal2.length);
            else input.value = datos[input.id] || "";

            const regex = patrones[input.id];
            if (regex) validarCampo(input, regex, "");
        });

        validarContrasenas();
        alert("Datos recuperados.");
    });
});
