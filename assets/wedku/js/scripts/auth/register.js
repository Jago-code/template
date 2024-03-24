
$(function () {
  ('use strict');

  var freg = $('.auth-register-form');

  new Cleave($('.nwa'), {
      blocks: [3, 4, 5]
  });
  
  // jQuery Validation
  // --------------------------------------------------------------------
  if (freg.length) {
    freg.validate({
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
        'nama': { required: true },
        'number': { required: true },
        'email': { required: true, email: true },
        'password': { required: true },
        'cbox': { required: true }
      }
    });
  }
  
  freg.submit(function(e) {
    e.preventDefault();
    if(!freg.valid()) return false
    freg.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: $(this).serialize(),
      url: $(this).attr("action"),
      type: "POST",
      success: function (d) {
        freg.unblock();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        .then(d => {
          window.location.href = '/auth/verify'
        });
      },
      error: function (e) {
        freg.unblock();
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
    url: '/auth/google_register',
    type: "POST",
    success: function (d) {
      $.unblockUI();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      .then(d => {
        if(param('next'))  window.location.href = '/' + decodeURIComponent(param('next'));
        else window.location.href = '/auth/login'
      });
    },
    error: function (e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
}