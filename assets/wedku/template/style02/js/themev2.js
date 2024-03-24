var satuMomen = document.getElementById('satuMomen');

// loader
var loader = document.getElementById('loader');
if (loader) {
    window.onload = loader.style.display = "none";
}

// splide        
const main = new Splide( '#satuMomen', {
    type        : 'fade',
    direction   : 'ttb',
    height      : '100%',
    perPage     : 1,
    arrows      : false,
    pagination  : false,
    updateOnMove: true,
    noDrag      : 'input, textarea, .rsvp-placeholder',
} );
const menu = new Splide( '#menuSlider', {
    fixedWidth  : '25%',
    fixedHeight : 60,
    focus       : 'center',
    arrows      : false,
    rewind      : true,
    pagination  : false,
    cover       : false,
    updateOnMove: true,
    isNavigation: true,
} );

main.mount();

// tampilkan nama tamu
var guestName = satuMomen.dataset.guest;
var guestNameSlot = document.getElementById('guestNameSlot');
if (guestName && guestNameSlot) {
    guestNameSlot.innerHTML = guestName;
}

// tampilkan nama group
var groupName = satuMomen.dataset.group;
var groupNameSlot = document.getElementById('groupNameSlot');
if (groupName && groupNameSlot) {
    groupNameSlot.innerHTML = groupName;
}

// music
var btnMusic = document.getElementById('btnMusic');
var music = document.getElementById("music") ? document.getElementById("music") : null;
// soundcloud
// soundcloud music
var iframeElement = document.querySelector('.sc-music > iframe');
var widget = iframeElement ? SC.Widget(iframeElement) : null;
let isPlaying = false;

playMusic = (status) => {
    if (status) {
        if(music) {
            music.play();
        }
    } else {
        if(music) {
            isPlaying ? music.pause() : music.play();
        }
    }
    // soundcloud
    
    if (widget && SC.Widget.Events.READY) {
        if (isPlaying) {
            widget.pause();
            isPlaying = false;
        } else {
            widget.play();
            isPlaying = true;
        }
    }
};
if(music) {
    music.onplaying = function() {
        isPlaying = true;
    };
    music.onpause = function() {
        isPlaying = false;
    };
} else {
    // btnMusic.style = 'display: none;';
}

// full screen
openFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
    }
};

// invitation
openInvitation = (target) => {
    playMusic(true);
    openFullScreen();
};

// toggle open invitation
var invToggle = (e) => {
    this.openInvitation();
    var nomenu = document.querySelector(".no-menu");
    if (nomenu === null) {
        menu.mount();
        main.sync( menu );
        menu.go(1);
    } else {
        main.go(1);
    }
    satuMomen.classList.remove("not-open");
    e.target.style.display = "none";
};
// buka undangan
var btnOpenInvitation = document.getElementsByClassName('btn-open-invitation');

for (let i = 0; i < btnOpenInvitation.length; i++) {
    btnOpenInvitation[i].addEventListener('click', invToggle, false);
}

// tampilkan gift
showGift = (index) => {
    for (let i = 0; i < btnGift.length; i++) {
        if (i != index) {
            giftContainer[i].style.display = "none";
        }
    }

    giftContainer[index].style.display = "inherit";
}

var giftContainer = document.getElementsByClassName('gift-container');
for (let i = 0; i < giftContainer.length; i++) {
    giftContainer[i].style.display = "none";
}

var btnGift = document.getElementsByClassName('btn-gift');

for (let i = 0; i < btnGift.length; i++) {
    btnGift[i].onclick = () => {
        this.showGift(i);
    };
}

// lightbox gallery
var lightboxWrapper = document.getElementById("lightboxWrapper");
var lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
var lightboxNextBtn = document.getElementById("lightboxNextBtn");
var lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
var lightboxList = document.querySelector("#lightboxWrapper > .lightbox-list");
var images = document.getElementsByClassName("lightbox");

showLightbox = (i) => {
    lightboxWrapper.classList.add("show");
    lightboxList.innerHTML = `<div class="lightbox-inner"><img src="${images[i].src}"></div>`;
    lightboxNextBtn.dataset.index = i;
    lightboxPrevBtn.dataset.index = i;
}

lightboxNextBtn.onclick = () => {
    let i = parseInt(lightboxNextBtn.dataset.index) + 1;
    if (i >= images.length) {
        i = 0;
    }
    this.showLightbox(i);
};

