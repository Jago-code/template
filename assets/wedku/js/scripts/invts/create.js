
$(function () {
  'use strict';

  var bsStepper = document.querySelectorAll('.bs-stepper'),
    modernWizard = document.querySelector('.modern-wizard-invits');
    
  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener('show.bs-stepper', function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find('.step').length - 1;
        var line = $(event.target).find('.step');

        for (var i = 0; i < index; i++) {
          line[i].classList.add('crossed');

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove('crossed');
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove('crossed');
          }
          line[0].classList.remove('crossed');
        }
      });
    }
  }
  
  if (typeof modernWizard !== undefined && modernWizard !== null) {
    // linier
    var modernStepper = new Stepper(modernWizard, { linear: true });
    var mform = $(modernWizard).find('form');
    
    mform.each(function () {
      $(this).validate({
        rules: {
          lnama: { required: true },
          lnama_ayah: { required: true },
          lnama_ibu: { required: true },
          luserig: { required: true },
          pnama: { required: true },
          pnama_ayah: { required: true },
          pnama_ibu: { required: true },
          puserig: { required: true },
          atempat: { required: true },
          atgl: { required: true },
          atm1: { required: true },
          atm2: { required: true },
          aalmt: { required: true },
          rtempat: { required: true },
          rtgl: { required: true },
          rtm1: { required: true },
          rtm2: { required: true },
          ralmt: { required: true },
          tema: { required: true },
          paket: { required: true },
          slug: { required: true, minlength: 3 },
        }
      });
    });
      
    $(modernWizard)
      .find('.btn-next').each(function () {
        $(this).on('click', function (e) {
          var isValid = $(this).parent().siblings('form').valid();
          if (isValid) {
            modernStepper.next();
          } else {
            e.preventDefault();
          }
        });
      });
    $(modernWizard)
      .find('.btn-prev')
      .on('click', function () {
        modernStepper.previous();
      });

    $(modernWizard)
      .find('.btn-submit')
      .on('click', function () {
        var isValid = $(this).parent().siblings('form').valid(), mdat = '';
        if (isValid) {
          $(modernWizard).find('form').each(function () {
            mdat += '&' + $(this).serialize();
          });

          $('.modern-wizard-invits').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
          $.post('/a/order/invitation', mdat.substring(1), function(d){
            console.log(d)
            $('.modern-wizard-invits').unblock()
            if (d.status == 200) Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 }).then(() => window.location.href = '/');
            else Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
          });
        }
      });
  }

  $("#sakc").change(function() {
    if ($(this).prop('checked')) $('#takd').show();
    else $('#takd').hide();
  });
  $("#srsc").change(function() {
    if ($(this).prop('checked')) $('#trsp').show();
    else $('#trsp').hide();
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
      if (d.status == 200) $('#exSlug').html(`<i class="text-success">w.jagocode.my.id/${d.slug}</i>`);
      else $('#exSlug').html(`<i class="text-danger">w.jagocode.my.id/${d.slug}</i>`);
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
function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}
  
function loadt(p) {
    $('#ltmp').html('');
    var mtyp = param('type') ? param('type') : 'Free';
    var prm = p ? p : 'default';
    $.blockUI({ message: '<div class="spinner-grow  text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 }});
    $.get(`/api/template?category=${prm}&type=${mtyp}`, function(d) {
        $.unblockUI();
        d.data.forEach(df => {
          var typ = mtyp == 'Free' ? df.type != 'Free' ? 'disabled' : '' : '';
            $('#ltmp').append(`<div class="col-lg-3 col-md-4 col-6">
            <input class="custom-option-item-check" type="radio" name="tema" value="${df.id}" id="mtem-${df.id}" ${typ}/>
            <label class="card custom-option-item" style="align-items: center;" for="mtem-${df.id}">
              <a href="/demo/tema/${df.id}" target="_blank" class="btn btn-sm btn-primary" style="position: absolute; top: 0px; width: 80%;">${feather.icons['eye'].toSvg()}&nbsp; Preview</a>
              <img class="card-img-top mt-1" src="${df.thumb}" alt="${df.name}" />
              <div class="card-body"><h6>${df.name}</h6></div>
            </label>
          </div>`);
        });
    })
  }
  
loadt()