const patrones = {
    nombre: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/,
    apellidos: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/,
    dni: /^\d{8}[A-Z]$/,
    fechaNacimiento: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
    codigoPostal: /^(0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefonoFijo: /^(?:\+34|0034)?[89]\d{8}$/,
    telefonoMovil: /^(?:\+34|0034)?[67]\d{8}$/,
    iban: /^ES\d{22}$/,
    tarjeta: /^\d{16}$/,
    contrasena: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/
};

// === OBJETO DE DATOS === //
const datosUsuario = {};

// === FUNCIONES === //

// Función para validar un campo con su regex
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

// Validación específica de contraseñas
function validarContrasenas() {
    const pass1 = document.querySelector("#contrasena");
    const pass2 = document.querySelector("#repetirContrasena");
    const error2 = pass2.nextElementSibling;

    if (pass1.value !== pass2.value || !patrones.contrasena.test(pass1.value)) {
        pass1.classList.add('incorrecto');
        pass2.classList.add('incorrecto');
        pass1.classList.remove('correcto');
        pass2.classList.remove('correcto');
        error2.textContent = "Las contraseñas no coinciden o no cumplen requisitos.";
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

// === EVENTOS === //
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formulario");
    const inputs = formulario.querySelectorAll("input");

    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener("keyup", () => {
            switch (input.id) {
                case "nombre":
                    validarCampo(input, patrones.nombre, "Debe empezar con mayúscula y sólo contener letras.");
                    break;
                case "apellidos":
                    validarCampo(input, patrones.apellidos, "Máx. dos apellidos con mayúscula inicial.");
                    break;
                case "dni":
                    validarCampo(input, patrones.dni, "Formato DNI/NIE incorrecto.");
                    break;
                case "fechaNacimiento":
                    validarCampo(input, patrones.fechaNacimiento, "Formato DD/MM/AAAA.");
                    break;
                case "codigoPostal":
                    validarCampo(input, patrones.codigoPostal, "Código postal español (5 dígitos).");
                    break;
                case "email":
                    validarCampo(input, patrones.email, "Correo electrónico inválido.");
                    break;
                case "telefonoFijo":
                    validarCampo(input, patrones.telefonoFijo, "Debe empezar por 9 y tener 9 dígitos.");
                    break;
                case "telefonoMovil":
                    validarCampo(input, patrones.telefonoMovil, "Debe empezar por 6 o 7 y tener 9 dígitos.");
                    break;
                case "iban":
                    validarCampo(input, patrones.iban, "IBAN español: ES + 22 dígitos.");
                    break;
                case "tarjeta":
                    validarCampo(input, patrones.tarjeta, "Debe tener 16 dígitos.");
                    break;
                case "contrasena":
                case "repetirContrasena":
                    validarContrasenas();
                    break;
            }
        });
    });

    // Botón GUARDAR
    document.querySelector("#guardar").addEventListener("click", () => {
        let valido = true;

        inputs.forEach(input => {
            if (input.id === "repetirContrasena") return;
            const regex = patrones[input.id];
            if (regex) {
                if (!validarCampo(input, regex, "Campo inválido.")) valido = false;
            }
        });

        if (!validarContrasenas()) valido = false;

        if (valido) {
            inputs.forEach(input => {
                datosUsuario[input.id] = input.value.trim();
            });
            sessionStorage.setItem("usuario", JSON.stringify(datosUsuario));
            alert("Datos guardados correctamente en SessionStorage.");
        } else {
            alert("Por favor, corrige los errores antes de guardar.");
        }
    });

    // Botón RECUPERAR
    document.querySelector("#recuperar").addEventListener("click", () => {
        const recuperado = sessionStorage.getItem("usuario");
        if (!recuperado) {
            alert("No hay datos almacenados.");
            return;
        }

        const datos = JSON.parse(recuperado);
        inputs.forEach(input => {
            input.value = datos[input.id] || "";
            const regex = patrones[input.id];
            if (regex) validarCampo(input, regex, "");
        });
        validarContrasenas();
        alert("Datos recuperados y validados.");
    });
});
