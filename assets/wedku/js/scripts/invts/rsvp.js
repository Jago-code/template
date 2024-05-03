function loadRsvps() {
  $('.table-borderless').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.get('?type=json', function(d) {
    $('.table-borderless').unblock();
    $('#listRsvps').html('');
    if (d.data?.length === 0) {
      $('#listRsvps').append(`<tr>
          <td colspan="5">Nampaknya, Anda belum pernah diberi ucapan (:</td>
        </tr>`)
    } else {
      d.data.forEach((rsvp, i) => {
        $('#listRsvps').append(`<tr>
            <td>${i++}</td>
            <td>${rsvp.name}</td>
            <td>${rsvp.msg}</td>
            <td><span class="badge rounded-pill badge-light-primary me-1">${rsvp.status}</span></td>
            <td>${new Date(rsvp.created_at).toLocaleDateString()}</td>
            <td>
              <button type="button" data-id="${rsvp.id}" class="btn btn-icon btn-icon rounded-circle btn-danger btn-delete">${feather.icons['trash'].toSvg()}</button>
            </td>
        </tr>`)
      })
    }
  });
}
loadRsvps();

$(document).on('click', '.btn-delete', function () {
    let idRsvp = $(this).data('id');
    Swal.fire({ text: 'Apakah Anda yakin ingin menghapus rsvp ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
      .then(function (result) {
          if (result.value) {
            deleteRsvp(idRsvp);
          }
      });
  });
  
function deleteRsvp(itemId) {
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    url: '/a/i/rsvp?id=' + itemId, 
    type: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(d) {
      loadRsvps();
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