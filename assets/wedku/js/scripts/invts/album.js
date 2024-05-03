var from = $('#addGaleryValidation');

$('#metodeUpload').change(function() {
  if(this.value == 'url'){
    $('#formUrl').show()
    $('#fromDevice').hide()
  }else{
    $('#formUrl').hide()
    $('#fromDevice').show()
  }
})

if (from.length) {
    from.validate({
      onkeyup: function (element) {
        $(element).valid();
      },
      rules: {
        'metodeUpload': { required: true},
        'file': { required: true},
        'url': { required: true},
        'desc': { required: true}
      }
    });
}
  
$(from).submit(function(e) {
    e.preventDefault();
    if (!from.valid()) return false
    $(from).block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      data: new FormData(this),
      contentType: false,
      processData: false,
      success: function (d) {
        $(from).unblock();
        $('#addGalery').modal('hide');
        loadAlbums();
        from[0].reset();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        $(from).unblock()
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
});

function loadAlbums() {
  $('.table-borderless').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.get('?type=json', function(d) {
    $('.table-borderless').unblock();
    $('#listAlbums').html('');
    if (d.data?.length === 0) {
      $('#listAlbums').append(`<tr>
          <td colspan="4">Nampaknya, Anda belum punya album..</td>
        </tr>`)
    } else {
      d.data.forEach((album) => {
        $('#listAlbums').append(`<tr>
            <td>${album.type}</td>
            <td>${album.desc}</td>
            <td>${new Date(album.created_at).toLocaleDateString()}</td>
            <td>
              <a href="${album.url}" target="_blank" class="btn btn-icon btn-icon rounded-circle btn-info">${feather.icons['eye'].toSvg()}</a>
              <button type="button" data-id="${album.id}" class="btn btn-icon btn-icon rounded-circle btn-danger btn-delete">${feather.icons['trash'].toSvg()}</button>
            </td>
        </tr>`)
      })
    }
  });
}
loadAlbums();

$(document).on('click', '.btn-delete', function () {
    let idAlbum = $(this).data('id');
    Swal.fire({ text: 'Apakah Anda yakin ingin menghapus album ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
      .then(function (result) {
          if (result.value) {
            deleteAlbum(idAlbum);
          }
      });
  });
  
function deleteAlbum(itemId) {
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    url: '/a/i/album?id=' + itemId, 
    type: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(d) {
      loadAlbums();
      $.unblockUI();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function(e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'Terjadi kesalahan!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    }
  });
}