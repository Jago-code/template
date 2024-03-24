
$(function () {
  'use strict';
  var flog = $('.auth-login-form');
  
  function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
  }

  // jQuery Validation
  // --------------------------------------------------------------------
  if (flog.length) {
    flog.validate({
      // * ? To enable validation onkeyup
      onkeyup: function (element) {
        $(element).valid();
      },
      /*
      * ? To enable validation on focusout
      onfocusout: function (element) {
        $(element).valid();
      }, */
      rules: {
        'emno': { required: true },
        'password': { required: true},
      }
    });
  }
  
  flog.submit(function(e) {
    e.preventDefault();
    if(!flog.valid()) return false
    flog.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: $(this).serialize(),
      url: $(this).attr("action"),
      type: "POST",
      success: function (d) {
        flog.unblock();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        .then(d => {
          if(param('next'))  window.location.href = '/' + decodeURIComponent(param('next'));
          else window.location.href = '/a/dash'
        });
      },
      error: function (e) {
        flog.unblock();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});

$.ajaxSetup({
   headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
   }
});

window.loginGoogle = (res) => {
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 }});
  $.ajax({
    data: `credential=${res.credential}`,
    url: '/auth/google_login',
    type: "POST",
    success: function (d) {
      $.unblockUI();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      .then(d => {
        if(param('next'))  window.location.href = '/' + decodeURIComponent(param('next'));
        else window.location.href = '/a/dash'
      });
    },
    error: function (e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
}