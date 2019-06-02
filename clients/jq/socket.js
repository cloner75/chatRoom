const token = localStorage.getItem('token');
if (token === undefined || token === null) {
    window.location.replace('login.html')
} else {
    axios.post(`${info.address}:${info.port + info.baseUrl}verify`, {token: token}).then(res => {
        localStorage.setItem('user', res.data.token.user_id)
    }).catch(err => {
        this.logout()
    })
}

$(function () {
    $("#chat").animate({scrollTop: $('#chat').height() * 4}, 1000);
    let socket = io(`${info.address}:8000`);
    let searchParams = new URLSearchParams(window.location.search)

    if (searchParams.has('user_id')) {
        let param = searchParams.get('user_id')
        axios.get(`${info.address}:${info.port}/api/v1/rooms/find?to=${param}&user_id=${localStorage.getItem('user')}`, {
            headers: {'Authorization': localStorage.getItem('token')}
        })
            .then(res => {
                if (res.data) {
                    localStorage.setItem('socket', `connect-${res.data.na}`)
                } else {
                    localStorage.setItem('socket', `connect-room-${localStorage.getItem('user')}-${param}`)
                }
                socket.emit('create-room', {token: localStorage.getItem('token'), to: param})
                socket.on(localStorage.getItem('socket'), function (data) {
                    if (data.switch === 1) {
                        // get history chats
                        $('#errors').append(`<li class="list-group-item"> ${data.message}</li>`);
                        data.data.map((item, i) => {
                            if (item.ty === 'text') {
                                $('#messages').append(`<li>${item.uid.na}: ${item.co} <span  style="float: right"><img class="status-message" src="img/${item.st === '1' ? 'tick.png' : 'd-tick.png'}" width="20" alt=""></span></li>`);
                            } else if (item.ty === 'file') {
                                $('#messages').append(`<li>${item.uid.na}: <img width="200" src='${info.address}:${info.port}/CDN/${item.co}'> <span style="float: right"><img src="img/${item.st === 1 ? 'tick.png' : 'd-tick.png'}" width="20" alt=""></span> </li>`);
                            }
                        })
                    } else if (data.switch === 0) {
                        // get new chat messages
                        if (data.ty === 'text') {
                            $('#messages').append(`<li>${data.user}: ${data.data} <span style="float: right"><img class="status-message" src="img/${data.st === 1 ? `tick.png` : `d-tick.png` }" width="20" alt=""></span></li>`);
                        } else if (data.ty === 'file') {
                            $('#messages').append(`<li>${data.user}:<img  width="200" src='${info.address}:${info.port}/CDN/${data.data}'>  <span style="float: right"><img  class="status-message" src="img/${data.st === 1 ? `tick.png` : `d-tick.png` }" width="20" alt=""></span> </li>`);
                        }
                        $(`#${data.data.split(' ').join('')}`).remove()

                    } else if (data.switch === 3 && data.user !== localStorage.getItem('user')) {
                        $('.status-message').attr('src', 'img/d-tick.png')
                    }
                    $("#chat").animate({scrollTop: $('#chat').height() * 4})
                })
            }).catch(err => {
            this.logout()
        })
    }


    let param = searchParams.get('user_id')
    // send File
    $('input[type="file"]').change(function (e) {
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios.post(`${info.address}:${info.port}/CDN/Upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
            $('#messages').append(`<li id='${response.data}'>sending file ... <span style="float: right"><img src="img/clock.png" width="20" alt=""></span> </li>`)
            socket.emit(localStorage.getItem('socket'), {
                co: response.data,
                ty: 'file',
                token: localStorage.getItem('token')
            });
        }).catch(err => {
            console.log(err);
        })
    })


    $('form').submit(function (e) {
        e.preventDefault();
        $('#messages').append(`<li id=${$('#send-text').val().split(' ').join('')}>${$('#send-text').val()}<span style="float: right"><img src="img/clock.png" width="20" alt=""></span></li>`)
        socket.emit(localStorage.getItem('socket'), {
            co: $('#send-text').val(),
            ty: 'text',
            token: localStorage.getItem('token')
        });
        $('.emoji-wysiwyg-editor').empty();
        $("#chat").animate({scrollTop: $('#chat').height() * 4}, 1000);

    });

});

