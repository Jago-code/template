$(function () {
  var dt_basic_table = $('.datatables-basic'),
    itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>',
    dt_basic, 
    idb = $('#myIdb').val();
    
  var t = $(".select2");
  t.length && t.each(function () {
      var e = $(this);
      e.wrap('<div class="position-relative"></div>').select2({ placeholder: "Select value", dropdownParent: e.parent() });
  });
  
  $('#myBlog').on('select2:select', function (e) {
    idb = e.params.data.id;
    dt_basic.ajax.url(`?type=json&idb=${idb}`).load();
  });

  $('#actionPost').change(function(){
    const myType = this.value;
    if (myType != 'none') {
      if (myType == 'delete') {
        Swal.fire({ text: "Do you want to delete this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
        .then(function (e) {
          if (e.value) actionPost(myType);
        })
      } else if (myType == 'seo') {
        Swal.fire({ text: "Are you sure you want to convert your articles into SEO?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
        .then(function (e) {
          if (e.value) actionPost(myType);
        })
      } else if (myType == 'share') {
        Swal.fire({ text: "Are you sure you want to share this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
        .then(function (e) {
          if (e.value) actionPost(myType);
        });
      } else if (myType == 'index') {
        Swal.fire({ text: "Are you sure you want to index this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
        .then(function (e) {
          if (e.value) actionPost(myType);
        });
      } else actionPost(myType);
    }
  })

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
        { data: 'id' },
        { data: 'blog' },
        { data: 'title' },
        { data: 'author' },
        { data: 'labels' },
        { data: 'replies' },
        { data: 'updated' },
        { data: 'url' }
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
          targets: 1,
          orderable: !1,
          searchable: !1,
          responsivePriority: 3,
          checkboxes: !0,
          checkboxes: { selectAllRender: '<input type="checkbox" class="form-check-input">' },
          render: function (data, type, full, meta) {
            return `<input type="checkbox" class="dt-checkboxes form-check-input" data-id="${full['id']}" data-url="${full['url']}">`;
          },
        },
        {
          // Avatar image/badge, Name and post
          targets: 3,
          responsivePriority: 4,
          render: function (data, type, full, meta) {
            var $name = full['author'].displayName,
              $output = '<img src="' + full['author'].image.url + '" alt="Avatar" class="rounded-circle">';
            
            var $row_output =
              '<div class="d-flex justify-content-start align-items-center user-name">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar me-2">' +
              $output +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<span class="emp_name text-truncate">' +
              $name +
              '</span>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          responsivePriority: 1,
          targets: 2
        },
        {
          // Label
          targets: -4,
          render: function (data, type, full, meta) {
            const mlb = typeof full['labels'] != 'undefined' ? full['labels'] : '-';
            return '<span class="badge bg-label-primary">' + mlb + '</span>';
          }
        },
        {
          // Label
          targets: -3,
          render: function (data, type, full, meta) {
            return '<span class="badge bg-label-info">' + full['replies'].totalItems + '</span>';
          }
        },
        {
          targets: -2,
          render: function (data, type, full, meta) {
            return moment(full['updated']).format('LLL');
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          searchable: false,
          render: function (data, type, full, meta) {
            return `<div class="d-inline-block">
                <a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></a>
                <ul class="dropdown-menu dropdown-menu-end m-0">
                  <li><a href="${full['url']}" class="dropdown-item">Show</a></li>
                  <div class="dropdown-divider"></div>
                  <li><a href="javascript:deletp('${full['blog'].id}', '${full['id']}');" class="dropdown-item text-danger delete-record">Delete</a></li>
                </ul>
              </div>
              <a href="/a/blog/b/posts/${full['blog'].id}/${full['id']}" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-edit"></i></a>`;
          }
        }
      ],
      // order: [[2, 'desc']],
      dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      // dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        { 
          text: '<i class="bx bx-plus me-sm-1"></i> <span class="d-none d-sm-inline-block">Add New Post</span>', 
          className: "btn rounded-pill btn-primary",
          action: function () {
            window.location = '/a/blog/b/posts/add?idb=' + idb;
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
    $("div.head-label").html('<h5 class="card-title mb-0">My Post</h5>');
  }
  
  function actionPost(selectedType) {
    var listPost = $("input.dt-checkboxes[type=checkbox]:checkbox:checked");
    var dtPost = [];
    listPost.each(function(){
      dtPost.push({ idp: $(this).data('id'), url: $(this).data('url') });
    })
    if (dtPost.length <= 0) {
      Swal.fire({ title: "Upss!", text: 'Please select a post first!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    } else {
      console.log(dtPost, idb, selectedType);
      $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
      $.ajax({
        type: "POST",
        url: "/api/tools/actionPost",
        contentType: "application/json",
        data: JSON.stringify({ dtPost, type: selectedType, idb, platform: 'blogger' }),
        success: function (d) {
          $.unblockUI();
          $('#actionPost').val('none');
          Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
          dt_basic.ajax.reload();
        },
        error: function (e) {
          $.unblockUI();
          const msg = e.responseJSON.msg;
          Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
        }
      });
    }
  }

  window.deletp = (ib, ip) => {
    Swal.fire({ text: "Do you want to delete this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(function (e) {
        if (e.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
          $.ajax({
            data: `idb=${ib}&idp=${ip}`,
            url: '/a/blog/b/posts/dell',
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

  setTimeout(() => {
    $(".dataTables_filter .form-control").removeClass("form-control-sm"), $(".dataTables_length .form-select").removeClass("form-select-sm");
  }, 200);
  
  setInterval(function() {
    $.ajax({
      url: '/api/checkToken',
      type: 'GET',
      success: function(data) {
        console.log(data.msg);
      },
      error: function(xhr, status, error) {
        console.error('Terjadi kesalahan saat melakukan permintaan:', error);
      }
    });
  }, 300000);
});