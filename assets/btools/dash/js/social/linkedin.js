"use strict";
const itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

document.addEventListener("DOMContentLoaded", function (e) {
  const fv = FormValidation.formValidation(document.querySelector("#formPost"), {
    fields: {
        title: { validators: { notEmpty: { message: "Please enter a Title!" } } },
        url: { validators: { notEmpty: { message: "Please enter a Url!" } } },
        desc: { validators: { notEmpty: { message: "Please enter a Description!" } } },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "", rowSelector: ".col-12" }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (e) => {
      e.on("plugins.message.placed", function (e) {
        e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
      });
    },
  });

  fv.on('core.form.valid', function () {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.ajax({
      data: $('#formPost').serialize(),
      url: $('#formPost').attr('action'),
      type: "POST",
      success: function (d) {
        $.unblockUI()
        Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
        $('#formPost').trigger('reset');
      },
      error: function (e) {
        $.unblockUI()
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});

$('#formSetting').submit(function(e) {
  e.preventDefault();
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr("action"),
    type: "POST",
    success: function (d) {
      $.unblockUI()
      $('#mSetting').modal('hide');
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function (e) {
      $.unblockUI()
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$('#btnLogin').click(function(){
	  window.location.href = '/oauth/linkedin_grant_access';
	});
	
	$('#btnLogged').click(function(){
	  Swal.fire({ text: "Are you sure you want to log out of your linkedin account?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(function (e) {
        if (e.value) {
          window.location.href = '/oauth/logout/linkedin';
        }
      })
	});