const audio = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");
const muteBtn = document.getElementById("muteBtn");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

const favoriteBtn = document.getElementById("favoriteBtn");
const totalSongs = document.getElementById("totalSongs");
const favoriteCount = document.getElementById("favoriteCount");

const sideSong = document.getElementById("sideSong");
const playerArt = document.getElementById("playerArt");

const startBtn = document.getElementById("startBtn");
const fileInput = document.getElementById("fileInput");


// ========================================
// BUILT-IN SONGS
// ========================================

let songs = [

    {
        id: 1,
        title: "Midnight Drive",
        artist: "VibeFlow",
        file: "./music/midnight-drive.wav",
        emoji: "🌙",
        favorite: false,
        custom: false
    },

    {
        id: 2,
        title: "Neon Dreams",
        artist: "VibeFlow",
        file: "./music/neon-dreams.wav",
        emoji: "🌆",
        favorite: false,
        custom: false
    },

    {
        id: 3,
        title: "Summer Vibes",
        artist: "VibeFlow",
        file: "./music/summer-vibes.wav",
        emoji: "☀️",
        favorite: false,
        custom: false
    }

];


let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let listeningSeconds = 0;


// ========================================
// LOAD SONG
// ========================================

function loadSong(index) {

    if (songs.length === 0) {
        return;
    }

    currentIndex = index;

    const song = songs[currentIndex];

    audio.src = song.file;

    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;

    sideSong.textContent = song.title;

    playerArt.textContent = song.emoji;

    favoriteBtn.textContent =
        song.favorite ? "♥" : "♡";

    favoriteBtn.classList.toggle(
        "liked",
        song.favorite
    );

    progressBar.value = 0;

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderSongs(searchInput.value);
}


// ========================================
// PLAY SONG
// ========================================

function playSong() {

    if (songs.length === 0) {
        return;
    }

    audio.play()
        .then(() => {

            isPlaying = true;

            playBtn.textContent = "❚❚";

            document
                .querySelector(".disc")
                .classList.add("playing");

        })
        .catch((error) => {

            console.error("Audio error:", error);

            alert(
                "Unable to play the song.\n\n" +
                "Please check that the audio file is inside the music folder."
            );

        });
}


// ========================================
// PAUSE SONG
// ========================================

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playBtn.textContent = "▶";

    document
        .querySelector(".disc")
        .classList.remove("playing");
}


// ========================================
// PLAY / PAUSE
// ========================================

playBtn.addEventListener("click", () => {

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }

});


// ========================================
// START LISTENING
// ========================================

startBtn.addEventListener("click", () => {

    loadSong(currentIndex);

    playSong();

});


// ========================================
// NEXT SONG
// ========================================

function nextSong() {

    if (songs.length === 0) {
        return;
    }

    if (isShuffle && songs.length > 1) {

        let newIndex;

        do {

            newIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (newIndex === currentIndex);

        currentIndex = newIndex;

    } else {

        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }

    }

    loadSong(currentIndex);

    playSong();
}


nextBtn.addEventListener(
    "click",
    nextSong
);


// ========================================
// PREVIOUS SONG
// ========================================

prevBtn.addEventListener("click", () => {

    if (songs.length === 0) {
        return;
    }

    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;
    }

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            songs.length - 1;

    }

    loadSong(currentIndex);

    playSong();

});


// ========================================
// SONG ENDED
// ========================================

audio.addEventListener("ended", () => {

    if (isRepeat) {

        audio.currentTime = 0;

        playSong();

    } else {

        nextSong();

    }

});


// ========================================
// SHUFFLE
// ========================================

shuffleBtn.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffleBtn.style.color =
        isShuffle ? "#a78bfa" : "";

});


// ========================================
// REPEAT
// ========================================

repeatBtn.addEventListener("click", () => {

    isRepeat = !isRepeat;

    repeatBtn.style.color =
        isRepeat ? "#a78bfa" : "";

});


// ========================================
// AUDIO LOADED
// ========================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (!isNaN(audio.duration)) {

            progressBar.max =
                audio.duration;

            duration.textContent =
                formatTime(audio.duration);

        }

    }
);


// ========================================
// UPDATE PROGRESS
// ========================================

audio.addEventListener(
    "timeupdate",
    () => {

        if (!isNaN(audio.duration)) {

            progressBar.value =
                audio.currentTime;

            currentTime.textContent =
                formatTime(audio.currentTime);

        }

    }
);


// ========================================
// SEEK
// ========================================

