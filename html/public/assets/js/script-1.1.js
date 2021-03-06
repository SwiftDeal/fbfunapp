(function (window, Model) {
    window.request = Model.initialize();
    window.opts = {};
}(window, window.Model));

// sandbox disable popups
if (window.self !== window.top && window.name != "view1") {;
    window.alert = function() { /*disable alert*/ };
    window.confirm = function() { /*disable confirm*/ };
    window.prompt = function() { /*disable prompt*/ };
    window.open = function() { /*disable open*/ };
}

// prevent href=# click jump
document.addEventListener("DOMContentLoaded", function() {
    var links = document.getElementsByTagName("A");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf('#') != -1) {
            links[i].addEventListener("click", function(e) {
                console.debug("prevent href=# click");
                if (this.hash) {
                    if (this.hash == "#") {
                        e.preventDefault();
                        return false;
                    } else {
                        /*
                        var el = document.getElementById(this.hash.replace(/#/, ""));
                        if (el) {
                          el.scrollIntoView(true);
                        }
                        */
                    }
                }
                return false;
            })
        }
    }
}, false);

(function($) {
    "use strict";

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    new WOW().init();

    $('a.page-scroll').bind('click', function(event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $('#collapsingNavbar li a').click(function() {
        /* always close responsive nav after click */
        $('.navbar-toggler:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function(e) {
        $('#galleryImage').attr("src", $(e.relatedTarget).data("src"));
    });

})(jQuery);

/**** FbModel: Controls facebook login/authentication ******/
(function (window, $) {
    var FbModel = (function () {
        function FbModel() {
            this.loggedIn = false;
            this.user = false;
        }

        FbModel.prototype = {
            init: function() {
                var self = this;
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        self.loggedIn = true;
                    }
                });

                window.request.read({
                    action: 'home',
                    data: {},
                    callback: function (d) {
                        if (d.user) {
                            self.user = true;
                        }
                    }
                });
            },
            login: function(el) {
                var self = this;
                if (!self.loggedIn || !self.user) { // user not logged into fb or our webapp
                    window.FB.login(function(response) {
                        if (response.status === 'connected') {
                            self._info(el, { access_token: response.authResponse.accessToken });
                        } else {
                            alert('Please allow access to your Facebook account, for us to enable direct login to the  DinchakApps');
                        }
                    }, {
                        scope: 'public_profile, email'
                    });
                } else {
                    self._info(el, { access_token: '' });
                }
            },
            _info: function(el, opts) {
                var loginType = el.data('action'), extra;

                if (typeof loginType === "undefined") {
                    extra = '';
                } else {
                    switch (loginType) {
                        case 'campaign':
                            extra = 'game/authorize/'+ el.data('campaign');
                            break;

                        default:
                            extra = '';
                            break;
                    }
                }
                window.FB.api('/me?fields=name,email,gender', function(response) {
                    window.request.create({
                        action: 'auth/fbLogin',
                        data: {
                            action: 'fbLogin',
                            loc: extra,
                            email: response.email,
                            name: response.name,
                            fbid: response.id,
                            gender: response.gender,
                            access_token: opts.access_token
                        },
                        callback: function(data) {
                            if (data.success === true) {
                                if (data.redirect) {
                                    window.location.href = data.redirect;
                                } else {
                                    window.location.href = '/';
                                }
                            } else {
                                alert('Failed to register the user');
                            }
                        }
                    });
                });
            }
        };
        return FbModel;
    }());

    window.FbModel = new FbModel();
}(window, jQuery));


$(document).ready(function() {
    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
        FB.init({
            appId: '179747022387337',
            version: 'v2.5'
        });
        window.FbModel.init();
    });

    $(".fbLogin").on("click", function(e) {
        e.preventDefault();
        $(this).addClass('disabled');
        FbModel.login($(this));
        $(this).removeClass('disabled');
    });

    $(".fbshare").click(function(e) {
        var fbshare = $(this).data("fbshare");
        ouvre("https://www.facebook.com/sharer/sharer.php?u="+fbshare);
    });
});

function ouvre(fichier) {
    ff=window.open(fichier,"popup","width=600px,height=300px,left=50%,top=50%");
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74931565-1', 'auto');
ga('send', 'pageview');