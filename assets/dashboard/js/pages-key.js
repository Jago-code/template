$(document).ready(function () {
  const formAddKey = $('#formAddKey');
  const formSettingKey = $('#formSettingKey');

  // load Key
  loadKeys();

  // handle event
  $('#formAddKey').submit(function (e) {
    e.preventDefault();
    formAddKey.block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: $(this).serialize(),
      success: function (d) {
        formAddKey.unblock();
        $('#modalAddKey').modal('hide');
        loadKeys();
        Swal.fire({ title: 'Good job!', text: d.msg, icon: 'success', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      },
      error: function (e) {
        formAddKey.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  });

  formSettingKey.submit(function (e) {
    e.preventDefault();
    formSettingKey.block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: 'PUT',
      data: $(this).serialize(),
      success: function (d) {
        formSettingKey.unblock();
        loadKeys();
        $('#settingKeyModal').modal('hide');
        Swal.fire({ title: 'Good job!', text: d.msg, icon: 'success', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      },
      error: function (e) {
        formSettingKey.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  });

  $('#urlType').change(function () {
    const type = $(this).val();
    if (type === 'urlFeed') {
      $('#fromFeed').show();
      $('#fromManual').hide();
    } else {
      $('#fromFeed').hide();
      $('#fromManual').show();
    }
  });

  $('#withProxy').change(function () {
    if ($(this).is(':checked')) {
      $('#formProxy').show();
    } else {
      $('#formProxy').hide();
    }
  });
  
  $('#autoSendReport').change(function () {
    if ($(this).is(':checked')) {
      $('#formNumber').show();
    } else {
      $('#formNumber').hide();
    }
  });

  $(document).on('click', '.copy-key', function () {
    copyText($(this).data('key'));
  });

  $(document).on('click', '.key-setting', function () {
    settingKey($(this).data('id'));
  });

  $(document).on('click', '.key-delete', function () {
    let idKey = $(this).data('id');
    Swal.fire({ text: 'Apakah anda yakin ingin menghapus kunci ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light', cancelButton: 'btn btn-outline-danger ms-2 waves-effect waves-light' }, buttonsStyling: false }).then(function (result) {
      if (result.value) {
        deleteKey(idKey);
      }
    });
  });

  $(document).on('click', '.btn-buy', function () {
    let idKey = $(this).data('id');
    let typeKey = $(this).data('type');
    Swal.fire({ text: 'Apakah anda yakin ingin membeli kunci ini?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light', cancelButton: 'btn btn-outline-danger ms-2 waves-effect waves-light' }, buttonsStyling: false }).then(function (result) {
      if (result.value) {
        buyKey(idKey, typeKey);
      }
    });
  });

  function settingKey(id) {
    $.get(`keys?type=detail&id=${id}`, function (d) {
      $('#idKey').val(d.data._id);
      $('#taskBot').val(d.data.taskBot);
      $('#clickAds').val(d.data.clickAds);
      $('#urlType').val(d.data.urlType);
      
      if (d.data.urlType === 'urlFeed') {
        $('#fromFeed').show();
        $('#fromManual').hide();
        $('#urlFeed').val(d.data.urlFeed);
      } else {
        $('#fromFeed').hide();
        $('#fromManual').show();
        $('#urlManual').val(d.data.urlManual.join('\n'));
      }

      // if (d.data.type === 'trial') {
      //   $('#autoSendReport').prop('checked', false);
      //   $('#withProxy').prop('checked', false);
      // }

      if (d.data.autoSendReport) {
        $('#autoSendReport').prop('checked', true);
        $('#formNumber').show();
        $('#numberWa').val(d.data.number);
      } else {
        $('#formNumber').hide();
        $('#autoSendReport').prop('checked', false);
      }

      if (d.data.withProxy) {
        $('#withProxy').prop('checked', true);
        $('#formProxy').show();
        $('#listProxy').val(d.data.proxy.join('\n'));
      } else {
        $('#withProxy').prop('checked', false);
        $('#formProxy').hide();
      }

      $('#settingKeyModal').modal('show');
    });
  }

  function loadKeys() {
    $('#listKeys').html('');
    $('#loadingKeys').show();

    $.get('keys?type=json', function (d) {
      $('#loadingKeys').hide();
      if (d.data?.length === 0) {
        $('#listKeys').html(`<div class="col-md-12">
          <div class="bg-lighter rounded p-3 mb-3 position-relative">
            <span class="text-muted">Anda belum mempunyai kunci akses.
          </div>
        </div>`);
      } else {
        d.data.forEach(key => {
          const statusKey = key.status === 'Active' ? 'success' : key.status === 'Pending' ? 'warning' : 'danger';
          const isBtnBuyOrRenew =
            (key.status === 'Expired' && key.type !== 'trial') || key.status === 'Pending'
              ? ` <button data-id="${key._id}" data-type="${key.type}" class="btn btn-sm rounded-pill btn-label-primary mb-2 btn-buy">
              <span class="ti-xs ti ti-wallet me-1"></span>${key.status === 'Pending' ? 'Bayar' : 'Perpanjang'}
            </button><br/>`
              : '';

          $('#listKeys').append(`<div class="col-md-12">
            <div class="bg-lighter rounded p-3 mb-3 position-relative">
              <div class="dropdown api-key-actions">
                <a class="btn dropdown-toggle text-muted hide-arrow p-0" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-sm"></i></a>
                <div class="dropdown-menu dropdown-menu-end">
                  <button class="dropdown-item key-setting" data-id="${key._id}" ${key.type === 'trial' && key.status === 'Expired' ? 'disabled' : ''}><i class="ti ti-settings-code me-2"></i>Pengaturan</button>
                  <button class="dropdown-item key-delete" data-id="${key._id}" ${key.type === 'trial' && key.status === 'Expired' ? 'disabled' : ''}><i class="ti ti-trash me-2"></i>Hapus</button>
                </div>
              </div>
              <div class="d-flex align-items-center mb-3">
                <h4 class="mb-0 me-3">${key.name}</h4>
                <span class="badge bg-label-info me-2">${key.type.toUpperCase()}</span>
                <span class="badge bg-label-${statusKey}">${key.status.toUpperCase()}</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <p class="me-2 mb-0 fw-medium">${key.key}</p>
                <span class="text-muted cursor-pointer copy-key" data-key="${key.key}"><i class="ti ti-copy ti-sm"></i></span>
              </div>
              ${isBtnBuyOrRenew}
              <span class="text-muted">Kadaluarsa pada ${moment(key.expiredAt).calendar()}</span>
            </div>
          </div>`);
        });
      }
    });
  }

  function buyKey(id, type) {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: '/api/payment',
      data: { id, type },
      type: 'POST',
      success: function (d) {
        $.unblockUI();
        handlerPay(d.token);
      },
      error: function (e) {
        $.unblockUI();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  }

  function handlerPay(token) {
    fpay(token, {
      onSuccess: function (data) {
        paymentProcess(data);
      },
      onPending: function (data) {
        Swal.fire({ title: 'Info!', text: data.msg, icon: 'info', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      },
      onError: function (data) {
        Swal.fire({ title: 'Upss!', text: data.msg, icon: 'info', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      },
      onClose: function () {
        Swal.fire({ title: 'Warning!', text: 'Jendela pembayaran telah di tutup!', icon: 'info', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  }

  function paymentProcess(res) {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: {
        orderId: res.transaction.order_id,
        paymentMethod: res.transaction.payment_method
      },
      url: '/api/payment/process',
      type: 'POST',
      success: function (d) {
        $.unblockUI();
        Swal.fire({ title: 'Good job!', text: 'Your payment has been successful 🎉', icon: 'success', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 }).then(() => location.reload());
      },
      error: function (e) {
        $.unblockUI();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  }

  function deleteKey(id) {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: 'keys?id=' + id,
      type: 'DELETE',
      success: function (d) {
        $.unblockUI();
        loadKeys();
        Swal.fire({ title: 'Good job!', text: d.msg, icon: 'success', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      },
      error: function (e) {
        $.unblockUI();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 });
      }
    });
  }

  const copyText = text => {
    navigator.clipboard
      .writeText(text)
      .then(() => Swal.fire({ title: 'Good job!', text: 'Berhasil menyalin Kunci Akses..', icon: 'success', customClass: { confirmButton: 'btn btn-primary waves-effect waves-light' }, buttonsStyling: !1 }))
      .catch(() => console.log('Gagal mengcopy!'));
  };
});
