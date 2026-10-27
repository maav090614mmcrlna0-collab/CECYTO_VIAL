document.addEventListener('DOMContentLoaded', () => {

  const vistaLogin = document.getElementById('vistaLogin');
  const vistaRegistro = document.getElementById('vistaRegistro');
  const vistaFolio = document.getElementById('vistaFolio');
  const panelPrincipal = document.getElementById('panelPrincipal');
  const vistaNormas = document.getElementById('vistaNormas');

  const btnIrRegistro = document.getElementById('btnIrRegistro');
  const btnCancelarRegistro = document.getElementById('btnCancelarRegistro');
  const btnVolverInicio = document.getElementById('btnVolverInicio');
  const btnValidarFolio = document.getElementById('btnValidarFolio');
  const btnVerNormas = document.getElementById('btnVerNormas');
  const btnVolverPanel = document.getElementById('btnVolverPanel');

  const registroForm = document.getElementById('registroForm');
  const inputNombre = document.getElementById('nombre');
  const inputCorreo = document.getElementById('correo');
  const inputEdad = document.getElementById('edad');
  const inputAutomovil = document.getElementById('automovil');
  const txtFolioGenerado = document.getElementById('txtFolioGenerado');
  const inputFolio = document.getElementById('inputFolio');

  const btnCargarCategorias = document.getElementById('btnCargarCategorias');
  const contenedorCategorias = document.getElementById('contenedorCategorias');
  const btnComenzarPrueba = document.getElementById('btnComenzarPrueba');
  const boxPreguntas = document.getElementById('boxPreguntas');
  const saludoBienvenida = document.getElementById('saludoBienvenida');

  function cambiarVista(vistaActiva) {
    vistaLogin.classList.add('d-none');
    vistaRegistro.classList.add('d-none');
    vistaFolio.classList.add('d-none');
    panelPrincipal.classList.add('d-none');
    if (vistaNormas) vistaNormas.classList.add('d-none');

    vistaActiva.classList.remove('d-none');
  }

  if (btnIrRegistro) {
    btnIrRegistro.addEventListener('click', () => {
      cambiarVista(vistaRegistro);
    });
  }

  if (btnCancelarRegistro) {
    btnCancelarRegistro.addEventListener('click', () => {
      cambiarVista(vistaLogin);
    });
  }

  if (btnVerNormas) {
    btnVerNormas.addEventListener('click', () => {
      cambiarVista(vistaNormas);
    });
  }

  if (btnVolverPanel) {
    btnVolverPanel.addEventListener('click', () => {
      cambiarVista(panelPrincipal);
    });
  }

  function validarCampo(input, condicion) {
    if (condicion) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const esNombreValido = validarCampo(inputNombre, inputNombre.value.trim().length >= 3);
      const esCorreoValido = validarCampo(inputCorreo, validarEmail(inputCorreo.value));
      const esEdadValida = validarCampo(inputEdad, inputEdad.value !== "" && parseInt(inputEdad.value) >= 18);

      if (esNombreValido && esCorreoValido && esEdadValida) {
        try {
          const respuesta = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: inputNombre.value,
              correo: inputCorreo.value,
              edad: inputEdad.value,
              automovil: inputAutomovil.value
            })
          });
          const data = await respuesta.json();
          txtFolioGenerado.textContent = data.folio;
        } catch (err) {
          txtFolioGenerado.textContent = "1WE3N";
        }
        
        if (saludoBienvenida) {
          saludoBienvenida.textContent = `¡Bienvenido, ${inputNombre.value.trim()}!`;
        }

        cambiarVista(vistaFolio);
      }
    });
  }

  if (btnVolverInicio) {
    btnVolverInicio.addEventListener('click', () => {
      cambiarVista(vistaLogin);
    });
  }

  if (btnValidarFolio) {
    btnValidarFolio.addEventListener('click', () => {
      if (inputFolio.value.trim() !== "") {
        if (saludoBienvenida) {
          saludoBienvenida.textContent = `¡Bienvenido al Portal, Usuario (Folio: ${inputFolio.value.trim().toUpperCase()})!`;
        }
        cambiarVista(panelPrincipal);
      } else {
        alert("Por favor ingresa tu folio válido.");
      }
    });
  }

  if (btnCargarCategorias) {
    btnCargarCategorias.addEventListener('click', () => {
      contenedorCategorias.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary"></div></div>`;
      fetch('reglamentos.json')
        .then(res => res.json())
        .then(data => {
          contenedorCategorias.innerHTML = '';
          data.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.innerHTML = `
              <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <h6 class="fw-bold">${item.categoria}</h6>
                <span class="badge bg-light text-dark border mb-2">${item.articulo}</span>
                <p class="small text-muted">${item.descripcion}</p>
                <button class="btn btn-sm btn-outline-warning mt-auto" onclick="agregarFav('${item.articulo}')"><i class="bi bi-star"></i> Favorito</button>
              </div>`;
            contenedorCategorias.appendChild(col);
          });
        })
        .catch(err => {
          contenedorCategorias.innerHTML = `<div class="alert alert-danger small text-center">Asegúrate de tener tu archivo reglamentos.json en la misma carpeta.</div>`;
        });
    });
  }

  if (btnComenzarPrueba) {
    btnComenzarPrueba.addEventListener('click', () => {
      boxPreguntas.classList.toggle('d-none');
      preguntaActual = 0;
      puntaje = 0;
      cargarPregunta();
    });
  }
});

