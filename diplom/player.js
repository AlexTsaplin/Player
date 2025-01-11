// Инициализация пустого списка песен
let songs = [];
let currentSong = 0; // Начинаем с первой песни

// Функция для загрузки JSON с песнями
function loadSongs() {
  fetch('songs.json')
    .then(response => {
      if (!response.ok) throw new Error("Ошибка загрузки данных");
      return response.json();
    })
    .then(data => {
      songs = data;
      if (songs.length > 0) {
        init(); // Запускаем инициализацию только после загрузки песен
      } else {
        console.error('Список песен пуст');
      }
    })
    .catch(error => console.error('Ошибка загрузки списка песен:', error));
}

// Инициализация плеера
function init() {
  updatePlaylist(songs);
  loadSong(currentSong);
}

// Функция для загрузки песни
function loadSong(num) {
  if (!songs[num]) {  // Проверяем, существует ли песня с индексом num
    return;
  }
  
  infoWrapper.innerHTML = `<h2>${songs[num].title}</h2><h3>${songs[num].artist}</h3>`;
  currentSongTitle.innerHTML = songs[num].title;
  coverImage.style.backgroundImage = `url(data/image/${songs[num].img_src})`;
  audio.src = `${baseAudioPath}${songs[num].src}`;
  currentFavourite.classList.toggle("active", favourites.includes(num));
}

// Запускаем загрузку песен из JSON
loadSongs();

const playerContent = document.querySelector(".player-content");
const openPlayerBtn = document.getElementById("openPlayer");
const menuBtn = document.querySelector(".menu-btn");
const backToMenuBtn = document.getElementById("backToMenu");
const mainMenu = document.querySelector(".main-menu");
const playerBody = document.querySelector(".player-body");
const container = document.querySelector(".container");
const progressBar = document.querySelector(".bar");
const progressDot = document.querySelector(".dot");
const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".duration");
const playlistContainer = document.querySelector("#playlist");
const infoWrapper = document.querySelector(".info");
const coverImage = document.querySelector(".cover-image");
const currentSongTitle = document.querySelector(".current-song-title");
const currentFavourite = document.querySelector("#current-favourite");
const playPauseBtn = document.querySelector("#playpause");
const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
const shuffleBtn = document.querySelector("#shuffle");
const repeatBtn = document.querySelector("#repeat");
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
const volumeControl = document.querySelector('#volume-control');
const volumePercentage = document.querySelector('#volume-percentage');
const optionBtn = document.querySelector('#option');
const trackInfoModal = document.querySelector('#trackInfoModal');
const closeTrackInfoBtn = document.querySelector('#closeTrackInfo');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');
const trackCover = document.querySelector('.track-cover');


const baseAudioPath = "data/audio/";
const baseImagePath = "data/image/";

// ТЕСТ ЛЮШЕРА //

// Селекторы для элементов
const openPlayerButton = document.getElementById("openPlayer");
const luscherModal = document.getElementById("luscherModal");
const closeLuscherModalButton = document.getElementById("closeLuscherModal");
const colorButtons = document.querySelectorAll(".color-choice");
const songListContainer = document.getElementById("song-list");
const timerElement = document.getElementById("timer"); // Элемент для отображения таймера
let luscherTimer; // Таймер для закрытия модального окна
let interval; // Таймер для обратного отсчета

// Функция запуска таймера
function startLuscherTimer(duration) {
    clearTimeout(luscherTimer); // Сбрасываем предыдущий таймер
    clearInterval(interval); // Останавливаем обратный отсчёт, если он запущен

    if (!timerElement) {
        console.error("Таймер (timerElement) не найден в DOM.");
        return;
    }

    let remainingTime = duration / 1000; // Преобразуем миллисекунды в секунды

    // Обновляем текст таймера каждую секунду
    interval = setInterval(() => {
      if (remainingTime > 0) {
          remainingTime--; // Сначала уменьшаем
          timerElement.textContent = `${remainingTime} секунд залишилося`; // Потом отображаем
      } else {
          clearInterval(interval); // Останавливаем обратный отсчёт
          timerElement.textContent = `0 секунд залишилося`; // Показываем 0, если время вышло
      }
  }, 1000);

    // Устанавливаем таймер для закрытия окна
    luscherTimer = setTimeout(() => {
        clearInterval(interval); // Останавливаем обновление текста таймера
        closeLuscherModal(); // Закрываем модальное окно
    }, duration);
}

// Функция закрытия модального окна
function closeLuscherModal() {
    if (luscherModal) {
        luscherModal.style.display = "none";
    }
    clearTimeout(luscherTimer); // Сбрасываем основной таймер
    clearInterval(interval); // Сбрасываем таймер обратного отсчета
}

