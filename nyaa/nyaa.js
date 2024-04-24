// Are torrents with no seeders hidden?
var hidden = false;
var hiddenTorrentsNum = 0;

// Website elements.
const container = document.querySelector('body > div.container');
const elms = document.querySelectorAll('tbody > tr');
const paging = document.querySelectorAll('.pagination > li');
const navbar = document.querySelector("#navbar > ul");

/** Don't execute stuff if user inside these pages. */
const restricted = ['upload', 'rules', 'info', 'rss', 'view', 'settings', 'downloads'];

/** Function to load when page finishes loading. */
async function onLoad()
{
    /** @type {{ filters: { global: [], local: { template?: [] } }, preferences: { autohide: boolean, custom_background: boolean, custom_background_link: string, global_filters: boolean, highlight_uploaders: boolean, per_uploader_filters: boolean }, uploaders: { favorites: [] } }} */
    const userData = await chrome.storage.sync.get(['preferences', 'uploaders', 'filters']);

    // Debug
    console.log(userData);

    /** Inserts new custom styles. */
    function loadStylesheets()
    {
        // Responsive width (for wider displays overall).
        document.styleSheets[0].insertRule("body > .container { width: 80vw !important; }", 1);
        
        if (restricted.some(l => window.location.href.includes(l))) return;

        // Insert new custom styles for custom classes. //
        document.styleSheets[0].insertRule(".placeholder { height: 37px; width: 37px; }", 0);
        document.styleSheets[0].insertRule(".noSeeds { height: 37px; width: 37px; z-index: 10; margin-left: 34px; background-image: url(https://static.thenounproject.com/png/55393-200.png); background-size: 40%; background-position: 50%; background-repeat: no-repeat; }", 0);
        //document.styleSheets[0].insertRule(".favorite { height: 37px; width: 37px; z-index: 10; margin-left: 7px; background-image: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 50%; background-position: 50%; background-repeat: no-repeat; }", 0);
        document.styleSheets[0].insertRule(".favorite { background-color: #D3D31534 !important; }", 0);
    };

    /** Loads the custom user-set background. */
    function setCustomBackground()
    {
        if (!userData.preferences.custom_background || userData.preferences.custom_background_link.length < 10) return;
        document.styleSheets[0].insertRule(`body { background: linear-gradient(#000000aa, #000000aa), url(${ userData.preferences.custom_background_link }); background-position: auto 50%; }`, 0);
        return;
    };

    /** Create extra links or text nodes in the nav bar. */
    function loadNavigationBar()
    {
        navbar.insertAdjacentHTML('beforeend', `<li><a href="/downloads">Downloads</a></li>`);
        navbar.insertAdjacentHTML('beforeend', `<li><a id="hiddenTorrentsNum" href=""></a></li>`);
        return;
    };

    loadStylesheets();
    setCustomBackground();
    loadNavigationBar();

    if (restricted.some(l => window.location.href.includes(l))) return;
    
    /** Clone the bottom pages-navigation bar above the torrents table. */
    function clonePages()
    {
        container.insertAdjacentElement('afterbegin', document.querySelector('body > div.container > div.center')?.cloneNode(true) ?? document.querySelector('body > div.container > div.row > div.center')?.cloneNode(true));
        return;
    };

    /** Mark torrents with no seeders. */
    function noSeeders()
    {
        for (const torrent of elms)
        {
            /** @type {number} - Number of seeders this torrent has. */
            var seeders = parseInt(torrent.children[5].innerHTML);
            if (seeders) continue;

            torrent.children[5].innerHTML = '';
            torrent.children[5].setAttribute('class', 'noSeeds');
            hiddenTorrentsNum++;
            //torrent.insertAdjacentHTML('beforeend', `<td class="${ seeders > 0 ? 'placeholder' : 'noSeeds' } seeders"></td>`);
        };
        return;
    };

    function highlightUploaders()
    {
        for (const torrent of elms)
        {
            /** @type {string} - Name of this torrent. */
            var name = torrent.getElementsByTagName("td")[1].textContent;
            if (!userData.uploaders.favorites.some(u => name.toLowerCase().includes(u.toLowerCase()))) continue;

            // If filters are enabled, checks if the torrent names contains both the uploader and the filters. //
            if (!userData.preferences.per_uploader_filters && !userData.preferences.global_filters) torrent.setAttribute('class', 'favorite');
            else if (userData.preferences.per_uploader_filters && Object.keys(userData.filters.local).some(u => name.toLowerCase().includes(u.toLowerCase())))
            {
                /** @type {string} - The name of the uploader (filtered and in the torrent name). */
                const uploader = Object.keys(userData.filters.local).find(u => name.toLowerCase().includes(u.toLowerCase()));
                if (userData.filters.local[uploader].every(f => f.startsWith('-') ? !name.toLowerCase().includes(f.toLowerCase().substring(1)) : name.toLowerCase().includes(f.toLowerCase()))) torrent.setAttribute('class', 'favorite');
            }
            else if (userData.preferences.global_filters) if (userData.filters.global.every(f => f.startsWith('-') ? !name.toLowerCase().includes(f.toLowerCase().substring(1)) : name.toLowerCase().includes(f.toLowerCase()))) torrent.setAttribute('class', 'favorite');
        };
        return;
    };

    clonePages();
    noSeeders();
    if (userData.preferences.highlight_uploaders) highlightUploaders();
    if (userData.preferences.autohide) hideTorrents();
}

