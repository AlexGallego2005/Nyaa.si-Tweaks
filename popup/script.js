var checkboxes = document.querySelectorAll('input[type=checkbox]'),
    viewmores = document.querySelectorAll('[class="viewMore"]'),
    selected_uploader = undefined;

function onLoad() {
    //chrome.storage.sync.clear();
    //chrome.storage.local.clear();
    console.log(chrome.extension.getBackgroundPage())
    chrome.storage.sync.get(['preferences', 'filters', 'uploaders', 'downloads'], function (items) {
        if (items['preferences'] == undefined) items['preferences'] = {};
        if (items['preferences'].autohide == undefined) items['preferences'].autohide = false;
        if (items['preferences'].highlight_uploaders == undefined) items['preferences'].highlight_uploaders = false;
        if (items['preferences'].global_filters == undefined) items['preferences'].global_filters = false;
        if (items['preferences'].per_uploader_filters == undefined) items['preferences'].per_uploader_filters = false;
        if (items['preferences'].custom_background == undefined) items['preferences'].custom_background = false;
        if (items['preferences'].custom_background_link == undefined) items['preferences'].custom_background_link = '';
        chrome.storage.sync.set({ 'preferences': items['preferences'] });

        if (items['filters'] == undefined) items['filters'] = {};
        if (items['filters'].global == undefined) items['filters'].global = {};
        if (items['filters'].local == undefined) items['filters'].local = {};
        chrome.storage.sync.set({ 'filters': items['filters'] });

        if (items['uploaders'] == undefined) items['uploaders'] = {};
        if (items['uploaders'].favorites == undefined) items['uploaders'].favorites = {};
        chrome.storage.sync.set({ 'uploaders': items['uploaders'] });

        chrome.storage.local.get(['downloads'], function (items) {
            if (items['downloads'] == undefined) items['downloads'] = {};
            if (items['downloads'].downloadIds == undefined) items['downloads'].downloadIds = {};
            chrome.storage.local.set({ 'downloads': items['downloads'] });
        });

        if (items['preferences'].autohide) document.getElementById('autohide').checked = true;
        else document.getElementById('autohide').checked = false;
        if (items['preferences'].highlight_uploaders) document.getElementById('highlightFav').checked = true;
        else document.getElementById('highlightFav').checked = false, document.getElementById('prefs').checked = false, document.getElementById('per_uploader_filter').checked = false;
        if (items['preferences'].global_filters) document.getElementById('prefs').checked = true;
        else document.getElementById('prefs').checked = false;
        if (items['preferences'].per_uploader_filters) document.getElementById('per_uploader_filter').checked = true;
        else document.getElementById('per_uploader_filter').checked = false;
        if (items['preferences'].custom_background) document.getElementById('custom_background').checked = true;
        else document.getElementById('custom_background').checked = false;

        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    if (checkbox.getAttribute('id') == 'autohide') items['preferences'].autohide = true, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'highlightFav') items['preferences'].highlight_uploaders = true, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'prefs') items['preferences'].global_filters = true, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'per_uploader_filter') items['preferences'].per_uploader_filters = true, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'custom_background') items['preferences'].custom_background = true, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                } else {
                    if (checkbox.getAttribute('id') == 'autohide') items['preferences'].autohide = false, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'highlightFav') items['preferences'].highlight_uploaders = false, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'prefs') items['preferences'].global_filters = false, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'per_uploader_filter') items['preferences'].per_uploader_filters = false, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                    else if (checkbox.getAttribute('id') == 'custom_background') items['preferences'].custom_background = false, chrome.storage.sync.set({ 'preferences': items['preferences'] }, function () { console.log('Settings saved.') });
                }
            })
        })
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
                        if (items['filters'].local[selected_uploader].includes(customSplitted[i]) && !customSplitted[i] == '') { var index = items['filters'].local[selected_uploader].indexOf(customSplitted[i]); items['filters'].local[selected_uploader].splice(index, 1); }
                    }
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

    function global_filters(action) {
        var custom_input = document.getElementById('custom_global_filter_input'),
            customSplitted = custom_input.value.split(';');

        chrome.storage.sync.get(['filters'], function (items) {
            if (action == 'add') {
                if (items['filters'].global.length > 0) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (!items['filters'].global.includes(customSplitted[i]) && !customSplitted[i] == '') items['filters'].global.push(customSplitted[i]);
                    }
                } else items['filters'].global = customSplitted;

            } else if (action == 'remove') {
                if (items['filters'].global.length > 0) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (items['filters'].global.includes(customSplitted[i]) && !customSplitted[i] == '') { var index = items['filters'].global.indexOf(customSplitted[i]); items['filters'].global.splice(index, 1); }
                    }
                } else return;
            } else if (action == 'clear') {
                var clear_all_button = document.getElementById('clear_all_filters_button');
                if (clear_all_button.innerHTML == 'Confirm') {
                    items['filters'].global = {};
                    items['filters'].local = {};
                    clear_all_button.innerHTML = 'Cleared!';
                    setTimeout(function () { clear_all_button.innerHTML = 'Filters'; }, 3000)
                } else {
                    clear_all_button.innerHTML = 'Confirm';
                }
            }

            chrome.storage.sync.set({ 'filters': items['filters'] });
        });
        custom_input.value = '';
        return
    }

    function uploaders(action, mode) {
        var custom_input = document.getElementById('custom_uploader_input'),
            customSplitted = custom_input.value.split(';');
        console.log(action, mode)
        chrome.storage.sync.get(['uploaders'], function (items) {
            if (action == 'add') {
                console.log(items['uploaders'])
                if (items['uploaders'][mode].length > 0) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (!items['uploaders'][mode].includes(customSplitted[i]) && !customSplitted[i] == '') items['uploaders'][mode].push(customSplitted[i]);
                    }
                } else items['uploaders'][mode] = customSplitted;

            } else if (action == 'remove') {
                if (items['uploaders'][mode].length > 0) {
                    for (var i = 0; i < customSplitted.length; i++) {
                        if (items['uploaders'][mode].includes(customSplitted[i]) && !customSplitted[i] == '') { var index = items['uploaders'][mode].indexOf(customSplitted[i]); items['uploaders'][mode].splice(index, 1); }
                    }
                } else return;
            } else if (action == 'clear') {
                var clear_all_button = document.getElementById('clear_all_uploaders_button');
                if (clear_all_button.innerHTML == 'Confirm') {
                    items['uploaders'].favorites = {};
                    clear_all_button.innerHTML = 'Cleared!';
                    setTimeout(function () { clear_all_button.innerHTML = 'Uploaders'; }, 3000)
                } else {
                    clear_all_button.innerHTML = 'Confirm';
                }
            }

            chrome.storage.sync.set({ 'uploaders': items['uploaders'] });
        });
        custom_input.value = '';
        return
    }

    function set_background() {
        var custom_input = document.getElementById('set_custom_background_link').value;
        chrome.storage.sync.get(['preferences'], function (items) {
            if (custom_input == '') custom_input = document.getElementById('set_custom_background_link').value;
            items['preferences'].custom_background_link = custom_input;
            chrome.storage.sync.set({ 'preferences': items['preferences'] });
        });
        custom_input = document.getElementById('set_custom_background_link').value;
        custom_input = '';
        return
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
        global_filters('add');
    });

    remove_custom_global_filter_button.addEventListener('click', function () {
        global_filters('remove');
    });

    clear_all_filters_button.addEventListener('click', function () {
        global_filters('clear');
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
        set_background();
    });
}

document.onload = onLoad();