// Обработка выбора цвета
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedColor = button.getAttribute("data-color");
        filterSongsByColor(selectedColor); // Фильтруем песни
        closeLuscherModal(); // Закрываем модальное окно
    });
});

// Открытие модального окна
openPlayerButton.addEventListener("click", () => {
    if (luscherModal) {
        luscherModal.style.display = "flex";
    }
    if (songListContainer) {
        songListContainer.innerHTML = ''; // Очистить список песен
    }
    startLuscherTimer(10000); // Запускаем таймер на 15 секунд
});

// Функция фильтрации песен по цвету
function filterSongsByColor(color) {
    const filteredSongs = songs.filter(song => 
        song['data-color'] && song['data-color'].toLowerCase() === color.toLowerCase()
    );

    updatePlaylist(filteredSongs);

    if (filteredSongs.length === 0) {
        const playlistContainer = document.querySelector("#playlist");
        playlistContainer.innerHTML = '<tr><td colspan="4">На жаль, немає пісень з таким кольором.</td></tr>';
    }
}

// TEST LUSHERA //

// Змінні для стану програвача
let playing = false, 
  shuffle = false, 
  repeat = 0, 
  favourites = [], 
  audio = new Audio(); 
audio.volume = volumeControl.value;
volumePercentage.innerText = `${Math.floor(volumeControl.value * 100)}%`;

// переход к плееру
openPlayerBtn.addEventListener("click", () => {
  mainMenu.style.display = "none"; 
  playerContent.style.display = "block"; 
  playerBody.style.display = "block";
  container.classList.add("active");
});

//возвращение в меню
backToMenuBtn.addEventListener("click", () => {
  mainMenu.style.display = "block"; 

  // Скрываем интерфейс плеера
  playerContent.style.display = "none"; 
  playerBody.style.display = "none"; 

  // Снимаем класс active у контейнера
  container.classList.remove('active');

  // Скрываем поле поиска и обновляем плейлист
  searchInput.style.display = 'none';
  searchInput.value = '';
  updatePlaylist(songs);
});




// Функция для открытия окна с информацией о треке
function openTrackInfo() {
  trackInfoModal.style.display = 'block';
  setTimeout(() => trackInfoModal.style.opacity = '1', 0); // Плавное появление
  trackTitle.innerText = songs[currentSong].title;
  trackArtist.innerText = songs[currentSong].artist;
  trackCover.style.backgroundImage = `url(${baseImagePath}${songs[currentSong].img_src})`;
}

// Функция для закрытия окна с информацией о треке
function closeTrackInfo() {
  trackInfoModal.style.opacity = '0'; // Плавное исчезновение
  setTimeout(() => trackInfoModal.style.display = 'none', 300); // Скрыть после завершения анимации
}

// Обработчик клика по кнопке опций
optionBtn.addEventListener('click', openTrackInfo);

// Обработчик клика по стрелочке для закрытия окна
closeTrackInfoBtn.addEventListener('click', closeTrackInfo);

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
  } else {
    updatePlaylist(songs);
  }
});

// Ініціалізація програвача
function init() {
  updatePlaylist(songs);
  loadSong(currentSong);
}

// Оновлення плейлиста
function updatePlaylist(songList) {
  const playlistContainer = document.querySelector("#playlist");
  playlistContainer.innerHTML = songList.map((song, index) => `
      <tr class="song">
          <td class="no"><h5>${song.id + 1}</h5></td>
          <td class="title"><h6>${song.title}</h6></td>
          <td class="length"><h5>2:03</h5></td>
          <td><i class="fas fa-heart ${favourites.includes(index) ? "active" : ""}"></i></td>
      </tr>
  `).join("");

  // Добавляем обработчики событий для новых строк плейлиста
  document.querySelectorAll(".song").forEach((tr, index) => {
      tr.addEventListener("click", (e) => {
          if (e.target.classList.contains("fa-heart")) {
              addToFavourites(index);
              e.target.classList.toggle("active");
              return;
          }
          currentSong = songList[index].id;
          loadSong(currentSong);
          audio.play();
          container.classList.remove("active");
          playPauseBtn.classList.replace("fa-play", "fa-pause");
          playing = true;

          // Скрываем поле поиска и обновляем плейлист
          searchInput.style.display = 'none';
          searchInput.value = '';
          updatePlaylist(songList);
      });

      // Загружаем длительность песен
      const audioForDuration = new Audio(`${baseAudioPath}${songList[index].src}`);
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
