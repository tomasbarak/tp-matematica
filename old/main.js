
const max_plays = 2;
const no_button = document.querySelector("#no");
const yes_button = document.querySelector("#yes");
const start_button = document.querySelector("#start-btn");
//All the genres
const genres = {
    "rock": max_plays,
    "pop": max_plays,
    "clásica": max_plays,
    "techno": max_plays,
    "reggaetón": max_plays,
    "hip hop": max_plays,
    "cumbia": max_plays,
    "funk de brasil": max_plays,
}
let controller;

const select_genre = () => {
    const random_genre = Math.floor(Math.random() * Object.keys(genres).length);

    let random_genre_value = genres[Object.keys(genres)[random_genre]]

    //Sum all the genres values
    let sum = 0;
    for (let i = 0; i < Object.keys(genres).length; i++) {
        sum += genres[Object.keys(genres)[i]];
    }

    if(sum > 0) {
        if ( random_genre_value <= 0 ) {
            return select_genre();
        } else {
            genres[Object.keys(genres)[random_genre]] -= 1;
            document.title = Object.keys(genres)[random_genre];
            return Object.keys(genres)[random_genre];
        }
    } else {
        return -1;
    }
}

const callback = (EmbedController) => {
    controller = EmbedController;
    clock.reset();
    clock.stop();

    EmbedController.addListener('ready', () => {
        clock.start();
        EmbedController.play();
    });

    EmbedController.addListener('playback_update', (state) => {
        const data = state.data;

        if (data.isPaused) {
            clock.stop();
        }
    });

    document.querySelectorAll('.episode').forEach(
        episode => {
            episode.addEventListener('click', () => {
                EmbedController.loadUri(episode.dataset.spotifyId);
            });
        })
};

const set_new_song = (genre, offset, market) => {
    fetch(`http://localhost:8080/genreList`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "genre": genre,
            "market": market,
            "limit": 50,
        }),
    }).then(
        response => response.json()
    ).then(
        data => {
            const track = data[offset - 1];

            let img = document.createElement('img');
            img.setAttribute('src', track.album.images[0].url);
            img.crossOrigin = "Anonymous";

            img.addEventListener('load', function () {
                var vibrant = new Vibrant(img);
                var swatches = vibrant.swatches()
                //change css variable
                let root = document.querySelector(':root');
                root.style.setProperty('--vibrant', swatches['Vibrant'].getHex());
                root.style.setProperty('--dark-vibrant', swatches['DarkVibrant'].getHex());

                for (var swatch in swatches)
                if (swatches.hasOwnProperty(swatch) && swatches[swatch])
                        console.log(swatch, swatches[swatch].getHex())
            });

            if (controller != null) {
                // console.log("Loading new song");
                controller.loadUri(track.uri);
            } else {
                // console.log(controller)
            }
        }
    );
}

//Both buttons skip to next song

no_button.addEventListener("click", () => {
    // console.log("Opinion Erronea");
    const random_offset = Math.floor(Math.random() * 10);
    const genre = select_genre();
    if (genre != -1) {
        set_new_song(genre, random_offset, "AR");
    } else {
        console.log("No hay mas canciones");
    }
});

yes_button.addEventListener("click", () => {
    // console.log("Opinion Valida");
    const random_offset = Math.floor(Math.random() * 10);
    if (select_genre() != -1) {
        set_new_song(select_genre(), random_offset, "AR");
    } else {
        console.log("No hay mas canciones");
    }
});

window.onSpotifyIframeApiReady = (IFrameAPI) => {
    // console.log(IFrameAPI)
    IFrameAPI.createController(document.querySelector("#embed-iframe"), { uri: "" }, callback);

    // console.log("c", controller)
    const random_offset = Math.floor(Math.random() * 10);
    set_new_song(select_genre(), random_offset, "AR");
}