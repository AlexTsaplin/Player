// Инициализация пустого списка песен
let songs = [];
let currentSong = -1; // Начинаем с первой песни

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

  // Если песня не выбрана, очищаем информацию
  if (currentSong === -1) {
    infoWrapper.innerHTML = `<h2></h2><h3></h3>`;
    currentSongTitle.innerHTML = "";
  }
}

// Функция для загрузки песни
function loadSong(num) {
  if (num === -1 || !songs[num]) {
    infoWrapper.innerHTML = `<h2></h2><h3></h3>`;
    currentSongTitle.innerHTML = "";
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

// --- Тест Люшера --- //

const luscherModal = document.getElementById("luscherModal");
const closeLuscherModalButton = document.getElementById("closeLuscherModal");
const colorButtons = document.querySelectorAll(".color-choice");
const timerElement = document.getElementById("timer"); // Элемент для отображения таймера
let luscherTimer; // Таймер для закрытия модального окна
let interval; // Таймер для обратного отсчета

// Функция запуска таймера
function startLuscherTimer(duration) {
    clearTimeout(luscherTimer);
    clearInterval(interval);

    let remainingTime = duration / 1000; // В секундах

    interval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            timerElement.textContent = `${remainingTime} секунд залишилося`;
        } else {
            clearInterval(interval);
            timerElement.textContent = `0 секунд залишилося`;
        }
    }, 1000);

    luscherTimer = setTimeout(() => {
        clearInterval(interval);
        closeLuscherModal();
    }, duration);
}

// Закрытие окна Люшера
function closeLuscherModal() {
    luscherModal.style.display = "none";
    clearTimeout(luscherTimer);
    clearInterval(interval);
}

closeLuscherModalButton.addEventListener("click", closeLuscherModal);

// Обработка выбора цвета
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedColor = button.getAttribute("data-color");
        filterSongsByColor(selectedColor);
        closeLuscherModal();
    });
});

// Открытие окна Люшера
function openLuscherModal() {
    luscherModal.style.display = "flex";
    startLuscherTimer(10000); // 10 секунд
}

// Фильтрация песен по цвету
function filterSongsByColor(color) {
    const filteredSongs = songs.filter(song => 
        song['data-color'] && song['data-color'].toLowerCase() === color.toLowerCase()
    );

    updatePlaylist(filteredSongs);

    if (filteredSongs.length === 0) {
        playlistContainer.innerHTML = '<tr><td colspan="4">На жаль, немає пісень з таким кольором.</td></tr>';
    }
}

// --- Вікно вибору опцій --- //

const choiceModal = document.getElementById("choiceModal");
const chooseLuscherBtn = document.getElementById("chooseLuscher");
const chooseMoodBtn = document.getElementById("chooseMood");
const closeChoiceModalBtn = document.getElementById("closeChoiceModal");

// Открыть выбор опций
openPlayerBtn.addEventListener("click", () => {
    choiceModal.style.display = "flex";
});

// Закрыть выбор опций
closeChoiceModalBtn.addEventListener("click", () => {
    choiceModal.style.display = "none";
});

// Выбор теста Люшера
chooseLuscherBtn.addEventListener("click", () => {
    choiceModal.style.display = "none";
    openLuscherModal();
});

// Выбор настроения
chooseMoodBtn.addEventListener("click", () => {
    choiceModal.style.display = "none";

    const moodModal = document.createElement("div");
    moodModal.classList.add("luscher-test-container");
    moodModal.innerHTML = `
        <div class="test-content">
            <h3 style="color: black;">Опишіть свій настрій:</h3><br>
            <input type="text" id="moodInput" placeholder="Ваш настрій...">
            <br>
            <button id="applyMood" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; bottom: 300px">Підібрати пісню</button>
            <button id="closeMoodModal" style="position: absolute; bottom: 185px; width: 117px; display: flex;
    justify-content: center;
    padding: 10px 0;
    font-size: 18px;
    color: white;
    background-color: rgba(82, 82, 82, 0.8);
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;">Закрити</button>
        </div>
    `;

    playerContent.appendChild(moodModal);

    const applyMoodBtn = document.getElementById("applyMood");
    const closeMoodModalBtn = document.getElementById("closeMoodModal");

    applyMoodBtn.addEventListener("click", () => {
        const userMood = document.getElementById("moodInput").value.trim();
        if (userMood) {
            const matchedSongs = songs.filter(song =>
                song.title.toLowerCase().includes(userMood.toLowerCase()) ||
                song.artist.toLowerCase().includes(userMood.toLowerCase())
            );

            if (matchedSongs.length > 0) {
                updatePlaylist(matchedSongs);
            } else {
                playlistContainer.innerHTML = '<tr><td colspan="4">Немає пісень, що відповідають вашому настрою.</td></tr>';
            }

            moodModal.remove();
        }
    });

    closeMoodModalBtn.addEventListener("click", () => {
        moodModal.remove();
    });
});

// Window prompt //

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

//про програму
document.getElementById("openAboutApp").addEventListener("click", function () {
  document.getElementById("aboutAppModal").style.display = "flex";
});

document.getElementById("closeAboutApp").addEventListener("click", function () {
  document.getElementById("aboutAppModal").style.display = "none";
});


// НАЛАШТУВАННЯ (зміна мовu)


// Setting (language change)

// Ініціалізація програвача
init();


