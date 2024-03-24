$(document).ready(function() {
  function load() {
    $('#ldt').html('')
    $.get('/api/template', function(d) {
        d.data.forEach(df => {
            $('#ldt').append(`<tr>
            <td><span class="fw-bold">${df.name}</span></td>
            <td><span class="badge rounded-pill badge-light-info me-1">${df.category}</span></td>
            <td>${df.type}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">${feather.icons['more-vertical'].toSvg()}</button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="/demo/tema/${df.slug}">${feather.icons.eye.toSvg({ class: 'me-50' })}<span>Lihat</span></a>
                        <a class="dropdown-item" onclick="updateTm('${df.id}')">${feather.icons['edit-2'].toSvg({ class: 'me-50' })}<span>Edit</span></a>
                        <a class="dropdown-item" href="/admin/temaDelete/${df.id}">${feather.icons['trash'].toSvg({ class: 'me-50' })}<span>Delete</span></a>
                    </div>
                </div>
            </td>
        </tr>`)
        });
    })
  }
  load()

  $('#igm').on('change', function (e) {
    var files = e.target.files;
    if(files[0].name != undefined || files[0].name != ''){
      uploadFile(files[0].name, files[0])
        .then(dur => $('#thumb').val(dur));
    }else alert('File not found!');
  });

  $('#uitbm').on('change', function (e) {
    var files = e.target.files;
    if(files[0].name != undefined || files[0].name != ''){
      uploadFile(files[0].name, files[0])
        .then(dur => {
          $('#umimg').val(dur);
          $('#utmb').attr('src', dur);
        });
    }else alert('File not found!');
  });
})

window.updateTm = function(id) {
  $.get(`/api/template?type=detail&id=${id}`, function(d) {
    $('#uidf').val(d.id);
    $('#unmf').val(d.name);
    $('#utyp').val(d.type);
    $('#uctg').val(d.category);
    $('#uslug').val(d.slug);
    $('#umimg').val(d.thumb);
    $('#utmb').attr('src', d.thumb);
    $('#updateTema').modal('show');
  });
}