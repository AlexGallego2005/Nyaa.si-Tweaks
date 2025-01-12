var checkboxes = document.querySelectorAll('input[type=checkbox]'),
    viewmores = document.querySelectorAll('[class="viewMore"]'),
    selected_uploader = undefined;

async function setCustomBackground()
{
    var backgroundUrl = document?.getElementById('set_custom_background_link')?.value ?? '';

    await load('preferences').then(async (preferences) => {
        console.log(preferences);
        preferences.customBackgroundUrl = backgroundUrl;
        await save('preferences', preferences);
    });

    return document.getElementById('set_custom_background_link').value = '';
};

/**
 * @param { ('add'|'remove'|'clear') } action - Action to execute.
 * @param { ('favorites') } type - Type of uploaders.
 * @returns 
 */
async function uploaders(action, type) {
    const uploaders = (document?.getElementById('custom_uploader_input')?.value)?.split(';');

    await load('data').then(async (data) => {
        if (!data.uploaders[type]) return;

        switch (action)
        {
            case 'add':
                    for (const uploader of uploaders)
                    {
                        if (uploader?.length > 0 && !data?.uploaders?.[type]?.includes(uploader))
                            data.uploaders[type].push(uploader);
                    };
                break;

            case 'remove':
                    for (const uploader of uploaders)
                    {
                        if (uploader?.length > 0 && data?.uploaders?.[type]?.includes(uploader))
                            data.uploaders[type].splice(data.uploaders[type]?.indexOf(uploader), 1);
                    };
                break;

            case 'clear':
                    var clearButton = document?.getElementById('clear_all_uploaders_button');

                    if (clearButton.innerHTML == 'Confirm')
                    {
                        data.uploaders[type] = new Array();
                        clearButton.innerHTML = 'Cleared!';
                        setTimeout(() => { clearButton.innerHTML ='Uploaders'; }, 3000);
                    }
                    else clearButton.innerHTML = 'Confirm';
                break;

            default: break;
        };

        await save('data', data);
    });

    return document.getElementById('custom_uploader_input').value = '';
};

/**
 * @param { ('add'|'remove'|'clear') } action - Action to execute.
 * @returns 
 */
async function globalFilters(action) {
    const filters = (document?.getElementById('custom_global_filter_input')?.value)?.split(';');

    await load('data').then(async (data) => {
        switch (action) {
            case 'add':
                    for (const filter of filters)
                    {
                        if (filter?.length > 0 && !data?.filters?.global?.includes(filter))
                            data.filters.global.push(filter);
                    };
                break;
        
            case 'remove':
                    for (const filter of filters)
                    {
                        if (filter?.length > 0 && data?.filters?.global?.includes(filter))
                            data.filters.global.splice(data?.filters?.global?.indexOf(filter), 1);
                    };
                break;
            
            case 'clear':
                    var clearButton = document?.getElementById('clear_all_filters_button');

                    if (clearButton.innerHTML == 'Confirm')
                    {
                        data.filters.global = new Array();
                        data.filters.uploader = {};
                        clearButton.innerHTML = 'Cleared!';
                        setTimeout(() => { clearButton.innerHTML ='Filters'; }, 3000);
                    }
                    else clearButton.innerHTML = 'Confirm';
                break;

            default:
                break;
        };

        await save('data', data);
    });

    return document.getElementById('custom_global_filter_input').value = '';
};

/**
 * @param { ('add'|'remove'|'clear') } action - Action to execute.
 * @param { string } uploader - Selected uploader to apply the filters for.
 * @returns 
 */
