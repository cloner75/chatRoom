// function LogIn user
const info = {
    address: `http://192.168.1.100`,
    port: `1337`,
    baseUrl: `/api/v1/users/`
}

function sendRequestLogin() {
    axios.post(`${info.address}:${info.port + info.baseUrl}login`, {
        em: $('#email').val(),
        se: $('#password').val()
    }).then(response => {
        console.log(response)
        if (response.data.error === 'user not exists')
            alert('user not exits')
        else if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            window.location.replace('../index.html');
        }
    }).catch(error => {
        console.log(error)
    })
}

// function register user

function sendRequestRegister() {
    axios.post(`${info.address}:${info.port + info.baseUrl}register`,
        {
            em: $('#email').val(),
            se: $('#password').val(),
            cs: $('#confirm').val(),
            na: $('#name').val(),
            ci: $('#city').val(),

        }).then(response => {
        window.location.replace('index.html')
    }).catch(error => {
        alert('check fields try again')
    })
}

//function for check user login

function getUsers() {
    const token = localStorage.getItem('token');
    if (token === undefined || token === null) {
        window.location.replace('login/index.html')
    } else {
        axios.get(`${info.address}:${info.port + info.baseUrl}find`,
            {
                headers: {'Authorization': localStorage.getItem('token')}
            }
            ).then(response => {
            response.data.map((item, i) => {
                $("#showUsers").append(`
                <li class="list-group-item"><a class="btn btn-info" title='Email : ${item.em}' href=chat.html?user_id=${item._id}>
                <img src="img/avatar.png" style="border-radius:25px" width=50>
                  SendMessageTo ${item.na}
                </a></li>
                `)
            })
        }).catch(error => {
            this.logout()
        })
    }
}

// function for logout user

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('socket');
    localStorage.removeItem('user');
    window.location.replace('./login/index.html')
}