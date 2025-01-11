// Storage 

/**
 * @param { string } key - Key name inside the storage API to save the data.
 * @param { {} | [] } data - Object or array of data to be saved.
 */
async function save(key, data) {
    try {
        chrome.storage.local.set({ [key]: data });
        return 1;
    } catch (error) {
        throw new Error(error);
    };
};

/**
 * @param { string } key - Key name inside the storage API to load the data.
 */
async function load(key) {
    try {
        const data = await chrome.storage.local.get([key]);
        return data[key];
    } catch (error) {
        throw new Error(error);
    };
};

/**
 * Should only be used for debugging ? or if the user wants to delete all data.
 */
async function clear() {
    chrome.storage.local.clear();
};

// Downloads

/** @type {Array} - Latest download information. To check later for finished download. */
var latestDownload = {};

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
        console.log(item)

        latestDownload[item.id] = {
            filename: item?.filename?.replace('.torrent', ''),
            torrent: item?.finalUrl,
            href: item?.referrer?.includes('view') ? item.referrer : 'https://nyaa.si/view/' + item?.finalUrl?.split('download/')?.[1]?.split('.')?.[0],
            start: item?.startTime
        };
    }
);

chrome.downloads.onChanged.addListener( async function(downloadItem) {
    if (!downloadItem.state) return
    if (downloadItem.state.current == 'complete') {
        if (Object.keys(latestDownload)?.length < 1 || Object.keys(latestDownload)[0] != downloadItem.id) return;
        
        const key = Object.keys(latestDownload)[0];
        const json = latestDownload[key];
        
        await load('downloads').then( async (downloads) => {
            if (!key || !json?.filename) return;
            downloads[key] = json;
            if (Object.keys(downloads).length) await save('downloads', downloads);
        });
    };
});