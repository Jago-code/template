function loadt(p) {
    $('#ltmp').html('');
    $.blockUI({ message: '<div class="spinner-grow  text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 }});
    var prm = p ? p : 'default';
    $.get(`/api/template?category=${prm}&idt=${$('#idt').val()}`, function(d) {
        $.unblockUI();
        d.data.forEach(df => {
            var typ = $('#typ').val() == 'Free' ? df.type != 'Free' ? 'disabled' : '' : ''
            $('#ltmp').append(`<div class="col-lg-3 col-md-4 col-6">
            <input class="custom-option-item-check" type="radio" name="tema" value="${df.id}" id="mtem-${df.id}" ${df.id == d.selected ? 'checked' : ''} ${typ}/>
            <label class="card custom-option-item" style="align-items: center;" for="mtem-${df.id}">
              <a href="/demo/tema/${df.slug}" target="_blank" class="btn btn-sm btn-primary" style="position: absolute; top: 0px; width: 80%;">${feather.icons['eye'].toSvg()}&nbsp; Preview</a>
              <img class="card-img-top mt-1" src="${df.thumb}" alt="${df.name}" />
              <div class="card-body"><h6>${df.name}</h6></div>
            </label>
          </div>`);
        });
    })
}

$('.ftema').submit(function(e){
    e.preventDefault();
    $('.ftema').block({ message: '<div class="spinner-border text-primary" role="status"></div>', css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });

    $.post($(this).attr('action'), $(this).serialize(), function(d){
      $('.ftema').unblock()
      if (d.status == 200) Swal.fire({ title: "Success!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      else Swal.fire({ title: "Error!", text: d.msg, icon: "error", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
    });
});

loadt();