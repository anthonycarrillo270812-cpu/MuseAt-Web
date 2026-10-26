// =====================================================
// MUSEAT - SCRIPT.JS
// Toda la lógica e interactividad de la web.
// =====================================================
 
 
// -----------------------------------------------------
// 1. SELECCIONAR ELEMENTOS DEL HTML
// Guardamos referencias para reutilizarlas.
// -----------------------------------------------------
 
const menuToggle = document.getElementById("menuToggle");
const closeMenuButton = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
 
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
 
const searchInput = document.getElementById("searchInput");
const genreFilters = document.getElementById("genreFilters");
 
const songGrid = document.getElementById("songGrid");
const mySongGrid = document.getElementById("mySongGrid");
 
const songCount = document.getElementById("songCount");
const emptyMessage = document.getElementById("emptyMessage");
const mySongsEmpty = document.getElementById("mySongsEmpty");
 
const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const progressBar = document.getElementById("progressBar");
 
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
 
const profileForm = document.getElementById("profileForm");
const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bioInput");
const menuUsername = document.getElementById("menuUsername");
const profileMessage = document.getElementById("profileMessage");
 
const uploadForm = document.getElementById("uploadForm");
const audioFileInput = document.getElementById("audioFile");
const coverFileInput = document.getElementById("songCover");
const songTitleInput = document.getElementById("songTitle");
const songArtistInput = document.getElementById("songArtist");
const songGenreInput = document.getElementById("songGenre");
 
const selectedFileLabel = document.getElementById("selectedFile");
const uploadMessage = document.getElementById("uploadMessage");
 
 
// -----------------------------------------------------
// 2. ESTADO DE LA APLICACIÓN
// Aquí guardamos los datos mientras se ejecuta la web.
// -----------------------------------------------------
 
// Canciones de demostración.
// No tienen archivos de audio asociados, así que sus
// botones de reproducción mostrarán un aviso.
// Puedes reemplazarlas por canciones propias.
const demoSongs = [
  {
    id: "demo-1",
    title: "Static Dreams",
    artist: "The Broken Signals",
    genre: "Grunge",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 12
  },
  {
    id: "demo-2",
    title: "Concrete Heart",
    artist: "Rust District",
    genre: "Punk",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 8
  },
  {
    id: "demo-3",
    title: "Feedback Ritual",
    artist: "Black Voltage",
    genre: "Metal",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 21
  },
  {
    id: "demo-4",
    title: "After the Noise",
    artist: "Velvet Static",
    genre: "Rock",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 5
  },
  {
    id: "demo-5",
    title: "Basement Lights",
    artist: "Cheap Halo",
    genre: "Indie",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 16
  },
  {
    id: "demo-6",
    title: "Digital Decay",
    artist: "Null Frequency",
    genre: "Electrónica",
    cover: null,
    audioUrl: null,
    local: false,
    likes: 9
  }
];
 
// Las canciones cargadas desde el ordenador.
// Se mantienen en memoria mientras la página está abierta.
let uploadedSongs = [];
 
// Filtro musical activo.
let activeGenre = "Todos";
 
// Canción que se está reproduciendo.
let currentSong = null;
 
// Índice de la siguiente canción añadida.
let nextSongId = 1;
 
// Archivos de portada seleccionados que aún no se han enviado.
let pendingCoverUrl = null;
 
// Las URL de archivos locales deben revocarse cuando
// ya no se necesiten, para liberar memoria.
const objectUrls = new Set();
 
 
// -----------------------------------------------------
// 3. FUNCIONES AUXILIARES
// -----------------------------------------------------
 
