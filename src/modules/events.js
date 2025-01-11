function navigate(direction)
{
    /** @type {string} - Redirection URL */
    var redirect;

    if (direction == 'full-forward') redirect = webElement?.pagination[webElement?.pagination?.length - 2]?.getElementsByTagName("a")?.[0]?.href;
    else if (direction == 'forward') redirect = webElement?.pagination[webElement?.pagination?.length - 1]?.getElementsByTagName("a")?.[0]?.href;
    else if (direction == 'full-backwards') redirect = webElement?.pagination?.[1]?.getElementsByTagName("a")?.[0]?.href;
    else redirect = webElement?.pagination?.[0]?.getElementsByTagName("a")?.[0]?.href;

    window.location.href = redirect;
};

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