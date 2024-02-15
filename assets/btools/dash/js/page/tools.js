'use strict';
const itemLoader = `<div class='d-flex justify-content-center'><div class='sk-grid sk-primary'><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div><div class='sk-grid-cube'></div></div><div>`
var myTable, cekTable = false;

const frn = (n) => {
  if (n < 1e3) return n;
  else if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  else if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  else if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  else if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

$('#formBacklinkChecker').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  if (cekTable) {
    myTable.ajax.url($(this).attr('action') + '?url=' + $('#url').val()).load();
    $('.mbtools').unblock();
  } else {
    cekTable = true;
    myTable = $('.datatables-basic').DataTable({
      ajax: {
        url: $(this).attr('action') + '?url=' + $('#url').val(),
        type: 'POST'
      },
      columns: [
        { data: '' },
        { data: 'anchor' },
        { data: 'source.da' },
        { data: 'source.pa' },
        { data: 'nofollow' },
        { data: 'source.url' },
        { data: 'date' },
      ],
      columnDefs: [
        {
          className: 'control',
          orderable: !1,
          searchable: !1,
          responsivePriority: 2,
          targets: 0,
          render: function (e, t, a, s) {
            return '';
          },
        },
        { responsivePriority: 1, targets: 1 },
        {
          targets: 2,
          render: function (e, t, a, s) {
            return `<span class='badge bg-label-info me-1'>${a.source.da}</span>`;
          },
        },
        {
          targets: 3,
          render: function (e, t, a, s) {
            return `<span class='badge bg-label-info me-1'>${a.source.pa}</span>`;
          },
        },
        {
          targets: 4,
          render: function (e, t, a, s) {
            return `<span class='badge bg-label-${a.nofollow ? 'secondary' : 'primary'} me-1'>${a.nofollow ? 'NoFollow' : 'DoFollow'}</span>`;
          },
        },
        {
          targets: -2,
          orderable: !1,
          searchable: !1,
          render: function (e, t, a, s) {
            return `${a.source.title} \n<a href='http://${a.source.url}' target='_blank'>${a.source.url}</a>`;
          },
        },
      ],
      order: [[1, 'desc']],
      dom: "<'card-header flex-column flex-md-row'<'head-label text-center'><'dt-action-buttons text-end pt-3 pt-md-0'B>><'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end'f>>t<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100],
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-label-primary dropdown-toggle me-2',
          text: "<i class='bx bx-export me-sm-1'></i> <span class='d-none d-sm-inline-block'>Export</span>",
          buttons: [
            {
              extend: 'print',
              text: "<i class='bx bx-printer me-1' ></i>Print",
              className: 'dropdown-item',
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = '';
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains('user-name') ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
              customize: function (e) {
                $(e.document.body).css('color', config.colors.headingColor).css('border-color', config.colors.borderColor).css('background-color', config.colors.bodyBg),
                  $(e.document.body).find('table').addClass('compact').css('color', 'inherit').css('border-color', 'inherit').css('background-color', 'inherit');
              },
            },
            {
              extend: 'csv',
              text: "<i class='bx bx-file me-1' ></i>Csv",
              className: 'dropdown-item',
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = '';
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains('user-name') ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: 'excel',
              text: "<i class='bx bxs-file-export me-1'></i>Excel",
              className: 'dropdown-item',
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = '';
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains('user-name') ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: 'pdf',
              text: "<i class='bx bxs-file-pdf me-1'></i>Pdf",
              className: 'dropdown-item',
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = '';
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains('user-name') ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
                      }),
                      n
                    );
                  },
                },
              },
            },
            {
              extend: 'copy',
              text: "<i class='bx bx-copy me-1' ></i>Copy",
              className: 'dropdown-item',
              exportOptions: {
                columns: [3, 4, 5, 6, 7],
                format: {
                  body: function (e, t, a) {
                    if (e.length <= 0) return e;
                    var s = $.parseHTML(e),
                      n = '';
                    return (
                      $.each(s, function (e, t) {
                        void 0 !== t.classList && t.classList.contains('user-name') ? (n += t.lastChild.firstChild.textContent) : void 0 === t.innerText ? (n += t.textContent) : (n += t.innerText);
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
              return 'Details Backlink';
            },
          }),
          type: 'column',
          renderer: function (e, t, a) {
            var s = $.map(a, function (e, t) {
              return '' !== e.title ? '<tr data-dt-row="' + e.rowIndex + '" data-dt-column="' + e.columnIndex + '"><td>' + e.title + ':</td> <td>' + e.data + '</td></tr>' : '';
            }).join('');
            return !!s && $("<table class='table'/><tbody />").append(s);
          },
        },
      },
    });
    $('.mbtools').unblock();
    $('#result').show();
    $('div.head-label').html("<h5 class='card-title mb-0'>Result Backlink</h5>");
  }
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm'), $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 200);
});

