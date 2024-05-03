let formAddGuest = $('#addGuestValidation');
let tableGuest = $('.datatables-basic');
let idInvitation = $('#idInvitation').val();

let html5QrCode = new Html5Qrcode("reader");
let fileinput = document.getElementById('fileQr');
let scanQrGuest = document.getElementById('scanQrGuest');
let config = {
  fps: 10,
  qrbox: {
    width: 250,
    height: 250
  }
};

let shownModal = new bootstrap.Modal(scanQrGuest, { title: 'Modal Shown Event', trigger: 'click', placement: 'right' });
let hiddenModal = new bootstrap.Modal(scanQrGuest, { title: 'Modal Hidden Event', trigger: 'click', placement: 'right' });

scanQrGuest.addEventListener('shown.bs.modal', function () {
    html5QrCode.start({ facingMode: "environment" }, config, checkGuest);
});
scanQrGuest.addEventListener('hidden.bs.modal', function () {
  html5QrCode.stop()
});

fileinput.addEventListener('change', e => {
  if (e.target.files.length === 0) {
    Swal.fire({ title: "Opps!", text: 'Silahkan pilih gambar untuk di scan!', icon: "warning", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
  }
  let imageFile = e.target.files[0];
  html5QrCode.scanFile(imageFile, true)
    .then((result) => checkGuest(result))
    .catch(err => {
      Swal.fire({ title: "Upss!", text: 'Terjadi kesalahan tidak terduga!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      console.log(`Error scanning file. Reason: ${err}`)
    });
});

function checkGuest(data) {
  let idGuest = data.split('!')[0];
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    url: `/api/guest/${idGuest}?type=check`,
    type: "POST",
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
}

if (formAddGuest.length) {
    formAddGuest.validate({
      onkeyup: function (element) {
        $(element).valid();
      },
      rules: {
        'nama': { required: true},
        'number': { required: true},
        'alamat': { required: true}
      }
    });
}

if (tableGuest.length) {
  let dataTableGuest = tableGuest.DataTable({
    ajax: {
      url: `/api/guest/${idInvitation}?type=json&id=${idInvitation}`,
      type: 'POST',
      beforeSend: function () {
          tableGuest.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
        },
        complete: function () {
          tableGuest.unblock();
        }
    },
    columns: [
      { data: 'name' },
      { data: 'address' },
      { data: 'number' },
      { data: 'status' },
      { data: 'created_at' },
      { data: 'id' }
    ],
    columnDefs: [
      {
        targets: -3,
        render: function (data, type, full, meta) {
          let $st = full['status'];
          return (`<span class="badge rounded-pill badge-light-${$st == 'Hadir' ? 'success' : 'warning'} me-1">${$st}</span>`);
        }
      },
      {
        targets: -2,
        render: function (data, type, full, meta) {
          let $tm = full['created_at'];
          return (`<span class="badge badge-light-info">${$tm.split('T')[0]}<span>`);
        }
      },
      {
        targets: -1,
        title: 'Aksi',
        orderable: false,
        render: function (data, type, full, meta) {
          return (`<button type="button" class="btn btn-icon btn-icon rounded-circle btn-danger btn-delete-guest" data-id="${full['id']}">${feather.icons['trash'].toSvg()}</button>`)
        }
      }
    ],
    // order: [[2, 'desc']],
    dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
    displayLength: 7,
    lengthMenu: [7, 10, 25, 50, 75, 100],
    buttons: [
      {
        extend: 'collection',
        className: 'btn btn-outline-secondary dropdown-toggle me-2',
        text: feather.icons['share'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
        buttons: [
          {
            extend: 'print',
            text: feather.icons['printer'].toSvg({ class: 'font-small-4 me-50' }) + 'Print',
            className: 'dropdown-item',
            exportOptions: { columns: [0, 1, 2, 3, 4] }
          },
          {
            extend: 'csv',
            text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
            className: 'dropdown-item',
            exportOptions: { columns: [0, 1, 2, 3, 4] }
          },
          {
            extend: 'excel',
            text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
            className: 'dropdown-item',
            exportOptions: { columns: [0, 1, 2, 3, 4] }
          },
          {
            extend: 'pdf',
            text: feather.icons['clipboard'].toSvg({ class: 'font-small-4 me-50' }) + 'Pdf',
            className: 'dropdown-item',
            exportOptions: { columns: [0, 1, 2, 3, 4] }
          },
          {
            extend: 'copy',
            text: feather.icons['copy'].toSvg({ class: 'font-small-4 me-50' }) + 'Copy',
            className: 'dropdown-item',
            exportOptions: { columns: [0, 1, 2, 3, 4] }
          }
        ],
        init: function (api, node, config) {
          $(node).removeClass('btn-secondary');
          $(node).parent().removeClass('btn-group');
          setTimeout(function () {
            $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
          }, 50);
        }
      },
      {
        text: feather.icons['plus'].toSvg({ class: 'me-50 font-small-4' }) + 'Tambah Tamu',
        className: 'create-new btn btn-info rounded-pill',
        attr: {
          'data-bs-toggle': 'modal',
          'data-bs-target': '#addGuest'
        },
        init: function (api, node, config) {
          $(node).removeClass('btn-secondary');
        }
      }
    ],
    language: {
      paginate: {
        previous: '&nbsp;',
        next: '&nbsp;'
      }
    }
  });
  $('div.head-label').html('<h6 class="mb-0">Daftar Tamu Undangan</h6>');

  formAddGuest.submit(function(e) {
    e.preventDefault();
    if (!formAddGuest.valid()) return false;
    
    formAddGuest.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      success: function (d) {
        formAddGuest.unblock()
        dataTableGuest.ajax.reload();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        formAddGuest.unblock()
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });

  $('.btn-autoSendInvitation').click(function() {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: '/api/autoSendInvitation?id=' + idInvitation,
      type: "POST",
      success: function (d) {
        $.unblockUI();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        $.unblockUI();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      }
    })
  });
  
  $(document).on('click', '.btn-delete-guest', function() {
    let idGuest = $(this).data('id');
    Swal.fire({ text: 'Apakah Anda yakin ingin menghapus tamu ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes', customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline-danger ms-2' }, buttonsStyling: false })
      .then((result) => {
          if (result.value) {
            deleteGuest(idGuest);
          }
      });
  });
  
  function deleteGuest(itemId) {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: '/a/i/guest?id=' + itemId, 
      type: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(d) {
        $.unblockUI();
        dataTableGuest.ajax.reload();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function(e) {
        $.unblockUI();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'Terjadi kesalahan!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      }
    });
  }
}
