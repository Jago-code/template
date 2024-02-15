"use strict";
const itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

$(".select2").each(function () {
  var e = $(this);
  e.wrap('<div class="position-relative"></div>').select2({ placeholder: "Choose a one..", dropdownParent: e.parent() });
});

document.addEventListener("DOMContentLoaded", function (e) {
  let s = document.getElementById("uploadedAvatar");
  const t = document.querySelector("#formCPass"),
    n = document.querySelector("#fromCProfil"),
    f = document.querySelector("#hakun"),
    i = document.querySelector(".dlct"),
    l = document.querySelector(".account-file-input"),
    c = document.querySelector(".account-image-reset");

  if (s) {
    const e = s.src;
    l.onchange = () => {
      l.files[0] && (s.src = window.URL.createObjectURL(l.files[0]));
      if (l.files[0].name != undefined || l.files[0].name != '') {
        $.blockUI({ message: itemLoader, css: { backgroundColor: "transparent", border: "0" }, overlayCSS: { backgroundColor: "#fff", opacity: 0.8 } });
        uploadFile(l.files[0].name, l.files[0])
          .then(my_pic => {
            $.unblockUI();
            $('#mypic').val(my_pic);
          });
      }
    }
    c.onclick = () => {
      l.value = "";
      s.src = e;
    }
  }

  FormValidation.formValidation(n, {
    fields: {
      username: { validators: { notEmpty: { message: "Please input username!" }, stringLength: { min: 6, message: "Username must be longer than 6 characters!" } } }
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "mb-2" }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (e) => {
      e.on("plugins.message.placed", function (e) {
        e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
      });
    },
  }).on("core.form.valid", function () {
    const mf = $("#fromCProfil");
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

  FormValidation.formValidation(f, {
    fields: { check: { validators: { notEmpty: { message: "Harap konfirmasi bahwa Anda ingin menghapus akun" } } } },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "" }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      fieldStatus: new FormValidation.plugins.FieldStatus({
        onStatusChanged: function (e) {
          e ? i.removeAttribute("disabled") : i.setAttribute("disabled", "disabled");
        },
      }),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (e) => {
      e.on("plugins.message.placed", function (e) {
        e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
      });
    },
  });

  i.onclick = function () {
    const s = document.querySelector("#hpk");
    1 == s.checked &&
      Swal.fire({
        text: "Are you sure you want to deactivate your account?",
        icon: "warning",
        showCancelButton: !0,
        confirmButtonText: "Yes",
        customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" },
        buttonsStyling: !1,
      }).then(function (e) {
        if (e.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: "transparent", border: "0" }, overlayCSS: { backgroundColor: "#fff", opacity: 0.8 } });
          $.post("/a/user/delete_account", function (d) {
            $.unblockUI();
            if (d.status == 200) {
              Swal.fire({ icon: "success", title: "Deleted!", text: "Your account has been deleted.", customClass: { confirmButton: "btn btn-success" } });
              window.location.href = "/auth/login";
            }
          });
        } else {
          e.dismiss === Swal.DismissReason.cancel && Swal.fire({ title: "Cancelled", text: "Action canceled!", icon: "error", customClass: { confirmButton: "btn btn-success" } });
        }
      });
  };
});
