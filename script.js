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

function calcularElevacion(esAutomatico = false) {
    let tiempoRealActivo = document.getElementById('checkTiempoReal').checked;

    // Si la llamada viene del evento 'oninput' y el switch está apagado, no hace nada
    if (esAutomatico && !tiempoRealActivo) {
        return;
    }
    // Obtenemos los valores de los inputs
    let metrosInput = document.getElementById('metros').value;
    let metros = parseFloat(metrosInput);
    let inclinacion = parseFloat(document.getElementById('inclinacion').value) || 0;
    let contenedorResultado = document.getElementById('resultado');

    // Obtener configuración del tanque elegido
    let tanqueElegido = document.getElementById('tanqueSelect').value;
    let config = TANQUES[tanqueElegido];

    // Validación de campo de metros vacío
    if (metrosInput.trim() === "" || isNaN(metros)) {
        contenedorResultado.innerHTML = "<h3>Elevación a ajustar: <strong>- MIL</strong></h3>";
        return;
    }

    /// Cálculo según el vehículo seleccionado
    let milsTeoricos = (metros * config.factor) - config.resta;
    // Ajuste por inclinación del terreno
    let elevacionFinal = Math.round(milsTeoricos - inclinacion);

    // Validación de rangos permitidos por la mecánica del juego (-89 MIL a 466 MIL y máx 600m)
    if (metros < config.minMetros) {
        contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>
        <p style="color: orange;">⚠️ Advertencia: Distancia menor a ${config.minMetros}m (Fuego directo).</p>`;
    } else if (metros > config.maxMetros) {
        contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>
        <p style="color: red;">❌ Objetivo fuera de alcance (Supera el límite máximo de ${config.maxMetros}m en terreno plano).</p>`;
    } else if (elevacionFinal > config.maxMil) {
        contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>
        <p style="color: red;">❌ Objetivo fuera de alcance (Supera el límite máximo de ${config.maxMil} MIL del cañón).</p>`;
    } else if (elevacionFinal < config.minMil) {
        contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>
        <p style="color: red;">❌ Ajuste imposible (Supera el límite inferior de ${config.minMil} MIL del cañón).</p>`;
    } else {
        contenedorResultado.innerHTML = `<h3>Elevación a ajustar: <strong>${elevacionFinal} MIL</strong></h3>`;
    }
}

// Escuchador de evento para que ejecute el cálculo al encender el switch
document.getElementById('checkTiempoReal').addEventListener('change', function () {
    if (this.checked) {
        //document.getElementById('').addEventListener('change', () => {})
        calcularElevacion(true);
    }
});

let inputs = document.querySelectorAll('input[type="number"]');

inputs.forEach(function (input) {
    input.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter') {
            input.blur(); // Le quita el foco al campo y cierra el teclado en móviles
        }
    });
});

