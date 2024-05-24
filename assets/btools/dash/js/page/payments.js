$(function() {
  var itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

$('#btWallet').click(function () {
  $('.payment-form').block({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: {
      type: $('#type').val(),
      payment_method: 'E-Wallet'
    },
    url: '/a/payment/fpay',
    type: 'POST',
    success: function (d) {
      $('.payment-form').unblock();
      handlerPay(d.token);
    },
    error: function (e) {
      $('.payment-form').unblock();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    }
  });
});

function handlerPay(token) {
  fpay(token, {
    onSuccess: function (res) {
      paymentProcess(res);
    },
    onPending: function () {
      Swal.fire({ title: 'Wait!', text: 'Wating your payment!', icon: 'warning', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    },
    onError: function () {
      Swal.fire({ title: 'Error!', text: 'Payment failed!!', icon: 'error', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    },
    onClose: function () {
      Swal.fire({ title: 'Upss!', text: 'You closed the popup without finishing the payment!', icon: 'warning', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    }
  });
}

function paymentProcess(res) {
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0' }, overlayCSS: { backgroundColor: '#fff', opacity: 0.8 } });
  $.ajax({
    data: {
      order_id: res.transaction.order_id,
      payment_method: res.transaction.payment_method
    },
    url: '/a/payment/process',
    type: 'POST',
    success: function (d) {
      $.unblockUI();
      Swal.fire({ title: 'Good job!', text: 'Your payment has been successful 🎉', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 }).then(() => location.reload());
    },
    error: function (e) {
      $.unblockUI();
      const msg = e.responseJSON.msg;
      Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon: 'error', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
    }
  });
}

})