/** Hide or unhide torrents without seeders. */
function hideTorrents()
{
    if (!hidden) {
        for (const seeds of container.getElementsByClassName('noSeeds')) seeds.parentElement.style.display = 'none';
        try { document.getElementById('hiddenTorrentsNum').textContent = `Hidden: ${ hiddenTorrentsNum }`; } catch (err) { console.log(err) };
    } else {
        for (const seeds of container.getElementsByClassName('noSeeds')) seeds.parentElement.removeAttribute('style');
        try { document.getElementById('hiddenTorrentsNum').textContent = ''; } catch (err) { console.log(err) };
    };
    hidden = !hidden;
    return;
}

function navigate(direction)
{
    /** @type {string} - Redirection URL */
    var redirect;

    if (direction == 'full-forward') redirect = paging[paging.length - 2].getElementsByTagName("a")[0].href;
    else if (direction == 'forward') redirect = paging[paging.length - 1].getElementsByTagName("a")[0].href;
    else if (direction == 'full-backwards') redirect = paging[1].getElementsByTagName("a")[0].href;
    else redirect = paging[0].getElementsByTagName("a")[0].href;

    window.location.href = redirect;
};

document.onload = onLoad();
document.onkeydown = function (e)
{
    if (document.activeElement.tagName === 'INPUT') return;
    e = e || window.Event;
    
    if (e.key.toLowerCase() == 'h') hideTorrents();
    else if (e.key.toLowerCase() == 'arrowright' && e.ctrlKey) navigate('full-forward');
    else if (e.key.toLowerCase() == 'arrowleft' && e.ctrlKey) navigate('full-backwards');
    else if ((e.key.toLowerCase() == 'n' || e.key.toLowerCase() == 'arrowright')) navigate('forward');
    else if ((e.key.toLowerCase() == 'b' || e.key.toLowerCase() == 'arrowleft')) navigate('backwards');
};

//console.log(`Settings retrieved:\n\nHide automatically: ${items['preferences'].autohide}\nHighlight favorites: ${items['preferences'].highlight_uploaders}\nGlobal filters: ${items['preferences'].global_filters}\nCustom background: ${items['preferences'].custom_background}\n\nFavorite uploaders: ${items['uploaders'].favorites}\nFilters: ${items['prefFilters']}\nBackground link: ${items['preferences'].custom_background_link}\n\n`);