lightboxPrevBtn.onclick = () => {
    let i = parseInt(lightboxPrevBtn.dataset.index) - 1;
    if (i == -1) {
        i = images.length - 1;
    }
    this.showLightbox(i);
};

closeLightbox = () => {
    lightboxWrapper.classList.remove("show");
    lightboxList.innerHTML = '';
}

for (let i = 0; i < images.length; i++) {
    images[i].onclick = () => {
        this.showLightbox(i);
    };
}

lightboxCloseBtn.onclick = () => {
    this.closeLightbox();
};

// modal
var body = document.getElementsByTagName("BODY")[0];
var modalOverlay = document.getElementById('modalOverlay');

showModal = (target) => {
    body.classList.add('modal-open');
    modalOverlay.classList.add('show');
    modalOverlay.style = 'display: block;';
    target.classList.add('show');
    target.style = 'display: block;';
};
closeModal = (target) => {
    body.classList.remove('modal-open');
    modalOverlay.classList.remove('show');
    modalOverlay.style = 'display: none;';
    target.classList.remove('show');
    target.style = 'display: none;';
};

// countdown
var countdownElement = document.getElementsByClassName('countdown-wrapper');

displayCountdown = (target) => {
    var countDownDate = new Date(target.dataset.datetime).getTime();
    var daysEl = target.querySelector('.countdown > .day > .number');
    var hoursEl = target.querySelector('.countdown > .hour > .number');
    var minutesEl = target.querySelector('.countdown > .minute > .number');
    var secondsEl = target.querySelector('.countdown > .second > .number');

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerHTML = days;
        hoursEl.innerHTML = hours;
        minutesEl.innerHTML = minutes;
        secondsEl.innerHTML = seconds;

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            daysEl.innerHTML = '00';
            hoursEl.innerHTML = '00';
            minutesEl.innerHTML = '00';
            secondsEl.innerHTML = '00';
        }
    }, 1000);
}

for (let i = 0; i < countdownElement.length; i++) {
    this.displayCountdown(countdownElement[i]);
}

// rsvp
var btnRsvp = document.getElementsByClassName('btn-rsvp');
var rsvpPlaceholder = document.querySelector('.rsvp-placeholder') ?? null;
var rsvpForm = document.querySelector('.rsvp-form') ?? null;

for (let i = 0; i < btnRsvp.length; i++) {
    if (rsvpPlaceholder) {
        btnRsvp[i].style.display = "none";
    } else {        
        btnRsvp[i].onclick = () => {
            this.showModal(rsvpModal);
        };
    }
}

// inser rsvp to element
if (rsvpForm && rsvpPlaceholder) {
    rsvpPlaceholder.innerHTML = "";
    rsvpPlaceholder.appendChild(rsvpForm);
}

// watermark
var app = document.getElementById('app') ?? null;
var illegal = document.getElementById('illegal') ?? null;
var wm = document.getElementById('waterMark') ?? null;
var wmp = document.querySelector('.watermark-placeholder') ?? null;
var nowm = document.querySelector('.no-watermark') ?? null;
var wmLayout = document.querySelector('.watermark') ?? null;
if (wm && wmp && nowm == null) {
    wm.style.display = "inherit";
    wmp.appendChild(wm);
    illegal.style.display = "none";
} else if (wmLayout && wmp == null) {
    app.innerHTML = "";
    illegal.style.display = "flex";
} else {
    wm.style.display = "none";
    illegal.style.display = "none";
}

// copy rekening
var accountNumber = document.getElementsByClassName('account-number');

for (let i = 0; i < accountNumber.length; i++) {
    if (accountNumber[i].innerHTML) {
        accountNumber[i].insertAdjacentHTML("afterend", `<button type='button' class='btn btn-sm btn-primary mt-2 mb-2 animate__animated animate__fadeInUp animate__slow delay-5' data-text='${accountNumber[i].innerText}' onclick='copyText(event)' style='font-family: sans-serif; border-radius: 4px'>Copy Rekening</button>`);
    }
}

copyText = (e) => {
    // const cb = navigator.clipboard;
    // cb.writeText(e.target.dataset.text).then(() => e.target.innerHTML = "Berhasil Dicopy");
    let newInp = document.createElement("input");
    newInp.autofocus = false;
    newInp.value = e.target.dataset.text;
    document.body.appendChild(newInp);
    newInp.select();
    document.execCommand("copy");
    newInp.remove();
    e.target.innerHTML = "Berhasil Dicopy";
}