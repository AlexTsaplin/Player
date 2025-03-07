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

// --- За жанрами --- //
const chooseGenreTestBtn = document.getElementById("chooseGenreTest");
const genreTestModal = document.getElementById("genreTestModal");
const closeGenreTestModalButton = document.getElementById("closeGenreTestModal");
const genreButtons = document.querySelectorAll(".genre-choice");

// Відкриття модального вікна тесту "За жанрами"
function openGenreTestModal() {
    genreTestModal.style.display = "flex";
}

// Закриття модального вікна тесту "За жанрами"
function closeGenreTestModal() {
    genreTestModal.style.display = "none";
}

// Фільтрація пісень за жанром
function filterSongsByGenre(genre) {
    const filteredSongs = songs.filter(song => song.genre && song.genre.toLowerCase() === genre);
    updatePlaylist(filteredSongs);

    if (filteredSongs.length === 0) {
        playlistContainer.innerHTML = '<tr><td colspan="4">На жаль, немає пісень у цьому жанрі.</td></tr>';
    }
}

// Додаємо обробники подій для кнопок жанрів
genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterSongsByGenre(button.getAttribute("data-genre"));
        closeGenreTestModal();
    });
});

// Обробник для кнопки відкриття тесту "За жанрами"
chooseGenreTestBtn.addEventListener("click", () => {
    choiceModal.style.display = "none";
    openGenreTestModal();
});

// Обробник для кнопки закриття тесту "За жанрами"
closeGenreTestModalButton.addEventListener("click", closeGenreTestModal);
// --- By genre --- //

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
  // Приводим название цвета к нижнему регистру, если в объекте ключи в нижнем регистре
  const colorKey = color.toLowerCase();
  const filteredSongs = songs
      .filter(song => song.colors && song.colors[colorKey] !== undefined)
      .sort((a, b) => b.colors[colorKey] - a.colors[colorKey]); // Сортировка по убыванию коэффициента

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
    let dominantColor = "";
    if (song.colors) {
      // Знаходимо колір із максимальним значенням
      dominantColor = Object.entries(song.colors).reduce((maxEntry, entry) => {
        return entry[1] > maxEntry[1] ? entry : maxEntry;
      }, ["", 0])[0];
    }
    return { ...song, temp: getTempByColor(dominantColor) };
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

// НАЛАШТУВАННЯ
const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const settingsModal = document.getElementById("settingsModal");
const languageSelect = document.getElementById("languageSelect");

// Глобальная переменная для хранения переводов
let translations = {};

// Відкриття налаштувань
openSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "block";
});

// Закриття налаштувань
closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

// Функція зміни мови
function updateLanguage(translations, lang) {
    document.documentElement.lang = lang;
    localStorage.setItem("playerLanguage", lang);

    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Оновлення тестів
    if (document.getElementById("luscherModal")?.style.display === "flex") {
        document.getElementById("timer").textContent = translations[lang]["timerText"];
    }

    if (document.getElementById("mbtiModal")?.style.display === "flex") {
        displayMbtiQuestion();
    }

    if (document.getElementById("rhythmModal")?.style.display === "flex") {
        document.getElementById("rhythmResult").textContent = translations[lang]["bpm"];
        document.getElementById("rhythmTimer").textContent = translations[lang]["timeLeft"];
    }
}

// Функція завантаження перекладів
function loadTranslations() {
    fetch('language.json')
        .then(response => response.json())
        .then(data => {
            translations = data; // Збереження перекладів
            const savedLanguage = localStorage.getItem("playerLanguage") || "uk";
            updateLanguage(translations, savedLanguage);
        })
        .catch(error => console.error('Помилка завантаження JSON:', error));
}

// Завантажуємо переклади при запуску
loadTranslations();

// Обробник зміни мови
languageSelect.addEventListener("change", () => {
    const selectedLang = languageSelect.value;
    updateLanguage(translations, selectedLang);
});

// Зміна кольору
document.addEventListener("DOMContentLoaded", () => {
    const playerColorPicker = document.getElementById("playerColor");
    const playerContainer = document.querySelector(".container") || document.body;

    // Функція зміни кольору
    function updatePlayerColor(color) {
        playerContainer.style.backgroundColor = color;
        localStorage.setItem("playerColor", color);
    }

    // Завантажуємо збережений колір
    const savedColor = localStorage.getItem("playerColor") || "#222";
    playerContainer.style.backgroundColor = savedColor;
    playerColorPicker.value = savedColor;

    // Оновлюємо колір при виборі користувачем
    playerColorPicker.addEventListener("input", () => {
        updatePlayerColor(playerColorPicker.value);
    });
});
// SETTING

// Ініціалізація програвача
init();