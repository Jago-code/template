const formAuthentication = document.querySelector("#formAuthentication"),
  itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

document.addEventListener("DOMContentLoaded", function (e) {
  const fv = FormValidation.formValidation(formAuthentication, {
    fields: {
      password: { validators: { notEmpty: { message: "Please enter a new password!" }, stringLength: { min: 8, message: "Password must be more than 8 characters" } } },
      cpass: {
        validators: {
          notEmpty: { message: "Please confirm the new password!" },
          identical: {
            compare: function () {
              return t.querySelector('[name="password"]').value;
            },
            message: "Password and confirmation are not the same!",
          },
          stringLength: { min: 8, message: "Password must be longer than 8 characters!" },
        },
      },
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
    const mf = $('#formAuthentication');
    mf.block({ message: itemLoader, css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: mf.serialize(),
      url: mf.attr('action'),
      type: "POST",
      success: function (d) {
        mf.unblock();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
          .then(() => window.location.href = '/auth/login');
      },
      error: function (e) {
        mf.unblock();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});