let favoritos = [];
function agregarFav(articulo) {
  if (!favoritos.includes(articulo)) {
    favoritos.push(articulo);
    document.getElementById('cantFavs').textContent = `${favoritos.length} Guardados`;
    const cont = document.getElementById('contenedorFavs');
    const item = document.createElement('div');
    item.className = 'p-1 bg-light rounded border mb-1 small fw-semibold';
    item.textContent = articulo;
    cont.appendChild(item);
  }
}

const bancoPreguntas = [
  {
    pregunta: "¿Cuál es la sanción o multa por sostener o manipular un teléfono celular mientras se conduce?",
    opciones: [
      { texto: "A) Solo una llamada de atención verbal", correcta: false },
      { texto: "B) Multa de 30 a 35 UMA y pérdida de puntos en licencia", correcta: true },
      { texto: "C) Retención del vehículo por 48 horas", correcta: false }
    ]
  },
  {
    pregunta: "¿Qué indica una señal de tránsito restrictiva con un círculo rojo y una barra diagonal sobre una letra P?",
    opciones: [
      { texto: "A) Estacionamiento permitido los fines de semana", correcta: false },
      { texto: "B) Prohibido estacionarse o detenerse en la zona", correcta: true },
      { texto: "C) Zona exclusiva para vehículos de carga", correcta: false }
    ]
  },
  {
    pregunta: "¿Cuál es el límite de velocidad permitido por regla general en zonas escolares si no hay señalamiento?",
    opciones: [
      { texto: "A) 20 km/h", correcta: true },
      { texto: "B) 40 km/h", correcta: false },
      { texto: "C) 60 km/h", correcta: false }
    ]
  },
  {
    pregunta: "¿Qué porcentaje o grado de alcohol en la sangre está prohibido para conductores particulares en el alcoholímetro?",
    opciones: [
      { texto: "A) Más de 0.8 gramos por litro de sangre", correcta: false },
      { texto: "B) Cualquier presencia detectada o superior a 0.4 g/l", correcta: true },
      { texto: "C) Hasta 1.0 gramos por litro de sangre", correcta: false }
    ]
  },
  {
    pregunta: "¿Es obligatorio el uso del cinturón de seguridad para todos los pasajeros de un automóvil?",
    opciones: [
      { texto: "A) Sí, tanto para el conductor como para todos los ocupantes del vehículo", correcta: true },
      { texto: "B) Solo para el copiloto y el conductor", correcta: false },
      { texto: "C) Es opcional en los asientos traseros", correcta: false }
    ]
  }
];

let preguntaActual = 0;
let puntaje = 0;

function cargarPregunta() {
  const p = bancoPreguntas[preguntaActual];
  document.getElementById('contadorPregunta').textContent = `Pregunta ${preguntaActual + 1}/${bancoPreguntas.length}`;
  document.getElementById('textoPregunta').textContent = p.pregunta;
  document.getElementById('resPregunta').textContent = '';
  document.getElementById('btnSiguientePregunta').classList.add('d-none');

  const contenedor = document.getElementById('contenedorOpciones');
  contenedor.innerHTML = '';

  p.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-secondary btn-sm text-start';
    btn.textContent = op.texto;
    btn.onclick = () => verificarRespuesta(op.correcta, btn);
    contenedor.appendChild(btn);
  });
}

function verificarRespuesta(esCorrecta, botonSeleccionado) {
  const botones = document.getElementById('contenedorOpciones').children;
  for (let b of botones) {
    b.disabled = true;
  }

  const res = document.getElementById('resPregunta');
  if (esCorrecta) {
    botonSeleccionado.classList.remove('btn-outline-secondary');
    botonSeleccionado.classList.add('btn-success');
    res.className = "mt-2 small text-center fw-bold text-success";
    res.textContent = "¡Correcto!";
    puntaje++;
  } else {
    botonSeleccionado.classList.remove('btn-outline-secondary');
    botonSeleccionado.classList.add('btn-danger');
    res.className = "mt-2 small text-center fw-bold text-danger";
    res.textContent = "Incorrecto.";
  }

  const btnSig = document.getElementById('btnSiguientePregunta');
  btnSig.classList.remove('d-none');
  
  if (preguntaActual < bancoPreguntas.length - 1) {
    btnSig.textContent = "Siguiente Pregunta";
    btnSig.onclick = () => {
      preguntaActual++;
      cargarPregunta();
    };
  } else {
    btnSig.textContent = "Ver Resultado Final";
    btnSig.onclick = mostrarResultadoFinal;
  }
}

function mostrarResultadoFinal() {
  document.getElementById('contadorPregunta').textContent = "¡Completado!";
  document.getElementById('textoPregunta').textContent = `Has terminado la prueba del reglamento vial. Tu calificación final es:`;
  
  const contenedor = document.getElementById('contenedorOpciones');
  contenedor.innerHTML = `
    <div class="alert alert-info text-center py-3 mb-0">
      <h4 class="fw-bold mb-1">${puntaje} / ${bancoPreguntas.length} Aciertos</h4>
      <p class="small mb-0">${puntaje >= 4 ? '¡Excelente trabajo! Conoces muy bien las reglas de tránsito.' : 'Te recomendamos repasar las categorías y artículos del portal.'}</p>
    </div>
  `;
  
  document.getElementById('resPregunta').textContent = '';
  const btnSig = document.getElementById('btnSiguientePregunta');
  btnSig.textContent = "Reiniciar Prueba";
  btnSig.onclick = () => {
    preguntaActual = 0;
    puntaje = 0;
    cargarPregunta();
  };
}