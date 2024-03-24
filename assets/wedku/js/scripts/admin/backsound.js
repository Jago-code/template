function load() {
    $('#ldt').html('')
    $.get('/api/backsound', function(d) {
        d.forEach(df => {
            $('#ldt').append(`<tr>
            <td><span class="fw-bold">${df.title}</span></td>
            <td><span class="badge rounded-pill badge-light-info me-1">${df.type}</span></td>
            <td>
                <div class="dropdown">
                    <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">${feather.icons['more-vertical'].toSvg()}</button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="${df.url}">${feather.icons['eye'].toSvg({ class: 'me-50' })}<span>Lihat</span></a>
                        <a class="dropdown-item" href="/admin/backsound/d/${df.id}">${feather.icons['trash'].toSvg({ class: 'me-50' })}<span>Delete</span></a>
                    </div>
                </div>
            </td>
        </tr>`)
        });
    })
}
load()