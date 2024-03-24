function wpay(idi, ty) {
    const am = ty == 'Standard' ? 60000 : ty == 'Premium' ? 100000 : 0;
    $.post('/api/payment', `name=${fdat.name}&email=${fdat.email}&number=${fdat.number}&amount=${am}&type=${ty}`, function(d){
        if (d.status == 200){
          fpay(d.token, {
            onSuccess: function(dt){
              $.post('/payment/process?type=order', `oid=${dt.data.order_id}&paym=${dt.data.paym}&idi=${idi}&type=${ty}`, function(dg){
                if(dg.status == 200) Swal.fire('Thanks!', `Pembayaran anda berhasil, melalui ${dt.data.paym}.`, 'success');
                else Swal.fire('Error!', dg.msg, 'error');
              });
            },
            onPending: function(dt){
              Swal.fire('Info!', dt.msg, 'info');
            },
            onError: function(dt){
              Swal.fire('Opss!', dt.msg, 'error');
            },
            onClose: function(){
              Swal.fire('Warn!', `Popup payment di tutup!`, 'warning')
            }
          })
        }
      });
}

function indell(id) {
  $.get('dell?id=' + id, function(d) {
    if (d.status == 200) Swal.fire('Successfully', d.msg, 'success');
    else Swal.fire('Opss!', d.msg, 'error');
  })
}

const copyText = (el) => {
  navigator.clipboard.writeText($(`#${el}`).text())
    .then(() => Swal.fire('Successfully', 'Berhasil copy link unndangan.', 'success'))
    .catch(() => console.log('Gagal mengcopy!'));
}