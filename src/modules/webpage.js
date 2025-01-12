async function createFavsLink()
{
    const preferences = await load('preferences');
    const data = await load('data');
    
    /** @type { string } - Search query. */
    var query = 'https://nyaa.si/?f=0&c=0_0&q=';

    if (preferences?.globalFilters)
    {
        const filters = data?.filters?.global?.join(' ');
        const uploaders = new Array();

        for (const uploader of data.uploaders.favorites)
        {
            if (preferences?.perUploaderFilters && Object.keys(data.filters.uploader).includes(uploader)) continue;
            uploaders.push(uploader);
        };

        query += `(${ filters } ${ uploaders?.length > 0 ? `(${ uploaders.join('|') }))` : ')' }`;
    };

    if (preferences?.perUploaderFilters)
        for (const [uploader, filters] of Object.entries(data?.filters?.uploader))
            console.log(filters),
            query += '|(' + filters.join(' ') + ' (' + uploader + '))';
    
    return query;
};

async function navbar()
{
    webElement.navbar.insertAdjacentHTML('beforeend', `<li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
            Tweaks
            <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
            <li><a href="/downloads">Downloads</a></li>
            <li><a href="${ await createFavsLink() }">Favorites</a></li>
        </ul>
    </li>`);
    
    webElement.navbar.insertAdjacentHTML('beforeend', `<li><a id="hiddenTorrentsNum" href=""></a></li>`);
};

async function background()
{
    if ((await load('preferences'))?.customBackground)
        document.body.style.background = `linear-gradient(#000000a4, #000000a4), url('${ (await load('preferences')).customBackgroundUrl }')`;
};

function stylesheets()
{
    fetch(chrome.runtime.getURL('src/assets/css/style.css')).then(async (response) => {
        const css = await response.text();
        document.styleSheets[0].insertRule(css, 0);
    });

    if (window.location.href.includes('/view/'))
        fetch(chrome.runtime.getURL('src/assets/css/view.css')).then(async (response) => {
            const css = await response.text();
            document.styleSheets[0].insertRule(css, 0);
        });
};

function pagination()
{
    webElement.container.insertAdjacentHTML('afterbegin', `
        <div class="center">
            ${ document.querySelector('body > div.container > div.center')?.outerHTML ?? document.querySelector('body > div.container > div.row > div.center > .pagination')?.outerHTML }
        </div>`);
};

async function torrents()
{
    const data = await load('data');
    const preferences = await load('preferences');
    
    for (const row of webElement.torrents)
    {
        /** @type { string } - Name of this torrent. */
        var name = row.children[1].textContent;
        /** @type { number } - Number of seeders this torrent has. */
        var seeders = parseInt(row?.children[5]?.innerHTML);

        if (!seeders)
        {
            row.children[5].innerHTML = '';
            row.children[5].classList.add('noSeeds');
            hiddenTorrents++;
        };

        if (data?.uploaders?.favorites?.some(u => name?.toLowerCase()?.includes(u?.toLowerCase())))
        {
            if (preferences?.highlightUploaders)
                if (preferences?.globalFilters)
                    if (data?.filters?.global?.some(f => name?.toLowerCase()?.includes(f?.toLowerCase()))) row.children[1].classList.add('favorite');
        };
    };

    if (preferences.autohide) hideTorrents();
};

/** Hide or unhide torrents without seeders. */
function hideTorrents() {
    if (!hidden) {
        for (const seeds of webElement.container.getElementsByClassName('noSeeds')) seeds.parentElement.style.display = 'none';
        try { document.getElementById('hiddenTorrentsNum').textContent = `Hidden: ${ hiddenTorrents }`; } catch (err) { console.log(err) };
    } else {
        for (const seeds of webElement.container.getElementsByClassName('noSeeds')) seeds.parentElement.removeAttribute('style');
        try { document.getElementById('hiddenTorrentsNum').textContent = ''; } catch (err) { console.log(err) };
    };
    hidden = !hidden;
    return;
}