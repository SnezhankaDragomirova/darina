const scene = document.getElementById("scene");
const btn = document.getElementById("vrBtn");
const statusEl = document.getElementById("status");
const panoImg = document.getElementById("pano");

function setStatus(text) {
  statusEl.textContent = text ? ` ${text}` : "";
}

// Диагностика за снимката (много полезно при 404 / грешен път)
setStatus("(зареждам снимката...)");
panoImg.addEventListener("load", () => setStatus(""));
panoImg.addEventListener("error", () => {
  setStatus("(ГРЕШКА: снимката не се зарежда — провери името/пътя на файла)");
  console.error("Не може да се зареди:", panoImg.src);
});

async function updateVRButton() {
  // Панорамата трябва да се вижда и без XR.
  // Тук само решаваме дали да активираме VR бутона.
  if (!navigator.xr) {
    btn.disabled = true;
    setStatus("(Няма VR тук — за Pico 4 отвори в Pico Browser и натисни VR)");
    return;
  }

  try {
    const supported = await navigator.xr.isSessionSupported("immersive-vr");
    btn.disabled = !supported;
    if (!supported) setStatus("(Няма VR тук — пробвай в Pico Browser)");
  } catch (e) {
    btn.disabled = true;
    setStatus("(Не може да се провери VR поддръжка)");
  }
}

btn.addEventListener("click", () => {
  const start = () => scene.enterVR();
  if (scene.hasLoaded) start();
  else scene.addEventListener("loaded", start, { once: true });
});

updateVRButton();