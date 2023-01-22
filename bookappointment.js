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

  // Populate form fields with stored variables
  document.getElementById('doc-name').value = docname;
  document.getElementById('city').value = city;
  document.getElementById('address').value = address;
  document.getElementById('app-type').value = appname;
  document.getElementById('price').value = price;

  // Show form
  document.getElementById('appointment-form').classList.remove('hidden');

  // Handle form submission
  document.getElementById('slotBtn').addEventListener('click', e => {
    e.preventDefault();

    // Get form data
    const date = document.getElementById('date').value;
    const interactionMethod = document.getElementById('interaction-method').value;
    // const datetime = date + ' ' + time + ":00";

    fetch('http://127.0.0.1:3000/doctor/timeslots', {
      method: 'POST',
      headers: {

        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctor_id: docid,
        date: date
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        // Handle success/error
        // window.location = "/myappointments.html";
        for (i in response) {
          console.log(response[i]);
          let newBtn = document.createElement('button');
          newBtn.classList.add('slotBtn');
          newBtn.value = response[i].slot_id;
          newBtn.innerText = response[i].time_start;
          if(response[i].available == false){
            newBtn.disabled = true;
          } else {
            newBtn.addEventListener('click', e => makeApt(e));
          }
          document.getElementById('button-container').appendChild(newBtn);
        }
      })
      .catch(error => {
        console.error(error);

      });
  });

function makeApt(e){
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
      date: '2023-01-22',
      phyorvirt: "physical",
      status: "scheduled",
      // prescription: "",
      apptype: appid
    })
  })
    .then(response => {
      // Handle success/error
      //window.location = "/myappointments.html";
    })
    .catch(error => {
      console.error(error);
    });

}

}