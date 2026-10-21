const TANQUES = {
    sherman: {
        factor: 0.665,
        resta: 33,
        maxMetros: 600,
        minMetros: 200,
        maxMil: 466,
        minMil: -89
    },
    stuh43: {
        factor: 0.8867,
        resta: 77.33,
        maxMetros: 500,
        minMetros: 200,
        maxMil: 466,
        minMil: -89
    }
};

// Referencias al DOM (se obtienen una sola vez al cargar la página)
const inputMetros = document.getElementById('metros');
const inputInclinacion = document.getElementById('inclinacion');
const checkTiempoReal = document.getElementById('checkTiempoReal');
const tanqueSelect = document.getElementById('tanqueSelect');
const contenedorResultado = document.getElementById('resultado');

function recortarInput(input, maxDigitos) {
    const esNegativo = input.value.startsWith('-');
    const limite = esNegativo ? maxDigitos + 1 : maxDigitos;
    if (input.value.length > limite) {
        input.value = input.value.slice(0, limite);
    }
}

function calcularElevacion(esAutomatico = false) {
    // 1. Limpieza total de caracteres no numéricos en metros (evita escribir o pegar '-')
    inputMetros.value = inputMetros.value.replace(/[^0-9]/g, '');

    // 2. Control y recorte de longitud
    recortarInput(inputMetros, 3);
    recortarInput(inputInclinacion, 3);

    // 3. Si la llamada es automática y el switch está apagado, salimos tras limpiar la entrada
    if (esAutomatico && !checkTiempoReal.checked) {
        return;
    }

    const metrosInput = inputMetros.value.trim();

    // 4. Validación de campo vacío, no numérico o igual/menor a cero
    if (metrosInput === "" || isNaN(metrosInput) || parseFloat(metrosInput) <= 0) {
        contenedorResultado.innerHTML = "<h3>Elevación a ajustar: <strong>- MIL</strong></h3>";
        return;
    }

    const metros = parseFloat(metrosInput);
    const inclinacion = parseFloat(inputInclinacion.value) || 0;
    const config = TANQUES[tanqueSelect.value];

    // 5. Cálculo balístico
    const milsTeoricos = (metros * config.factor) - config.resta;
    const elevacionFinal = Math.round(milsTeoricos - inclinacion);

    // 6. Determinación de la alerta según límites balísticos
    let mensajeAlerta = "";

    if (metros < config.minMetros) {
        mensajeAlerta = `<p style="color: orange;">⚠️ Advertencia: Distancia menor a ${config.minMetros}m (Fuego directo).</p>`;
    } else if (metros > config.maxMetros) {
        mensajeAlerta = `<p style="color: red;">❌ Objetivo fuera de alcance (Supera el límite máximo de ${config.maxMetros}m en terreno plano).</p>`;
    } else if (elevacionFinal > config.maxMil) {
        mensajeAlerta = `<p style="color: red;">❌ Objetivo fuera de alcance (Supera el límite máximo de ${config.maxMil} MIL del cañón).</p>`;
    } else if (elevacionFinal < config.minMil) {
        mensajeAlerta = `<p style="color: red;">❌ Ajuste imposible (Supera el límite inferior de ${config.minMil} MIL del cañón).</p>`;
    }

    // 7. Renderizado único en pantalla
    contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>${mensajeAlerta}`;
}

// Escuchador para el switch
checkTiempoReal.addEventListener('change', function () {
    if (this.checked) {
        calcularElevacion(true);
    }
});

// Listener para cerrar teclado móvil con Enter
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', evento => {
        if (evento.key === 'Enter') {
            input.blur();
        }
    });
});

