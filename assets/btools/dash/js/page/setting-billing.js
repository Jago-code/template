$(function () {
  var e,
    t = $(".datatables-basic");

  t.length &&
    ((e = t.DataTable({
      ajax: "?type=json",
      columns: [
        { data: "" },
        { data: "transaction_id" },
        { data: "status" },
        { data: "payment_method" },
        { data: "type" },
        { data: "createdAt" },
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
        { responsivePriority: 1, targets: 1 },
        {
          targets: 2,
          render: function (e, t, a, s) {
            return `<span class="badge bg-label-${a.status == 'PENDING' ? 'warning' : 'success'} me-1">${a.status}</span>`;
          },
        },
      ],
      order: [[1, "desc"]],
      dom:
        '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-3 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        {
          extend: "collection",
          className: "btn btn-label-primary dropdown-toggle me-2",
          text: '<i class="bx bx-export me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
          buttons: [
            {
              extend: "print",
              text: '<i class="bx bx-printer me-1" ></i>Print',
              className: "dropdown-item",
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = "";
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
              customize: function (e) {
                $(e.document.body).css("color", config.colors.headingColor).css("border-color", config.colors.borderColor).css("background-color", config.colors.bodyBg),
                  $(e.document.body).find("table").addClass("compact").css("color", "inherit").css("border-color", "inherit").css("background-color", "inherit");
              },
            },
            {
              extend: "csv",
              text: '<i class="bx bx-file me-1" ></i>Csv',
              className: "dropdown-item",
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = "";
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: "excel",
              text: '<i class="bx bxs-file-export me-1"></i>Excel',
              className: "dropdown-item",
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = "";
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: "pdf",
              text: '<i class="bx bxs-file-pdf me-1"></i>Pdf',
              className: "dropdown-item",
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = "";
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: "copy",
              text: '<i class="bx bx-copy me-1" ></i>Copy',
              className: "dropdown-item",
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = "";
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains("user-name") ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
          ],
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (e) {
              return "Details of " + e.data().transaction_id;
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
    })),
    $("div.head-label").html('<h5 class="card-title mb-0">Transaction History</h5>'));
});