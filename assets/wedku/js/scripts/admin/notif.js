$(document).ready(function() {
  function load() {
    $('#ldt').html('')
    $.post(`/api/notif`, function(d) {
        d.system.forEach(df => {
            $('#ldt').append(`<tr>
            <td>${df.title}</td>
            <td>${df.desc}</td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">${feather.icons['more-vertical'].toSvg()}</button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#${df.id}">${feather.icons['edit-2'].toSvg({ class: 'me-50' })}<span>Edit</span></a>
                        <a class="dropdown-item" href="/admin/notif/d/${df.id}">${feather.icons['trash'].toSvg({ class: 'me-50' })}<span>Delete</span></a>
                    </div>
                </div>
            </td>
        </tr>`)
        });
    })
  }
  load()
});