// Convierte segundos a minutos y segundos.
// Ejemplo: 125 -> "2:05".
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
 
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
 
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
 
 
// Crea una URL temporal para un archivo local.
// No sube el archivo a ningún servidor.
function createLocalUrl(file) {
  const url = URL.createObjectURL(file);
  objectUrls.add(url);
  return url;
}
 
 
// Muestra un mensaje con un estilo determinado.
function showMessage(element, message, type = "") {
  element.textContent = message;
  element.className = "form-message";
 
  if (type) {
    element.classList.add(type);
  }
}
 
 
// Devuelve todas las canciones disponibles.
function getAllSongs() {
  return [...demoSongs, ...uploadedSongs];
}
 
 
// Busca una canción por su identificador.
function findSongById(id) {
  return getAllSongs().find(song => song.id === id);
}
 
 
// -----------------------------------------------------
// 4. MENÚ HAMBURGUESA
// -----------------------------------------------------
 
function openMenu() {
  sideMenu.classList.add("open");
  menuOverlay.classList.add("show");
 
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Cerrar menú");
 
  document.body.style.overflow = "hidden";
}
 
function closeMenu() {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("show");
 
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
 
  document.body.style.overflow = "";
}
 
// Abrir al pulsar el botón hamburguesa.
menuToggle.addEventListener("click", () => {
  if (sideMenu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});
 
// Cerrar mediante el botón de la X.
closeMenuButton.addEventListener("click", closeMenu);
 
// Cerrar al pulsar el fondo oscuro.
menuOverlay.addEventListener("click", closeMenu);
 
// Cerrar con Escape.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
 
// Cerrar el menú al elegir una sección.
document.querySelectorAll(".menu-link[data-section]")
  .forEach(link => {
    link.addEventListener("click", closeMenu);
  });
 
 
// -----------------------------------------------------
// 5. TEMA CLARO Y OSCURO
// -----------------------------------------------------
 
// Recupera la preferencia guardada.
// Si todavía no hay ninguna, usa el tema oscuro.
function loadTheme() {
  let savedTheme = "dark";
 
  try {
    savedTheme = localStorage.getItem("museat-theme") || "dark";
  } catch (error) {
    console.warn("No se pudo recuperar el tema guardado.");
  }
 
  applyTheme(savedTheme);
}
 
 
// Aplica el tema y actualiza el texto del botón.
function applyTheme(theme) {
  const safeTheme = theme === "light" ? "light" : "dark";
 
  document.documentElement.setAttribute("data-theme", safeTheme);
 
  if (safeTheme === "dark") {
    themeLabel.textContent = "Cambiar a tema claro";
    themeToggle.querySelector("i").className = "bi bi-sun";
  } else {
    themeLabel.textContent = "Cambiar a tema oscuro";
    themeToggle.querySelector("i").className = "bi bi-moon";
  }
 
  try {
    localStorage.setItem("museat-theme", safeTheme);
  } catch (error) {
    console.warn("El tema no se pudo guardar.");
  }
}
 
 
// Cambia entre claro y oscuro.
themeToggle.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");
 
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});
 
 
// -----------------------------------------------------
// 6. PERFIL DEL USUARIO
// -----------------------------------------------------
 
// Recupera el perfil guardado en el navegador.
function loadProfile() {
  let profile = {};
 
  try {
    profile = JSON.parse(
      localStorage.getItem("museat-profile") || "{}"
    );
  } catch (error) {
    console.warn("No se pudo leer el perfil.");
  }
 
  usernameInput.value = profile.username || "";
  bioInput.value = profile.bio || "";
 
  menuUsername.textContent =
    profile.username || "Músico anónimo";
}
 
 
// Guarda el nombre artístico y la biografía.
profileForm.addEventListener("submit", event => {
  event.preventDefault();
 
  const profile = {
    username: usernameInput.value.trim(),
    bio: bioInput.value.trim()
  };
 
  if (!profile.username) {
    showMessage(
      profileMessage,
      "Escribe un nombre artístico.",
      "error"
    );
    return;
  }
 
  try {
    localStorage.setItem(
      "museat-profile",
      JSON.stringify(profile)
    );
 
    menuUsername.textContent = profile.username;
 
    showMessage(
      profileMessage,
      "Perfil guardado en este navegador.",
      "success"
    );
  } catch (error) {
    showMessage(
      profileMessage,
      "No se pudo guardar el perfil.",
      "error"
    );
  }
});
 
 
// -----------------------------------------------------
// 7. FILTROS POR GÉNERO
// -----------------------------------------------------
 
genreFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-genre]");
 
  // Ignora los clics que no proceden de un filtro.
  if (!button) return;
 
  activeGenre = button.dataset.genre;
 
  // Marca visualmente el género seleccionado.
  genreFilters.querySelectorAll(".genre-chip")
    .forEach(chip => {
      chip.classList.toggle("active", chip === button);
    });
 
  renderSongs();
});
 
 
// -----------------------------------------------------
// 8. BUSCADOR
// -----------------------------------------------------
 
searchInput.addEventListener("input", renderSongs);
 
 
// -----------------------------------------------------
// 9. CREAR TARJETAS MUSICALES
// -----------------------------------------------------
 
// Construimos las tarjetas usando createElement y
// textContent para no interpretar los nombres como HTML.
function createSongCard(song) {
  const column = document.createElement("div");
 
  column.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
 
  const card = document.createElement("article");
  card.className = "song-card";
 
  // Portada del tema.
  const art = document.createElement("div");
  art.className = "song-art";
 
  if (song.cover) {
    const image = document.createElement("img");
 
    image.src = song.cover;
    image.alt = `Portada de ${song.title}`;
    image.loading = "lazy";
 
    art.appendChild(image);
  } else {
    const icon = document.createElement("i");
    icon.className = "bi bi-vinyl";
    icon.setAttribute("aria-hidden", "true");
 
    art.appendChild(icon);
  }
 
  const artLabel = document.createElement("span");
  artLabel.className = "art-label";
  artLabel.textContent = song.local ? "LOCAL" : "DEMO";
 
  art.appendChild(artLabel);
 
  // Información de la canción.
  const body = document.createElement("div");
  body.className = "song-card-body";
 
  const title = document.createElement("h3");
  title.className = "song-title";
  title.textContent = song.title;
 
  const artist = document.createElement("p");
  artist.className = "song-artist";
  artist.textContent = song.artist;
 
  const meta = document.createElement("div");
  meta.className = "song-meta";
 
  const genre = document.createElement("span");
  genre.className = "song-genre";
  genre.textContent = song.genre;
 
  // El contador lleva el id de la canción para poder
  // actualizar todas sus copias (catálogo y "Mis canciones").
  const likes = document.createElement("span");
  likes.className = "song-artist like-count";
  likes.dataset.songId = song.id;
  likes.style.marginBottom = "0";
  likes.textContent = `♥ ${song.likes || 0}`;
 
  meta.append(genre, likes);
 
  // Controles de la tarjeta.
  const actions = document.createElement("div");
  actions.className = "song-card-actions";
 
  const playButton = document.createElement("button");
  playButton.className = "btn btn-danger";
  playButton.type = "button";
  playButton.innerHTML =
    '<i class="bi bi-play-fill"></i> ESCUCHAR';
 
  playButton.addEventListener("click", () => {
    playSong(song.id);
  });
 
  const likeButton = document.createElement("button");
  likeButton.className = "btn btn-outline-danger like-button";
  likeButton.type = "button";
  likeButton.setAttribute("aria-label", "Me gusta");
  likeButton.dataset.songId = song.id;
 
  // El estado "me gusta" se guarda en la canción, no en la
  // tarjeta, para que sobreviva cuando se vuelven a dibujar.
  likeButton.innerHTML =
    `<i class="bi ${song.liked ? "bi-heart-fill" : "bi-heart"}"></i>`;
  likeButton.classList.toggle("liked", Boolean(song.liked));
 
  likeButton.addEventListener("click", () => {
    song.liked = !song.liked;
 
    // Este contador es visual y temporal.
    // Para likes compartidos se necesita un servidor.
    song.likes = Math.max(
      0,
      (song.likes || 0) + (song.liked ? 1 : -1)
    );
 
    // Actualiza esta tarjeta y su copia en "Mis canciones".
    document.querySelectorAll(`[data-song-id="${song.id}"]`)
      .forEach(element => {
        if (element.classList.contains("like-button")) {
          element.innerHTML =
            `<i class="bi ${song.liked ? "bi-heart-fill" : "bi-heart"}"></i>`;
          element.classList.toggle("liked", song.liked);
        } else if (element.classList.contains("like-count")) {
          element.textContent = `♥ ${song.likes}`;
        }
      });
  });
 
  actions.append(playButton, likeButton);
 
  body.append(title, artist, meta, actions);
  card.append(art, body);
  column.appendChild(card);
 
  return column;
}
 
 
// -----------------------------------------------------
// 10. MOSTRAR Y FILTRAR CANCIONES
// -----------------------------------------------------
 
