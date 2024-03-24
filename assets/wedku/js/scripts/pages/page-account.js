$(function () {
  ('use strict');

  // variables
  var form = $('.validate-form'),
    deactivateAcc = document.querySelector('#formAccountDeactivation'),
    deactivateButton = deactivateAcc.querySelector('.deactivate-account');

  // jQuery Validation for all forms
  // --------------------------------------------------------------------
  if (form.length) {
    form.each(function () {
      var $this = $(this);

      $this.validate({
        rules: {
          name: { required: true },
          ppic: { required: true },
          acDel: { required: true },
        }
      });
      $this.on('submit', function (e) {
        e.preventDefault();
        $.post($(this).attr("action"), $(this).serialize(), function(d){
          if(d.status == 200){
            Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
          }
        })
      });
    });
  }

  // disabled submit button on checkbox unselect
  if (deactivateAcc) {
    $(document).on('click', '#accountActivation', function () {
      if (accountActivation.checked == true) {
        deactivateButton.removeAttribute('disabled');
      } else {
        deactivateButton.setAttribute('disabled', 'disabled');
      }
    });
  }

  // Deactivate account alert
  const accountActivation = document.querySelector('#accountActivation');

  // Alert With Functional Confirm Button
  if (deactivateButton) {
    deactivateButton.onclick = function () {
      if (accountActivation.checked == true) {
        Swal.fire({ text: 'Apakah Anda yakin ingin menghapus akun Anda?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
        .then(function (result) {
          if (result.value) {
            $.post('/user/d/account', function(d){
              if(d.status == 200){
                Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Akun anda telah di hapus!', customClass: { confirmButton: 'btn btn-success' } })
                .then(() => window.location.href = '/auth/login')
              }
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({ title: 'Cancelled', text: 'Penghapusan Diabatalkan!', icon: 'error', customClass: { confirmButton: 'btn btn-success' } });
          }
        });
      }
    };
  }
});
