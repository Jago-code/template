var from = $('#addGuestValidation');
var fguest = $('.datatables-basic');

const html5QrCode = new Html5Qrcode("reader");
const fileinput = document.getElementById('fileQr');
var mQr = document.getElementById('scanQrm');
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

var shownModal = new bootstrap.Modal(mQr, { title: 'Modal Shown Event', trigger: 'click', placement: 'right' });
var hiddenModal = new bootstrap.Modal(mQr, { title: 'Modal Hidden Event', trigger: 'click', placement: 'right' });

mQr.addEventListener('shown.bs.modal', function () {
    html5QrCode.start({ facingMode: "environment" }, config, cekGuest);
});
mQr.addEventListener('hidden.bs.modal', function () {
  html5QrCode.stop()
});

fileinput.addEventListener('change', e => {
  if (e.target.files.length == 0) {
    alert('Silahkan pilih gambar qr')
  }
  const imageFile = e.target.files[0];
  html5QrCode.scanFile(imageFile, true)
    .then(hs => cekGuest(hs))
    .catch(err => {
      console.log(`Error scanning file. Reason: ${err}`)
    });
});

function cekGuest(tx, t2) {
  var idg = tx.split('!')[0];
  $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.post(`/api/guest/${idg}?type=check`, function(d){
    $.unblockUI()
    if (d.status == 200) Swal.fire('Successfully', d.msg, 'success');
    else Swal.fire('Opss!', d.msg, 'error');
  })
}

if (from.length) {
    from.validate({
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

if (fguest.length) {
  var dtG = fguest.DataTable({
    ajax: {
      url: `/api/guest/${$('#idi').val()}?type=json`,
      type: 'POST'
    },
    columns: [
      { data: 'name' },
      { data: 'alamat' },
      { data: 'number' },
      { data: 'status' },
      { data: 'created_at' },
      { data: 'id' }
    ],
    columnDefs: [
      {
        targets: -3,
        render: function (data, type, full, meta) {
          var $st = full['status'];
          return (`<span class="badge rounded-pill badge-light-${$st == 'Hadir' ? 'success' : 'warning'} me-1">${$st}</span>`);
        }
      },
      {
        targets: -2,
        render: function (data, type, full, meta) {
          var $tm = full['created_at'];
          return (`<span class="badge badge-light-info">${$tm.split('T')[0]}<span>`);
        }
      },
      {
        targets: -1,
        title: 'Aksi',
        orderable: false,
        render: function (data, type, full, meta) {
          return (`<button type="button" onclick="delet('${full['id']}')" class="btn btn-icon btn-icon rounded-circle btn-danger">${feather.icons['trash'].toSvg()}</button>`)
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

  from.submit(function(e){
      e.preventDefault();
      if (!from.valid()) return false
      from.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
      $.post($(this).attr('action'), $(this).serialize(), function(d){
        from.unblock()
        if (d.status == 200){
          Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
          dtG.ajax.reload();
        }else Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      });
  });

  function autoSend(id) {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.post(`/api/autoSend?id=${id}`, function(d) {
      // console.log(d)
      $.unblockUI()
      if (d.status == 200) Swal.fire('Successfully', d.msg, 'success');
      else Swal.fire('Opss!', d.msg, 'error');
    })
  }
  
  function delet(id) {
      $.get(`/a/invt/guest/d?id=${id}`, function(d) {
          Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
          dtG.ajax.reload();
      })
  }
}
