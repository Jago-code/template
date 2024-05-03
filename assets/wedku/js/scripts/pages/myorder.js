$(function() {

  // load orders
  loadOrders();
  
  // event handler
  $(document).on('click', '.order-delete', function () {
    let idOrder = $(this).data('id');
    Swal.fire({ text: 'Apakah Anda yakin ingin menghapus pesanan ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
      .then(function (result) {
          if (result.value) {
            deleteOrder(idOrder);
          }
      });
  });
});

function wpay(idi, ty) {
    const am = ty === 'Standard' ? 60000 : ty === 'Premium' ? 100000 : 0;
    $.post('/api/payment', `name=${fdat.name}&email=${fdat.email}&number=${fdat.number}&amount=${am}&type=${ty}`, function(d){
        if (d.status === 200){
          fpay(d.token, {
            onSuccess: function(dt){
              $.post('/payment/process?type=order', `oid=${dt.data.order_id}&paym=${dt.data.paym}&idi=${idi}&type=${ty}`, function(dg){
                if(dg.status === 200) Swal.fire('Thanks!', `Pembayaran anda berhasil, melalui ${dt.data.paym}.`, 'success');
                else Swal.fire('Error!', dg.msg, 'error');
              });
            },
            onPending: function(dt){
              Swal.fire('Info!', dt.msg, 'info');
            },
            onError: function(dt){
              Swal.fire('Opss!', dt.msg, 'error');
            },
            onClose: function(){
              Swal.fire('Warn!', `Popup payment di tutup!`, 'warning')
            }
          })
        }
      });
}

function loadOrders() {
  $('#listOrder').html('');
  $('#loadingOrders').show();
  
  $.get('/a/order?type=json', function(d) {
    $('#loadingOrders').hide();
    if (d.data?.length === 0) {
      $('#listOrder').html(`<div class="col-md-12">
        <div class="alert alert-secondary alert-validation-msg" role="alert">
          <p class="alert-body">Pesanan kosong, Silahkan buat pesanan anda..</p>
        </div>
      </div>`);
    } else {
      d.data.forEach((order) => {
        let isExpired = order.status === 'EXPIRED' ? 'disabled' : '';
        let isPremiumAndExpired = order.type === 'Free' || order.status === 'EXPIRED' ? 'disabled' : '';
        let isBtnBuyOrRenew = order.status === 'UNPAID' ? `
        <button onclick="wpay('${order.id}', '${order.type}')" class="btn btn-sm btn-primary mb-1 mt-1 round">
          <i data-feather="shopping-cart" class="me-25"></i><span>Bayar Sekarang</span>
        </button><br>` : order.status === 'EXPIRED' ? `
        <button onclick="wpay('${order.id}', '${order.type}')" class="btn btn-sm btn-info mb-1 mt-1 round">
          <i data-feather="shopping-cart" class="me-25"></i><span>Perpanjang Sekarang</span>
        </button><br>` : '';
        
        $('#listOrder').append(`<div class="col-md-6">
          <div class="bg-light-secondary position-relative rounded p-2" >
            <div class="dropdown dropstart btn-pinned">
              <a class="btn btn-icon rounded-circle hide-arrow dropdown-toggle p-0" href="javascript:void(0)" id="ordp" data-bs-toggle="dropdown" aria-expanded="false">
                ${feather.icons['settings'].toSvg({ class: 'font-medium-4' })}
              </a>
              <ul class="dropdown-menu" aria-labelledby="ordp">
                <li><a class="dropdown-item d-flex align-items-center ${isExpired}" href="/a/i/${order.slug}/detail"> ${feather.icons['feather'].toSvg({ class: 'me-50' })} <span>Edit</span> </a></li>
                <li><a class="dropdown-item d-flex align-items-center ${isExpired}" href="/a/i/${order.slug}/guest"> ${feather.icons['users'].toSvg({ class: 'me-50' })} <span>Tamu</span> </a></li>
                <li><a class="dropdown-item d-flex align-items-center ${isExpired}" href="/a/i/${order.slug}/theme"> ${feather.icons['layout'].toSvg({ class: 'me-50' })} <span>Tema</span> </a></li>
                <li><a class="dropdown-item d-flex align-items-center ${isPremiumAndExpired}" href="/a/i/${order.slug}/album"> ${feather.icons['image'].toSvg({ class: 'me-50' })} <span>Album</span> </a></li>
                <li><a class="dropdown-item d-flex align-items-center ${isPremiumAndExpired}" href="/a/i/${order.slug}/gift"> ${feather.icons['gift'].toSvg({ class: 'me-50' })} <span>Hadiah</span> </a></li>
                <li><a class="dropdown-item d-flex align-items-center ${isPremiumAndExpired}" href="/a/i/${order.slug}/rsvp"> ${feather.icons['message-square'].toSvg({ class: 'me-50' })} <span>Ucapan</span> </a></li>
                <hr>
                <li><a class="dropdown-item d-flex align-items-center order-delete" data-id="${order.id}"> ${feather.icons['trash-2'].toSvg({ class: 'me-50' })} <span>Delete</span> </a></li>
              </ul>
            </div>
            <div class="d-flex align-items-center flex-wrap">
              <h4 class="mb-1 me-1">Wedding Paket ${order.type}</h4>
              <span class="badge badge-light-${order.status === 'PAID' ? 'success' : 'warning'} mb-1">${order.status === 'PAID' ? 'Aktif' : order.status === 'EXPIRED' ? 'Kadaluwarsa' : 'Belum Dibayar'}</span>
            </div>
            <h6 class="d-flex align-items-center fw-bolder">
              <a target="_blank" id="lnk${order.id}" href="https://${d.base_url + '/' + order.slug}" class="me-50">https://${d.base_url + '/' + order.slug}</a>
              <span onclick="copyText('lnk${order.id}')"> ${feather.icons['copy'].toSvg({ class: 'font-medium-4 cursor-pointer' })}</span>
            </h6>
            ${isBtnBuyOrRenew}
            <span>Expired Pada ${order.expiredAt}</span>
          </div>
        </div>`);
      });
    }
  });
}

function deleteOrder(itemId) {
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    url: '/a/order?id=' + itemId, 
    type: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    success: function(d) {
      $.unblockUI();
      loadOrders();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function(e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'Terjadi kesalahan!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    }
  });
}

const copyText = (el) => {
  navigator.clipboard.writeText($(`#${el}`).text())
    .then(() => Swal.fire('Successfully', 'Berhasil copy link unndangan.', 'success'))
    .catch(() => console.log('Gagal mengcopy!'));
}