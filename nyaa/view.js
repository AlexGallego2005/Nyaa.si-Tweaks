function onLoad() {
    chrome.storage.sync.get(['preferences', 'uploaders', 'filters'], function (items) {
        console.log(`Settings retrieved:\n\nHide automatically: ${items['preferences'].autohide}\nHighlight favorites: ${items['preferences'].highlight_uploaders}\nGlobal filters: ${items['preferences'].global_filters}\nCustom background: ${items['preferences'].custom_background}\n\nFavorite uploaders: ${items['uploaders'].favorites}\nFilters: ${items['prefFilters']}\nBackground link: ${items['preferences'].custom_background_link}\n\n`);

        var uploader = document.querySelector('[class="row"] [title="Trusted"]'),
            uploaderToggle = document.createElement("div");
        if (!uploader) uploader = document.querySelector('[class="row"] [title="User"]');

        if (uploader) {
            if (items["uploaders"].favorites.length > 0 && items["uploaders"].favorites.includes(uploader.textContent)) {
                document.styleSheets[0].insertRule(".uploader { float: left; border-radius: 50px; background-color: transparent; margin-right: 3px; height: 20px; width: 20px; background: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
                document.styleSheets[0].insertRule(".uploader:hover { cursor: pointer; background: url(https://i.imgur.com/idTXgAh.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
                uploaderToggle.setAttribute("class", "uploader");
                uploaderToggle.setAttribute("title", "Unfavorite Uploader");
                uploader.parentNode.insertBefore(uploaderToggle, uploader.nextSibling)
                uploaderToggle.addEventListener("click", function () {
                    for (var i = 0; i < items["uploaders"].favorites.length; i++) {
                        if (items["uploaders"].favorites == uploader.textContent) {
                            items["uploaders"].favorites.splice(i, 1);
                            i--;
                        }
                    }
                    chrome.storage.sync.set({ "uploaders": items["uploaders"] })
                    location.reload()
                })
            } else {
                document.styleSheets[0].insertRule(".uploader { float: left; border-radius: 50px; background-color: transparent; margin-right: 3px; height: 20px; width: 20px; background: url(https://i.imgur.com/idTXgAh.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
                document.styleSheets[0].insertRule(".uploader:hover { cursor: pointer; background: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
                uploaderToggle.setAttribute("class", "uploader");
                uploaderToggle.setAttribute("title", "Favorite Uploader");
                uploader.parentNode.insertBefore(uploaderToggle, uploader.nextSibling)
                uploaderToggle.addEventListener("click", function () {
                    items["uploaders"].favorites.push(uploader.textContent)
                    chrome.storage.sync.set({ "uploaders": items["uploaders"] })
                    location.reload()
                })
            }
        }
    });
}

document.onload = onLoad()

window.onresize = function () {
    var torrents_container = document.querySelector('body > .container');
    if (window.screen.innerWidth > 2080) torrents_container.setAttribute('style', 'width: 2000px;');
    else torrents_container.removeAttribute('style');
}