progressBar.addEventListener(
    "input",
    () => {

        audio.currentTime =
            progressBar.value;

    }
);


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsPart =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${secondsPart}`;
}


// ========================================
// VOLUME
// ========================================

audio.volume = 0.8;

volumeBar.addEventListener(
    "input",
    () => {

        audio.volume =
            volumeBar.value;

        if (audio.volume === 0) {

            muteBtn.textContent = "🔇";

        } else {

            muteBtn.textContent = "🔊";

        }

    }
);


// ========================================
// MUTE
// ========================================

muteBtn.addEventListener(
    "click",
    () => {

        audio.muted =
            !audio.muted;

        muteBtn.textContent =
            audio.muted
                ? "🔇"
                : "🔊";

    }
);


// ========================================
// FAVORITE CURRENT SONG
// ========================================

favoriteBtn.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {
            return;
        }

        songs[currentIndex].favorite =
            !songs[currentIndex].favorite;

        favoriteBtn.textContent =
            songs[currentIndex].favorite
                ? "♥"
                : "♡";

        favoriteBtn.classList.toggle(
            "liked",
            songs[currentIndex].favorite
        );

        updateStats();

        renderSongs(searchInput.value);

    }
);


// ========================================
// RENDER SONG LIST
// ========================================

function renderSongs(filter = "") {

    songList.innerHTML = "";

    const filteredSongs =
        songs.filter(song => {

            const title =
                song.title.toLowerCase();

            const artist =
                song.artist.toLowerCase();

            const search =
                filter.toLowerCase();

            return (
                title.includes(search) ||
                artist.includes(search)
            );

        });


    const noResults =
        document.getElementById("noResults");


    if (filteredSongs.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    filteredSongs.forEach(song => {

        const realIndex =
            songs.findIndex(
                item =>
                    item.id === song.id
            );


        const songElement =
            document.createElement("div");


        songElement.className =
            "song";


        if (realIndex === currentIndex) {

            songElement.classList.add(
                "active"
            );

        }


        songElement.innerHTML = `

            <div class="song-cover">
                ${song.emoji}
            </div>

            <div>
                <div class="song-title">
                    ${song.title}
                </div>

                <div class="song-artist">
                    ${song.artist}
                </div>
            </div>

            <div class="song-duration">
                ♫
            </div>

            <div class="song-actions">

                <button
                    class="list-heart ${
                        song.favorite
                            ? "liked"
                            : ""
                    }"
                >
                    ${
                        song.favorite
                            ? "♥"
                            : "♡"
                    }
                </button>

                ${
                    song.custom
                        ? `
                        <button
                            class="delete-btn"
                        >
                            🗑
                        </button>
                        `
                        : ""
                }

                <button class="list-play">
                    ▶
                </button>

            </div>
        `;


        // PLAY BUTTON

        songElement
            .querySelector(".list-play")
            .addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    loadSong(realIndex);

                    playSong();

                }
            );


        // FAVORITE BUTTON

        songElement
            .querySelector(".list-heart")
            .addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    songs[realIndex].favorite =
                        !songs[realIndex].favorite;

                    updateStats();

                    renderSongs(
                        searchInput.value
                    );

                    if (
                        realIndex ===
                        currentIndex
                    ) {

                        favoriteBtn.textContent =
                            songs[realIndex].favorite
                                ? "♥"
                                : "♡";

                    }

                }
            );


        // DELETE BUTTON

        const deleteButton =
            songElement.querySelector(
                ".delete-btn"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    deleteSong(realIndex);

                }
            );

        }


        // CLICK SONG

        songElement.addEventListener(
            "click",
            () => {

                loadSong(realIndex);

                playSong();

            }
        );


        songList.appendChild(
            songElement
        );

    });

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    () => {

        renderSongs(
            searchInput.value
        );

    }
);


// ========================================
// ADD YOUR OWN SONG
// ========================================

fileInput.addEventListener(
    "change",
    (event) => {

        const files =
            Array.from(
                event.target.files
            );


        files.forEach(file => {

            if (
                !file.type.startsWith("audio/")
            ) {
                return;
            }


            const newSong = {

                id:
                    Date.now() +
                    Math.random(),

                title:
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ),

                artist:
                    "My Music",

                file:
                    URL.createObjectURL(file),

                emoji:
                    "🎵",

                favorite:
                    false,

                custom:
                    true

            };


            songs.push(newSong);

        });


        updateStats();

        renderSongs(
            searchInput.value
        );

        fileInput.value = "";

    }
);


// ========================================
// DELETE CUSTOM SONG
// ========================================

function deleteSong(index) {

    if (!songs[index].custom) {

        alert(
            "Built-in songs cannot be deleted."
        );

        return;

    }


    if (index === currentIndex) {

        pauseSong();

        audio.src = "";

    }


    songs.splice(index, 1);


    if (songs.length === 0) {

        currentTitle.textContent =
            "Choose a song";

        currentArtist.textContent =
            "VibeFlow";

        sideSong.textContent =
            "Nothing playing";

        return;

    }


    if (currentIndex >= songs.length) {

        currentIndex =
            songs.length - 1;

    }


    loadSong(currentIndex);

    updateStats();

    renderSongs(
        searchInput.value
    );

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats() {

    totalSongs.textContent =
        songs.length;


    const favorites =
        songs.filter(
            song => song.favorite
        ).length;


    favoriteCount.textContent =
        favorites;

}


// ========================================
// LISTENING TIME
// ========================================

setInterval(() => {

    if (isPlaying) {

        listeningSeconds++;

        document.getElementById(
            "listeningTime"
        ).textContent =
            formatTime(listeningSeconds);

    }

}, 1000);


// ========================================
// INITIALIZE PLAYER
// ========================================

loadSong(0);

updateStats();

renderSongs();