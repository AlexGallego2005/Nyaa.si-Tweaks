var elms = document.querySelectorAll('tbody > tr'),
    paging = document.querySelectorAll('.pagination > li'),
    navbar = document.querySelector("#navbar > ul"),
    hidden = false,
    weblinks = ['upload', 'rules', 'info', 'rss', 'view', 'settings', 'downloads'];

function onLoad() {
    chrome.storage.sync.get(['preferences', 'uploaders', 'filters'], function (items) {
        console.log(`Settings retrieved:\n\nHide automatically: ${items['preferences'].autohide}\nHighlight favorites: ${items['preferences'].highlight_uploaders}\nGlobal filters: ${items['preferences'].global_filters}\nCustom background: ${items['preferences'].custom_background}\n\nFavorite uploaders: ${items['uploaders'].favorites}\nFilters: ${items['prefFilters']}\nBackground link: ${items['preferences'].custom_background_link}\n\n`);

        if (items['preferences'].custom_background && items['preferences'].custom_background_link !== '') document.styleSheets[0].insertRule(`body { background: linear-gradient(#000000aa, #000000aa), url(${items['preferences'].custom_background_link}); background-position: auto 50%; }`, 0);
        if (window.innerWidth > 2080) document.styleSheets[0].insertRule("body > .container { width: 2000px !important; }", 1);

        var li = document.createElement("li"),
            downloads = document.createElement("a");

        downloads.setAttribute("href", "https://nyaa.si/downloads");
        downloads.innerHTML = 'Downloads'
        li.appendChild(downloads);
        navbar.appendChild(li);

        if (!weblinks.includes(window.location.href.split('https://nyaa.si/')[1].split('/')[0])) {
            
            // clone the bottom pages-navigation bar above the torrents table //
            var nav = document.querySelector('[class="navbar navbar-default navbar-static-top navbar-inverse"]'),
                nav_pagination = document.querySelector('[class="center"]'),
                nav_pagination_clone = nav_pagination.cloneNode(true);

            nav.parentNode.insertBefore(nav_pagination_clone, nav.nextSibling);

            // insert new custom styles for custom classes //
            document.styleSheets[0].insertRule(".placeholder { height: 37px; width: 37px; }", 0);
            document.styleSheets[0].insertRule(".noSeeds { height: 37px; width: 37px; z-index: 10; margin-left: 34px; background-image: url(https://static.thenounproject.com/png/55393-200.png); background-size: 50%; background-position: 50%; background-repeat: no-repeat; }", 0);
            document.styleSheets[0].insertRule(".favorite { height: 37px; width: 37px; z-index: 10; margin-left: 7px; background-image: url(https://images.freeimages.com/fic/images/icons/767/wp_woothemes_ultimate/256/star.png); background-size: 50%; background-position: 50%; background-repeat: no-repeat; }", 0);

            // adds a new column for each torrent with custom classes //
            for (var i = 0; i < elms.length; i++) {
                var td1 = document.createElement("td");
                td1.setAttribute("class", "placeholder seeders");
                elms[i].appendChild(td1);

                var seeders = elms[i].getElementsByClassName("text-center")[3];

                // if no seeders adds a special class //
                if (parseInt(seeders.innerHTML) == 0) {
                    var noSeed = elms[i].getElementsByTagName("td")[8];
                    noSeed.setAttribute("class", "noSeeds seeders")
                }
            }

            // if the option to highlight favorite uploaders is enabled, adds a new column and checks if any fav. uploader is in the torrent's name //
            if (items['preferences'].highlight_uploaders) {
                for (var i = 0; i < elms.length; i++) {
                    var td2 = document.createElement("td");
                    td2.setAttribute("class", "placeholder");
                    elms[i].appendChild(td2);
                    var torrentName = elms[i].getElementsByTagName("td")[1].getElementsByTagName("a")[elms[i].getElementsByTagName("td")[1].getElementsByTagName("a").length - 1].innerHTML;
                    if (items['uploaders'].favorites.some(uploaderName => torrentName.toLowerCase().includes(uploaderName.toLowerCase()))) {
                        function favoriteAdd() {
                            var fav = elms[i].getElementsByTagName("td")[9];
                            fav.setAttribute("class", "favorite")
                        }

                        function findName() {
                            for (var i = 0; i < Object.keys(items['filters'].local).length; i++) {
                                if (torrentName.includes(Object.keys(items['filters'].local)[i])) {
                                    name = Object.keys(items['filters'].local)[i];
                                    return name;
                                }
                            }
                        }

                        // if filters are enabled, checks if the torrent names contains both the uploader and the filters //
                        if (items['preferences'].per_uploader_filters && Object.keys(items['filters'].local).some(uploaderName => torrentName.toLowerCase().includes(uploaderName.toLowerCase()))) {
                            console.log('test')
                            var name = findName()
                            if (items['filters'].local[name].every(filterWord => torrentName.toLowerCase().includes(filterWord.toLowerCase()))) console.log('test1'), favoriteAdd();
                        } else if (items['preferences'].global_filters) {
                            if (items['filters'].global.some(preference => torrentName.toLowerCase().includes(preference.toLowerCase()))) favoriteAdd();
                        } else {
                            favoriteAdd();
                        }
                    }
                }
            }

            // new label on nav to count hidden torrents //
            var li = document.createElement("li"),
                hiddenTorrents = document.createElement("a");

            hiddenTorrents.setAttribute("id", "hiddenTorrentsNum");
            li.appendChild(hiddenTorrents);
            navbar.appendChild(li);

            // automatically hide torrents if the option is enabled //
            if (items['preferences'].autohide) hideTorrents();

        }
    });
}

