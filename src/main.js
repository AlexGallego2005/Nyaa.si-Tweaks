/**
 * https://github.com/AlexGallego2005/Nyaa.si-Tweaks/
 * Creator: Álex
 * Contact me: discord.gg/6Fg4fPwjGm or alex_gallego2005!
 */

const webElement = {
    container: document.querySelector('body > div.container'),
    pagination: document.querySelectorAll('.pagination > li'),
    navbar: document.querySelector('#navbar > ul'),
    torrents: document.querySelectorAll('tbody > tr')
};

/* Don't execute stuff if user inside these pages. */
const restricted = ['upload', 'rules', 'info', 'rss', 'view', 'settings', 'downloads'];
var hiddenTorrents = 0;
var hidden = false;

async function onLoad()
{
    console.log(await load('data'), await load('preferences'), await load('downloads'));
    //await save('preferences', { customBackground: true, customBackgroundUrl: "https://img.freepik.com/premium-vector/seamless-abstract-geometric-pattern-retro-style_73378-546.jpg" });

    stylesheets(); // Loading custom CSS stylesheets.
    background(); // Loading custom background (if enabled & exists).
    navbar(); // Loading navbar extra buttons.

    switch (true)
    {
        case window.location.href.includes('view'):
            break;

        case window.location.href.includes('downloads'):
            break;
    
        default:
            if (restricted.some(l => window.location.href.includes(l))) break;

            pagination(); // Loading upper pagination list.
            torrents(); // Filter torrents in table.

            break;
    };
};

document.onload = onLoad();