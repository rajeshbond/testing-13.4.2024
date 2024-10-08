function signIn() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
   // Show processing indicator
  //  document.getElementById("processing-indicator").style.display = "block";
    var isDataEntered = username.trim() !== '' || password.trim() !== '';
    var processingIndicator = document.getElementById('processing-indicator');
    processingIndicator.style.display = isDataEntered ? 'block' : 'none';
 
  // Prepare data for POST request
  var data = {
    email: username,
    password: password
  };

  // Make a POST request using fetch API
  if (isDataEntered) {
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(async response => {
      // Check if response is successful
      document.getElementById("processing-indicator").style.display = "none";
      const data = await response.json();
      // console.log(response.status)
      // console.log(data.email_status)
      if (response.status == 208 || data.email_status == "unverifed" ) {
        // throw new Error('Network response was not ok');
        window.alert('Error: Email is not verified \n Please check your email');
        window.location.href = '/';
      }else if(response.status ==401){
        // throw new Error('Network response was not ok');
        // console.log('Network response was not ok');
        window.alert('Error: ' + "Invalid username or password");
        window.location.href = '/';
        return response.json();
      }else if (response.status == 200) {
        // console.log('Login Scuccessful');
        window.location.href = '/';
        // window.alert('Login Scuccessful\nDisclaimer: \n'+ "We are not SEBI Registered.\nInformation transmitted as Generated");
        // disPOPup();
        return response.json();
      }else {
        window.alert('Error: ' + "Invalid username or password");
        window.location.href = '/';
      }
      
      }
    );
  }else{
    window.alert('Please enter username and password');
  }

  }

function signUp() {
  const referralCode = document.getElementById('referralCode').value;
  if(referralCode == "not_found"){
    window.alert('Invalid Referral Code');
    window.location.href = '/';
    return;
  }
  
  if(referralCode){
    console.log("Referral Code:", referralCode);
  }else{
    console.log("No Referral Code");
  }
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobile = document.getElementById('mobile').value;

    // document.getElementById("processing-indicator").style.display = "block";
    let isDataEntered = name.trim() !== '' && email.trim() !== '' && password.trim() !== ''&& mobile.trim() !== '';
    // console.log(isDataEntered);
    if (isDataEntered) {
      let processingIndicator = document.getElementById('processing-indicator');
      processingIndicator.style.display = isDataEntered ? 'block' : 'none';
      let data;
      if(referralCode){
        data = {
          name: name,
          email: email,
          password: password,
          mobile: mobile,
          referral_code: referralCode
        };

      }else{
        data = {
          name: name,
          email: email,
          password: password,
          mobile: mobile,
        };
      }
      // console.log(data);
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        // Check if response status is OK (status code 200)
        document.getElementById("processing-indicator").style.display = "none";
        if (response.status === 200) {
          window.alert('Congratulations, You have signed up successfully\n Email verification link sent to your email');
          window.location.href = '/';
          return response.json();
        } else {
          // If the response status is not OK, throw an error with the status text
          window.alert('Error: ' + "Email Already Present");
          throw new Error(response.statusText);
  
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
    }else{
      window.alert('Please enter valid data in all fields');
    }
    
  }

    
 // Assume you have a function to make a POST request to the server to fetch user information
function fetchUserInfo() {
      fetch('/dashboard', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'exampleUser' }) // Replace 'exampleUser' with the actual username
      })
      .then(response => response.json())
      .then(data => {
        // Display the user information on the dashboard
        document.getElementById('welcome-message').innerText = `Welcome, ${data.name}`;
        document.getElementById('user-info').innerHTML = `
          <p>Name: ${data.name}</p>
          <p>Email: ${data.email}</p>
          <p>Mobile: ${data.mobile}</p>
        `;
      })
      .catch(error => console.error('Error:', error));
} 

    // Function to toggle password visibility

