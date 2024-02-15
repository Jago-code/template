"use strict";
var dt_basic_table = $('.datatables-basic'),
  dt_basic,
  itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

document.addEventListener("DOMContentLoaded", function (e) {
  const fv = FormValidation.formValidation(document.querySelector("#formPin"), {
    fields: {
        bid: { validators: { notEmpty: { message: "Please select a Board!" } } },
        title: { validators: { notEmpty: { message: "Please enter a Title!" } } },
        url: { validators: { notEmpty: { message: "Please enter a Url Web!" } } },
        imgurl: { validators: { notEmpty: { message: "Please enter a Url Image!" } } },
        desc: { validators: { notEmpty: { message: "Please enter a Description!" } } },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({ eleValidClass: "", rowSelector: ".mb-2" }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (e) => {
      e.on("plugins.message.placed", function (e) {
        e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
      });
    },
  });

  fv.on('core.form.valid', function () {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.ajax({
      data: $('#formPin').serialize(),
      url: $('#formPin').attr('action'),
      type: "POST",
      success: function (d) {
        $.unblockUI()
        $('#addPin').modal('hide');
        $('#formPin').trigger('reset');
        Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
          .then(() => dt_basic.ajax.reload());
      },
      error: function (e) {
        $.unblockUI()
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
});

$('#formSetting').submit(function(e) {
  e.preventDefault();
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr("action"),
    type: "POST",
    success: function (d) {
      $.unblockUI()
      $('#mSetting').modal('hide');
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function (e) {
      $.unblockUI()
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$(function () {
  if (dt_basic_table.length) {
    dt_basic = dt_basic_table.DataTable({
      ajax: {
        url: '?type=json',
        type: 'GET',
        beforeSend: function () {
          $('#myTable').block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
        },
        complete: function () {
          $('#myTable').unblock();
        }
      },
      columns: [
        { data: '' },
        { data: 'title' },
        { data: 'description' },
        { data: 'created_at' },
        { data: 'id' }
      ],
      columnDefs: [
        {
          // For Responsive
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
          targets: 2,
          render: function (data, type, full, meta) {
            return full['description'].substring(0, 30);
          }
        },
        {
          targets: -2,
          render: function (data, type, full, meta) {
            return moment(full['created_at']).format('LLL');
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Action',
          orderable: false,
          searchable: false,
          render: function (data, type, full, meta) {
            return `<a href="javascript:deletPost('${full['id']}');" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-trash"></i></a>`;
          }
        }
      ],
      dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        { 
          text: '<i class="bx bx-plus me-sm-1"></i> <span class="d-none d-sm-inline-block">Add New Pin</span>', 
          className: "btn rounded-pill btn-primary",
          action: function (e, node, config){
            $('#addPin').modal('show')
          }
        },
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'My post details';
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
    $("div.head-label").html('<h5 class="card-title mb-0">My Pin</h5>');
  }

  window.deletPost = async(idp) => {
  	Swal.fire({ text: "Do you want to delete this pin?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(function (e) {
        if (e.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
          $.ajax({
            data: { idp },
            url: '/a/social/delete/pin',
            type: "POST",
            success: function (d) {
              $.unblockUI();
              Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
                .then(() => dt_basic.ajax.reload());
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
	
	setTimeout(() => {
    $(".dataTables_filter .form-control").removeClass("form-control-sm"), $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 200);
	
	$('#btnLogin').click(function(){
	  window.location.href = '/oauth/pinterest_grant_access';
	});
	
	$('#btnLogged').click(function(){
	  Swal.fire({ text: "Are you sure you want to log out of your pinterest account?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(function (e) {
        if (e.value) {
          window.location.href = '/oauth/logout/pinterest';
        }
      })
	});
});