async function perUploaderFilters(action, uploader) {
    const filters = (document?.getElementById('custom_uploader_filter_input')?.value)?.split(';');
    console.log(filters)

    await load('data').then( async (data) => {
        switch (action)
        {
            case 'add':
                    if (data?.filters?.uploader?.[selected_uploader])
                    {
                        for (const filter of filters)
                            if (filter?.length > 0 && !data?.filters?.uploader?.[selected_uploader]?.includes(filter))
                                data.filters.uploader[selected_uploader].push(filter);
                    }
                    else data.filters.uploader[selected_uploader] = filters;

                    await save('data', data);
                    document.getElementById('custom_uploader_filter_input').value = '';
                    window.location.reload();
                break;

            case 'remove':
                    if (data?.filters?.uploader?.[selected_uploader])
                        for (const filter of filters)
                            if (filter?.length > 0 && data?.filters?.uploader?.[selected_uploader]?.includes(filter))
                                data.filters.uploader[selected_uploader].splice(data?.filters?.uploader?.[selected_uploader]?.indexOf(filter), 1);

                    if (data?.filters?.uploader[selected_uploader]?.length < 1) delete data.filters.uploader[selected_uploader];

                    await save('data', data);
                    document.getElementById('custom_uploader_filter_input').value = '';
                    window.location.reload();
                break;

            case 'select':
                    if (!document?.getElementById('custom_uploader_filter_input')?.value)
                    {
                        document.getElementById('custom_uploader_filter_input').setAttribute('placeholder', 'Cannot be empty!'),
                        setTimeout(() => { document.getElementById('custom_uploader_filter_input').setAttribute('placeholder', 'Separate with (;)...'); }, 3000);
                        return;
                    };

                    await load('data').then( async (data) => {
                        if (data?.uploaders?.favorites)
                        {
                            var buttonHolder = document?.getElementById('select_uploader_for_filter');
                            buttonHolder.replaceChildren();

                            for (const uploader of data?.uploaders?.favorites)
                            {
                                var favoriteUploaderButton = document.createElement('button');
                                favoriteUploaderButton.classList.add('button', 'margin');
                                favoriteUploaderButton.innerHTML = uploader;
                                favoriteUploaderButton.addEventListener('click', function() {
                                    let selectedUploader = this.innerHTML;
                                    document.getElementById('select_custom_uploader_filter_button').setAttribute('class', 'button hide');
                                    document.getElementById('custom_uploader_filter_button').setAttribute('class', 'button');
                                    document.getElementById('remove_custom_uploader_filter_button').setAttribute('class', 'button');
                                    buttonHolder.replaceChildren(`Selected: ${ selectedUploader }`);
                                    selected_uploader = selectedUploader;
                                });
                                buttonHolder.appendChild(favoriteUploaderButton);
                            };
                        };
                    });
                break;

            default:
                break;
        };
    });
};

async function getRandomHex() {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    var hexString = '#';
    
    for (let i = 0; i < 6; i++) hexString += array[Math.floor(Math.random() * array.length)];
    return hexString;
};

document?.getElementById('viewUploaders')?.addEventListener('click', async function() {
    const uploadersTextbox = document?.getElementById('showFavUploaders');

    if (uploadersTextbox?.hasAttribute('style'))
    {
        await load('data').then( async (data) => {
            for (const uploader of data?.uploaders?.favorites)
                uploadersTextbox.innerHTML += `<span style="color: ${ await getRandomHex() }">${ uploader }</span>`;
            uploadersTextbox.removeAttribute('style');
        });

        this.innerText = 'Hide';
    }
    else
    {
        uploadersTextbox.innerHTML = '';
        uploadersTextbox.style.display = 'none';
        this.innerText = 'View';
    };
});

document?.getElementById('viewFilters')?.addEventListener('click', async function() {
    const filtersTextbox = document?.getElementById('showPrefFilters');

    if (filtersTextbox?.hasAttribute('style'))
    {
        await load('data').then( async (data) => {
            for (const filter of data?.filters?.global)
                filtersTextbox.innerHTML += `<span style="color: ${ await getRandomHex() }">${ filter }</span>`;
            filtersTextbox.removeAttribute('style');
        });

        this.innerText = 'Hide';
    }
    else
    {
        filtersTextbox.innerHTML = '';
        filtersTextbox.style.display = 'none';
        this.innerText = 'View';
    };
});

document?.getElementById('view_per_uploader_filters')?.addEventListener('click', async function() {
    const singleFiltersTextbox = document.getElementById('show_per_uploader_filters');

    if (singleFiltersTextbox?.hasAttribute('style'))
    {
        await load('data').then( async (data) => {
            for (const [uploader, filters] of Object.entries(data?.filters?.uploader))
                singleFiltersTextbox.innerHTML += `<span style="color: ${ await getRandomHex() }">${ uploader }: [${ filters }]</span>`;
            singleFiltersTextbox.removeAttribute('style');
        });

        this.innerText = 'Hide';
    }
    else
    {
        singleFiltersTextbox.innerHTML = '';
        singleFiltersTextbox.style.display = 'none';
        this.innerText = 'View';
    };
});

