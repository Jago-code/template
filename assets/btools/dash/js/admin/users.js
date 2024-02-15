'use strict';
var dt_basic_table = $('.datatables-basic'),
  itemLoader = `<div class="d-flex justify-content-center"><div class="sk-grid sk-primary"><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div><div class="sk-grid-cube"></div></div><div>`,
  dt_basic;
  
document.addEventListener("DOMContentLoaded", function (e) {
  const fv = FormValidation.formValidation(document.querySelector("#formEditUser"), {
    fields: {
      username: { validators: { notEmpty: { message: "Please enter Username!" } } },
      type: { validators: { notEmpty: { message: "Please select type!" } } },
      expr: { validators: { notEmpty: { message: "Please select expired days!" } } },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger,
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: "",
        rowSelector: function(e, t) {
          return ".col"
        }
      }),
      submitButton: new FormValidation.plugins.SubmitButton,
      autoFocus: new FormValidation.plugins.AutoFocus
    }
  });

  fv.on('core.form.valid', function () {
    const mf = $('#formEditUser');
    mf.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      data: mf.serialize(),
      url: mf.attr('action'),
      type: "POST",
      success: function (d) {
        mf.unblock();
        dt_basic.ajax.reload();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        mf.unblock();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});

window.deleteu = (id) => {
  Swal.fire({ text: "Do you want to delete this user?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
    .then(function (e) {
      if (e.value) {
        $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
        $.ajax({
          data: `id=${id}`,
          url: '/admin/dell/users',
          type: "POST",
          success: function (d) {
            $.unblockUI();
            Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
            dt_basic.ajax.reload();
          },
          error: function (e) {
            $.unblockUI();
            const msg = e.responseJSON.msg;
            Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
          },
        });
      }
    });
}

$(function () {
  if (dt_basic_table.length) {
    dt_basic = dt_basic_table.DataTable({
      ajax: '?type=json',
      columns: [
        { data: '_id' },
        { data: 'username' },
        { data: 'number_wa' },
        { data: 'type' },
        { data: 'status' },
        { data: 'expired_at' },
        { data: 'createdAt' },
        { data: '' }
      ],
      columnDefs: [
        {
          className: 'control',
          orderable: false,
          searchable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          responsivePriority: 1,
          targets: 1
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            const myNumber = typeof full['number_wa'] != 'undefined' ? full['number_wa'] : full['email'] ? full['email'] : '-';
            return myNumber;
          }
        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            return `<span class="badge bg-label-${full['type'] == 'Free' ? 'secondary' : 'primary'}">${full['type']}</span>`;
          }
        },
        {
          targets: -3,
          render: function (data, type, full, meta) {
            return moment(full['expired_at']).diff(moment(), 'days') + ' days left';
          }
        },
        {
          targets: -2,
          render: function (data, type, full, meta) {
            return moment(full['createdAt']).format('LLL');
          }
        },
        {
          targets: -1,
          title: 'Actions',
          orderable: false,
          searchable: false,
          render: function (data, type, full, meta) {
            return `
              <a href="javascript:deleteu('${full['_id']}');" class="btn btn-sm btn-icon"><i class="bx bxs-trash"></i></a>
              <a href="javascript:editu('${full['_id']}');" class="btn btn-sm btn-icon"><i class="bx bxs-edit"></i></a>`;
          }
        }
      ],
      order: [[2, 'desc']],
      dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        { 
          text: '<i class="bx bx-plus me-sm-1"></i> <span class="d-none d-sm-inline-block">Edit User</span>', 
          className: "btn rounded-pill btn-primary edit-user",
        },
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'User details';
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');
            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
    $("div.head-label").html('<h5 class="card-title mb-0">List Users</h5>');
  }
  
  setTimeout(() => {
    $('.edit-user').click(function(){
      $('#modalEdit').modal('show');
    });
    $(".dataTables_filter .form-control").removeClass("form-control-sm"), $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 200);
})