function hideTorrents() {
    if (!hidden) {
        var hiddenNum = 0;

        for (var i = 0; i < elms.length; i++) {
            var seeders = elms[i].getElementsByClassName("text-center")[3];
            var seeds = elms[i].getElementsByClassName("seeders");
            if (parseInt(seeders.innerHTML) == 0) {
                elms[i].style.display = "none";
                hiddenNum += 1;
            }
            seeds[0].style.display = "none";
        }
        hidden = true;
        try { document.querySelector("[id='hiddenTorrentsNum']").innerHTML = `Hidden: ${hiddenNum}`; } catch (err) { console.log(err) };
    } else {
        for (var i = 0; i < elms.length; i++) {
            var seeds = elms[i].getElementsByClassName("seeders");
            elms[i].removeAttribute("style");
            seeds[0].removeAttribute("style");
        }
        hidden = false;
        try { document.querySelector("[id='hiddenTorrentsNum']").innerHTML = ""; } catch (err) { throw err };
    }
    return;
}

function navigate(direction) {
    var nextBtnHref = paging[paging.length - 1].getElementsByTagName("a")[0].getAttribute("href");
    var prevBtnHref = paging[0].getElementsByTagName("a")[0].getAttribute("href");

    if (direction == "forward") {
        if (nextBtnHref) window.location.href = `https://nyaa.si${nextBtnHref}`, console.log(nextBtnHref);
        else alert("You can't go any further.")
    } else {
        if (prevBtnHref) window.location.href = `https://nyaa.si${prevBtnHref}`, console.log(prevBtnHref);
        else alert("You can't go back anymore.")
    }
}

document.onload = onLoad()
document.onkeyup = function (e) {
    e = e || window.Event;
    if (e.key.toLowerCase() == "h" && document.activeElement.tagName != 'INPUT') {
        hideTorrents();
    } else if ((e.key.toLowerCase() == "n" || e.key.toLowerCase() == "arrowright") && document.activeElement.tagName != 'INPUT') {
        navigate("forward");
    } else if ((e.key.toLowerCase() == "b" || e.key.toLowerCase() == "arrowleft") && document.activeElement.tagName != 'INPUT') {
        navigate("backwards");
    }
}

window.onresize = function () {
    var torrents_container = document.querySelector('body > .container');
    if (window.screen.innerWidth > 2080) torrents_container.setAttribute('style', 'width: 2000px;');
    else torrents_container.removeAttribute('style');
}