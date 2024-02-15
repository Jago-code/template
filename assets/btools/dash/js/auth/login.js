"use strict";

var formAuthentication = document.querySelector("#formAuthentication"),
  itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>',
  myToken;
  
function getCaptcha() {
  grecaptcha.ready(function() {
    grecaptcha.execute('6Ld0lDciAAAAAISScycKw-_qevx2UrHjXCuBF1dR').then(_token => {
      $('#ftokn').val(_token)
      myToken = _token;
      $('#btSub').prop('disabled', false)
    })
  });
}
getCaptcha();

document.addEventListener("DOMContentLoaded", function (e) {
  const fv = FormValidation.formValidation(formAuthentication, {
    fields: {
      usnoem: { validators: { notEmpty: { message: "Please enter email or username" }, stringLength: { min: 6, message: "Email or Username must be longer than 6 characters" } } },
      password: { validators: { notEmpty: { message: "Please enter your password" }, stringLength: { min: 6, message: "Password must be more than 6 characters" } } },
      terms: { validators: { notEmpty: { message: "Please agree to the terms & conditions" } } },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger,
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: "",
        rowSelector: function(e, t) {
          return ".mb-3"
        }
      }),
      submitButton: new FormValidation.plugins.SubmitButton,
      autoFocus: new FormValidation.plugins.AutoFocus
    }
  });

  fv.on('core.form.valid', function () {
    getCaptcha();
    const mf = $('#formAuthentication');
    mf.block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: mf.serialize(),
      url: mf.attr('action'),
      type: "POST",
      success: function (d) {
        mf.unblock();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        .then(() => {
          if (d.type == 'verify') {
            window.location.href = '/auth/verify?type=verifyUser&uid=' + d.uid;
          }else{
            if (param('next'))  window.location.href = param('next')
            else window.location.href = '/a/dash'
          }
        });
      },
      error: function (e) {
        mf.unblock();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});

function param(name) {
  return (location.search.split(name + '=')[1] || '').split('&')[0];
}

function famLog(res){
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  getCaptcha();
  $.ajax({
    data: `google_credential=${res.credential}&_token=${myToken}`,
    url: '/auth/google_login',
    type: "POST",
    success: function (d) {
      $.unblockUI();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      .then(d => {
        if(param('next'))  window.location.href = param('next')
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