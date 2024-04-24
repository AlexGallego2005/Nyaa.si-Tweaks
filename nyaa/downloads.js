function onLoad() {
    var html = document.querySelector('html'),
        head = document.querySelector('head'),
        body = document.querySelector('body'),
        container = document.querySelector('body > div.container');
    head.remove()
    head = document.createElement('head');
    html.insertBefore(head, body);

    document.head.insertAdjacentHTML('beforeend', `
		<meta charset="utf-8">
		<title>Browse :: Nyaa</title>

		<meta name="viewport" content="width=480px">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<link rel="shortcut icon" type="image/png" href="/static/favicon.png">
		<link rel="icon" type="image/png" href="/static/favicon.png">
		<link rel="mask-icon" href="/static/pinned-tab.svg" color="#3582F7">
		<link rel="alternate" type="application/rss+xml" href="https://nyaa.si/?page=rss">

		<meta property="og:site_name" content="Nyaa">
		<meta property="og:title" content="Browse :: Nyaa">
		<meta property="og:image" content="/static/img/avatar/default.png">
<meta name="description" content="A BitTorrent community focused on Eastern Asian media including anime, manga, music, and more">
<meta name="keywords" content="torrents, bittorrent, torrent, anime, manga, sukebei, download, nyaa, magnet, magnets">
<meta property="og:description" content="Nyaa homepage">

		<!-- Bootstrap core CSS -->
		<!--
			Note: This has been customized at http://getbootstrap.com/customize/ to
			set the column breakpoint to tablet mode, instead of mobile. This is to
			make the navbar not look awful on tablets.
		-->
		<link href="/static/css/bootstrap-dark.min.css?t=1608007388" rel="stylesheet" id="bsThemeLink">
		<link href="/static/css/bootstrap-xl-mod.css?t=1608007388" rel="stylesheet">
		<!--
			This theme changer script needs to be inline and right under the above stylesheet link to prevent FOUC (Flash Of Unstyled Content)
			Development version is commented out in static/js/main.js at the bottom of the file
		-->
		<script>function toggleDarkMode(){"dark"===localStorage.getItem("theme")?setThemeLight():setThemeDark()}function setThemeDark(){bsThemeLink.href="/static/css/bootstrap-dark.min.css?t=1608007388",localStorage.setItem("theme","dark"),document.body!==null&&document.body.classList.add('dark')}function setThemeLight(){bsThemeLink.href="/static/css/bootstrap.min.css?t=1608007388",localStorage.setItem("theme","light"),document.body!==null&&document.body.classList.remove('dark')}if("undefined"!=typeof Storage){var bsThemeLink=document.getElementById("bsThemeLink");"dark"===localStorage.getItem("theme")&&setThemeDark()}</script>
		<script>window.markdown_proxy_images=true;</script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.2/css/bootstrap-select.min.css" integrity="sha256-an4uqLnVJ2flr7w0U74xiF4PJjO2N5Df91R2CUmCLCA=" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=" crossorigin="anonymous">

		<!-- Custom styles for this template -->
		<link href="/static/css/main.css?t=1683696976" rel="stylesheet">

		<!-- Core JavaScript -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script><style>undefined</style>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha256-U5ZEeKfGNOja007MMD3YBI0A3OSZOQbeG6z2f2Y0hu8=" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js" integrity="sha256-3WZyZQOe+ql3pLo90lrkRtALrlniGdnf//gRpW0UQks=" crossorigin="anonymous"></script>
		<!-- Modified to not apply border-radius to selectpickers and stuff so our navbar looks cool -->
		<script src="/static/js/bootstrap-select.min.js?t=1623304983"></script>
		<script src="/static/js/main.min.js?t=1683696976"></script>

		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<link rel="search" type="application/opensearchdescription+xml" title="Nyaa.si" href="/static/search.xml">
	<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="true"><link rel="preconnect" href="https://fonts.gstatic.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900&amp;display=swa"><script data-avast-pam="y" type="text/javascript" name="AVAST_PAM_submitInjector">(function _submitInjector() {
        var f = document.querySelectorAll("form")[1]; // eslint-disable-line no-undef
        if (!f._avast_submit) {
          f._avast_submit = f.submit;
        }
        try {
          Object.defineProperty(f, "submit", {
            get: function get() {
              return function (prev_submit) {
                prev_submit.call(this);

                if (this._avast_inside_submit) {
                  return;
                }
                this._avast_inside_submit = true;

                var evt = document.createEvent("CustomEvent");
                evt.initEvent("scriptsubmit", true, true); // bubbling & cancelable
                this.dispatchEvent(evt);

                delete this._avast_inside_submit;
              }.bind(this, this._avast_submit);
            },
            set: function set(submitFunc) {
              this._avast_submit = submitFunc;
            }
          });
        } catch (ex) {
          // ignored
        }
      })();</script>
    `);
    
    var error = document.querySelectorAll('[class="container"]');
    error = error[error.length - 1];
    error.replaceChildren();

    container.insertAdjacentHTML('beforeend', `
    <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped torrent-list">
            <thead>
                <tr>
                    <th class="hdr-category text-center" style="width:80px;">Category</th>
                    <th class="hdr-name" style="width:auto;">Name</th>
                    <th class="hdr-link text-center" style="width:50px;">Link</th>
                    <th class="hdr-size text-center" style="width:100px;">Size</th>
                    <th class="hdr-date text-center" title="In local time" style="width:140px;">Date</th>

                    <th class="hdr-seeders text-center" title="Seeders" style="width:50px;"><i class="fa fa-arrow-up" aria-hidden="true"></i></th>
                    <th class="hdr-leechers text-center" title="Leechers" style="width:50px;"><i class="fa fa-arrow-down" aria-hidden="true"></i></th>
                    <th class="hdr-downloads text-center" title="Completed downloads" style="width:50px;"><i class="fa fa-check" aria-hidden="true"></i></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    `)

    var tbody = document.querySelector('tbody');

    function loadDownloads() {
        chrome.storage.local.get(['downloads'], function (items) {
            console.log(items['downloads'].downloadIds)
            for (var i = 0; i < Object.keys(items['downloads'].downloadIds).length; i++) {
                setInterval( function() {
                    fetch(`https://nyaa.si/view/${items['downloads'].downloadIds[Object.keys(items['downloads'].downloadIds)[i]]}`).then(function (data) {
                        return data.text();
                    }).then(function (html) {
                        var parser = new DOMParser(),
                            doc = parser.parseFromString(html, 'text/html');

                        var uploader_class = doc.querySelector('body > div.container > div').getAttribute('class').split('-')[1],
                            torrentName = doc.querySelector('body > div.container > div > div > h3').textContent,
                            torrentId = doc.querySelector('.panel-footer > a').getAttribute('href').split(/\/(?=[^\/]+$)/)[1].split('.')[0],
                            category = [doc.querySelectorAll('.col-md-5 > a')[0].textContent, doc.querySelectorAll('.col-md-5 > a')[1].textContent],
                            category_img = doc.querySelectorAll('.col-md-5 > a')[1].getAttribute('href'),
                            upload_date = [doc.querySelectorAll('.col-md-5')[1].textContent, doc.querySelectorAll('.col-md-5')[1].getAttribute('data-timestamp')],
                            seeders = doc.querySelectorAll('.col-md-5 > span')[0].textContent,
                            leechers = doc.querySelectorAll('.col-md-5 > span')[1].textContent,
                            size = doc.querySelectorAll('.col-md-5')[6].innerHTML,
                            completed = doc.querySelectorAll('.col-md-5')[7].innerHTML;

                        tbody.insertAdjacentHTML('afterbegin', `
                        <tr class="${uploader_class}">
                            <td>
                                <a href="${category_img}" title="${category.join(' - ')}">
                                    <img src="/static/img/icons/nyaa/${category_img.split('=')[1]}.png" alt="${category.join(' - ')}" class="category-icon">
                                </a>
                            </td>
                            <td>
                                <a href="https://nyaa.si/view/${torrentId}" title="${torrentName}">${torrentName}</a>
                            </td>
                            <td class="text-center">
                                <a href="/download/${torrentId}.torrent"><i class="fa fa-fw fa-download"></i></a>
                            </td>
                            <td class="text-center">${size}</td>
                            <td class="text-center" data-timestamp="${upload_date[1]}">${upload_date[0]}</td>

                            <td class="text-center">${seeders}</td>
                            <td class="text-center">${leechers}</td>
                            <td class="text-center">${completed}</td>
                        </tr>
                        `)
                    }).catch(function (err) {
                        console.error('Something went wrong.', err);
                    });
                }, 1500);
            }

        });
    };
    loadDownloads();
}

document.onload = onLoad()

window.onresize = function () {
    var torrents_container = document.querySelector('body > .container');
    if (window.screen.innerWidth > 2080) torrents_container.setAttribute('style', 'width: 2000px;');
    else torrents_container.removeAttribute('style');
}