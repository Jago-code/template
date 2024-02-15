const itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>',
  myQuery = document.querySelector("#query");

new Tagify(myQuery, { whitelist: $("#suggestsQuery").val().split(", "), maxTags: 10, dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: !1 } });

if (!$("#at").attr("checked")) {
  $("#listLang").hide();
}
if (!$("#asf").attr("checked")) {
  $("#listFbPage").hide();
}
if (!$("#asp").attr("checked")) {
  $("#listBoard").hide();
}

$("#asp").on("change", function () {
  if (this.checked) $("#listBoard").show();
  else $("#listBoard").hide();
});
$("#asf").on("change", function () {
  if (this.checked) $("#listFbPage").show();
  else $("#listFbPage").hide();
});
$("#at").on("change", function () {
  if (this.checked) $("#listLang").show();
  else $("#listLang").hide();
});

$(".select2").each(function () {
  var e = $(this);
  e.wrap('<div class="position-relative"></div>').select2({ placeholder: "Choose a one..", dropdownParent: e.parent() });
});

$('#tqry').on('select2:select', function (e) {
  getCategory(e.params.data.id);
});

$("#btAdd").click(function () {
  const mf = $('#formCamp');
  mf.block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: mf.serialize(),
    url: '/a/campaign/add',
    type: "POST",
    success: function (d) {
      mf.unblock();
      $("#formCamp")[0].reset();
      $(".btn-close").click();
      loadItem();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function (e) {
      mf.unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

$("#btEdit").click(function () {
  const mf = $('#formCamp');
  mf.block({ message: itemLoader, css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: mf.serialize(),
    url: '/a/campaign/edit',
    type: "POST",
    success: function (d) {
      mf.unblock();
      Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
    },
    error: function (e) {
      mf.unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
    },
  });
});

function dellCam(id) {
  Swal.fire({ text: "Do you want to delete this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
    .then(function (e) {
      if (e.value) {
        $.blockUI({ message: itemLoader, css: {   backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
        $.ajax({
          data: `idc=${id}`,
          url: '/a/campaign/dell',
          type: "POST",
          success: function (d) {
            $.unblockUI();
            loadItem();
            Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
          },
          error: function (e) {
            $.unblockUI();
            const msg = e.responseJSON.msg;
            Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
          },
        });
      }
    })
}

function loadItem() {
  $.get('?type=json', function(d) {
    $('#listCamp').html('');
    d.data.forEach(f => {
      const txp = f.days.length == '7' ? 'Repeat every day.' : f.days.length == '6' && f.days.includes('Sun') ? 'Repeats every Monday to Friday.' : `Repeats every ${f.days.join(', ')}.`;
      $('#listCamp').append(`
        <div class="bg-lighter rounded p-3 mb-3 position-relative">
          <div class="dropdown myCamp">
            <a class="btn dropdown-toggle text-muted hide-arrow p-0" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></a>
            <div class="dropdown-menu dropdown-menu-end">
              <a href="/a/campaign/edit/${f._id}" class="dropdown-item"><i class="bx bx-pencil me-2"></i>Edit</a>
              <a href="javascript:dellCam('${f._id}');" class="dropdown-item"><i class="bx bx-trash me-2"></i>Delete</a>
            </div>
          </div>
          <div class="d-flex align-items-center flex-wrap mb-3">
            <h4 class="mb-0 me-3">${f.title}</h4>
            <span class="badge bg-label-${f.setting.auto_post == 'on' ? 'primary' : 'secondary'}">${f.setting.auto_post == 'on' ? 'Active' : 'Not active'}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <span class="fw-semibold me-3">Query : ${f.query.join(', ')}</span>
          </div>
          <span>${txp}</span>
        </div>
      `);
    })
  })
}

loadItem();

function getCategory(type) {
  if (type == 'ezinearticles') {
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.getJSON(`/api/tools/get-category?type=${type}`, function (d) {
      $('tags').remove();
      new Tagify(myQuery, { whitelist: d.data, maxTags: 10, dropdown: { maxItems: 600, classname: "", enabled: 0, closeOnSelect: !1 } });
      $.unblockUI()
    });
  }
}

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