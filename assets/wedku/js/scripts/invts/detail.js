$(function () {
  'use strict';
  
  // event handlerr
  $("#akad_display").change(function() {
    if ($(this).prop('checked')) $('#form-akad').show();
    else $('#form-akad').hide();
  });
  
  $("#reception_display").change(function() {
    if ($(this).prop('checked')) $('#form-reception').show();
    else $('#form-reception').hide();
  });
  
  $("#display_broadcast").change(function() {
    if ($(this).prop('checked')) $('.broadcast').show();
    else $('.broadcast').hide();
  });
  
  $("#display_story").change(function() {
    if ($(this).prop('checked')) $('.loveStory').show();
    else $('.loveStory').hide();
  });

  $('#form-update').submit(function(e){
    e.preventDefault();
    $('#form-update').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      success: function (d) {
        $('#form-update').unblock()
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        $('#form-update').unblock()
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'Terjadi kesalahan!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
  
  // form repeater jquery
  $('.loveStory').repeater({
    show: function () {
      $(this).slideDown();
      // Feather Icons
      if (feather) {
        feather.replace({ width: 14, height: 14 });
      }
    },
    hide: function (deleteElement) {
      if (confirm('Apakah Anda yakin ingin menghapus elemen ini?')) {
        $(this).slideUp(deleteElement);
      }
    }
  });
  
  $('.broadcast').repeater({
    show: function () {
      $(this).slideDown();
      if (feather) {
        feather.replace({ width: 14, height: 14 });
      }
    },
    hide: function (deleteElement) {
      if (confirm('Apakah Anda yakin ingin menghapus elemen ini?')) {
        $(this).slideUp(deleteElement);
      }
    }
  });

  let timeoutCheck;
  $('#linkInvitation').on('input', function(){
    clearTimeout(timeoutCheck);
    let slug = this.value;
    if (slug.length > 2){
      $('#loadingCheck').html('<div class="spinner-border spinner-border-sm"></div>');
      timeoutCheck = setTimeout(function() {
          checkLinkInvitation(slug);
      }, 1000);
    }
    $('#linkResult').html('');
  });

  function checkLinkInvitation (slug) {
    $.get(`/api/checkLinkInvitation?slug=${slug}`, function(d){
      if (d.status === 200) {
        $('.btn-save').prop('disabled', false);
        $('#linkResult').html(`<i class="text-success">${d.link}</i>`);
      } else {
        $('.btn-save').prop('disabled', true);
        $('#linkResult').html(`<i class="text-danger">${d.link}</i>`);
      }
      $('#loadingCheck').html('');
    })
  }

  if ($('#displayAvatarMale')) {
    var resetImage = $('#displayAvatarMale').attr('src');
    $('#uploadAvatarMale').on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if ($('#displayAvatarMale')) {
          $('#displayAvatarMale').attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
      if(files[0].name != undefined || files[0].name != ''){
        uploadFile(files[0].name, files[0])
          .then(dur => $('#man_avatar').val(dur));
      }
    });

    $('#btnResetAvatarMale').on('click', function () {
      $('#displayAvatarMale').attr('src', resetImage);
    });
  }
  
  if ($('#displayAvatarFemale')) {
    var resetImage = $('#displayAvatarFemale').attr('src');
    $('#uploadAvatarFemale').on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if ($('#displayAvatarFemale')) {
          $('#displayAvatarFemale').attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
      if(files[0].name != undefined || files[0].name != ''){
        uploadFile(files[0].name, files[0])
          .then(dur => $('#woman_avatar').val(dur));
      }
    });

    $('#btnResetAvatarFemale').on('click', function () {
      $('#displayAvatarFemale').attr('src', resetImage);
    });
  }
});
