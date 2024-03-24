$(function () {
  'use strict';

  $('#fDetail').submit(function(e){
    e.preventDefault();
    $('#fDetail').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });

    $.post($(this).attr('action'),$(this).serialize(), function(d){
      $('#fDetail').unblock()
      if (d.status == 200) Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      else Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    });
  });

  // form repeater jquery
  $('.lovestry').repeater({
    show: function () {
      $(this).slideDown();
      // Feather Icons
      if (feather) {
        feather.replace({ width: 14, height: 14 });
      }
    },
    hide: function (deleteElement) {
      if (confirm('Are you sure you want to delete this element?')) {
        $(this).slideUp(deleteElement);
      }
    }
  });
  
  $('.siaranf').repeater({
    show: function () {
      $(this).slideDown();
      if (feather) {
        feather.replace({ width: 14, height: 14 });
      }
    },
    hide: function (deleteElement) {
      if (confirm('Are you sure you want to delete this element?')) {
        $(this).slideUp(deleteElement);
      }
    }
  });

  var tpg;
  $('#dmn').on('input', function(){
    clearTimeout(tpg);
    if (this.value.length > 2){
      $('#ldslg').html('<div class="spinner-border spinner-border-sm"></div>');
      tpg = setTimeout(cekSlug(this.value), 5000);
    }
    $('#exSlug').html('');
  });

  function cekSlug(vl) {
    $.get(`/api/cekDomain?slug=${vl}`, function(d){
      if (d.status == 200) $('#exSlug').html(`<i class="text-success">${location.host}/${d.slug}</i>`);
      else $('#exSlug').html(`<i class="text-danger">${location.host}/${d.slug}</i>`);
      $('#ldslg').html('');
    })
  }

  if ($('#ppq-img')) {
    var resetImage = $('#ppq-img').attr('src');
    $('#ppq').on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if ($('#ppq-img')) {
          $('#ppq-img').attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
      if(files[0].name != undefined || files[0].name != ''){
        uploadFile(files[0].name, files[0])
          .then(dur => $('#plur').val(dur));
      }
    });

    $('#ppq-reset').on('click', function () {
      $('#ppq-img').attr('src', resetImage);
    });
  }
  if ($('#pwq-img')) {
    var resetImage = $('#pwq-img').attr('src');
    $('#pwq').on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if ($('#pwq-img')) {
          $('#pwq-img').attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
      if(files[0].name != undefined || files[0].name != ''){
        uploadFile(files[0].name, files[0])
          .then(dur => $('#ppur').val(dur));
      }
    });

    $('#pwq-reset').on('click', function () {
      $('#pwq-img').attr('src', resetImage);
    });
  }
});
