var inputContainer = document.querySelector('.auth-input-wrapper');

// Get focus on next element after max-length reach
inputContainer.onkeyup = function (e) {
  var target = e.srcElement;
  var maxLength = parseInt(target.attributes['maxlength'].value, 10);
  var currentLength = target.value.length;

  if (e.keyCode === 8) {
    if (currentLength === 0) {
      var next = target;
      while ((next = next.previousElementSibling)) {
        if (next == null) break;
        if (next.tagName.toLowerCase() == 'input') {
          next.focus();
          break;
        }
      }
    }
  } else {
    if (currentLength >= maxLength) {
      var next = target;
      while ((next = next.nextElementSibling)) {
        if (next == null) break;
        if (next.tagName.toLowerCase() == 'input') {
          next.focus();
          break;
        }
      }
    }
  }
};

//  Two Steps Verification
var numeralMask = document.querySelectorAll('.numeral-mask'),
  fv = $('.fverify');

// Verification masking
if (numeralMask.length) {
  numeralMask.forEach(e => {
    new Cleave(e, {
      numeral: true
    });
  });
}

fv.validate({
      onkeyup: function (element) {
        $(element).valid();
      },
      rules: { 'otj': { required: true } }
});

$.ajaxSetup({ headers: { 'X-CSRF-Token': $('#ftoken').val() }});

fv.submit(function(e) {
    e.preventDefault();
    if(!$(this).valid()) return false
    fv.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    var otp = '';
    numeralMask.forEach(f => otp += f.value);
    $.post($(this).attr("action"), `otp=${otp}&number=${$('#nmbrk').val()}`, function(d){
      if(d.status == 200){
        fv.unblock()
        Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 }).then(() => window.location.href = '/a/dash');
      }else{
        fv.unblock()
        Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      }
    });
});
  
function resend(){
  $.post('/auth/resend', `number=${$('#nmbrk').val()}`, function(d){
    if(d.status == 403) Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    else countdown(1);
    // else Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
  })
}

var timeoutHandle;

function countdown(minutes, seconds) {
    var seconds = 60;
    var mins = minutes

    function tick() {
      var counter = document.getElementById("mtm");
      var current_minutes = mins - 1
      seconds--;
      counter.innerHTML = " " + current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
      if (seconds > 0) {
        timeoutHandle = setTimeout(tick, 1000);
      } else {
        if (mins > 1) {
          // countdown(mins-1);   never reach “00″ issue solved:Contributed by Victor Streithorst
          setTimeout(function() {
            countdown(mins - 1);
          }, 1000);
        }else $('#mtm').html('<a href="javascript:resend();"><span> Kirim Ulang</span></a>')
      }
    }
    tick();
  }

countdown(1);