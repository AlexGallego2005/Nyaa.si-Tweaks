load('data').then( async (data) => {
    const torrentUploader = document?.querySelector('[class="row"] [title="Trusted"]') ?? document?.querySelector('[class="row"] [title="User"]');
    if (!torrentUploader) return; // If user is anonymous.

    if (data?.uploaders?.favorites?.includes(torrentUploader.textContent))
    {
        torrentUploader.parentElement.insertAdjacentHTML('beforeend', `<div class="uploader fav" id="favToggle" title="Unfavorite Uploader"></div>`);
        document?.getElementById('favToggle')?.addEventListener('click', function() {
            data?.uploaders?.favorites.splice(data?.uploaders?.favorites?.indexOf(torrentUploader.textContent), 1);
            save('data', data);
            location.reload();
        });
    }
    else
    {
        torrentUploader.parentElement.insertAdjacentHTML('beforeend', `<div class="uploader" id="favToggle" title="Favorite Uploader"></div>`);
        document?.getElementById('favToggle')?.addEventListener('click', function () {
            data.uploaders.favorites.push(torrentUploader.textContent);
            save('data', data);
            location.reload();
        });
    };
});