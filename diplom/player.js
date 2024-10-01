// Вибір усіх необхідних елементів DOM
const menuBtn = document.querySelector(".menu-btn"),
  container = document.querySelector(".container"),
  progressBar = document.querySelector(".bar"),
  progressDot = document.querySelector(".dot"),
  currentTimeEl = document.querySelector(".current-time"),
  durationEl = document.querySelector(".duration"),
  playlistContainer = document.querySelector("#playlist"),
  infoWrapper = document.querySelector(".info"),
  coverImage = document.querySelector(".cover-image"),
  currentSongTitle = document.querySelector(".current-song-title"),
  currentFavourite = document.querySelector("#current-favourite"),
  playPauseBtn = document.querySelector("#playpause"),
  nextBtn = document.querySelector("#next"),
  prevBtn = document.querySelector("#prev"),
  shuffleBtn = document.querySelector("#shuffle"),
  repeatBtn = document.querySelector("#repeat");

// Змінні для стану програвача
let playing = false, 
  currentSong = 0, 
  shuffle = false, 
  repeat = 0, 
  favourites = [], 
  audio = new Audio(); 

// Список пісень
const songs = [
  { title: "song 1", artist: "artist 1", img_src: "song.png", src: "song1.mp3" },
  { title: "song 2", artist: "artist 2", img_src: "song2.png", src: "song2.mp3" }
];

// Обробник кліку по кнопці меню (відкриває/закриває програвач)
menuBtn.addEventListener("click", () => container.classList.toggle("active"));

// Ініціалізація програвача
function init() {
  updatePlaylist(songs); // Оновлює плейлист на основі списку пісень
  loadSong(currentSong); // Завантажує першу пісню
}

// Оновлення плейлиста
function updatePlaylist(songs) {
  playlistContainer.innerHTML = songs.map((song, index) => `
    <tr class="song">
      <td class="no"><h5>${index + 1}</h5></td>
      <td class="title"><h6>${song.title}</h6></td>
      <td class="length"><h5>2:03</h5></td>
      <td><i class="fas fa-heart ${favourites.includes(index) ? "active" : ""}"></i></td>
    </tr>
`).join("");

  // Додаємо події для кожного рядка пісні в плейлисті
  document.querySelectorAll(".song").forEach((tr, index) => {
    tr.addEventListener("click", (e) => {
      // Якщо клік по значку улюбленого, додаємо/видаляємо з улюблених
      if (e.target.classList.contains("fa-heart")) {
        addToFavourites(index);
        e.target.classList.toggle("active");
        return;
      }
      // В іншому випадку, програємо вибрану пісню
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      container.classList.remove("active");
      playPauseBtn.classList.replace("fa-play", "fa-pause");
      playing = true;
    });

    // Визначення тривалості кожної пісні
    const audioForDuration = new Audio(`image/${songs[index].src}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = formatTime(audioForDuration.duration);
      tr.querySelector(".length h5").innerText = duration;
    });
  });
}

// Форматування часу (мм:сс)
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = String(Math.floor(time % 60)).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Завантаження пісні
function loadSong(num) {
  infoWrapper.innerHTML = `<h2>${songs[num].title}</h2><h3>${songs[num].artist}</h3>`;
  currentSongTitle.innerHTML = songs[num].title;
  coverImage.style.backgroundImage = `url(image/${songs[num].img_src})`;
  audio.src = `image/${songs[num].src}`;
  currentFavourite.classList.toggle("active", favourites.includes(num));
}

// Перемикання кнопки "відтворити/пауза"
function togglePlayPause() {
  if (playing) {
    playPauseBtn.classList.replace("fa-pause", "fa-play");
    audio.pause();
  } else {
    playPauseBtn.classList.replace("fa-play", "fa-pause");
    audio.play();
  }
  playing = !playing;
}
// Обробник кліку для кнопки "відтворити/пауза"
playPauseBtn.addEventListener("click", togglePlayPause);

// Функція для відтворення наступної пісні
function nextSong() {
  if (shuffle) shuffleFunc(); // Якщо ввімкнено shuffle, граємо випадкову пісню
  currentSong = (currentSong + 1) % songs.length; // Перехід на наступну пісню
  loadSong(currentSong);
  if (playing) audio.play();
}

// Обробник кліку для кнопки "наступна пісня"
nextBtn.addEventListener("click", nextSong);

// Функція для відтворення попередньої пісні
function prevSong() {
  if (shuffle) shuffleFunc(); // Якщо ввімкнено shuffle, граємо випадкову пісню
  currentSong = (currentSong - 1 + songs.length) % songs.length; // Перехід на попередню пісню
  loadSong(currentSong);
  if (playing) audio.play();
}

// Обробник кліку для кнопки "попередня пісня"
prevBtn.addEventListener("click", prevSong);

// Додавання або видалення пісні з улюблених
function addToFavourites(index) {
  if (favourites.includes(index)) {
    favourites = favourites.filter(item => item !== index);
    currentFavourite.classList.remove("active");
  } else {
    favourites.push(index);
    if (index === currentSong) currentFavourite.classList.add("active");
  }
  updatePlaylist(songs);
}

// Обробник кліку для кнопки "додати в улюблені"
currentFavourite.addEventListener("click", () => {
  currentFavourite.classList.toggle("active");
  addToFavourites(currentSong);
});

// Ввімкнення або вимкнення shuffle (випадкового відтворення)
shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
});

// Функція для випадкового вибору пісні
function shuffleFunc() {
  currentSong = Math.floor(Math.random() * songs.length);
}

// Обробник кліку для кнопки "повтор"
repeatBtn.addEventListener("click", () => {
  repeat = (repeat + 1) % 3;
  repeatBtn.classList.toggle("active", repeat > 0);
});

// Автоматичний перехід до наступної пісні після завершення поточної
audio.addEventListener("ended", () => {
  if (repeat === 1) {
    loadSong(currentSong); // Повтор поточної пісні
    audio.play();
  } else if (repeat === 2) {
    nextSong(); // Перехід до наступної пісні з повтором плейлиста
    audio.play();
  } else {
    nextSong(); // Перехід до наступної пісні без повтору
  }
});

// Оновлення прогрес-бару під час відтворення пісні
function progress() {
  let { duration, currentTime } = audio;
  currentTimeEl.innerHTML = formatTime(currentTime || 0);
  durationEl.innerHTML = formatTime(duration || 0);
  progressDot.style.left = `${(currentTime / duration) * 100}%`;
}
// Обробник оновлення часу пісні
audio.addEventListener("timeupdate", progress);

// Переміщення по треку через прогрес-бар
progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});
init();