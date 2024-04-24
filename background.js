chrome.storage.local.get(['downloads'], function (items) {
    if (items['downloads'] == undefined) items['downloads'] = {};
    if (items['downloads'].downloadIds == undefined) items['downloads'].downloadIds = {};
    chrome.storage.local.set({ 'downloads': items['downloads'] });
})
var ids = {}

chrome.downloads.onCreated.addListener( function(downloadItem) {
    if (downloadItem.finalUrl.split(/\/(?=[^\/]+$)/)[0].includes('https://nyaa.si/')) {
        ids[downloadItem.id] = { torrentId: downloadItem.finalUrl.split(/\/(?=[^\/]+$)/)[1].split('.')[0] }
        console.log(ids)
    }
})

chrome.downloads.onChanged.addListener( function(downloadItem) {
    if (!downloadItem.state) return
    if (downloadItem.state.current == 'complete') {
        console.log(downloadItem)
        
        var currentDownloadId = undefined;
        for (var i = 0; i < Object.keys(ids).length; i++) {
            if (downloadItem.id == Object.keys(ids)[i]) currentDownloadId = ids[Object.keys(ids)[i]]
        }

        console.log(currentDownloadId)
        chrome.storage.local.get(['downloads'], function (items) {
            items['downloads'].downloadIds[downloadItem.id] = currentDownloadId.torrentId;
            chrome.storage.local.set({ 'downloads': items['downloads'] });
        })
    }
})