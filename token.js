// Get variables from local storage
const jwt = localStorage.getItem('jwt');
const docid = localStorage.getItem('docid');
const apptype = localStorage.getItem('appname');
const docname = localStorage.getItem('docname');
const city = localStorage.getItem('city');
const address = localStorage.getItem('address');
const price = localStorage.getItem('price');
const appname = localStorage.getItem('appname');
const appid = localStorage.getItem('apptype');
document.getElementById('firstName').value = docname;
document.getElementById('firstName').readOnly = true;
document.getElementById('address').value = address;
document.getElementById('address').readOnly = true;
document.getElementById('price').value = price;
document.getElementById('price').readOnly = true;


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// Check if user is logged in
if (!jwt) {
    document.getElementById('not-logged-in').classList.remove('hidden');
} else {
    // Decode JWT to get patid and is_doctor
    const decoded = parseJwt(jwt);
    const patid = decoded.id;
    const is_doctor = decoded.isdoctor;
    fetch("http://127.0.0.1:3000/doctor/newtoken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Authorization: jwt
        },
        body: JSON.stringify({
            doctor_id: docid, date: "2023-01-22"
        })
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            document.getElementById('yourTkn').innerHTML = response.num;
        })
        .catch(e => {
            console.log(e);
        });

    fetch("http://127.0.0.1:3000/doctor/curtoken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Authorization: jwt
        },
        body: JSON.stringify({
            doctor_id: docid, date: "2023-01-22"
        })
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            document.getElementById('currTkn').innerHTML = response.num;
        })
        .catch(e => {
            console.log(e);
        });

}