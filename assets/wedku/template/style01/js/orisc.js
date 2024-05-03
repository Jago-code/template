const musicAudio = new Audio(fdat.audio);
let audioIsPlaying = false;
musicAudio.loop = true;

var options = {
		text: `${fdat.guest}!Author Fahmi Hidaytulloh - https://fahmihdytllah.me!${new Date().getTime()}`,
    logo: 'https://cdn.jagocode.my.id/assets/wedku/images/logo/logo-bg.png',
    width: 300,
    height: 300,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H,
    logoWidth: 70, 
    logoHeight: 70,
    logoBackgroundTransparent: true,
    // PI: '#538FFB',
    // PO: '#538FFB',
};
new QRCode(document.getElementById("qrcode"), options);

function loadup(){
  $.post(`/api/ucapan/${$('#idt').val()}?type=json`, function(d){
    $('#lisucp').html('')
    d.forEach(ls => {
      $('#lisucp').append(`<div class="message-item">
      <strong class="name">${ls.name} <span class="badge">${ls.status}</span></strong>
      <i class="message">${ls.msg}</i>
    </div>`)
    });
  })
}
loadup();

$('#fUcapan').submit(function(e){
  e.preventDefault();
  const name = $("#ucapanName").val();
  const confirmation = $("#ucapanConfirmation").val();
  const message = $("#ucapanMessage").val();
  // const whatsapp = $("#ucapanWhatsapp").val();

  if (name === "" || !confirmation || message === "") Swal.fire('Validasi', `Semua kolom harus di isi!`, 'warning')
  else {
    $.post($(this).attr('action'), $(this).serialize(), function(d){
      if (d.status == 200){
        loadup()
        Swal.fire('Success', `Ucapan berhasil dikirim.`, 'success')
        $("#ucapanName").val("");
        $("#ucapanConfirmation").val("");
        $("#ucapanMessage").val("");
        // $("#ucapanWhatsapp").val("");
      }
    });
  }
});

$('#fGift').submit(function(e){
  e.preventDefault();
  const nml = $("#noml").val(),
    nm = $("#nme").val(),
    nc = $("#nmlc").val(),
    nmc = $("#stnma").prop('checked');

  if (nml == 'custom' && nc == '') Swal.fire('Validasi!', `Kolom nominal harus di isi!`, 'warning');
  else if (!nmc && nm == '') Swal.fire('Validasi!', `Kolom Nama harus di isi!`, 'warning');
  else {
    $.post($(this).attr('action'), $(this).serialize(), function(d){
      if (d.status == 200){
        fpay(d.token, {
          onSuccess: function(dt){
            $.post('/payment/process', `oid=${dt.data.order_id}&paym=${dt.data.paym}`, function(dg){
              if(dg.status == 200) Swal.fire('Terima kasih!', `Pembayaran anda berhasil, melalui ${dt.data.paym}.`, 'success');
              else Swal.fire('Error!', dg.msg, 'error');
            });
          },
          onPending: function(dt){
            Swal.fire('Info!', dt.msg, 'info');
          },
          onError: function(dt){
            Swal.fire('Opss!', dt.msg, 'error');
          },
          onClose: function(){
            Swal.fire('Warn!', `Popup payment di tutup!`, 'warning')
          }
        })
      }
    });
  }
});

$('#noml').change(function(){
  if(this.value == 'custom') $('#nmcst').show()
  else $('#nmcst').hide()
})

function togglePlayMusic() {
  if (audioIsPlaying) {
    $("#buttonIconVolumeMusic").addClass("fa-volume-down");
    $("#buttonIconVolumeMusic").removeClass("fa-volume-up");
    audioIsPlaying = false;
    musicAudio.pause();
  } else {
    $("#buttonIconVolumeMusic").addClass("fa-volume-up");
    $("#buttonIconVolumeMusic").removeClass("fa-volume-down");
    audioIsPlaying = true;
    musicAudio.play();
  }
}

$("iframe").attr("width", "100%");
$("iframe").attr("height", "250px");

function requestFullScreen() {
  const elm = document.documentElement;
  if (elm.requestFullscreen) {
    elm.requestFullscreen();
  } else if (elm.mozRequestFullScreen) {
    elm.mozRequestFullScreen();
  } else if (elm.webkitRequestFullScreen) {
    elm.webkitRequestFullScreen();
  }
}

$("#buttonBukaUndangan").on("click", function () {
  requestFullScreen();
  $(".wrapper .main-container-page-1").hide();
  $(".wrapper .tabbar").css("display", "flex");
  $(".wrapper #buttonIconVolumeMusic").show();
  $(".wrapper .main-container-page-2").css("display", "flex");
});

let currentPage = 1;
let goChangePage = false;
function changePage(id) {
  currentPage = parseInt(id);
  $(".wrapper .main-container").hide();
  $(`.wrapper .main-container-page-${id}`).show();
  $(".wrapper .tabbar .item").css("opacity", 0.5);
  $(`.wrapper .tabbar .item-page-${id}`).css("opacity", 1);

  if (id === 2) {
    $(".wrapper .frame-preview").hide();
  } else {
    $(".wrapper .frame-preview").show();
  }

  let leftValue = 0;
  switch (id) {
    case 4:
      leftValue = 50;
      break;
    case 5:
      leftValue = 100;
      break;
    case 11:
      leftValue = 100;
      break;
    case 8:
      leftValue = 210;
      break;
    case 9:
      leftValue = 290;
      break;
    case 10:
      leftValue = 370;
      break;
    case 6:
      leftValue = 450;
      break;
    case 7:
      leftValue = 530;
      break;
  }
  $(".wrapper .tabbar").animate(
    {
      scrollLeft: leftValue,
    },
    500
  );
  if (goChangePage) {
    setTimeout(() => {
      goChangePage = false;
    }, 500);
  }
}

const getFullYear = new Date().getFullYear();
$("#wrapperCountdown").countdown({
  date: `${fdat.tgl}T${fdat.time}:00`,
  render: function (data) {
    var el = $(this.el);
    el.empty()
      .append("<span>" + this.leadingZeros(data.days, 2) + "<small>Hari</small></span>")
      .append("<span>" + this.leadingZeros(data.hours, 2) + "<small>Jam</small></span>")
      .append("<span>" + this.leadingZeros(data.min, 2) + "<small>Menit</small></span>")
      .append("<span>" + this.leadingZeros(data.sec, 2) + "<small>Detik</small></span>");
  },
});

//loading screen
$(window).ready(function () {
  $(".loading-animation-screen").fadeOut("slow");
});

$("i.icon-search-navbar").on("click", function () {
  $("div.search-form").slideDown("fast");
  $("div.search-form input").focus();
});

$("div.search-form i").on("click", function () {
  $("div.search-form").slideUp("fast");
});

lightbox.option({
  disableScrolling: true,
  alwaysShowNavOnTouchDevices: true,
  albumLabel: "Foto %1 dari %2",
});

new WOW().init();

const mydmn = ['wedku.live', 'l.wed.my.id','wed.my.id', 'w.jagocode.my.id', 'wed.jagocode.my.id'];

// if (true) {
if (!mydmn.includes(location.host)){
  location.href = 'https://www.jagocode.my.id'
}