const botonPlay = document.getElementById("play-video");
const botonSubir = document.getElementById("cargar-video");
let timeToDetect = false;
let intervalTime;

botonPlay.addEventListener("click", (e) => {
  video.play();
  botonSubir.disabled = true;
  botonPlay.disabled = true;
});

video.addEventListener("timeupdate", () => {
  if (video.currentTime === 0) return;
  const currentTimeMs = Math.floor(video.currentTime * 1000);

  const detection = labelsDetectados.find(
    (label) => Math.abs(label.timestamp - currentTimeMs) < 500
  );

  if (detection) {
    if (timeToDetect) {
      clearTimeout(intervalTime);
      timeToDetect = false;
    }

    mostrarMensaje(
      `He detectado vehículo de emergencia (Ambulancia 🚑 o bomberos 🚒) con seguridad de un ${detection.confidence.toFixed(
        2
      )}%. Activar luz verde 🟢`
    );

    if (intervaloSemaforo) {
      clearInterval(intervaloSemaforo);
      intervaloSemaforo = undefined;
    }
    resetearLuces();
    luzActiva = 2;
    luzVerde.style.backgroundColor = "green";
    dibujarBox(detection.boundingBoxes);
  } else {
    mostrarMensaje("No se detectan vehículos de emergencia");

    if (!timeToDetect) {
      timeToDetect = true;
      intervalTime = setTimeout(() => {
        if (!intervaloSemaforo) {
          resetearLuces();
          luzActiva = 1;
          luzRoja.style.backgroundColor = "red";
          resetearSemaforo();
        }
        mostrarMensaje("Funcionamiento normal del semáforo 🚦");

        timeToDetect = false;
      }, 3000);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

video.addEventListener("ended", () => {
  timeToDetect = false;
  botonPlay.disabled = false;
  botonSubir.disabled = false;
  
  if (intervaloSemaforo === undefined) {
    mostrarMensaje(
      "Acivando el funcionamiento normal del semáforo 🚦 en 5 segundos"
    );

    setTimeout(() => {
      mostrarMensaje("Funcionamiento normal del semáforo 🚦");
      resetearLuces();
      luzActiva = 1;
      luzRoja.style.backgroundColor = "red";
      resetearSemaforo();
    }, 5000);
  }
});

function dibujarBox(boundingBoxes) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar antes de dibujar

  boundingBoxes.forEach((box) => {
    const { Width, Height, Left, Top } = box;

    // Escalar a las dimensiones del video
    const x = Left * canvas.width;
    const y = Top * canvas.height;
    const width = Width * canvas.width;
    const height = Height * canvas.height;

    // Dibujar rectángulo
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  });
}
