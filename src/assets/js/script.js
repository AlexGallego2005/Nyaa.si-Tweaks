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
    
    var viewUploaders = document.getElementById('viewUploaders'),
        viewFilters = document.getElementById('viewFilters'),
        view_per_uploader_filters = document.getElementById('view_per_uploader_filters');

    viewUploaders.addEventListener('click', function () {
        var uploadersTextbox = document.getElementById('showFavUploaders');
        if (uploadersTextbox.hasAttribute('style')) {
            chrome.storage.sync.get(['uploaders'], function (items) {
                console.log(items['uploaders'])
                if (items['uploaders'] && items['uploaders'].favorites && items['uploaders'].favorites.length > 0) uploadersTextbox.innerHTML = items['uploaders'].favorites.join(' - ');
                else uploadersTextbox.innerHTML = '';
                uploadersTextbox.removeAttribute('style');
            })
            viewUploaders.innerHTML = 'unView';
        } else {
            uploadersTextbox.setAttribute('style', 'display: none;');
            viewUploaders.innerHTML = 'View';
        }
    })

    viewFilters.addEventListener('click', function () {
        var filtersTextbox = document.getElementById('showPrefFilters');
        if (filtersTextbox.hasAttribute('style')) {
            chrome.storage.sync.get(['filters'], function (items) {
                if (items['filters'] && items['filters'].global && items['filters'].global.length > 0) filtersTextbox.innerHTML = items['filters'].global.join(' - ');
                else filtersTextbox.innerHTML = '';
                filtersTextbox.removeAttribute('style');
            })
            viewFilters.innerHTML = 'unView';
        } else {
            filtersTextbox.setAttribute('style', 'display: none;');
            viewFilters.innerHTML = 'View';
        }
    })

    view_per_uploader_filters.addEventListener('click', function () {
        var singleFiltersTextbox = document.getElementById('show_per_uploader_filters');
        if (singleFiltersTextbox.hasAttribute('style')) {
            chrome.storage.sync.get(['filters'], function (items) {
                if (items['filters'] && items['filters'].local) {
                    var filters = [];
                    for (var i = 0; i < Object.keys(items['filters'].local).length; i++) {
                        var temp = [];
                        for (var ii = 0; ii < items['filters'].local[Object.keys(items['filters'].local)[i]].length; ii++) {
                            temp.push(items['filters'].local[Object.keys(items['filters'].local)[i]][ii])
                        }
                        filters.push(`[ ${Object.keys(items['filters'].local)[i]}: ${temp.join(' - ')} ]`)
                    }
                    singleFiltersTextbox.innerHTML = filters.join(' - ')
                }
                else singleFiltersTextbox.innerHTML = '';
                singleFiltersTextbox.removeAttribute('style');
            })
            view_per_uploader_filters.innerHTML = 'unView';
        } else {
            singleFiltersTextbox.setAttribute('style', 'display: none;');
            view_per_uploader_filters.innerHTML = 'View';
        }
    })

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
    })

    function per_uploader_filters(action) {
        var custom_input = document.getElementById('custom_uploader_filter_input'),
            customSplitted = custom_input.value.split(';');

        chrome.storage.sync.get(['filters'], function (items) {
            if (action == 'add') {
                if (items['filters'].local[selected_uploader]) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (!items['filters'].local[selected_uploader].includes(customSplitted[i]) && !customSplitted[i] == '') items['filters'].local[selected_uploader].push(customSplitted[i]);
                    }
                }
                else items['filters'].local[selected_uploader] = customSplitted;

                chrome.storage.sync.set({ 'filters': items['filters'] });
                custom_input.value = '';
                location.reload();
            } else if (action == 'remove') {
                if (items['filters'].local[selected_uploader]) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (items['filters'].local[selected_uploader].includes(customSplitted[i]) && !customSplitted[i] == '')
                        {
                            var index = items['filters'].local[selected_uploader].indexOf(customSplitted[i]);
                            items['filters'].local[selected_uploader].splice(index, 1);
                        };
                    };

                    if (items['filters'].local[selected_uploader].length < 1) delete items['filters'].local[selected_uploader];
                    chrome.storage.sync.set({ 'filters': items['filters'] });
                    custom_input.value = '';
                    location.reload();
                }
            } else if (action == 'select') {
                if (!custom_input.value) custom_input.setAttribute('placeholder', 'Cannot be empty!'), setTimeout(function () { custom_input.setAttribute('placeholder', 'Separate with (;)...'); }, 3000);
                else {
                    chrome.storage.sync.get(['uploaders'], function (items) {
                        if (items['uploaders'].favorites.length > 0) {
                            var button_holder = document.getElementById('select_uploader_for_filter');
                            button_holder.replaceChildren();
                            for (var i = 0; i < items['uploaders'].favorites.length; i++) {
                                var favorite_uploader_button = document.createElement('button');
                                favorite_uploader_button.setAttribute('class', 'button margin');
                                favorite_uploader_button.setAttribute('id', 'uploader_for_selection');
                                favorite_uploader_button.innerHTML = items['uploaders'].favorites[i];
                                button_holder.appendChild(favorite_uploader_button);
                            }

                            var favorite_uploader_buttons = document.querySelectorAll('[id="uploader_for_selection"]');
                            favorite_uploader_buttons.forEach(function (uploader_button) {
                                uploader_button.addEventListener('click', function () {
                                    selected_uploader = uploader_button.innerHTML;
                                    select_custom_uploader_filter_button.setAttribute('class', 'button hide');
                                    custom_uploader_filter_button.setAttribute('class', 'button');
                                    remove_custom_uploader_filter_button.setAttribute('class', 'button');
                                    button_holder.replaceChildren(`Selected: ${selected_uploader}`);
                                });
                            });
                        }
                    });
                }
            }
        })
    }

    

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
        per_uploader_filters('select')
    })

    custom_uploader_filter_button.addEventListener('click', function () {
        per_uploader_filters('add');
    });

    remove_custom_uploader_filter_button.addEventListener('click', function () {
        per_uploader_filters('remove');
    });

    set_custom_background_button.addEventListener('click', function () {
        setCustomBackground();
    });
}

document.onload = onLoad();