function sendResetEmail() {
    // document.getElementById("processing-indicator").style.display = "block";
    const email = document.getElementById('email').value;
    var isDataEntered = email.trim() !== ''; 
    var processingIndicator = document.getElementById('processing-indicator');
    processingIndicator.style.display = isDataEntered ? 'block' : 'none';
    // document.getElementById("processing-indicator").style.display = "none";
     
    // console.log(email);
    // Create a data object to send in the POST request
    const data = {
     
      email: email,
     
    };

    // console.log(data)

    if (isDataEntered) {
      fetch('/forgetpwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        // Check if response is successful
        document.getElementById("processing-indicator").style.display = "block";
        if (response.status!=200) {
          // throw new Error('Network response was not ok');
          // console.log('Network response was not ok');
          window.alert('Error: ' + "Please provide a valid email");
          window.location.href = '/forgetpwd';
        }else{
          window.alert('Success: Email Sent \n Please check your email');
          window.location.href = '/';
          return response.json();
        }
        
      });
    }else{
      window.alert('Please Enter Email');
    }
    
  }

// Show error dialog
function showErrorDialog(message) {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // Get the error message element
  var errorMessageElement = document.getElementById("errorMessage");

  // Display error message
  errorMessageElement.textContent = message;

  // When the user clicks the <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  // Display the modal
  modal.style.display = "block";
}

function refreshToken() {
  // Fetch the current ID token from cookies
  const currentIdToken = document.cookie.replace(/(?:(?:^|.*;\s*)id_token\s*=\s*([^;]*).*$)|^.*$/, "$1");

  if (currentIdToken) {
      // Make a POST request to the /refresh-token endpoint
      fetch('/refresh-token', {
          method: 'POST',
          credentials: 'same-origin', // Include cookies in the request
          headers: {
              'Content-Type': 'application/json'
          },
          // You can optionally pass the current ID token as a request body if needed
          // body: JSON.stringify({ id_token: currentIdToken })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to refresh token');
          }
          return response.json();
      })
      .then(data => {
          // Handle the refreshed token received from the server
          // console.log('Token refreshed successfully:', data);
          // Update the existing token with the new token
          // For example, you can update a global variable storing the token
          // or update the token stored in local storage or session storage
      })
      .catch(error => {
          console.error('Failed to refresh token:', error);
          // Handle error response
      });
  } else {
      console.error('ID token not found in cookies');
      // Handle case where ID token is not found in cookies
  }
}
function logout() {
  fetch('/logout', {
    method: 'GET',
    redirect: 'follow',
    
  }).then((response) => {
    window.location.href = '/';
    window.alert('Logged out successfully');
  })
  
}


function disPOPup(){
  // window.alert('Please Login First');
  let htmlContent = '';
  popdisp = document.querySelector('#overlay');
  htmlContent = `<div class="popup">
        <h2>Disclaimer</h2>
        <h3>Kind Attention of All Members</h3>
        <p>Disclaimer from Admins as per SEBI norms:<p>
        <ul>
            <li>Equity Investments are subject to 100% market risks. Kindly refer to your financial consultant advice before Trading & Investing in stock markets.</li>
            <li>This group/channel is only for Educational and Learning, Knowledge Purposes. Admins have no responsibility for your intended decision & financial losses. Keep calculated & always analyzed your cash position and risk bearing capacity before following msg of our group postings.</li>
            <li>Stock market investments are VERY RISKY and being part of this group, you agree that you understand the Market risks involved. Profits and Losses are part of Share market. Most of the times, retail traders end up making only Losses in Share market.</li>
            <li>All member pls follow guidelines as applicable even in past too.</li>
        </ul>
        <p>SEBI SOCIAL MEDIA MANDATE & MANDATORY DISCLAIMER AS REQUIRED BY SEBI</p>
        <p>Disclaimer/ disclosure</p>
        <ul>
            <li>This group/channel does not provide any tips/recommendations/advice</li>
            <li>All updates/analysis/posts/discussions are only for educational and learning purpose.</li>
            <li>Do Consult your financial advisor before taking trades or investment decisions</li>
            <li>Group/Channel Admins or Members are not responsible for any financial losses</li>
            <li>Disclaimer/disclosure/terms and conditions applicable to all members of this group/channel</li>
        </ul>
        <p>We are not SEBI registered. Members posting may not be SEBI registered also. All the posts are for education and learning purpose only.</p>
       <div class="but-agg"><button onclick="closePopup()">I Agree</button></div>
    </div>
</div>`;
// console.log(htmlContent);
popdisp.innerHTML = htmlContent;
function closePopup() {
  // console.log("clicked");
  document.getElementById('overlay').style.display = 'none';
  }
}

