function onLoad() {
    var error = document.querySelectorAll('[class="container"]');
    error = error[error.length - 1];
    error.replaceChildren();

    function loadSettings() {
        var nyaaTweaksTitle = document.createElement("h1");
        nyaaTweaksTitle.setAttribute("class", "settingsTitle text-center");
        nyaaTweaksTitle.textContent = 'Nyaa.si Tweaks';
        error.appendChild(nyaaTweaksTitle);
    };

    loadSettings();
}

document.onload = onLoad()

window.onresize = function () {
    var torrents_container = document.querySelector('body > .container');
    if (window.screen.innerWidth > 2080) torrents_container.setAttribute('style', 'width: 2000px;');
    else torrents_container.removeAttribute('style');
}