function renderSongs() {
  const allSongs = getAllSongs();
 
  const query = searchInput.value.trim().toLowerCase();
 
  // Filtra por género y por texto de búsqueda.
  const filteredSongs = allSongs.filter(song => {
    const matchesGenre =
      activeGenre === "Todos" || song.genre === activeGenre;
 
    const searchableText =
      `${song.title} ${song.artist} ${song.genre}`.toLowerCase();
 
    const matchesSearch = searchableText.includes(query);
 
    return matchesGenre && matchesSearch;
  });
 
  // Limpia las tarjetas anteriores.
  songGrid.replaceChildren();
 
  // Genera las nuevas tarjetas.
  filteredSongs.forEach(song => {
    songGrid.appendChild(createSongCard(song));
  });
 
  // Actualiza el contador.
  songCount.textContent =
    `${String(filteredSongs.length).padStart(2, "0")} / TRACKS`;
 
  // Muestra un aviso si no hay resultados.
  emptyMessage.hidden = filteredSongs.length !== 0;
 
  // Actualiza la biblioteca personal.
  mySongGrid.replaceChildren();
 
  uploadedSongs.forEach(song => {
    mySongGrid.appendChild(createSongCard(song));
  });
 
  mySongsEmpty.hidden = uploadedSongs.length !== 0;
}
 
 
// -----------------------------------------------------
// 11. SELECCIÓN DE ARCHIVOS
// -----------------------------------------------------
 
