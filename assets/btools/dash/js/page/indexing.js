const itemLoader = `<div class="d-flex justify-content-center"><div class="sk-grid sk-primary"><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div></div><div>`

$('#formIndexingGoogle').submit(function(e){
  e.preventDefault();
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr("action"),
    type: "POST",
    success: function (d) {
      $.unblockUI()
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    },
    error: function (e) {
      $.unblockUI()
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$('#formIndexingBing').submit(function(e){
  e.preventDefault();
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr("action"),
    type: "POST",
    success: function (d) {
      $.unblockUI()
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    },
    error: function (e) {
      $.unblockUI()
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$('#formIndexingYandex').submit(function(e){
  e.preventDefault();
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr("action"),
    type: "POST",
    success: function (d) {
      $.unblockUI()
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    },
    error: function (e) {
      $.unblockUI()
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$('#btnLoginMicrosoft').click(function(){
  window.location.href = '/oauth/microsoft_grant_access';
});
$('#btnLoginGoogle').click(function(){
  window.location.href = '/oauth/google_grant_access';
});
$('#btnLoginYandex').click(function(){
  window.location.href = '/oauth/yandex_grant_access';
});

$('#btnLoggedMicrosoft').click(function(){
  Swal.fire({ text: "Are you sure you want to log out of your Microsoft account?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
    .then(function (e) {
      if (e.value) {
        window.location.href = '/oauth/logout/microsoft';
      }
    })
});
$('#btnLoggedGoogle').click(function(){
  Swal.fire({ text: "Are you sure you want to log out of your Google account?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
    .then(function (e) {
      if (e.value) {
        window.location.href = '/oauth/logout/google';
      }
    })
});
$('#btnLoggedYandex').click(function(){
  Swal.fire({ text: "Are you sure you want to log out of your Yandex account?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
    .then(function (e) {
      if (e.value) {
        window.location.href = '/oauth/logout/yandex';
      }
    })
});