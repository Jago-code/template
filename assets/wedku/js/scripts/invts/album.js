var from = $('#addGaleryValidation');

$('#mtdf').change(function(){
  if(this.value == 'url'){
    $('#murl').show()
    $('#mfile').hide()
  }else{
    $('#murl').hide()
    $('#mfile').show()
  }
})

if (from.length) {
    from.validate({
      onkeyup: function (element) {
        $(element).valid();
      },
      rules: {
        'mtdf': { required: true},
        'file': { required: true},
        'url': { required: true},
        'desc': { required: true}
      }
    });
}
  
$(from).submit(function(e){
    e.preventDefault();
    if (!from.valid()) return false
    $(from).block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
    $.post($(this).attr('action'), $(this).serialize(), function(d){
      $(from).unblock()
      if (d.status == 200){
        Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        .then(() => location.reload());
      }else Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    });
});

function delet(id) {
    $.get(`/a/invt/album/d?id=${id}`, function(d) {
        Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            .then(() => location.reload());
    })
}