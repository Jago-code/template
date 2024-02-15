$(function () {
  var e,
    t = $(".datatables-basic"),
    itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

  t.length &&
    ((e = t.DataTable({
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
        { data: "" },
        { data: "name" },
        { data: "status" },
        { data: "posts" },
        { data: "published" },
        { data: "" },
      ],
      columnDefs: [
        {
          className: "control",
          orderable: !1,
          searchable: !1,
          responsivePriority: 2,
          targets: 0,
          render: function (e, t, a, s) {
            return "";
          },
        },
        { responsivePriority: 1, targets: 2 },
        {
          targets: 2,
          render: function (e, t, a, s) {
            // ${a.status == 'PENDING' ? 'warning' : 'success'}
            return `<span class="badge bg-label-primary me-1">${a.status}</span>`;
          },
        },
        {
          targets: 3,
          render: function (e, t, a, s) {
            return `<span class="badge badge-pill bg-label-info me-1">${a.posts.totalItems}</span>`;
          },
        },
        {
          targets: -2,
          render: function (data, type, full, meta) {
            return moment(full['published']).format('LLL');
          }
        },
        {
          targets: -1,
          title: "Actions",
          orderable: !1,
          searchable: !1,
          render: function (e, t, a, s) {
            return `<a href="/a/blog/b/posts/${a.id}" class="btn btn-sm btn-icon item-edit"><i class="bx bxs-news"></i></a><a href="${a.url}" target="_blank" class="btn btn-sm btn-icon item-show"><i class="bx bxs-show"></i></a>`;
          },
        },
      ],
      order: [[1, "desc"]],
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      // dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (e) {
              return "Details of " + e.data().name;
            },
          }),
          type: "column",
          renderer: function (e, t, a) {
            var s = $.map(a, function (e, t) {
              return "" !== e.title ? '<tr data-dt-row="' + e.rowIndex + '" data-dt-column="' + e.columnIndex + '"><td>' + e.title + ":</td> <td>" + e.data + "</td></tr>" : "";
            }).join("");
            return !!s && $('<table class="table"/><tbody />').append(s);
          },
        },
      },
    })
  ))
  
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