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

  // Останавливаем предыдущее воспроизведение
  audio.pause();
  audio.src = "";
  audio.load();
  audio.currentTime = 0;

  infoWrapper.innerHTML = `<h2>${songs[num].title}</h2><h3>${songs[num].artist}</h3>`;
  currentSongTitle.innerHTML = songs[num].title;
  coverImage.style.backgroundImage = `url(data/image/${songs[num].img_src})`;

  // Загружаем новую песню
  audio.src = `${baseAudioPath}${songs[num].src}`;
  audio.load();
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

// --- Вікно вибору опцій --- //
const choiceModal = document.getElementById("choiceModal");
const chooseLuscherBtn = document.getElementById("chooseLuscher");
const closeChoiceModalBtn = document.getElementById("closeChoiceModal");

// --- Тест Люшера --- //
const luscherModal = document.getElementById("luscherModal");
const closeLuscherModalButton = document.getElementById("closeLuscherModal");
const colorButtons = document.querySelectorAll(".color-choice");
const timerElement = document.getElementById("timer"); // Элемент для отображения таймера
let luscherTimer, interval; // Таймеры для закрытия модального окна и обратного отсчета

// Функция для запуска таймера
function startLuscherTimer(duration) {
    clearTimeout(luscherTimer);
    clearInterval(interval);

    let remainingTime = duration / 1000; // В секундах
    interval = setInterval(() => {
        remainingTime > 0 
            ? timerElement.textContent = `${--remainingTime} секунд залишилося` 
            : endTimer();
    }, 1000);

    luscherTimer = setTimeout(endTimer, duration);
}

