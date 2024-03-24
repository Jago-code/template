if ($('.wdf').length) {
    $('.wdf').validate({
      onkeyup: function (element) {
        $(element).valid();
      },
      rules: {
        'metode': { required: true },
        'ewallet': { required: true },
        'bank': { required: true },
        'name': { required: true },
        'nowallet': { required: true },
        'nobank': { required: true },
        'amount': { required: true }
      }
    });
}
  
$('#wmtd').change(function() {
    if (this.value == 'bank'){
        $('.bank').show();
        $('.wallet').hide();
        $('.nowa').hide();
        $('.nobank').show();
    } else {
        $('.bank').hide();
        $('.wallet').show();
        $('.nowa').show();
        $('.nobank').hide();
    }
});