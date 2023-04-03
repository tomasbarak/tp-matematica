const no_button = document.querySelector("#no");
        const yes_button = document.querySelector("#yes");
        const start_button = document.querySelector("#start-btn");
        let controller;

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

                if(data.isPaused) {
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
            fetch(`https://api.spotify.com/v1/search?q=genre:${genre}&type=track&market=${market}&limit=1&offset=${offset}`, {
                method: "GET",
                headers: new Headers({
                    'Authorization': 'Bearer BQARWL9-NhvDMD-9e6mZh42KBGPOtU5FGUlQWg0U8nttcDed_D3Y4nfVajawHh8tsVdsJKZlBB3V1w6m5Ve2NZAwg9-de7-5aaTgP0vEAFkGLVrzxdcR'
                })
            }).then(
                response => response.json()
            ).then(
                data => {
                    const track = data.tracks.items[0];
                    console.log(track.album.images)

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
                        console.log("Loading new song");
                        controller.loadUri(track.uri);
                    } else {
                        console.log(controller)
                    }
                }
            );
        }

        //Both buttons skip to next song

        no_button.addEventListener("click", () => {
            console.log("Opinion Erronea");
            const random_offset = Math.floor(Math.random() * 200);
            set_new_song("Qawwali", random_offset, "IN");
        });

        yes_button.addEventListener("click", () => {
            console.log("Opinion Valida");
            const random_offset = Math.floor(Math.random() * 200);
            set_new_song("Cantonese", random_offset, "CH");
        });

        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            console.log(IFrameAPI)
            IFrameAPI.createController(document.querySelector("#embed-iframe"), { uri: "" }, callback);

            console.log("c", controller)
            set_new_song("Cumbia", 1, "AR");
        }