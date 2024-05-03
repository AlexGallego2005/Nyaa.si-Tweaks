//chrome.storage.local.clear();
/** Setting up the downloads data.? */
chrome.storage.local.get(['downloads'],
    /**
     * @param {Object} userData - Retrieved user data.
     * @param {Object} userData.downloads - User downloads on nyaa.
     */
    function (userData) {
        if (userData?.downloads == undefined) userData.downloads = {};
        else if (userData.downloads?.downloadIds) userData.downloads = {};
        
        console.log(userData);
        chrome.storage.local.set({ 'downloads': userData.downloads });
    }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** @type {Array} - Latest download information. To check later for finished download. */
var latestDownload = {};

/** huh */
/*chrome.downloads.onCreated.addListener( function(downloadItem) {
    //console.log(downloadItem);
    if (downloadItem.finalUrl.split(/\/(?=[^\/]+$)/)[0].includes('https://nyaa.si/')) {
        ids[downloadItem.id] = { torrentId: downloadItem.finalUrl.split(/\/(?=[^\/]+$)/)[1].split('.')[0] }
        //console.log(ids)
    }
})*/

/** Detects when a new download is triggered, when it asks where you want to download it. */
chrome.downloads.onDeterminingFilename.addListener(
    /**
     * @param {Object} item - The download item.
     * @param {string} item.id - The download's id.
     * @param {string} item.filename - The download final filename.
     * @param {string} item.finalUrl - The URL the file was downloaded from.
     * @param {string} item.referrer - The URL you were at when you clicked on the link to download.
     * @param {Date} item.startTime - When the download started.
     * @param {*} suggest 
     */
    function (item, suggest) {
        if (!item.referrer.startsWith('https://nyaa.si/')) return;
        else if (Object.keys(latestDownload).length > 0) latestDownload = {};

        latestDownload[item.id] = {
            filename: item.filename.replace('.torrent', ''),
            torrent: item.finalUrl,
            href: item.referrer.includes('view') ? item.referrer : 'https://nyaa.si/view/' + item.finalUrl.split('download/')[1].split('.')[0],
            start: item.startTime
        };
    }
);

chrome.downloads.onChanged.addListener( function(downloadItem) {
    if (!downloadItem.state) return
    if (downloadItem.state.current == 'complete') {
        if (Object.keys(latestDownload)?.length < 1 && Object.keys(latestDownload)[0] != downloadItem.id) return;
        
        var key = Object.keys(latestDownload)[0];
        var json = latestDownload[key];
        
        chrome.storage.local.get(['downloads'],
            /**
             * @param {Object} userData - Retrieved user data.
             * @param {Object} userData.downloads - User downloads on nyaa.
             */
            function (userData) {
                if (key == undefined || json?.filename == undefined) return;
                userData.downloads[key] = json;
                if (Object.keys(userData.downloads).length) chrome.storage.local.set({ 'downloads': userData.downloads });
            }
        );
        //console.log(downloadItem)


        //console.log(chrome.downloads.download);
        /*
        var currentDownloadId = undefined;
        for (var i = 0; i < Object.keys(ids).length; i++) {
            if (downloadItem.id == Object.keys(ids)[i]) currentDownloadId = ids[Object.keys(ids)[i]]
        }

        //console.log(currentDownloadId)
        chrome.storage.local.get(['downloads'], function (items) {
            items['downloads'].downloadIds[downloadItem.id] = currentDownloadId.torrentId;
            chrome.storage.local.set({ 'downloads': items['downloads'] });
        })*/
    };
});