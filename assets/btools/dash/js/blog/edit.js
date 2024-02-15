"use strict";

$(function () {
  var myDataImage,
    myTagify,
    myClip = [].slice.call(document.querySelectorAll('.clipboard-btn')),
    itemLoader = '<div class="d-flex justify-content-center"><div class="sk-wave sk-primary"><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div><div class="sk-wave-rect"></div></div></div>';

  new Quill("#full-editor", {
    bounds: "#full-editor",
    placeholder: "Type Something...",
    modules: {
      formula: !0,
      toolbar: [
        [{ font: [] }, { size: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }, { script: "super" }, { script: "sub" }],
        ["direction", { align: [] }, { indent: "-1" }, { indent: "+1" }],
        [{ list: "ordered" }, { list: "bullet" }, "blockquote", "code-block"],
        ["link", "image", "video", "formula"],
        ["clean"],
      ],
    },
    theme: "snow",
  });
  
  $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
  $.getJSON(`/api/getLabelBlogger?idb=${$('#idb').val()}`, function (d) {
    myTagify = new Tagify(document.querySelector("#lblf"), { whitelist: d.data, maxTags: 10, dropdown: { maxItems: 20, classname: "", enabled: 0, closeOnSelect: !1 } });
    $.unblockUI();
  });

  $('#cview').on('change', function() {
    if(this.value == 'html'){
      $('#cnt').show();
      $('#fcnt').hide();
      $('#cnt').val($('.ql-editor').html())
    }else{
      $('#fcnt').show();
      $('#cnt').hide();
      $('.ql-editor').html($('#cnt').val())
    }
  })

  $('.formPost').submit(function(e) {
    e.preventDefault();
    if ($("#fcnt").is(":visible")) {
      $('#cnt').val($('.ql-editor').html())
    }
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.ajax({
      data: $(this).serialize(),
      url: $(this).attr("action"),
      type: "POST",
      success: function (d) {
        $.unblockUI()
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      },
      error: function (e) {
        $.unblockUI()
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  });

  window.deletPost = () => {
    Swal.fire({ text: "Do you want to delete this post?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(function (e) {
        if (e.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
          $.ajax({
            data: `idb=${$('#idb').val()}&idp=${$('#idp').val()}`,
            url: '/a/blog/b/posts/dell',
            type: "POST",
            success: function (d) {
              $.unblockUI()
              Swal.fire({ title: "Good job!", text: d.msg, icon:"success", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 })
                .then(() => window.location.href = '/a/blog/b/posts/' + $('#idb').val());
            },
            error: function (e) {
              $.unblockUI()
              const msg = e.responseJSON.msg;
              Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
            },
          });
        }
      });
  }
  
  // tools
  $('#formSearchCont').submit(function(e){
    e.preventDefault();
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.ajax({
      url: `/api/tools/search-article?q=${$('#vser').val()}&type=${$('#tser').val()}`,
      type: "GET",
      success: function (d) {
        $.unblockUI();
        $('#hsct').html('');
        myDataImage = d.data;
        d.data.forEach(f => {
          if (f.type == 'image') {
            $('#hsct').append(`<a onclick="getContent('${f.id}', 'image')" class="list-group-item list-group-item-action d-flex align-items-center cursor-pointer">
            <img src="${f.src.small}" alt="${f.title}" class="rounded me-2 w-px-50">
            <div class="w-100"><h6 class="mb-1">${f.title}</h6></div></a>`)
          } else {
            $('#hsct').append(`<a onclick="getContent('${encodeURIComponent(f.url)}', '${$('#tser').val()}')" class="list-group-item list-group-item-action ">${f.title}</a>`)
          }
        });
        Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 });
      },
      error: function (e) {
        $.unblockUI()
        const msg = e.responseJSON.msg;
        Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
      },
    });
  })
  
  window.getContent = (url, type) => {
    if (type == 'image') {
      const fim = myDataImage.find(f => f.id == url);
      $('#imgResult').show();
      $('#myImgResult').attr('src', fim.src.medium);
      $('#myResult').val(`<p style="text-align: center;"><img src="${fim.src.medium}" alt="${fim.title} - Jago Post"/></p>`);
      $('#mContent').modal('show');
      $('#mSearch').modal('hide');
    } else {
      $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
      $.ajax({
        url: `/api/tools/get-content?url=${url}&type=${type}`,
        type: "GET",
        success: function (d) {
          $.unblockUI();
          $('#jdl, .ql-editor').html('');
          $('#jdl').val(d.data.title);
          $('.ql-editor').html(d.data.content);
          $('#mSearch').modal('hide');
          Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
        },
        error: function (e) {
          $.unblockUI()
          const msg = e.responseJSON.msg;
          Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
        },
      });
    }
  }

  window.seoFormatting = () => {
    Swal.fire({ text: "Would you like to SEO Formatting this article?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(f => {
        if (f.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
          var inputLabel = $('[name=label]').val();
          var myLabel = inputLabel != '' ? inputLabel : '[]';
          var jsonLabel = JSON.parse(myLabel);
          var selLabel = jsonLabel?.length ? jsonLabel[Math.floor(Math.random() * jsonLabel.length)].value : null;
          $.ajax({
            data: {
              idb: $('#idb').val(),
              title: $('#jdl').val(),
              body: $('.ql-editor').html(),
              label: selLabel
            },
            url: `/api/tools/seo-content`,
            type: "POST",
            success: function (d) {
              $.unblockUI()
              $('.ql-editor').html(d.content);
              Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            },
            error: function (e) {
              $.unblockUI()
              const msg = e.responseJSON.msg;
              Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
            },
          });
        }
      })
  }
  
  window.spinContent = () => {
    Swal.fire({ text: "Would you like to spin this article?", icon: "warning", showCancelButton: !0,confirmButtonText: "Yes", customClass: { confirmButton: "btn btn-primary me-2", cancelButton: "btn btn-label-secondary" }, buttonsStyling: !1 })
      .then(f => {
        if (f.value) {
          $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
          $.ajax({
            data: { text: $('.ql-editor').html(), lang: 'en' },
            url: `/a/tools/article-spinner`,
            type: "POST",
            success: function (d) {
              $.unblockUI()
              $('.ql-editor').html(d.content);
              Swal.fire({ title: "Good job!", text: d.msg, icon: "success", customClass: { confirmButton: "btn btn-primary" }, buttonsStyling: !1 })
            },
            error: function (e) {
              $.unblockUI()
              const msg = e.responseJSON.msg;
              Swal.fire({ title: "Upss!", text: msg ? msg : 'There is an error!', icon:"error", customClass:{ confirmButton:"btn btn-primary" }, buttonsStyling: !1 });
            },
          });
        }
      })
  }
  
  $('#formTranCont').submit(function(e){
    e.preventDefault();
    $.blockUI({ message: itemLoader, css: { backgroundColor: 'transparent', border: '0'}, overlayCSS: { backgroundColor:"#fff", opacity:.8 } });
    $.ajax({
      data: {
        text: '<p>'+$('#jdl').val()+'</p>------'+$('.ql-editor').html(),
        from: $('#fromTrans').val(),
        to: $('#toTrans').val()
      },
      url: $(this).attr('action'),
      type: 'POST',
      success: function (d) {
        $.unblockUI();
        $('#jdl, .ql-editor').html('');
        const mDat = d.content.split('------');
        var tempDiv = $('<div>').html(d.content);
        $('#jdl').val(tempDiv.find('p:first').text());
        $('.ql-editor').html(mDat[1]);
        $('#mTransCont').modal('hide');
        Swal.fire({ title: 'Good job!', text: 'Successfully translated content.', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      },
      error: function (e) {
        $.unblockUI();
        const msg = e.responseJSON.msg;
        Swal.fire({ title: 'Upss!', text: msg ? msg : 'There is an error!', icon:'error', customClass:{ confirmButton:'btn btn-primary' }, buttonsStyling: !1 });
      }
    });
  });
  
  if (ClipboardJS) {
    myClip.map(function (t) {
      const c = new ClipboardJS(t);
      c.on('success', function (t) {
        'copy' == myClip.action && Swal.fire({ title: 'Good Job!', text: 'Copied to Clipboard!', icon: 'success', customClass: { confirmButton: 'btn btn-primary' }, buttonsStyling: !1 });
      });
    })
  } else {
    myClip.map(function (t) {
      myClip.setAttribute('disabled', !0);
    });
  }
  
  $('#mContent').on('hidden.bs.modal', function() {
    $('#mSearch').modal('show');
  });
  
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