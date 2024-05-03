
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
          man_name: { required: true },
          man_father: { required: true },
          man_mother: { required: true },
          man_instagram: { required: true },
          woman_name: { required: true },
          woman_father: { required: true },
          woman_mother: { required: true },
          woman_instagram: { required: true },
          akad_place: { required: true },
          akad_date: { required: true },
          akad_start_time: { required: true },
          akad_end_time: { required: true },
          akad_address: { required: true },
          reception_place: { required: true },
          reception_date: { required: true },
          reception_start_time: { required: true },
          reception_end_time: { required: true },
          reception_address: { required: true },
          themes: { required: true },
          subcribtion: { required: true },
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
        var isValid = $(this).parent().siblings('form').valid(), requestData = '';
        if (isValid) {
          $(modernWizard).find('form').each(function () {
            requestData += '&' + $(this).serialize();
          });

          $('.modern-wizard-invits').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
          $.ajax({
            url: '/a/order/invitation',
            type: "POST",
            data: requestData.substring(1),
            success: function (d) {
              $('.modern-wizard-invits').unblock()
              Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            },
            error: function (e) {
              $('.modern-wizard-invits').unblock()
              const msg = e.responseJSON.msg;
              Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
            },
          });
        }
      });
  }

  $("#akad_display").change(function() {
    if ($(this).prop('checked')) $('#form-akad').show();
    else $('#form-akad').hide();
  });
  
  $("#reception_display").change(function() {
    if ($(this).prop('checked')) $('#form-reception').show();
    else $('#form-reception').hide();
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
        $('.btn-submit').prop('disabled', false);
        $('#linkResult').html(`<i class="text-success">${d.link}</i>`);
      } else {
        $('.btn-submit').prop('disabled', true);
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
  
  let isThemesLoaded = false;
  $('#btnLoadTheme').on('click', function () {
    if (!isThemesLoaded) {
      isThemesLoaded = true;
      loadThemesFromServer();
    }
  });
});

function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}

let currentPage = 1;
let itemsPerPage = 8;
let dataThemes = [];
let currentCategory = 'all';
let baseUrlTheme, totalPages;

function loadThemesFromServer () {
  $('.bs-stepper-content').block({ message: '<div class="spinner-grow  text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 }});
  $.get('/api/themes', function (d) {
    $('.bs-stepper-content').unblock();
    dataThemes = d.data;
    baseUrlTheme = d.base_url;
    displayThemes();
  })
}

function displayThemes (category = 'all', page = 1) {
  if (currentCategory !== category) {
    currentPage = 1;
    currentCategory = category;
  }
  
  let subcribtion = param('type') ? param('type') : 'Free';
  let filteredData = category === 'all' ? dataThemes : dataThemes.filter(q => q.category === category);
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let resultData = filteredData.slice(startIndex, endIndex);
  
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  var startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
  var endPage = startPage + 4 < totalPages ? startPage + 4 : totalPages;
  
  let paginationHtml = '<li class="page-item prev prev-theme"><a class="page-link" href="javascript:void(0);"><i class="ti ti-chevron-left ti-xs"></i></a></li>';
  for (var i = startPage; i <= endPage; i++) {
  // for (var i = 1; i <= totalPages; i++) {
    paginationHtml += `<li class="page-item ${page === i ? 'active' : ''} item-theme" data-category="${category}" data-page="${i}"><a class="page-link" href="javascript:void(0);">${i}</a></li>`
  }
  paginationHtml += '<li class="page-item next next-theme"><a class="page-link" href="javascript:void(0);"><i class="ti ti-chevron-right ti-xs"></i></a></li>';
  $('.pagination-themes').html(paginationHtml);
  $('#listThemes').html('');
  
  resultData.forEach((theme) => {
    var typ = subcribtion == 'Free' ? theme.type != 'Free' ? 'disabled' : '' : '';
      $('#listThemes').append(`<div class="col-lg-3 col-md-4 col-6">
      <div class="custom-options-checkable">
        <input class="custom-option-item-check" type="radio" name="themes" value="${theme.id}" id="mtem-${theme.id}" ${typ}/>
        <label class="card custom-option-item" style="align-items: center;" for="mtem-${theme.id}">
          <a href="${baseUrlTheme + theme.slug}" target="_blank" class="btn btn-sm btn-primary" style="position: absolute; top: 0px; width: 80%;">${feather.icons['eye'].toSvg()}&nbsp; Preview</a>
          <img class="card-img-top mt-1" src="${theme.thumb}" alt="${theme.name}" />
          <div class="card-header"><h6>${theme.name}</h6><span class="badge badge-sm rounded-pill badge-light-${theme.type == 'Free' ? 'success' : 'warning'} me-1">${theme.type == 'Free' ? 'Gratis' : 'Berbayar'}</span></div>
        </label>
      </div
    </div>`);
  });
}

$(document).on('click', '.prev-theme', function () {
  currentPage = currentPage === 1 ? 1 : --currentPage;
  displayThemes(currentCategory, currentPage);
  $('html, body').scrollTop($('.bs-stepper-content').offset().top)
})

$(document).on('click', '.next-theme', function () {
  if (currentPage < totalPages) {
    currentPage = currentPage + 1;
    displayThemes(currentCategory, currentPage);
    $('html, body').scrollTop($('.bs-stepper-content').offset().top)
  }
})

$(document).on('click', '.item-theme', function() {
  currentPage = $(this).data('page');
  displayThemes($(this).data('category'), currentPage);
  $('html, body').scrollTop($('.bs-stepper-content').offset().top)
});