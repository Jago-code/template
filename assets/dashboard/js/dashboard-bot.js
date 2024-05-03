$(document).ready(function () {
  loadDatas();
  
  function loadDatas() {
    $('.loaderData').show();
    $('.loadedData').hide();
    $.get('dashboard?type=json', function (d) {
      $('.totalBots').html(d.totalBots);
      $('.totalKeys').html(d.totalKeys);
      $('.totalHits').html(d.totalHits);
      $('.totalErrors').html(d.totalErrors);
      
      $('.loaderData').hide();
      $('.loadedData').show();
    });
  }
});
