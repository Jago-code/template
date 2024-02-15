const elPo = document.querySelector("#postChart");

let o, e, t, r, a, i, s, n, l, d;
d = isDarkStyle
  ? ((o = config.colors_dark.cardColor),
    (e = config.colors_dark.headingColor),
    (t = config.colors_dark.textMuted),
    (a = config.colors_dark.borderColor),
    (i = config.colors_dark.bodyColor),
    (r = "dark"),
    (s = "#4f51c0"),
    (n = "#595cd9"),
    (l = "#8789ff"),
    "#c3c4ff")
  : ((o = config.colors.cardColor), (e = config.colors.headingColor), (t = config.colors.textMuted), (a = config.colors.borderColor), (i = config.colors.bodyColor), (r = ""), (s = "#e1e2ff"), (n = "#c3c4ff"), (l = "#a5a7ff"), "#696cff");
    
$( document ).ready(function() {
  $.get('/api/dataDash', function(d) {
    $('#myCamp').html(d.my_campaigns);
    $('#myBlog').html(d.my_blogs);
    $('#loadCampA, #loadMC, #loadMB, #loadActivity').remove();
    
    d.my_actvity_daily.slice(-5).forEach(f => {
     $('#myActivity').append(`
      <li class="timeline-item timeline-item-transparent">
        <span class="timeline-point timeline-point-info"></span>
        <div class="timeline-event pb-0">
          <div class="timeline-header mb-1">
            <h6 class="mb-0">${f.title}</h6>
            <small class="text-muted">${moment(f.updatedAt).fromNow()}</small>
          </div>
          <p class="mb-2">${f.desc}</p>
        </div>
      </li>`);
    })
   $('#myActivity').append(`
    <li class="timeline-end-indicator">
      <i class="bx bx-check-circle"></i>
    </li>`);
   
    w = {
      series: [{ name: 'My Post', data: d.anlystic.post_values }],
      chart: { height: 200, parentHeightOffset: 0, parentWidthOffset: 0, toolbar: { show: !1 }, type: "area" },
      dataLabels: { enabled: !1 },
      stroke: { width: 2, curve: "smooth" },
      legend: { show: !1 },
      markers: {
        size: 6,
        colors: "transparent",
        strokeColors: "transparent",
        strokeWidth: 4,
        discrete: [{ fillColor: config.colors.white, seriesIndex: 0, dataPointIndex: d.anlystic.post_largest_index, strokeColor: config.colors.primary, strokeWidth: 2, size: 6, radius: 8 }],
        hover: { size: 7 },
      },
      colors: [config.colors.primary],
      fill: { type: "gradient", gradient: { shade: r, shadeIntensity: 0.6, opacityFrom: 0.5, opacityTo: 0.25, stops: [0, 95, 100] } },
      grid: { borderColor: a, strokeDashArray: 3, padding: { top: -20, bottom: -8, left: -10, right: 8 } },
      xaxis: { categories: d.anlystic.post_keys, axisBorder: { show: !1 }, axisTicks: { show: !1 }, labels: { show: !0, style: { fontSize: "13px", colors: t } } },
      yaxis: { labels: { show: !1 }, min: 0, max: 100, tickAmount: 4 },
    };
    
    if (void 0 !== typeof elPo && null !== elPo) {
      new ApexCharts(elPo, w).render();
    }
  })
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
});