// Завершение таймера
function endTimer() {
    clearInterval(interval);
    timerElement.textContent = `0 секунд залишилося`;
    closeLuscherModal();
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
        filterSongsByColor(button.getAttribute("data-color"));
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
// --- Тест Люшера --- //

// --- MBTI тест --- //
// Глобальные переменные для песен (предполагается, что где‑то есть функция loadSongs, которая загружает данные в songs)
let songsWithMbti = [];     // Будет вычислен после загрузки песен

const mbtiTypes = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

// Функция для вычисления массива песен с MBTI
function computeSongsWithMbti() {
  return songs.map(song => {
    return {
      ...song,
      // Если у песни уже задан MBTI (и не пустой), оставляем его, иначе назначаем циклически
      mbti: song.mbti && song.mbti.trim() !== ""
            ? song.mbti.trim().toUpperCase()
            : mbtiTypes[song.id % mbtiTypes.length]
    };
  });
}

// После загрузки песен (например, в loadSongs) необходимо пересчитать songsWithMbti:
function loadSongs() {
  fetch('songs.json')
    .then(response => {
      if (!response.ok) throw new Error("Ошибка загрузки данных");
      return response.json();
    })
    .then(data => {
      songs = data;
      // Пересчитываем songsWithMbti после загрузки песен:
      songsWithMbti = computeSongsWithMbti();
      if (songs.length > 0) {
        init(); // Инициализируем плеер
      } else {
        console.error('Список песен пуст');
      }
    })
    .catch(error => console.error('Ошибка загрузки списка песен:', error));
}

// Массив вопросов MBTI-теста
const mbtiQuestions = [
  {
    question: "mbtiQuestion1",
    options: [
      { text: "mbtiOptionE", value: "E" },
      { text: "mbtiOptionI", value: "I" }
    ]
  },
  {
    question: "mbtiQuestion2",
    options: [
      { text: "mbtiOptionS", value: "S" },
      { text: "mbtiOptionN", value: "N" }
    ]
  },
  {
    question: "mbtiQuestion3",
    options: [
      { text: "mbtiOptionT", value: "T" },
      { text: "mbtiOptionF", value: "F" }
    ]
  },
  {
    question: "mbtiQuestion4",
    options: [
      { text: "mbtiOptionJ", value: "J" },
      { text: "mbtiOptionP", value: "P" }
    ]
  }
];


// Функция фильтрации песен по MBTI типу
function filterSongsByMbti(mbtiType) {
  mbtiType = mbtiType.trim().toUpperCase();
  console.log("Filtering songs for MBTI:", mbtiType);
  const filteredSongs = songsWithMbti.filter(song =>
    song.mbti && song.mbti === mbtiType
  );
  currentSongs = filteredSongs;
  updatePlaylist(filteredSongs);
}

// Функция обновления плейлиста (пример)
function updatePlaylist(songsList) {
  document.getElementById("playlist").innerHTML =
    songsList.map(song => `<div>${song.title} (${song.mbti})</div>`).join("");
}

// Глобальные переменные для MBTI-теста
let mbtiCurrentQuestionIndex = 0;
let mbtiAnswers = [];
let selectedMbtiAnswer = null;

// Функция открытия MBTI-теста
function openMbtiTest() {
  const mbtiModal = document.getElementById("mbtiModal");
  mbtiModal.style.display = "flex";
  // Скрываем кнопку закрытия только для MBTI-теста
  document.getElementById("closeMbtiModal").style.display = "none";
  
  mbtiCurrentQuestionIndex = 0;
  mbtiAnswers = [];
  selectedMbtiAnswer = null;
  displayMbtiQuestion();
  document.getElementById("mbtiNextButton").style.display = "inline-block";
  document.getElementById("mbtiNextButton").disabled = true;
}

// Функция отображения текущего вопроса MBTI-теста
function displayMbtiQuestion() {
  const questionContainer = document.getElementById("mbtiQuestionContainer");
  questionContainer.innerHTML = ""; // Очищаємо контейнер

  const lang = localStorage.getItem("playerLanguage") || "uk"; // Додаємо визначення `lang`

  if (mbtiCurrentQuestionIndex < mbtiQuestions.length) {
      const currentQ = mbtiQuestions[mbtiCurrentQuestionIndex];

      // Відображаємо питання з перекладом
      const questionElement = document.createElement("p");
      questionElement.textContent = translations[lang][currentQ.question]; 
      questionContainer.appendChild(questionElement);

      // Відображаємо варіанти відповідей
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "mbti-options";

      currentQ.options.forEach(option => {
          const btn = document.createElement("button");
          btn.className = "mbti-option";
          btn.textContent = translations[lang][option.text]; // Отримуємо переклад
          btn.dataset.value = option.value;

          btn.addEventListener("click", () => {
              selectedMbtiAnswer = option.value;
              document.querySelectorAll(".mbti-option").forEach(b => b.style.backgroundColor = "");
              btn.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              document.getElementById("mbtiNextButton").disabled = false;
          });

          optionsDiv.appendChild(btn);
      });

      questionContainer.appendChild(optionsDiv);
  } else {
      // Після завершення тесту
      const mbtiType = mbtiAnswers.join("");
      questionContainer.innerHTML = `<p>${translations[lang]["mbtiResult"]} <strong>${mbtiType}</strong></p>`;
      document.getElementById("mbtiNextButton").style.display = "none";

      // Фільтрація пісень за MBTI
      setTimeout(() => {
          document.getElementById("mbtiModal").style.display = "none";
          filterSongsByMbti(mbtiType);
      }, 2000);
  }
}

// Обработчик кнопки "Далее"
document.getElementById("mbtiNextButton").addEventListener("click", () => {
  if (selectedMbtiAnswer) {
    mbtiAnswers.push(selectedMbtiAnswer);
    selectedMbtiAnswer = null;
    mbtiCurrentQuestionIndex++;
    displayMbtiQuestion();
    document.getElementById("mbtiNextButton").disabled = true;
  }
});

// Обработчик кнопки "Закрыть" в MBTI-тесте
document.getElementById("closeMbtiModal").addEventListener("click", () => {
  const mbtiModal = document.getElementById("mbtiModal");
  mbtiModal.style.display = "none";
});

// Обработчик для кнопки открытия MBTI-теста из окна выбора тестов
document.getElementById("chooseMbtiTest")?.addEventListener("click", () => {
  const choiceModal = document.getElementById("choiceModal");
  if (choiceModal) {
    choiceModal.style.display = "none";
  }
  openMbtiTest();
});
// --- MBTI тест --- //

// --- Ритм. тест --- //
// Предполагается, что глобальный массив songs уже загружен (например, через loadSongs)
let songsWithTemp = [];

// Функция для визначення "temp" за кольором
function getTempByColor(color) {
  if (!color) return "neutral";
  const energeticColors = ["red", "yellow", "purple", "blue"];
  const calmColors = ["black", "white", "brown"];
  if (energeticColors.includes(color.toLowerCase())) return "energetic";
  if (calmColors.includes(color.toLowerCase())) return "calm";
  return "neutral";
}

// Функция для обчислення нового масиву пісень з властивістю temp.
// Викликайте її після завантаження пісень (наприклад, у loadSongs).
function computeSongsWithTemp() {
  songsWithTemp = songs.map(song => {
    const color = song["data-color"] || song["data-colorr"] || "";
    return { ...song, temp: getTempByColor(color) };
  });
}

function filterSongsByRhythm(bpm) {
  const tempMap = {
    energetic: bpm >= 200,
    calm: bpm <= 150,
    neutral: bpm > 150 && bpm < 200,
  };

  const filteredSongs = songsWithTemp.filter(song =>
    tempMap[song.temp]
  );
  
  currentSongs = filteredSongs;
  updatePlaylist(filteredSongs);
}

// Глобальні змінні для ритмічного тесту
let tapTimes = [];
let startTime = 0;
let rhythmInterval;
let rhythmTimeout;

function openRhythmModal() {
  const rhythmModal = document.getElementById("rhythmModal");
  const rhythmResult = document.getElementById("rhythmResult");
  const rhythmTimer = document.getElementById("rhythmTimer");
  const tapButton = document.getElementById("rhythmTapButton");

  tapTimes = [];
  startTime = Date.now();
  rhythmResult.textContent = "BPM: --";
  rhythmTimer.textContent = "Час: 0 с";
  tapButton.disabled = false;
  rhythmModal.style.display = "flex";

  rhythmInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    rhythmTimer.textContent = "Час: " + elapsed + " с";
  }, 1000);

  rhythmTimeout = setTimeout(() => {
    clearInterval(rhythmInterval);
    tapButton.disabled = true;

    let finalBPM;
    if (tapTimes.length > 1) {
      const totalTime = tapTimes[tapTimes.length - 1] - tapTimes[0];
      const avgInterval = totalTime / (tapTimes.length - 1);
      finalBPM = Math.round(60000 / avgInterval);
      rhythmResult.textContent = "Final BPM: " + finalBPM;
    } else {
      rhythmResult.textContent = "Недостатньо натискань";
      finalBPM = 0;
    }

    setTimeout(() => {
      rhythmModal.style.display = "none";
      if (finalBPM > 0) {
        filterSongsByRhythm(finalBPM);
      }
    }, 2000);
  }, 8000);  
}

