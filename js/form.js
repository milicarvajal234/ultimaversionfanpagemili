// Validación accesible y UX amable
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const fields = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    email: document.getElementById('email'),
    edad: document.getElementById('edad'),
    comentario: document.getElementById('comentario'),
  };

  const err = (id) => document.getElementById('err-' + id);

  // Contador de caracteres del comentario
  const chars = document.getElementById('chars');
  fields.comentario?.addEventListener('input', () => {
    chars.textContent = String(fields.comentario.value.length);
  });

  // Reglas personalizadas
  function customValidity() {
    // Edad opcional pero válida si se completa
    if (fields.edad && fields.edad.value) {
      const n = Number(fields.edad.value);
      if (Number.isNaN(n) || n < 5 || n > 120) {
        fields.edad.setCustomValidity('Ingresá una edad entre 5 y 120.');
      } else {
        fields.edad.setCustomValidity('');
      }
    }
  }

  // Mostrar mensajes por campo
  function showMessage(input, el) {
    el.textContent = '';
    input.classList.remove('is-error', 'is-ok');
    if (input.validity.valid) {
      if (input.value.trim()) input.classList.add('is-ok');
      return;
    }
    input.classList.add('is-error');
    if (input.validity.valueMissing) el.textContent = 'Este campo es obligatorio.';
    else if (input.validity.tooShort) el.textContent = `Debe tener al menos ${input.minLength} caracteres.`;
    else if (input.validity.typeMismatch && input.type === 'email') el.textContent = 'Ingresá un email válido (ej: nombre@correo.com).';
    else if (input.validity.patternMismatch) el.textContent = 'Usá solo letras y espacios (sin números).';
    else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) el.textContent = 'Edad fuera de rango.';
    else if (input.validity.tooLong) el.textContent = `Máximo ${input.maxLength} caracteres.`;
    else el.textContent = 'Revisá este campo.';
  }

  // Delegar eventos para feedback inmediato
  Object.entries(fields).forEach(([key, input]) => {
    if (!input) return;
    const e = err(key);
    input.addEventListener('input', () => {
      customValidity();
      showMessage(input, e);
    });
    input.addEventListener('blur', () => {
      customValidity();
      showMessage(input, e);
    });
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    customValidity();

    let allValid = true;
    Object.entries(fields).forEach(([key, input]) => {
      if (!input) return;
      const e = err(key);
      if (!input.checkValidity()) {
        allValid = false;
        showMessage(input, e);
      }
    });

    status.className = 'alert';
    status.textContent = '';

    if (allValid) {
      status.classList.add('alert--ok');
      status.textContent = '¡Gracias! Te contactaré a la brevedad.';
      form.reset();
      // Reset estados visuales
      Object.values(fields).forEach((input) => input && input.classList.remove('is-ok', 'is-error'));
      if (chars) chars.textContent = '0';
      // Aquí podrías integrar envío real (Fetch a un backend / Formspree)
    } else {
      status.classList.add('alert--bad');
      status.textContent = 'Faltan datos o hay campos con errores. Revisalos por favor.';
      // Mover foco al primer error
      const firstError = form.querySelector('.is-error');
      firstError?.focus();
    }
  });
})();