$('#formArticleSpinner').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr('action'),
    type: 'POST',
    success: function (d) {
      $('.mbtools').unblock();
      Swal.fire({ title: 'Good job!', text: 'Successfully spin content.', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      $('#myResult').val('');
      $('#myResult').val(d.content);
      $('#result').show();
    },
    error: function (e) {
      $('.mbtools').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
    },
  });
});

$('#formTranslateContent').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr('action'),
    type: 'POST',
    success: function (d) {
      $('.mbtools').unblock();
      Swal.fire({ title: 'Good job!', text: 'Successfully translated content.', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      $('#myResult').val('');
      $('#myResult').val(d.content);
      $('#result').show();
    },
    error: function (e) {
      $('.mbtools').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
    },
  });
});

$('#formDaPaChecker').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr('action'),
    type: 'POST',
    success: function (d) {
      $('.mbtools').unblock();
      Swal.fire({ title: 'Good job!', text: 'Successfully fetched data.', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      $('#listResult').html('');
      d.data.forEach(f => {
        $('#listResult').append(`<tr>
          <td>${f.domain}</td>
          <td><span class='badge bg-label-info me-1'>${f.domain_authority}</span></td>
          <td><span class='badge bg-label-info me-1'>${f.page_authority}</span></td>
          <td>${frn(f.backlink_dofollow)}</td>
          <td>${frn(f.backlink_nofollow)}</td>
          <td>${f.spam_score}</td>
       </tr>`);
      })
      $('#result').show();
    },
    error: function (e) {
      $('.mbtools').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
    },
  });
});

$('#formPlagiarismChecker').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr('action'),
    type: 'POST',
    success: function (d) {
      $('.mbtools').unblock();
      Swal.fire({ title: 'Good job!', text: 'Successfully fetched data.', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      $('#listPlagiarism').html('');
      $('#pcUnique, #pcPlagiarism').html('0%');
      $('#pcUnique').html(d.unique);
      $('#pcPlagiarism').html(d.plagiarism);
      d.list_plagiarism.forEach((f, i) => {
        $('#listPlagiarism').append(`
        <div class="card accordion-item active">
          <h2 class="accordion-header" id="lpsjp${i}">
            <button type="button" class="accordion-button" data-bs-toggle="collapse" data-bs-target="#lps${i}" aria-expanded="true" aria-controls="lpsjp${i}">
              <span class="badge rounded-pill bg-danger">${f.similarity} </span>${f.title}
            </button>
          </h2>
          <div id="lps${i}" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div class="accordion-body">${f.snippet} <br><a href="${f.link}">Read more</a> </div>
          </div>
        </div>`);
      })
      $('#result').show();
    },
    error: function (e) {
      $('.mbtools').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
    },
  });
});

$('#formSearchContent').submit(function (e) {
  e.preventDefault();
  $('.mbtools').block({ message: itemLoader, css: { backgroundColor: 'transparent', color: '#fff', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: $(this).serialize(),
    url: $(this).attr('action'),
    type: 'POST',
    success: function (d) {
      $('.mbtools').unblock();
      if (d?.type == 'image') {
        $('#imgResult').show();
        $('#myImgResult').attr('src', d.imageUrl);
      } else {
        $('#imgResult').hide();
      }
      $('#resultTitle').val(d.title);
      $('#resultContent').val(d.content);
      $('#result').show();
      Swal.fire({ title: 'Good job!', text: 'Successfully fetched content', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    },
    error: function (e) {
      $('.mbtools').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
    },
  });
});

$(function () {
  const t = [].slice.call(document.querySelectorAll('.clipboard-btn'));
  const e = $('.fmArea');
  var se2 = $('.select2');

  if (se2) {
    se2.length && se2.each(function () {
        var e = $(this);
        e.wrap("<div class='position-relative'></div>").select2({ placeholder: 'Select value', dropdownParent: e.parent() });
    });
  }

  if (e) {
    e.each(function () {
      $(this).maxlength({
        warningClass: 'label label-success bg-success text-white',
        limitReachedClass: 'label label-danger',
        separator: ' out of ',
        preText: 'You typed ',
        postText: ' chars available.',
        validate: !0,
        threshold: +this.getAttribute('maxlength'),
      });
    });
  }

  if (ClipboardJS) {
    t.map(function (t) {
      const c = new ClipboardJS(t);
      c.on('success', function (t) {
        'copy' == t.action && Swal.fire({ title: 'Good Job!', text: 'Copied to Clipboard!', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      });
    })
  } else {
    t.map(function (t) {
      t.setAttribute('disabled', !0);
    });
  }
});
