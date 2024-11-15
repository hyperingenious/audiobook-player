const app_state = {
  isButtonEnabled: false,
  isSomethingPlaying: false,
};

const book_data_format = {
  stream_info: {
    book_id: "alskdfj",
    chapter: 1,
    time_stamp: "00:00",
  },
  books: [
    {
      book_id: "alskdfj83",
      book_name: "someti",
      chapter_url: ["https://kasdlkfjlasjfdlkjk"],
      book_stream_info: {
        chapter_playing: 1,
        time_stamp: "00:00",
      },
    },
  ],
};

const create_button = document.querySelector(".create_audiobook");
const book_input = document.querySelector(".book_input");
const submit_button = document.querySelector(".submit");
const book_name = document.querySelector(".book_name");
const book_url = document.querySelector(".book_url");
const file_num = document.querySelector(".file_num");

function playAudioWithUrl(el) {
  const player = document.createElement("div");
  player.id = "player";

  document.body.prepend(player);
  const audioUrl = el.chapter_url[0];

  // Create container for the audio player
  const container = document.createElement("div");
  container.className =
    "bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto flex flex-col items-center space-y-4";

  // Create the audio element
  const audioElement = document.createElement("audio");
  audioElement.src = audioUrl;
  audioElement.className = "hidden"; // Hide the native audio controls

  // Create the play/pause button
  const playPauseBtn = document.createElement("button");
  playPauseBtn.className =
    "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none";
  playPauseBtn.textContent = "Play";

  // Create audiobook info
  const infoAudiobook = document.createElement("p");
  infoAudiobook.className = "text-md ta-center";
  infoAudiobook.textContent = `${el.book_name} Chapter:1`;

  // Create a progress bar
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className =
    "w-full bg-gray-300 rounded-full h-2.5 overflow-hidden";

  const progressBar = document.createElement("div");
  progressBar.className = "bg-blue-500 h-full rounded-full";
  progressBar.style.width = "0%";
  progressBarContainer.appendChild(progressBar);

  // Create the current time and duration labels
  const timeContainer = document.createElement("div");
  timeContainer.className = "flex justify-between w-full text-gray-600 text-sm";

  const currentTime = document.createElement("span");
  currentTime.textContent = "0:00";
  const duration = document.createElement("span");
  duration.textContent = "0:00";

  timeContainer.appendChild(currentTime);
  timeContainer.appendChild(duration);

  // Create speed control dropdown
  const speedControlContainer = document.createElement("div");
  speedControlContainer.className = "flex items-center space-x-2";

  const speedLabel = document.createElement("label");
  speedLabel.textContent = "Speed:";
  speedLabel.className = "text-gray-600 text-sm";

  const speedSelect = document.createElement("select");
  speedSelect.className =
    "bg-gray-100 border border-gray-300 rounded-lg p-2 text-sm";
  speedSelect.innerHTML = `
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="1.75">1.75x</option>
                <option value="2">2x</option>
            `;

  speedControlContainer.appendChild(speedLabel);
  speedControlContainer.appendChild(speedSelect);

  // Append elements to the container
  container.appendChild(audioElement);
  container.appendChild(playPauseBtn);
  container.appendChild(infoAudiobook);
  container.appendChild(progressBarContainer);
  container.appendChild(timeContainer);
  container.appendChild(speedControlContainer);
  player.appendChild(container);

  // Add event listeners for play/pause functionality
  playPauseBtn.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement.play();
      playPauseBtn.textContent = "Pause";
      playPauseBtn.classList.remove("bg-green-500");
      playPauseBtn.classList.add("bg-red-500");
    } else {
      audioElement.pause();
      playPauseBtn.textContent = "Play";
      playPauseBtn.classList.remove("bg-red-500");
      playPauseBtn.classList.add("bg-green-500");
    }
  });

  // Update progress bar and time
  audioElement.addEventListener("timeupdate", () => {
    const current = audioElement.currentTime;
    const durationTime = audioElement.duration;

    if (!isNaN(durationTime)) {
      progressBar.style.width = `${(current / durationTime) * 100}%`;
      currentTime.textContent = formatTime(current);
      duration.textContent = formatTime(durationTime);
    }
  });

  // Helper function to format time in MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Seek functionality
  progressBarContainer.addEventListener("click", (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = clickPosition / rect.width;
    audioElement.currentTime = clickPercentage * audioElement.duration;
  });

  // Handle speed change
  speedSelect.addEventListener("change", () => {
    const selectedSpeed = parseFloat(speedSelect.value);
    audioElement.playbackRate = selectedSpeed;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("entire_book_data");

  if (!raw) return;
  const book_json = JSON.parse(raw);

  book_json.books.map((el) => {
    // Create a card container
    const element = document.createElement("div");

    element.className =
      "mb-2 bg-white border-[1px]  p-6 transform transition-transform max-w-md mx-auto";

    // Create a heading for the book name`
    const heading = document.createElement("h1");
    heading.textContent = el.book_name;
    heading.className = "text-xl font-bold text-gray-800 mb-4";

    // Create a paragraph for the chapter count
    const para = document.createElement("p");
    para.textContent = `Chapter count: ${el.chapter_url.length}`;
    para.className = "text-gray-600";

    // Append the heading and paragraph to the card
    element.appendChild(heading);
    element.appendChild(para);

    // Append the card to the body (or another container if needed)
    document.body.appendChild(element);

    // Adding event listener to the book el
    element.addEventListener("click", () => {
      const player = document.querySelector("#player");
      player?.remove();
      playAudioWithUrl(el);
    });
  });
});

create_button.addEventListener("click", () => {
  if (!app_state.isButtonEnabled) {
    app_state.isButtonEnabled = !app_state.isButtonEnabled;
    book_input.style.display = "flex";
  } else {
    app_state.isButtonEnabled = !app_state.isButtonEnabled;
    book_input.style.display = "none";
    book_url.value = "";
    book_name.value = "";
    file_num.value = 1;
  }
});

submit_button.addEventListener("click", () => {
  if (!book_name.value || !book_url.value || !file_num.value) return;

  const the_localstorage = localStorage.getItem("entire_book_data");

  const urls = [];
  const [basePart, extension] = book_url.value
    .match(/(.*?)(\d+\.mp3)$/)
    .slice(1);
  for (let i = 1; i <= file_num.value; i++) {
    const paddedNumber = String(i).padStart(2, "0");
    const newUrl = `${basePart}${paddedNumber}.mp3`;
    urls.push(newUrl);
  }

  if (!the_localstorage) {
    const data = {
      books: [
        {
          book_id: crypto.randomUUID(),
          book_name: book_name.value,
          chapter_url: urls,
        },
      ],
    };
    const data_string = JSON.stringify(data);
    localStorage.setItem("entire_book_data", data_string);
  }

  if (the_localstorage) {
    const retrived_json = JSON.parse(the_localstorage);
    const updated_json = {
      ...retrived_json,
      books: [
        {
          book_id: crypto.randomUUID(),
          book_name: book_name.value,
          chapter_url: urls,
        },
        ...retrived_json.books,
      ],
    };

    const shoot_string = JSON.stringify(updated_json);
    localStorage.setItem("entire_book_data", shoot_string);
  }
  book_input.style.display = "none";
});

/*
    1. Add books to localstorage
    2. Retrive them from storage on Load
    3. onClick to play, change current state, save state every second 
*/
