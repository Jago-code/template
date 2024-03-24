$(function () {
    ('use strict');
  
    // variables
    var form = $('.validate-form');
  
    // jQuery Validation for all forms
    // --------------------------------------------------------------------
    if (form.length) {
        form.validate({
          rules: {
            password: {
              required: true
            },
            'new-password': {
              required: true,
              minlength: 8
            },
            'cnpassword': {
              required: true,
              minlength: 8,
              equalTo: '#npws'
            }
          },
          messages: {
            'new-password': {
              required: 'Enter new password',
              minlength: 'Enter at least 8 characters'
            },
            'cnpassword': {
              required: 'Please confirm new password',
              minlength: 'Enter at least 8 characters',
              equalTo: 'The password and its confirm are not the same'
            }
          }
        });
        form.on('submit', function (e) {
            e.preventDefault();
            if(!form.valid()) return false
            $.post($(this).attr("action"), $(this).serialize(), function(d){
                if(d.status == 200){
                  Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
                }else{
                    Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
                }
            })
        });
    }
    $('.capikey').on('submit', function (e) {
        e.preventDefault();
        if(!$(this).valid()) return false
        $.post($(this).attr("action"), $(this).serialize(), function(d){
            if(d.status == 200){
              Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            }else{
              Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            }
        })
    });
    $('.aip').on('submit', function (e) {
        e.preventDefault();
        if(!$(this).valid()) return false
        $.post($(this).attr("action"), $(this).serialize(), function(d){
            if(d.status == 200){
                Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            }else{
                Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            }
        })
    });
  });