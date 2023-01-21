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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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

  // Populate form fields with stored variables
  document.getElementById('doc-name').value = docname;
  document.getElementById('city').value = city;
  document.getElementById('address').value = address;
  document.getElementById('app-type').value = appname;
  document.getElementById('price').value = price;

  // Show form
  document.getElementById('appointment-form').classList.remove('hidden');

  // Handle form submission
  document.getElementById('submit-button').addEventListener('click', e => {
    e.preventDefault();

    // Get form data
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const interactionMethod = document.getElementById('interaction-method').value;
    const datetime = date + ' ' + time + ":00";

    fetch('http://127.0.0.1:3000/doctor/timeslots', {
      method: 'POST',
      headers: {
        
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctor_id: docid,
        date: "2023-01-21"
      })
    })
    .then(response=>response.json())
    .then(response => {
      // Handle success/error
      // window.location = "/myappointments.html";
      var e = length(response);
    })
    .catch(error => {
      console.error(error);
      
    });
  });
   
  function myFunction(e){
    for(let i = 0; i< e; i++){
      let newBtn = document.createElement('button');
      newBtn.innerText="Click me";
      document.getElementById('button-container').appendChild(newBtn);
    }
  }

    // Make API call to http://127.0.0.1:3000/newappointment
    fetch('http://127.0.0.1:3000/newappointment', {
      method: 'POST',
      headers: {
        'Authorization': jwt,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctor_id: docid,
        patient_id: patid,
        datetime: datetime,
        phyorvirt: interactionMethod,
        status: "scheduled",
        prescription: "",
        apptype: appid
      })
    })
    .then(response => {
      // Handle success/error
      window.location = "/myappointments.html";
    })
    .catch(error => {
      console.error(error);
    });
  });
}


