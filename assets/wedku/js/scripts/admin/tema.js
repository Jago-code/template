$(document).ready(function () {
  const formAddTheme = $('#formAddTheme');
  const formUpdateTheme = $('#formUpdateTheme');
  
  // load theme
  loadThemes();
  
  // handle event
  $('#formAddTheme').submit(function(e) {
    e.preventDefault();
    formAddTheme.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      success: function (d) {
        formAddTheme.unblock();
        loadThemes();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        formAddTheme.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
  
  formUpdateTheme.submit(function(e) {
    e.preventDefault();
    formUpdateTheme.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "PUT",
      data: $(this).serialize(),
      success: function (d) {
        formUpdateTheme.unblock();
        loadThemes();
        $("#updateTheme").modal("show");
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        formUpdateTheme.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });

  $(document).on('click', '.theme-edit', function () {
    updateTheme($(this).data('id'))
  });
  
  $(document).on('click', '.theme-delete', function () {
    deleteTheme($(this).data('id'))
  });
  
  $("#addThumb").on("change", function (e) {
    var files = e.target.files;
    if (files[0].name != undefined || files[0].name != "") {
      uploadFile(files[0].name, files[0]).then((dur) => {
        $("#urlThumb").val(dur)
        $("#thumbATheme").attr("src", dur);
      });
    } else alert("File not found!");
  });

  $("#fileTheme").on("change", function (e) {
    var files = e.target.files;
    if (files[0].name != undefined || files[0].name != "") {
      uploadFile(files[0].name, files[0]).then((dur) => {
        $("#urlThumbTheme").val(dur);
        $("#thumbTheme").attr("src", dur);
      });
    } else alert("File not found!");
  });
  
  function updateTheme(id) {
    $.get(`/api/themes?type=detail&id=${id}`, function (d) {
      $("#idTheme").val(d.id);
      $("#nameTheme").val(d.name);
      $("#pathTheme").val(d.path);
      $("#typeTheme").val(d.type);
      $("#categoryTheme").val(d.category);
      $("#slugTheme").val(d.slug);
      $("#urlThumbTheme").val(d.thumb);
      $("#thumbTheme").attr("src", d.thumb);
      $("#updateTheme").modal("show");
    });
  };
  
  function loadThemes() {
    $("#listThemes").html("");
    $.get("/api/themes", function (d) {
      d.data.forEach((theme) => {
        $("#listThemes").append(`<tr>
            <td><span class="fw-bold">${theme.name}</span></td>
            <td><span class="badge rounded-pill badge-light-info me-1">${theme.category}</span></td>
            <td>${theme.type}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">${feather.icons["more-vertical"].toSvg()}</button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="${d.base_url + theme.slug}">${feather.icons.eye.toSvg({ class: "me-50" })}<span>Lihat</span></a>
                        <a class="dropdown-item theme-edit" data-id="${theme.id}">${feather.icons["edit-2"].toSvg({ class: "me-50" })}<span>Edit</span></a>
                        <a class="dropdown-item theme-delete" data-id="${theme.id}">${feather.icons["trash"].toSvg({ class: "me-50" })}<span>Delete</span></a>
                    </div>
                </div>
            </td>
        </tr>`);
      });
    });
  }
  
  function deleteTheme(id) {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: 'themes?id=' + id,
      type: "DELETE",
      success: function (d) {
        $.unblockUI();
        loadThemes();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        $.unblockUI();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  }
});