document.getElementById("rhythmTapButton").addEventListener("click", () => {
  const now = Date.now();
  tapTimes.push(now);
  if (tapTimes.length > 1) {
    const totalTime = tapTimes[tapTimes.length - 1] - tapTimes[0];
    const avgInterval = totalTime / (tapTimes.length - 1);
    const bpm = Math.round(60000 / avgInterval);
    document.getElementById("rhythmResult").textContent = "BPM: " + bpm;
  }
});

document.getElementById("closeRhythmModal").addEventListener("click", () => {
  const rhythmModal = document.getElementById("rhythmModal");
  rhythmModal.style.display = "none";
  clearInterval(rhythmInterval);
  clearTimeout(rhythmTimeout);
});

// Обробник кнопки "Ритмічний тест" у вікні вибору тестів
document.getElementById("chooseRhythmTest")?.addEventListener("click", () => {
  const choiceModal = document.getElementById("choiceModal");
  if (choiceModal) {
    choiceModal.style.display = "none";
  }
  computeSongsWithTemp();
  openRhythmModal();
});

// --- Ритм. тест --- //

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

  // Зупиняємо відтворення
  audio.pause();

  // Міняємо значок на "Play"
  playPauseBtn.classList.replace("fa-pause", "fa-play");
  playing = false; // Оновлюємо стан

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
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)  // Добавлен поиск по исполнителю
  );
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
          <td class="title">
              <h6>${song.title}</h6>
              <h6 class="artist small-artist">${song.artist}</h6>
          </td>
          <td class="length"><h5>0:00</h5></td>
          <td><i class="fas fa-heart ${favourites.includes(index) ? "active" : ""}"></i></td>
      </tr>
  `).join("");

  // Додаємо обробники подій для нових рядків списку
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

          // Сховати поле пошуку та оновити список
          searchInput.style.display = 'none';
          searchInput.value = '';
          updatePlaylist(songList);
      });

      // Завантажити тривалість пісень
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
const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const settingsModal = document.getElementById("settingsModal");
const languageSelect = document.getElementById("languageSelect");

// Відкриття налаштувань
openSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "block";
});

// Закриття налаштувань
closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

// Функція зміни мови
function updateLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem("playerLanguage", lang);

  document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.getAttribute("data-lang");
      if (translations[lang][key]) {
          el.innerText = translations[lang][key];
      }
  });

  // Якщо відкритий тест Люшера, оновлюємо таймер
  if (document.getElementById("luscherModal").style.display === "flex") {
      document.getElementById("timer").textContent = translations[lang]["timerText"];
  }

  // Якщо відкритий MBTI тест, оновлюємо питання
  if (document.getElementById("mbtiModal").style.display === "flex") {
      displayMbtiQuestion();
  }

  // Якщо відкритий ритмічний тест, оновлюємо BPM і таймер
  if (document.getElementById("rhythmModal").style.display === "flex") {
      document.getElementById("rhythmResult").textContent = translations[lang]["bpm"];
      document.getElementById("rhythmTimer").textContent = translations[lang]["timeLeft"];
  }
}


// Об'єкт перекладів
const translations = {
  uk: {
      setting: "Налаштування",
      addToPlaylist: "Додати до плейлисту",
      viewArtist: "Переглянути артиста",
      viewAlbum: "Переглянути альбом",
      share: "Поширити",
      menu: "Меню",
      next: "Далі",
      openPlayer: "Програвач",
      settings: "Налаштування",
      about: "Про YouPlayer",
      close: "Закрити",
      language: "Мова",
      chooseOption: "Оберіть опцію",
      rhythmTest: "Ритмічний тест",
      rhythmTestTitle: "Ритмічний тест",
      rhythmTestText: "Натискайте кнопку у бажаному ритмі:",
      click: "Натискайте",
      bpm: "BPM: --",
      timeLeft: "Час: 0 с",
      luscherTestTitle: "Тест Люшера",
      luscherTest: "Тест Люшера",
      luscherTestText: "Виберіть колір, який вам найбільш приємний:",
      timerText: "10 секунд залишилося",
      aboutTitle: "Про YouPlayer",
      aboutText: "YouPlayer — ідеальний супутник для любителів музики. Керуйте своїми треками, створюйте персоналізовані плейлисти та насолоджуйтеся якісним звуком у будь-якій ситуації.",
      appVersion: "Версія додатка: 0.6.9",
      mbtiTest: "MBTI тест",
      mbtiTestTitle: "MBTI тест",
      mbtiResult: "Ваш MBTI тип:",
      mbtiQuestion1: "Ви віддаєте перевагу спілкуванню з людьми чи проведенню часу на самоті?",
      mbtiQuestion2: "Ви довіряєте фактам і конкретним деталям чи інтуїції й абстрактним ідеям?",
      mbtiQuestion3: "Ви приймаєте рішення на основі логіки чи почуттів?",
      mbtiQuestion4: "Ви віддаєте перевагу планувати чи імпровізувати?",
      mbtiOptionE: "Екстраверсія (E)",
      mbtiOptionI: "Інтроверсія (I)",
      mbtiOptionS: "Сенсорика (S)",
      mbtiOptionN: "Інтуїція (N)",
      mbtiOptionT: "Логіка (T)",
      mbtiOptionF: "Почуття (F)",
      mbtiOptionJ: "Міркування (J)",
      mbtiOptionP: "Сприйняття (P)"
      
  },
  en: {
      setting: "Setting",
      addToPlaylist: "Add to Playlist",
      viewArtist: "View Artist",
      viewAlbum: "View Album",
      share: "Share",
      next: "Next",
      menu: "Menu",
      openPlayer: "Player",
      settings: "Settings",
      close: "Close",
      language: "Language",
      about: "About YouPlayer",
      chooseOption: "Choose an option",
      rhythmTest: "Rhythm Test",
      rhythmTestTitle: "Rhythm Test",
      rhythmTestText: "Tap the button at your desired rhythm:",
      bpm: "BPM: --",
      click: "Click",
      timeLeft: "Time: 0s",
      luscherTestTitle: "Luscher Test",
      luscherTest: "Luscher Test",
      luscherTestText: "Choose the color you find most pleasant:",
      timerText: "10 seconds left",
      aboutTitle: "About YouPlayer",
      aboutText: "YouPlayer is the perfect companion for music lovers. Manage your tracks, create personalized playlists and enjoy high-quality sound in any situation.",
      appVersion: "App version: 0.6.9",
      mbtiTest: "MBTI Test",
      mbtiTestTitle: "MBTI Test",
      mbtiResult: "Your MBTI type:",
      mbtiQuestion1: "Do you prefer socializing or spending time alone?",
      mbtiQuestion2: "Do you trust facts and details or intuition and abstract ideas?",
      mbtiQuestion3: "Do you make decisions based on logic or feelings?",
      mbtiQuestion4: "Do you prefer planning or improvising?",
      mbtiOptionE: "Extraversion (E)",
      mbtiOptionI: "Introversion (I)",
      mbtiOptionS: "Sensing (S)",
      mbtiOptionN: "Intuition (N)",
      mbtiOptionT: "Thinking (T)",
      mbtiOptionF: "Feeling (F)",
      mbtiOptionJ: "Judging (J)",
      mbtiOptionP: "Perceiving (P)"
  }
};

// Встановлення збереженої мови
const savedLanguage = localStorage.getItem("playerLanguage") || "uk";
languageSelect.value = savedLanguage;
updateLanguage(savedLanguage);

// Обробник зміни мови
languageSelect.addEventListener("change", () => {
    updateLanguage(languageSelect.value);
});

// Setting (language change)



// Ініціалізація програвача
init();