async function onLoad() {
    //console.log(chrome.runtime.getBackgroundPage());
    console.log(await load('data'));
    await load('preferences').then( async (preferences) => {
        if (!preferences) preferences = {};
        if (preferences?.autohide == undefined || typeof preferences?.autohide !== 'boolean') preferences.autohide = false;
        if (preferences?.highlightUploaders == undefined || typeof preferences?.highlightUploaders !== 'boolean') preferences.highlightUploaders = false;
        if (preferences?.globalFilters == undefined || typeof preferences?.globalFilters !== 'boolean') preferences.globalFilters = false;
        if (preferences?.perUploaderFilters == undefined || typeof preferences?.perUploaderFilters !== 'boolean') preferences.perUploaderFilters = false;
        if (preferences?.customBackground == undefined || typeof preferences?.customBackground !== 'boolean') preferences.customBackground = false;
        if (preferences?.customBackgroundUrl == undefined || typeof preferences?.customBackgroundUrl !== 'string') preferences.customBackgroundUrl = '';

        await save('preferences', preferences);
    });

    await load('data').then( async (data) => {
        if (!data) data = {};
        
        if (data?.uploaders == undefined) data.uploaders = {};
        if (data?.uploaders?.favorites == undefined) data.uploaders.favorites = new Array();

        if (data?.filters == undefined) data.filters = {};
        if (data?.filters?.global == undefined) data.filters.global = new Array();
        if (data?.filters?.uploader == undefined) data.filters.uploader = {};

        await save('data', data);
    });

    await load('downloads').then( async (downloads) => {
        if (downloads == undefined) downloads = {};
        delete downloads.downloadIds;
        
        await save('downloads', downloads);
    });

    console.log(await load('preferences'));
    console.log(await load('data'));
    console.log(await load('downloads'));

    /* Loading and setting up checkboxes. */

    checkboxes.forEach( async function(checkbox) {
        let preferences = await load('preferences');

        if (preferences?.[checkbox?.id] == true) checkbox.checked;
        else checkbox.checked = false;

        checkbox.addEventListener('change', async function()  {
            let preferences = await load('preferences');

            if (checkbox.checked)
            {
                preferences[checkbox?.id] = true;
                await save('preferences', preferences);
            }
            else
            {
                preferences[checkbox?.id] = false;
                await save('preferences', preferences);
            };

            return console.log(await load('preferences'));
        });
    });
    
    var button = document.getElementById('expand'),
        settings = document.getElementById('settingsDiv');

    button.addEventListener('click', function () {
        if (settings.hasAttribute('style')) {
            settings.removeAttribute('style');
            button.textContent = 'Settings ▲';
        } else {
            settings.setAttribute('style', 'display: none;');
            button.textContent = 'Settings ▼';
        }
    });

    var custom_uploader_button = document.getElementById('custom_uploader_button'),
        remove_custom_uploader_button = document.getElementById('remove_custom_uploader_button'),
        clear_all_uploaders_button = document.getElementById('clear_all_uploaders_button'),

        custom_global_filter_button = document.getElementById('custom_global_filter_button'),
        remove_custom_global_filter_button = document.getElementById('remove_custom_global_filter_button'),
        clear_all_filters_button = document.getElementById('clear_all_filters_button'),

        select_custom_uploader_filter_button = document.getElementById('select_custom_uploader_filter_button'),
        custom_uploader_filter_button = document.getElementById('custom_uploader_filter_button'),
        remove_custom_uploader_filter_button = document.getElementById('remove_custom_uploader_filter_button'),

        set_custom_background_button = document.getElementById('set_custom_background_button');

    custom_uploader_button.addEventListener('click', function () {
        uploaders('add', 'favorites');
    });

    remove_custom_uploader_button.addEventListener('click', function () {
        uploaders('remove', 'favorites');
    });

    clear_all_uploaders_button.addEventListener('click', function () {
        uploaders('clear', 'favorites');
    });

    custom_global_filter_button.addEventListener('click', function () {
        globalFilters('add');
    });

    remove_custom_global_filter_button.addEventListener('click', function () {
        globalFilters('remove');
    });

    clear_all_filters_button.addEventListener('click', function () {
        globalFilters('clear');
    });

    select_custom_uploader_filter_button.addEventListener('click', function () {
        perUploaderFilters('select')
    })

    custom_uploader_filter_button.addEventListener('click', function () {
        perUploaderFilters('add');
    });

    remove_custom_uploader_filter_button.addEventListener('click', function () {
        perUploaderFilters('remove');
    });

    set_custom_background_button.addEventListener('click', function () {
        setCustomBackground();
    });
}

document.onload = onLoad();