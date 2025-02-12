const luzRoja = document.getElementById("luz-roja");
const luzAmbar = document.getElementById("luz-ambar");
const luzVerde = document.getElementById("luz-verde");
const luces = ["red", "orange", "green"];
const elementos = [luzRoja, luzAmbar, luzVerde];
let luzActiva = 1;
let intervaloSemaforo;

const resetearSemaforo = () => {
  if (!(intervaloSemaforo === undefined)) {
    return;
  }
  
  intervaloSemaforo = setInterval(() => {
    resetearLuces();
    elementos[luzActiva].style.backgroundColor = luces[luzActiva];
    if (luzActiva === 2) return (luzActiva = 0);
    luzActiva = luzActiva + 1;
  }, 5000);
};

const resetearLuces = () => {
  luzRoja.style.backgroundColor = "grey";
  luzAmbar.style.backgroundColor = "grey";
  luzVerde.style.backgroundColor = "grey";
};

resetearSemaforo();