// Muestra el nombre del archivo de audio seleccionado.
audioFileInput.addEventListener("change", () => {
  const file = audioFileInput.files[0];
 
  if (!file) {
    selectedFileLabel.textContent =
      "Ningún archivo seleccionado.";
    return;
  }
 
  // Evita archivos demasiado grandes para esta demo.
  const maxSize = 30 * 1024 * 1024;
 
  if (file.size > maxSize) {
    showMessage(
      uploadMessage,
      "El archivo supera el límite de 30 MB de esta demo.",
      "error"
    );
 
    audioFileInput.value = "";
    selectedFileLabel.textContent =
      "Ningún archivo seleccionado.";
 
    return;
  }
 
  selectedFileLabel.textContent =
    `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
 
  showMessage(uploadMessage, "");
});
 
 
// Prepara una portada cuando se selecciona.
coverFileInput.addEventListener("change", () => {
  // Liberamos la URL anterior si existía.
  if (pendingCoverUrl) {
    URL.revokeObjectURL(pendingCoverUrl);
    objectUrls.delete(pendingCoverUrl);
    pendingCoverUrl = null;
  }
 
  const file = coverFileInput.files[0];
 
  if (!file) return;
 
  // Solo admitimos imágenes.
  if (!file.type.startsWith("image/")) {
    showMessage(
      uploadMessage,
      "Selecciona un archivo de imagen válido.",
      "error"
    );
 
    coverFileInput.value = "";
    return;
  }
 
  // Límite de tamaño para la portada.
  if (file.size > 5 * 1024 * 1024) {
    showMessage(
      uploadMessage,
      "La portada debe ocupar menos de 5 MB.",
      "error"
    );
 
    coverFileInput.value = "";
    return;
  }
 
  pendingCoverUrl = createLocalUrl(file);
});
 
 
// Arrastrar y soltar el audio sobre la zona de subida.
// Sin esto, el navegador abriría el archivo y saldría de la web.
const dropzone = document.querySelector(".upload-dropzone");
 
["dragenter", "dragover"].forEach(type => {
  dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });
});
 
["dragleave", "drop"].forEach(type => {
  dropzone.addEventListener(type, () => {
    dropzone.classList.remove("dragover");
  });
});
 
dropzone.addEventListener("drop", event => {
  event.preventDefault();
 
  if (!event.dataTransfer.files.length) return;
 
  // Reutiliza las validaciones del selector de archivos.
  audioFileInput.files = event.dataTransfer.files;
  audioFileInput.dispatchEvent(new Event("change"));
});
 
 
// -----------------------------------------------------
// 12. AÑADIR CANCIONES LOCALES
// -----------------------------------------------------
 
uploadForm.addEventListener("submit", event => {
  event.preventDefault();
 
  const audioFile = audioFileInput.files[0];
 
  const title = songTitleInput.value.trim();
  const artist = songArtistInput.value.trim();
  const genre = songGenreInput.value;
 
  // Comprobaciones básicas.
  if (!audioFile) {
    showMessage(
      uploadMessage,
      "Selecciona primero un archivo de audio.",
      "error"
    );
    return;
  }
 
  if (!audioFile.type.startsWith("audio/")) {
    showMessage(
      uploadMessage,
      "El archivo seleccionado no parece ser audio.",
      "error"
    );
    return;
  }
 
  if (!title || !artist) {
    showMessage(
      uploadMessage,
      "Completa el título y el artista.",
      "error"
    );
    return;
  }
 
  // Comprueba de nuevo el tamaño por seguridad.
  if (audioFile.size > 30 * 1024 * 1024) {
    showMessage(
      uploadMessage,
      "El audio supera el límite de 30 MB.",
      "error"
    );
    return;
  }
 
  // Crea una dirección temporal para el audio.
  const audioUrl = createLocalUrl(audioFile);
 
  // Construye el objeto de la nueva canción.
  const song = {
    id: `local-${nextSongId++}`,
    title,
    artist,
    genre,
    cover: pendingCoverUrl,
    audioUrl,
    local: true,
    likes: 0
  };
 
  // La canción solo se almacena en memoria.
  uploadedSongs.unshift(song);
 
  showMessage(
    uploadMessage,
    `¡"${title}" ya está en tu biblioteca local!`,
    "success"
  );
 
  // Reinicia el formulario para el siguiente tema.
  uploadForm.reset();
 
  selectedFileLabel.textContent =
    "Ningún archivo seleccionado.";
 
  // La portada pasa a pertenecer a la canción.
  // No revocamos su URL mientras siga utilizándose.
  pendingCoverUrl = null;
 
  // Vuelve a mostrar todos los géneros y canciones.
  activeGenre = "Todos";
 
  genreFilters.querySelectorAll(".genre-chip")
    .forEach(chip => {
      chip.classList.toggle(
        "active",
        chip.dataset.genre === "Todos"
      );
    });
 
  searchInput.value = "";
 
  renderSongs();
 
  // Lleva al usuario a su biblioteca.
  document.getElementById("mis-canciones")
    .scrollIntoView({ behavior: "smooth" });
});
 
 
// -----------------------------------------------------
// 13. REPRODUCIR Y PAUSAR
// -----------------------------------------------------
 
async function playSong(songId) {
  const song = findSongById(songId);
 
  if (!song) return;
 
  // Los temas de demostración no tienen audio real.
  if (!song.audioUrl) {
    showMessage(
      uploadMessage,
      "Este tema es un ejemplo visual. Sube un audio propio para escucharlo.",
      "error"
    );
 
    document.getElementById("subir")
      .scrollIntoView({ behavior: "smooth" });
 
    return;
  }
 
  // Si seleccionamos otra canción, cargamos su archivo.
  if (!currentSong || currentSong.id !== song.id) {
    currentSong = song;
    audioPlayer.src = song.audioUrl;
    audioPlayer.load();
 
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
 
    progressBar.value = 0;
    currentTimeLabel.textContent = "0:00";
    durationLabel.textContent = "0:00";
  }
 
  try {
    // Si estaba pausado, empieza a reproducirse.
    await audioPlayer.play();
 
    updatePlayButton();
  } catch (error) {
    showMessage(
      uploadMessage,
      "No se pudo reproducir el archivo. Comprueba su formato.",
      "error"
    );
  }
}
 
 
// Cambia el icono del reproductor según su estado.
function updatePlayButton() {
  const icon = playPauseButton.querySelector("i");
 
  if (audioPlayer.paused) {
    icon.className = "bi bi-play-fill";
    playPauseButton.setAttribute("aria-label", "Reproducir");
  } else {
    icon.className = "bi bi-pause-fill";
    playPauseButton.setAttribute("aria-label", "Pausar");
  }
}
 
 
// Botón principal de reproducción y pausa.
playPauseButton.addEventListener("click", async () => {
  // Si no hay ninguna canción cargada, busca la primera
  // canción local disponible.
  if (!currentSong) {
    const firstLocalSong = uploadedSongs[0];
 
    if (!firstLocalSong) {
      showMessage(
        uploadMessage,
        "Añade un tema para comenzar a escuchar música.",
        "error"
      );
 
      document.getElementById("subir")
        .scrollIntoView({ behavior: "smooth" });
 
      return;
    }
 
    await playSong(firstLocalSong.id);
    return;
  }
 
  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
    } catch (error) {
      showMessage(
        uploadMessage,
        "No se pudo iniciar la reproducción.",
        "error"
      );
    }
  } else {
    audioPlayer.pause();
  }
 
  updatePlayButton();
});
 
 
// Actualiza el icono cuando cambia el estado del audio.
audioPlayer.addEventListener("play", updatePlayButton);
audioPlayer.addEventListener("pause", updatePlayButton);
 
 
// -----------------------------------------------------
// 14. BARRA DE PROGRESO Y DURACIÓN
// -----------------------------------------------------
 
// Cuando el navegador conoce la duración del archivo.
audioPlayer.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audioPlayer.duration);
});
 
// Actualiza la posición mientras se reproduce.
audioPlayer.addEventListener("timeupdate", () => {
  currentTimeLabel.textContent = formatTime(audioPlayer.currentTime);
 
  if (
    Number.isFinite(audioPlayer.duration) &&
    audioPlayer.duration > 0
  ) {
    progressBar.value =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;
  }
});
 
// Permite saltar a otro punto de la canción.
progressBar.addEventListener("input", () => {
  if (
    Number.isFinite(audioPlayer.duration) &&
    audioPlayer.duration > 0
  ) {
    audioPlayer.currentTime =
      (Number(progressBar.value) / 100) * audioPlayer.duration;
  }
});
 
// Al terminar, vuelve al icono de reproducción.
audioPlayer.addEventListener("ended", () => {
  progressBar.value = 0;
  updatePlayButton();
});
 
 
// -----------------------------------------------------
// 15. INICIALIZAR LA APLICACIÓN
// Se ejecuta cuando el navegador carga este archivo.
// -----------------------------------------------------
 
loadTheme();
loadProfile();
renderSongs();
 
 
// -----------------------------------------------------
// 16. LIMPIEZA DE RECURSOS TEMPORALES
// Libera las URL de los archivos al abandonar la página.
// -----------------------------------------------------
 
window.addEventListener("beforeunload", () => {
  objectUrls.forEach(url => {
    URL.revokeObjectURL(url);
  });
});