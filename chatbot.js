document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.querySelector(".chat-send-btn");
  const chatMessages = document.querySelector(".chat-messages");
  const addBtn = document.getElementById('addBtn');
  const fileBox = document.getElementById('fileUploadBox');


  const previewBox = document.getElementById('previewBox');
const previewContent = document.getElementById('previewContent');

function mostrarVistaPrevia(file) {
    previewContent.innerHTML = ''; // limpiar contenido anterior
    previewBox.style.display = 'block';

    const fileType = file.type;

    if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewContent.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else {
        const info = document.createElement('p');
        info.textContent = `Archivo seleccionado: ${file.name}`;
        previewContent.appendChild(info);
    }
}

// Evento para archivos
document.getElementById('fileInputArchivo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) mostrarVistaPrevia(file);
});

document.getElementById('fileInputImagen').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) mostrarVistaPrevia(file);
});



  document.addEventListener('click', (e) => {
    if (addBtn.contains(e.target)) {
      fileBox.style.display = fileBox.style.display === 'block' ? 'none' : 'block';
    } else if (!fileBox.contains(e.target)) {
      fileBox.style.display = 'none';
    }
  });



  if (!chatInput || !sendBtn || !chatMessages) return;

  // Autoajuste de altura del textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
  });

  function addMessage(text, sender = "user") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");

    if (sender === "system") {
      msgDiv.classList.add("system-message");

      const emojiSpan = document.createElement("span");
      emojiSpan.textContent = " 🤖 ";
      const textSpan = document.createElement("span");
      textSpan.classList.add("text");

      msgDiv.appendChild(emojiSpan);
      msgDiv.appendChild(textSpan);
    } else {
      msgDiv.classList.add("user-message");

      const textSpan = document.createElement("span");
      textSpan.classList.add("text");
      textSpan.textContent = text;

      msgDiv.appendChild(textSpan);
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }

  function typeText(text, targetSpan, speed = 20) {
    let index = 0;
    const interval = setInterval(() => {
      targetSpan.textContent += text.charAt(index);
      index++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (index >= text.length) clearInterval(interval);
    }, speed);
  }

  function getResponse(message) {
    const msg = message.toLowerCase();

    if (msg.includes("hola")) {
      return "¡Hola! ¿En qué puedo ayudarte?";
    }
    if (msg.includes("estadísticas") || msg.includes("gráficos")) {
      return "Puedo generar gráficos y estadísticas para tus datos. Sube un archivo Excel para empezar.";
    }
    if (msg.includes("filtrar") || msg.includes("ordenar")) {
      return "Puedes pedirme que filtre u ordene datos específicos. Intenta subir un archivo primero.";
    }
    if (msg.includes("reporte") || msg.includes("resumen")) {
      return "Claro, puedo crear reportes personalizados según tus datos.";
    }
    if (msg.trim() === "") {
      return "Por favor, escribe algo para que pueda ayudarte.";
    }

    return "Lo siento, no entendí eso. Por ahora solo puedo ayudarte con Excel. ¡Prueba con saludos o pedir estadísticas!";
  }

  // Mensaje de bienvenida
  const welcomeMsg = addMessage("", "system");
  const welcomeTextSpan = welcomeMsg.querySelector(".text");
  typeText(" Bienvenido!, soy tu asistente virtual", welcomeTextSpan, 20);

  // Botón de enviar
  sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";
    chatInput.style.height = "auto";

    // Mostrar mensaje "escribiendo..."
    const loadingMsg = addMessage("", "system");
    const dotsSpan = loadingMsg.querySelector(".text");

    let dots = 0;
    const dotsInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      dotsSpan.textContent = ".".repeat(dots);
    }, 300);

    setTimeout(() => {
      clearInterval(dotsInterval);
      dotsSpan.textContent = "";
      const responseText = getResponse(message);
      typeText(" " + responseText, dotsSpan, 25);
    }, 1000);
  });

  // Enter = enviar
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });
});
