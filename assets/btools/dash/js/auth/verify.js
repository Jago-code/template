"use strict";
var fv,
  n = document.querySelector("#twoStepsForm"),
  itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

function param(name) {
  return (location.search.split(name + '=')[1] || '').split('&')[0];
}

document.addEventListener("DOMContentLoaded", function (e) {
  {
     for (let t of document.querySelector(".numeral-mask-wrapper").children)
        t.onkeyup = function (e) {
           t.nextElementSibling && this.value.length === parseInt(this.attributes.maxlength.value) && t.nextElementSibling.focus(), t.previousElementSibling && ((8 !== e.keyCode && 46 !== e.keyCode) || t.previousElementSibling.focus());
        };
    
     if (n) {
        FormValidation.formValidation(n, {
           fields: { otp: { validators: { notEmpty: { message: "Please enter otp" } } } },
           plugins: {
              trigger: new FormValidation.plugins.Trigger(),
              bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "", rowSelector: ".mb-3" }),
              submitButton: new FormValidation.plugins.SubmitButton(),
              // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
              autoFocus: new FormValidation.plugins.AutoFocus(),
           },
        }).on('core.form.valid', function () {
          const mf = $('#twoStepsForm');
          mf.block({ message: itemLoader, css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
          $.ajax({
            data: mf.serialize(),
            url: mf.attr('action') + '?type=' + param('type'),
            type: "POST",
            success: function (d) {
              mf.unblock();
              Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
                .then(() => {
                  if (param('type') == 'verifyPassword') location.href = '/auth/reset-password?token=' + d.token
                  else location.href = '/a/dash'
                })
            },
            error: function (e) {
              mf.unblock();
              const msg = e.responseJSON.msg;
              Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
            },
          });
        });

        const i = n.querySelectorAll(".numeral-mask"),
           t = function () {
              let t = !0,
                 o = "";
              i.forEach((e) => {
                 "" === e.value && ((t = !1), (n.querySelector('[name="otp"]').value = "")), (o += e.value);
              }),
                 t && (n.querySelector('[name="otp"]').value = o);
           };
        i.forEach((e) => {
           e.addEventListener("keyup", t);
        });
     }
     return;
  }
});

function resend(){
  $.blockUI({ message: itemLoader, css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: `email=${$('#myEmail').val()}`,
    url: '/api/auth/resend',
    type: "POST",
    success: function (d) {
      $.unblockUI();
      countdown(1);
      Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function (e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
}

var timeoutHandle;
function countdown(minutes, seconds) {
    var seconds = 60;
    var mins = minutes

    function tick() {
      var counter = document.getElementById("mtm");
      var current_minutes = mins - 1
      seconds--;
      counter.innerHTML = "<b>" + current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds) + "</b>";
      if (seconds > 0) {
        timeoutHandle = setTimeout(tick, 1000);
      } else {

        if (mins > 1) {

          // countdown(mins-1);   never reach “00″ issue solved:Contributed by Victor Streithorst
          setTimeout(function() {
            countdown(mins - 1);
          }, 1000);

        }else $('#mtm').html('<a href="javascript:resend();">Resending</a>')
      }
    }
    tick();
  }

countdown(1);