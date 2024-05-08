$.fn.extend({
  loaderHide: function () {
    this.removeClass('d-flex').addClass('d-none');
  },
  loaderShow: function () {
    this.removeClass('d-none').addClass('d-flex');
  }
});

$(document).ready(function () {
  let cardColor, headingColor, legendColor, labelColor, borderColor;
  if (isDarkStyle) {
    cardColor = config.colors_dark.cardColor;
    labelColor = config.colors_dark.textMuted;
    legendColor = config.colors_dark.bodyColor;
    headingColor = config.colors_dark.headingColor;
    borderColor = config.colors_dark.borderColor;
  } else {
    cardColor = config.colors.cardColor;
    labelColor = config.colors.textMuted;
    legendColor = config.colors.bodyColor;
    headingColor = config.colors.headingColor;
    borderColor = config.colors.borderColor;
  }

  // load data analystic
  loadStatistik();
  loadEarningReportYearly();
  
  $('.btn-refresh').click(function(){
    loadEarningReportYearly();
    loadStatistik();
  });

  // Earning Reports Tabs Function
  function EarningReportsBarChart(arrayData, arrayCategory, highlightData) {
    const basicColor = config.colors_label.primary,
      highlightColor = config.colors.primary;
    var colorArr = [];

    for (let i = 0; i < arrayData.length; i++) {
      if (i === highlightData) {
        colorArr.push(highlightColor);
      } else {
        colorArr.push(basicColor);
      }
    }

    const earningReportBarChartOpt = {
      chart: {
        height: 258,
        parentHeightOffset: 0,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '32%',
          startingShape: 'rounded',
          borderRadius: 7,
          distributed: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
          left: -10,
          right: -10
        }
      },
      colors: colorArr,
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return formatCurrency(val);
        },
        offsetY: -25,
        style: {
          fontSize: '15px',
          colors: [legendColor],
          fontWeight: '600',
          fontFamily: 'Public Sans'
        }
      },
      series: [
        {
          data: arrayData
        }
      ],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      xaxis: {
        categories: arrayCategory,
        axisBorder: {
          show: true,
          color: borderColor
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px',
            fontFamily: 'Public Sans'
          }
        }
      },
      yaxis: {
        labels: {
          offsetX: -15,
          formatter: function (val) {
            return formatCurrency(parseInt(val));
          },
          style: {
            fontSize: '13px',
            colors: labelColor,
            fontFamily: 'Public Sans'
          },
          min: 0,
          max: 60000,
          tickAmount: 6
        }
      },
      responsive: [
        {
          breakpoint: 1441,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '41%'
              }
            }
          }
        },
        {
          breakpoint: 590,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '61%',
                borderRadius: 5
              }
            },
            yaxis: {
              labels: {
                show: false
              }
            },
            grid: {
              padding: {
                right: 0,
                left: -20
              }
            },
            dataLabels: {
              style: {
                fontSize: '12px',
                fontWeight: '400'
              }
            }
          }
        }
      ]
    };
    return earningReportBarChartOpt;
  }

  // Earning Reports Tabs Profit
  // --------------------------------------------------------------------
  function loadEarningReportYearly() {
    $('.loaderEarning').loaderShow();
    $('#earningReportYearly').hide();
    $('.incomeToday').hide();
    $('.incomeThisMonth').hide();

    $.get('/api/dashboard?type=earningReportYearly', function (d) {
      $('.loaderEarning').loaderHide();
      $('#earningReportYearly').show();
      $('.incomeToday').show();
      $('.incomeThisMonth').show();
      
      if (d?.data) {
        $('.incomeToday').html(`<p class="mb-2 mt-1">${formatCurrency(d.data.incomeToday.income)}</p>
          <div class="pt-1">
            <span class="badge bg-label-${d.data.incomeToday.status}">${d.data.incomeToday.percentage}</span>
          </div>`);
  
        $('.incomeThisMonth').html(`<p class="mb-2 mt-1">${formatCurrency(d.data.incomeThisMonth.income)}</p>
          <div class="pt-1">
            <span class="badge bg-label-${d.data.incomeThisMonth.status}">${d.data.incomeThisMonth.percentage}</span>
          </div>`);
  
        const earningReportYearlyEl = document.querySelector('#earningReportYearly'),
          earningReportYearlyConfig = EarningReportsBarChart(d.data.chartData, d.data.categoryData, d.data.activeIndex);
        if (typeof earningReportYearlyEl !== undefined && earningReportYearlyEl !== null) {
          const earningReportYearly = new ApexCharts(earningReportYearlyEl, earningReportYearlyConfig);
          earningReportYearly.render();
        }
      } else {
        $('.incomeToday').html(`<p class="mb-2 mt-1">-</p>
          <div class="pt-1">
            <span class="badge bg-label-secondary">-</span>
          </div>`);
        $('.incomeThisMonth').html(`<p class="mb-2 mt-1">-</p>
          <div class="pt-1">
            <span class="badge bg-label-secondary">-</span>
          </div>`);
        $('#earningReportYearly').html('<span class="text-muted">Silahkan login ke akun adsense anda terlebih dahulu.<span>');
      }
    });
  }

  function loadStatistik() {
    $('.loaderStatistik').loaderShow();
    $('.dataStatistik').hide();

    $.get('/api/dashboard?type=statistics', function (d) {
      $('.loaderStatistik').loaderHide();
      $('.dataStatistik').show();

      $('.dataStatistik').html(`<div class="col-md-3 col-6">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-primary me-3 p-2">
            <i class="ti ti-trending-up ti-sm"></i>
          </div>
          <div class="card-info">
            <h5 class="mb-0">${formatCurrency(d.totalHits)}</h5>
            <small>Request</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-info me-3 p-2">
            <i class="ti ti-robot ti-sm"></i>
          </div>
          <div class="card-info">
            <h5 class="mb-0">${d.totalBots}</h5>
            <small>Server Bot</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-success me-3 p-2">
            <i class="ti ti-key ti-sm"></i>
          </div>
          <div class="card-info">
            <h5 class="mb-0">${d.totalKeys}</h5>
            <small>Kunci Akses</small>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-danger me-3 p-2">
            <i class="ti ti-alert-octagon ti-sm"></i>
          </div>
          <div class="card-info">
            <h5 class="mb-0">${d.totalErrors}</h5>
            <small>Error</small>
          </div>
        </div>
      </div>`);
    });
  }

  function formatCurrency(amount) {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(2) + ' m';
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2) + ' jt';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + ' rb';
    } else {
      return amount.toString();
    }
  }
});
