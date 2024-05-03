$(function() {
  let isThemesLoaded = false;
  if (!isThemesLoaded) {
    isThemesLoaded = true;
    loadThemesFromServer();
  }
});

let formTheme = $('.form-theme');
let idInvitation = $('#idInvitation').val();
let currentPage = 1;
let itemsPerPage = 8;
let dataThemes = [];
let currentCategory = 'all';
let baseUrlTheme,
  totalPages,
  selectedTheme;

formTheme.submit(function(e) {
    e.preventDefault();
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      success: function (d) {
        $.unblockUI();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        $.unblockUI();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
});

function loadThemesFromServer () {
  $.blockUI({ message: '<div class="spinner-grow  text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 }});
  $.get('/api/themes?idInvitation=' + idInvitation, function (d) {
    $.unblockUI();
    dataThemes = d.data;
    baseUrlTheme = d.base_url;
    selectedTheme = d.selected;
    displayThemes();
  })
}

function displayThemes (category = 'all', page = 1) {
  if (currentCategory !== category) {
    currentPage = 1;
    currentCategory = category;
  }
  
  let subcribtion = $('#typeTheme').val() ? $('#typeTheme').val(): 'Free';
  let filteredData = category === 'all' ? dataThemes : dataThemes.filter(q => q.category === category);
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let resultData = filteredData.slice(startIndex, endIndex);
  
  totalPages = Math.ceil(filteredData.length / itemsPerPage);
  var startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
  var endPage = startPage + 4 < totalPages ? startPage + 4 : totalPages;
  
  let paginationHtml = '<li class="page-item prev prev-theme"><a class="page-link" href="javascript:void(0);"><i class="ti ti-chevron-left ti-xs"></i></a></li>';
  for (var i = startPage; i <= endPage; i++) {
    paginationHtml += `<li class="page-item ${page === i ? 'active' : ''} item-theme" data-category="${category}" data-page="${i}"><a class="page-link" href="javascript:void(0);">${i}</a></li>`
  }
  paginationHtml += '<li class="page-item next next-theme"><a class="page-link" href="javascript:void(0);"><i class="ti ti-chevron-right ti-xs"></i></a></li>';
  $('.pagination-themes').html(paginationHtml);
  $('#listThemes').html('');
  
  resultData.forEach((theme) => {
    var typeTheme = subcribtion == 'Free' ? theme.type != 'Free' ? 'disabled' : '' : '';
    var select = selectedTheme == theme.id ? 'checked' : '';
    
      $('#listThemes').append(`<div class="col-lg-3 col-md-4 col-6">
      <div class="custom-options-checkable">
        <input class="custom-option-item-check" type="radio" name="themes" value="${theme.id}" id="mtem-${theme.id}" ${typeTheme} ${select}/>
        <label class="card custom-option-item" style="align-items: center;" for="mtem-${theme.id}">
          <a href="${baseUrlTheme + theme.slug}" target="_blank" class="btn btn-sm btn-primary" style="position: absolute; top: 0px; width: 80%;">${feather.icons['eye'].toSvg()}&nbsp; Preview</a>
          <img class="card-img-top mt-1" src="${theme.thumb}" alt="${theme.name}" />
          <div class="card-header"><h6>${theme.name}</h6><span class="badge badge-sm rounded-pill badge-light-${theme.type == 'Free' ? 'success' : 'warning'} me-1">${theme.type == 'Free' ? 'Gratis' : 'Berbayar'}</span></div>
        </label>
      </div
    </div>`);
  });
}

$(document).on('change', 'input[name="themes"]', function() {
  selectedTheme = $('input[name="themes"]:checked').val();
})
        
$(document).on('click', '.prev-theme', function () {
  currentPage = currentPage === 1 ? 1 : --currentPage;
  displayThemes(currentCategory, currentPage);
  $('html, body').scrollTop($('.form-theme').offset().top)
})

$(document).on('click', '.next-theme', function () {
  if (currentPage < totalPages) {
    currentPage = currentPage + 1;
    displayThemes(currentCategory, currentPage);
    $('html, body').scrollTop($('.form-theme').offset().top)
  }
})

$(document).on('click', '.item-theme', function() {
  currentPage = $(this).data('page');
  displayThemes($(this).data('category'), currentPage);
  $('html, body').scrollTop($('.form-theme').offset().top)
});