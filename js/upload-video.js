let labelsDetectados;
const contenedorVideo = document.getElementById("contenedor-video");
const video = document.getElementById("video");
const canvas = document.getElementById("video-canvas");
const ctx = canvas.getContext("2d");

document
  .getElementById("cargar-video")
  .addEventListener("click", async function () {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4, video/quicktime";

    input.addEventListener("change", async function () {
      let file = input.files[0];

      if (!file) return;

      const validTypes = ["video/mp4", "video/quicktime"];
      if (!validTypes.includes(file.type)) {
        mostrarMensaje(
          "El tipo de archivo que has subido no es compatible para analizar. Solo acepto videos con extensión .MOV o .MP4"
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        mostrarMensaje("Solo acepto videos con tamaño hasta 5MB");
        return;
      }

      let fileURL = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("file", file);
      try {
        mostrarMensaje("Subiendo video ...");

        desctivarBotones();
        const response = await fetch("http://192.168.1.46:3000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!(data.status === "Ok")) {
          activarBotones();
          return mostrarMensaje(data.message);
        }

        video.src = fileURL;
        video.load();

        mostrarMensaje(data.message);
        obtenerLabels(data.jobId);
        return;
      } catch (error) {
        video.src = "";
        activarBotones();
        mostrarMensaje("Error al conectar con el servidor");
      }
    });

    input.click();
  });

function obtenerLabels(jobId) {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`http://192.168.1.46:3000/labels/${jobId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === "Error") {
        activarBotones();
        clearInterval(interval);
        mostrarMensaje(data.message);
        return;
      }

      if (!(data.status === "Ok")) {
        return mostrarMensaje(data.message);
      }

      activarBotones();
      clearInterval(interval);
      mostrarMensaje(data.message);
      labelsDetectados = data.data;
    } catch (error) {
      activarBotones();
      console.error("Error en polling:", error);
    }
  }, 3000);
}

function mostrarMensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}

function desctivarBotones() {
  botonPlay.disabled = true;
  botonSubir.disabled = true;
}

function activarBotones() {
  botonPlay.disabled = false;
  botonSubir.disabled = false;
}
