$(document).ready(function () {
  const formAddNotif = $('#formAddNotif');
  const formUpdateNotif = $('#formUpdateNotif');
  
  // load Notif
  loadNotifs();
  
  // handle event
  $('#formAddNotif').submit(function(e) {
    e.preventDefault();
    formAddNotif.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "POST",
      data: $(this).serialize(),
      success: function (d) {
        formAddNotif.unblock();
        loadNotifs();
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        formAddNotif.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });
  
  formUpdateNotif.submit(function(e) {
    e.preventDefault();
    formUpdateNotif.block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: $(this).attr('action'),
      type: "PUT",
      data: $(this).serialize(),
      success: function (d) {
        formUpdateNotif.unblock();
        loadNotifs();
        $("#updateNotif").modal("show");
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
      },
      error: function (e) {
        formUpdateNotif.unblock();
        let msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });

  $(document).on('click', '.notif-edit', function () {
    updateNotif($(this).data('id'))
  });
  
  $(document).on('click', '.notif-delete', function () {
    deleteNotif($(this).data('id'))
  });
  
  function updateNotif(id) {
    $.get(`/api/Notifs?type=detail&id=${id}`, function (d) {
      $("#idNotif").val(d.id);
      $("#nameNotif").val(d.name);
      $("#pathNotif").val(d.path);
      $("#typeNotif").val(d.type);
      $("#categoryNotif").val(d.category);
      $("#slugNotif").val(d.slug);
      $("#urlThumbNotif").val(d.thumb);
      $("#thumbNotif").attr("src", d.thumb);
      $("#updateNotif").modal("show");
    });
  };
  
  function loadNotifs() {
    $("#listNotifs").html("");
    $.get("/api/Notifs", function (d) {
      d.data.forEach((Notif) => {
        $("#listNotifs").append(`<tr>
            <td><span class="fw-bold">${Notif.name}</span></td>
            <td><span class="badge rounded-pill badge-light-info me-1">${Notif.category}</span></td>
            <td>${Notif.type}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">${feather.icons["more-vertical"].toSvg()}</button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="${d.base_url + Notif.slug}">${feather.icons.eye.toSvg({ class: "me-50" })}<span>Lihat</span></a>
                        <a class="dropdown-item Notif-edit" data-id="${Notif.id}">${feather.icons["edit-2"].toSvg({ class: "me-50" })}<span>Edit</span></a>
                        <a class="dropdown-item Notif-delete" data-id="${Notif.id}">${feather.icons["trash"].toSvg({ class: "me-50" })}<span>Delete</span></a>
                    </div>
                </div>
            </td>
        </tr>`);
      });
    });
  }
  
  function deleteNotif(id) {
    $.blockUI({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.ajax({
      url: 'notification?id=' + id,
      type: "DELETE",
      success: function (d) {
        $.unblockUI();
        loadNotifs();
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