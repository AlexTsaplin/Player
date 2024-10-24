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
  repeatBtn = document.querySelector("#repeat"),
  searchBtn = document.querySelector('.search-btn'),
  searchInput = document.querySelector('.search-input'),
  volumeControl = document.querySelector('#volume-control'),
  volumePercentage = document.querySelector('#volume-percentage');

const baseAudioPath = "data/audio/";
const baseImagePath = "data/image/";

// Змінні для стану програвача
let playing = false, 
  currentSong = 0, 
  shuffle = false, 
  repeat = 0, 
  favourites = [], 
  audio = new Audio(); 
audio.volume = volumeControl.value;
volumePercentage.innerText = `${Math.floor(volumeControl.value * 100)}%`;

// Список пісень
const songs = [
  { title: "song 1", artist: "artist 1", img_src: "people.jpg", src: "song1.mp3" },
  { title: "song 2", artist: "artist 2", img_src: "song2.png", src: "song2.mp3" },
];

// Функція для оновлення громкості
function updateVolume() {
  const volumeValue = Math.floor(volumeControl.value * 100);
  volumePercentage.innerText = `${volumeValue}%`;
  audio.volume = volumeControl.value;
}


// Обновление процентов при изменении громкости
volumeControl.addEventListener('input', updateVolume);

// Функція для пошуку пісень
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(query));
  updatePlaylist(filteredSongs);
});

// Обробник кліка по іконці пошуку
searchBtn.addEventListener('click', () => {
  if (searchInput.style.display === 'none' || !searchInput.style.display) {
    searchInput.style.display = 'inline-block';
    searchInput.focus();
  } else {
    searchInput.style.display = 'none';
    searchInput.value = '';
    updatePlaylist(songs);
  }
});

// Обробник зміни стану контейнера
menuBtn.addEventListener('click', () => {
  container.classList.toggle('active');

  // Якщо контейнер стає неактивним, приховуємо поле пошуку
  if (!container.classList.contains('active')) {
    searchInput.style.display = 'none';
    searchInput.value = '';
    updatePlaylist(songs);
  }
});

// Ініціалізація програвача
function init() {
  updatePlaylist(songs);
  loadSong(currentSong);
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
      if (e.target.classList.contains("fa-heart")) {
        addToFavourites(index);
        e.target.classList.toggle("active");
        return;
      }
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      container.classList.remove("active");
      playPauseBtn.classList.replace("fa-play", "fa-pause");
      playing = true;
    });

    const audioForDuration = new Audio(`${baseAudioPath}${songs[index].src}`);
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
  coverImage.style.backgroundImage = `url(data/image/${songs[num].img_src})`;
  audio.src = `${baseAudioPath}${songs[num].src}`;
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
  if (shuffle) shuffleFunc();
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  if (playing) audio.play();
}

// Обробник кліку для кнопки "наступна пісня"
nextBtn.addEventListener("click", nextSong);

// Функція для відтворення попередньої пісні
function prevSong() {
  if (shuffle) shuffleFunc();
  currentSong = (currentSong - 1 + songs.length) % songs.length;
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

// Ввімкнення або вимкнення shuffle
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
  repeat = (repeat + 1) % 2;
  console.log("Repeat mode:", repeat);  // Додаємо повідомлення для відладки
  repeatBtn.classList.toggle("active", repeat > 0);
});

// Автоматичний перехід до наступної пісні після завершення поточної
audio.addEventListener("ended", () => {
  if (repeat === 1) {
    loadSong(currentSong);
    audio.play();
  } else if (repeat === 2) {
    nextSong();
    audio.play();
  } else {
    nextSong();
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

// Ініціалізація програвача
init();
