"use strict";

const itemLoader = `<div class='d-flex justify-content-center'><div class='sk-grid sk-primary'><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div></div><div>`

document.addEventListener("DOMContentLoaded", function (e) {
  const t = document.querySelector("#formCPass");

  const fvp = FormValidation.formValidation(t, {
    fields: {
      crpas: { validators: { notEmpty: { message: "Please enter the current password!" }, stringLength: { min: 8, message: "Password must be more than 8 characters" } } },
      npas: { validators: { notEmpty: { message: "Please enter a new password!" }, stringLength: { min: 8, message: "Password must be more than 8 characters" } } },
      cnpas: {
        validators: {
          notEmpty: { message: "Please confirm the new password!" },
          identical: {
            compare: function () {
              return t.querySelector('[name="npas"]').value;
            },
            message: "Password and confirmation are not the same!",
          },
          stringLength: { min: 8, message: "Password must be longer than 8 characters!" },
        },
      },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "", rowSelector: ".col-md-6" }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (e) => {
      e.on("plugins.message.placed", function (e) {
        e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
      });
    },
  });

  fvp.on("core.form.valid", function () {
    const mf = $("#formCPass");
    mf.block({ message: itemLoader, css: { backgroundColor: "transparent", border: "0" }, overlayCSS: { backgroundColor: "#fff", opacity: 0.8 } });
    $.ajax({
      data: mf.serialize(),
      url: mf.attr("action"),
      type: "POST",
      success: function (d) {
        mf.unblock();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      },
      error: function (e) {
        mf.unblock();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : "There is an error!", icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});
