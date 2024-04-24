/** Function to load when page finishes loading. */
async function onLoad()
{
    /** @type {{ filters: { global: [], local: { template?: [] } }, preferences: { autohide: boolean, custom_background: boolean, custom_background_link: string, global_filters: boolean, highlight_uploaders: boolean, per_uploader_filters: boolean }, uploaders: { favorites: [] } }} */
    const userData = await chrome.storage.sync.get(['preferences', 'uploaders', 'filters']);

    /** @type {HTMLElement} - HTML element that contains the information about the uploader. */
    const uploader = document.querySelector('[class="row"] [title="Trusted"]') ?? document.querySelector('[class="row"] [title="User"]'); if (!uploader) return; // Returns if there's not user (anonymous).

    if (userData.uploaders?.favorites?.includes(uploader.textContent))
    {
        document.styleSheets[0].insertRule(".uploader { float: left; border-radius: 50px; background-color: transparent; margin-right: 3px; height: 20px; width: 20px; background: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
        document.styleSheets[0].insertRule(".uploader:hover { cursor: pointer; background: url(https://i.imgur.com/idTXgAh.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
        uploader.parentElement.insertAdjacentHTML('beforeend', '<div class="uploader" id="favToggle" title="Unfavorite Uploader"></div>');
        document.getElementById('favToggle').addEventListener('click', function() {
            var index = userData.uploaders.favorites.indexOf(uploader.textContent);
            userData.uploaders.favorites.splice(index, 1);
            chrome.storage.sync.set({ 'uploaders': userData.uploaders });
            location.reload();
        });
    }
    else
    {
        document.styleSheets[0].insertRule(".uploader { float: left; border-radius: 50px; background-color: transparent; margin-right: 3px; height: 20px; width: 20px; background: url(https://i.imgur.com/idTXgAh.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
        document.styleSheets[0].insertRule(".uploader:hover { cursor: pointer; background: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 80%; background-position: 50%; background-repeat: no-repeat; }", 0);
        uploader.parentElement.insertAdjacentHTML('beforeend', '<div class="uploader" id="favToggle" title="Favorite Uploader"></div>');
        document.getElementById('favToggle').addEventListener('click', function () {
            userData.uploaders.favorites.push(uploader.textContent);
            chrome.storage.sync.set({ 'uploaders': userData.uploaders });
            location.reload();
        });
    };
};

document.onload = onLoad();