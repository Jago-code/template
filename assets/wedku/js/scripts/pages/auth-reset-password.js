$(function () {
  'use strict';

  var frsp = $('.auth-reset-password-form');

  // jQuery Validation
  // --------------------------------------------------------------------
  if (frsp.length) {
    frsp.validate({
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
        'password-new': {
          required: true
        },
        'password-confirm': {
          required: true,
          equalTo: '#password-new'
        }
      }
    });
  }
  frsp.submit(function(e) {
    e.preventDefault();
    if(!frsp.valid()) return false
    frsp.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.post($(this).attr("action"), $(this).serialize(), function(d){
      if(d.status == 403){
        frsp.unblock();
        Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      }else{
        frsp.unblock();
        Swal.fire({ title: "Success!", text: "Successfully reset password.", icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        .then(d => window.location.href = '/auth/login');
      }
    });
  });
});
