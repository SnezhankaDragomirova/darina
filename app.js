// --- елементи от HTML ---
const scene = document.getElementById("scene");
const sky = document.getElementById("sky");
const vrBtn = document.getElementById("vrBtn");
const statusEl = document.getElementById("status");

// Намираме стрелките (в HTML са първите 2 бутона в #ui)
const ui = document.getElementById("ui");
const prevBtn = ui.querySelectorAll("button")[0];
const nextBtn = ui.querySelectorAll("button")[1];

// --- списък с панорами (съответства на id-тата в <a-assets>) ---
const panoramas = [
  { src: "#pano-krakra", name: "Krakra" },
  { src: "#pano-ivan", name: "Ivan Rilski" },
  { src: "#pano-minen", name: "Minen Muzei" },
  { src: "#pano-minna", name: "Minna Direkcia" },
  { src: "#pano-palace", name: "Palace" },
  { src: "#pano-park", name: "Park" },
];

let current = 0;

function setStatus(text) {
  statusEl.textContent = text ? ` ${text}` : "";
}

function showPano(index) {
  // безопасно въртене в кръг
  current = (index + panoramas.length) % panoramas.length;

  // сменяме текстурата на небето
  sky.setAttribute("src", panoramas[current].src);

  // (по желание) можеш да смениш и ротация, ако снимките ти са ориентирани различно
  // sky.setAttribute("rotation", "0 -90 0");

  setStatus(`[${current + 1}/${panoramas.length}] ${panoramas[current].name}`);
}

// --- бутони за навигация ---
prevBtn.addEventListener("click", () => showPano(current - 1));
nextBtn.addEventListener("click", () => showPano(current + 1));

// --- VR бутон ---
function enterVR() {
  const start = () => scene.enterVR();
  if (scene.hasLoaded) start();
  else scene.addEventListener("loaded", start, { once: true });
}

vrBtn.addEventListener("click", enterVR);

// --- активиране/деактивиране на VR бутона според WebXR ---
async function updateVRButton() {
  // Панорамата работи и без XR — тук само решаваме дали VR има смисъл
  if (!navigator.xr) {
    vrBtn.disabled = true;
    setStatus("(VR работи в Pico Browser на очилата)");
    return;
  }

  try {
    const supported = await navigator.xr.isSessionSupported("immersive-vr");
    vrBtn.disabled = !supported;
    if (!supported) setStatus("(VR работи в Pico Browser на очилата)");
  } catch {
    vrBtn.disabled = true;
    setStatus("(Не може да се провери VR поддръжка)");
  }
}

// старт
showPano(0);
updateVRButton();

// (по избор) удобни събития
scene.addEventListener("enter-vr", () => setStatus("(VR режим)"));
scene.addEventListener("exit-vr", () => showPano(current));
// --- миниатюри ---
document.querySelectorAll("#thumbs img").forEach(img => {
  img.addEventListener("click", () => {
    const index = parseInt(img.dataset.pano, 10);
    showPano(index);
  });
});
