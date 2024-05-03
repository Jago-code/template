function loadGifts() {
  $('.table-borderless').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.get('?type=json', function(d) {
    $('.table-borderless').unblock();
    $('#listGifts').html('');
    if (d.data?.length === 0) {
      $('#listGifts').append(`<tr>
          <td colspan="5">Nampaknya, Anda belum pernah diberi hadiah (:</td>
        </tr>`)
    } else {
      d.data.forEach((gift, i) => {
        $('#listGifts').append(`<tr>
            <td>${i++}</td>
            <td>${gift.name}</td>
            <td>${gift.total}</td>
            <td>${gift.msg}</td>
            <td>${new Date(gift.created_at).toLocaleDateString()}</td>
            <td>
              <button type="button" data-id="${gift.id}" class="btn btn-icon btn-icon rounded-circle btn-danger btn-delete">${feather.icons['trash'].toSvg()}</button>
            </td>
        </tr>`)
      })
    }
  });
}
loadGifts();

$(document).on('click', '.btn-delete', function () {
    let idGift = $(this).data('id');
    Swal.fire({ text: 'Apakah Anda yakin ingin menghapus gift ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
      .then(function (result) {
          if (result.value) {
            deleteGift(idGift);
          }
      });
  });
  
function deleteGift(itemId) {
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    url: '/a/i/gift?id=' + itemId, 
    type: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(d) {
      loadGifts();
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