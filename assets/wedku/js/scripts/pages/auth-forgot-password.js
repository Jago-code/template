$(function () {
  'use strict';

  var form = $('.auth-forgot-password-form');

  // jQuery Validation
  // --------------------------------------------------------------------
  if (form.length) {
    form.validate({
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
        'email': {
          required: true,
          email: true
        }
      }
    });
  }
  form.submit(function(e) {
    e.preventDefault();
    if(!form.valid()) return false
      $.post($(this).attr("action"), $(this).serialize(), function(d){
        if(d.status == 403){
          Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
        }else{
          Swal.fire({ title: "Success!", text: "Successfully sent the password reset link.", icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
          .then(d => window.location.href = '/auth/login');
        }
    });
  });
});
