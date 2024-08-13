let RAZORPAY_id
const referbth = document.getElementById("refer");
const closeBtn = document.querySelector("#close-btn");


document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.header-menu__icon');
  const menu = document.querySelector('.header-menu__nav');

  function toggleMenu() {
    menu.classList.toggle('open');
  }

  function closeMenu(event) {
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
      menu.classList.remove('open');
    }
  }

  menuIcon.addEventListener('click', toggleMenu);
  document.addEventListener('click', closeMenu);
});


// funtion Decleration 
// get the use information
const getUserData = async () => {
  try {
    const response = await fetch("/api/getUsername");
    const data = await response.json();
    // console.log(data);
    const adminDisplay = document.querySelector('#admin-panel');
    isAdmin = data.user.isUserAdmin
    if (isAdmin == true) {
      adminDisplay.style.display = "block";
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
getUserData();

updateUsername();
// Logout code 

function logout() {
  // Perform logout operation here, such as calling logout API

  fetch("/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Successful logout
        window.location.href = "/"; // Redirect after successful logout
      } else {
        throw new Error("Logout failed");
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      // Handle error (e.g., display error message)
    });
}

// back to admin Panel
async function adminPanel(){
  window.location.href = '/admin';
}
async function dashboard(){
  window.location.href = '/dashboard';
}

// update user name 
async function updateUsername() {
  try {
    const userData = await getUserData();
    // console.log(userData);
    const username = userData.user.name;
    const userStatus = userData.user.isSubscribed;
    document.querySelector("#username").innerText = username;
  } catch (error) {
    console.error(error);
  }
}

// Account 
async function account() {
  let content = document.querySelector(".content");
  console.log(content);
  htmlContent = `<div class="user-info">
  <h2>User Information</h2>
  <p><strong>Name:</strong> <span id="displayUser"></span></p>
  <p><strong>Email:</strong> <span id="displayEmail"></span></p>
  <p><strong>Subscription Status:</strong> <span id="subscription-status"></span></p>
  <p><strong>Subscription Type:</strong> <span id="subscription-type"></span></p>
  <p><strong>Subscription Start Date:</strong> <span id="subscription-start-date"></span></p>
  <p><strong>Subscription End Date:</strong> <span id="subscription-end-date"></span></p>  
  <p><strong id ="subscription-coupon-used"></strong> <span id="subscription-coupon-details"></span></p>  
</div>`;
  // Select the content element where you want to add the TradingView widget

  content.innerHTML = "";
  content.innerHTML = htmlContent;
  try {
    const userData = await getUserData();
    console.log(userData.user)
    isScreenerState = userData.user.screener_active
    userName = userData.user.name;
    userEmail = userData.user.email;
    subscriptionStatus = userData.user.subscriptionDetails.subscriptionStatus;
    currentSubscription = userData.user.subscriptionDetails.currentSubscription;
    couponUsed = userData.user.subscriptionDetails.coupon_applied;
  console.log(`couponUsed: ${couponUsed}`);
    subscriptionDate = dateconverter(
      userData.user.subscriptionDetails.subscriptionDate
    );
    subscriptionEndDate = dateconverter(
      userData.user.subscriptionDetails.subscriptionEndDate
    );

    document.querySelector("#displayUser").innerText = userName;
    document.querySelector("#displayEmail").innerText = userEmail;
    document.querySelector("#subscription-status").innerText =
      subscriptionStatus;
    document.querySelector("#subscription-status").style.color = isScreenerState? "green" : "red";
    document.querySelector("#subscription-type").style.color = isScreenerState? "green" : "red";
    document.querySelector("#subscription-end-date").style.color = isScreenerState? "green" : "red";
    document.querySelector("#subscription-type").innerText =
      currentSubscription;
    document.querySelector("#subscription-start-date").innerText =
      subscriptionDate;
    document.querySelector("#subscription-end-date").innerText =
      subscriptionEndDate;
    if(couponUsed != "no coupon applied"){
      document.querySelector("#subscription-coupon-used").innerText =
      "Coupon Used";
      document.querySelector("#subscription-coupon-details").innerText =couponUsed
    }
    
  } catch (error) {
    console.error(error);
  }
}

// Subscription display 

function subscribePlanDisplay() {
  let content = document.querySelector(".content");
  htmlContent = `<div class="subscription-box-container">
      <div class="subscription-box">
          <img src="static/images/achivers_club.jpeg" alt="achivers_club">
          <button class ="btn-subscribe" onclick="achivers_club()">Join Now</button>
      </div>
      <div class="subscription-box">
        <img src="static/images/champions_club.jpeg" alt="champions_club">
        <button class ="btn-subscribe" onclick="champions_club()">Join Now</button>
      </div>
          
  </div>
  <div class="clearfix"></div>`;
  // Select the content element where you want to add the TradingView widget

  content.innerHTML = "";
  content.innerHTML = htmlContent;
}




// Support 

function support() {
  let content = document.querySelector(".content");
  htmlContent = `<div class="user-support">
  <h2>Customer Support</h2>
  <p><strong>Email:</strong> <span id="subscription-status">info@compoundingfunda.com</span></p>
  
</div>`;
  // Select the content element where you want to add the TradingView widget
  // console.log(htmlContent);
  content.innerHTML = "";
  content.innerHTML = htmlContent;
}
// Fetch Envionment Variables
async function fetchEnvironmentVariables() {
  try {
      const response = await fetch('/env');
      if (!response.ok) {
          throw new Error('Failed to fetch environment variables');
      }
      const data = await response.json();
      console.log(data);
      RAZORPAY_id = data // This will log the environment variables to the console
      return data;
      // Use the environment variables as needed in your JavaScript application
  } catch (error) {
      console.error('Error:', error);
  }
}

// Trading Register
const tradingButton = document.querySelector('#trading-reg')

tradingButton.addEventListener('click',async function(){
  console.log("Trading button clicked")
  try {
    const userData = await getUserData();
    isScreenerState = userData.user.screener_active;
    if(isScreenerState){
      window.location.href = "/traderegister"; 
    }else{
      sweetAlert("OOPS...", `your ${current_state} \n Please Join immediatley to the valid Plan`, "error");
      subscribePlanDisplay();
    }    
  } catch (error) {
    console.error(error);
  }
});

// Screener Achivers Club
async function screener() {
  try {
    const userData = await getUserData();
    data = userData.user.subscriptionDetails.subscriptionEndDate;
    current_state = userData.user.subscriptionDetails.currentSubscription;
    isScreenerState = userData.user.screener_active;
    // console.log(`screene ${isScreenerState}`);
    if(isScreenerState){
      swal({
        title: "Disclaimer",
        text: "The data provided herein is sourced from reliable and authorized data providers. However, users are advised to exercise due diligence and verify the accuracy and completeness of the data independently. Neither the data provider nor any associated entity shall be liable for any errors, omissions, or losses arising from the use of this data. Investors should consult their financial advisors and consider their risk tolerance before making any investment decisions based on this information",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, I Agree!!!",
        closeOnConfirm: false
      },
      function(){
        swal.close();
        // window.location.href = "/campdashboard"; 
        window.location.href = "/screener"; 
      });
      
      // window.location.href = "/screener"; 
    }else{
      sweetAlert("OOPS...", `your ${current_state} \n Please Join immediatley to the valid Plan`, "error");
      subscribePlanDisplay();
    }    
  } catch (error) {
    console.error(error);
  }
}

// Champions Club

function ShowDisclaimer(){
  console.log("disclaimer");
}

async function champDisplay() {
  console.log("champDisplay Rajesh");
  try {
    const userData = await getUserData();
    current_state = userData.user.subscriptionDetails.currentSubscription;
    isScreenerState = userData.user.screener_active;
    console.log(`screene ${isScreenerState} ${current_state}`);
    console.log(`screene ${isScreenerState}`);
    if(isScreenerState && current_state == "Champions Club"){
      swal({
        title: "Disclaimer",
        text: "The data provided herein is sourced from reliable and authorized data providers. However, users are advised to exercise due diligence and verify the accuracy and completeness of the data independently. Neither the data provider nor any associated entity shall be liable for any errors, omissions, or losses arising from the use of this data. Investors should consult their financial advisors and consider their risk tolerance before making any investment decisions based on this information.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, I Agree!!!",
        closeOnConfirm: false
      }, function(){
        swal.close();
        window.location.href = "/campdashboard"; 
      });
      
      // Apply custom styles after the swal is displayed
      setTimeout(function() {
        var swalText = document.querySelector('.swal-text');
        if (swalText) {
          swalText.style.maxHeight = '100px';
          swalText.style.overflowY = 'auto';
        }
      }, 0);
      
      
      // window.location.href = "/campdashboard"; 
    }else{
      sweetAlert("OOPS...", `Your plan is ${current_state} \n Please upgrade to Champions Club`, "error");
      subscribePlanDisplay();
    }    
  } catch (error) {
    console.error(error);
  }
}




// date converter 

function dateconverter(date) {
  const dateObj = new Date(date);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return dateObj.toLocaleDateString("en-GB", options).replace(/\//g, "-");
}
// Plan display
  // Champions club
function champions_club(){
  console.log("champions_club");
  plan = "Champions Club";
    planAmount = 21999;
    showPopup(plan=plan,planAmont = planAmount);
}
  // Achivers club
function achivers_club(){
  console.log("achivers_club");
    plan = "Achivers Club";
    planAmount = 9999;
    showPopup(plan=plan,planAmont = planAmount);
}
// Show popup
function showPopup(plan, planAmount ) {
  // Create the popup elements
  const popupOverlay = document.createElement('div');
  popupOverlay.classList.add('popup-overlay');
  
  const popup = document.createElement('div');
  popup.classList.add('popup');
  // console.log(plan, planAmount);

  popup.innerHTML = `
    <h2>Joining Summary </h2>
    <h3 class="popup">${plan}</h3>
    <p class="amount">Amount: ₹${planAmount}</p>
    <label for="coupon" >Coupon:</label>
    <input type="text" id="coupon"  placeholder="apply coupon">
    <button id="apply-btn">Apply</button>
    <p id="coupon-applied" ></p>
    <p id="final-amount" >Total Amount: ₹${planAmount}</p>
    <button id="checkout-btn">Pay Now</button>
    <span class="close">&times;</span>
    
  `;
  
  // Append the popup elements to the document body
  document.body.appendChild(popupOverlay);
  popupOverlay.appendChild(popup);
  
  // Add event listener to close button
  const couponApplied = popup.querySelector('#coupon-applied');
  const closeBtn = popup.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(popupOverlay); // Remove the popup elements when closed
  });
 
  // Update final amount when coupon is entered
  const couponInput = popup.querySelector('#coupon');
  const finalAmountDisplay = popup.querySelector('#final-amount');
  const checkoutBtn = popup.querySelector('#checkout-btn');
  const applybtn = popup.querySelector('#apply-btn');
  let discount = 0;
  let discount_multiplier = 0;
  let discount_flat = 0;
  let couponCode = "";
  let finalAmount = planAmount;
  let serverCoupon;
  let coupon_applied ='no coupon applied';
    couponInput.addEventListener('input', async function() {
    couponCode = couponInput.value.trim();
    
  })
  applybtn.addEventListener('click', async function() {
  if (couponCode === "") {
    couponInput.value = "";
    sweetAlert("OOPS...", "Please Enter coupon code", "warning");
    return;
  }
    couponfetch = await fetchsevercoupon(couponCode);
    console.log(couponfetch);
    const serverState = couponfetch.data.status;
    if(serverState){
      serverCoupon = couponfetch.data.coupon;
      discount_multiplier = couponfetch.data.discount_multiplier;
      discount_flat = couponfetch.data.discount_flat;

      
    }else{
      const data = couponfetch.data.coupon;
      const coupon = couponfetch.data.coupon_state;
      sweetAlert("OOPS...", `${data} \n ${coupon}`, "error");
      couponInput.value = "";
      discount = 0;
      
    }
    if (couponCode === serverCoupon) {
      discount = (planAmount * discount_multiplier) + discount_flat;
      couponApplied.textContent = `Coupon applied: ${serverCoupon}`;
      sweetAlert("Success", "Coupon applied successfully", "success");
      couponApplied.style.color = "green";
      applybtn.textContent = 'Applied';
      applybtn.disabled = true;
      applybtn.style.backgroundColor = 'grey';
      applybtn.style.cursor = 'not-allowed';
      coupon_applied = serverCoupon;
      // console.log(discount);      
    }else if(couponCode == ""){
      sweetAlert("OOPS...", "Please enter coupon code", "warning");
      couponApplied.textContent = ``;
      discount = 0;
    }
    
        
      //  // Update the final amount display
    discount = Math.round(discount);
    finalAmount = planAmount - discount;
 
    finalAmountDisplay.textContent = `Total Amount: ₹${finalAmount}`;
   
  })

  subscribePlanDisplay();
  
  // Checkout button click event
  checkoutBtn.addEventListener('click', function() {
      console.log(`Checkout button clicked! ${coupon_applied}`);
      razorpayOrderCreation(plan,finalAmount,coupon_applied);
      popup.innerHTML =`
      <div class="processing-indicator" id="processing-indicator">
      <img src="static/images/loading-spinner.gif" alt="Processing...">
      <p>Processing...Please wait</p>`;
      // var popupOverlay = document.querySelector('.popup-overlay');
      // popupOverlay.style.display = 'none';
      
     
  });
}
async function razorpayOrderCreation(plan,amount,coupon_applied) {
  try{
    // console.log(`RAZORPAY ${plan}`);
    // console.log(`RAZORPAY ${amount}`);
    // console.log(`RAZORPAY ${coupon_applied}`);
    const data = {
      plan: plan,
      amount: amount,
      coupon_applied: coupon_applied
    }
    const response = await fetch("/rporder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const server = await response.json();
    console.log(server.data.id)
    rzscreen(server.data, plan,amount,coupon_applied);
  }catch (error) {
    console.log(error);
  }
}


async function rzscreen(data, plan , Amount, coupon_applied) {
  // Extract the order id from the data object
  var popupOverlay = document.querySelector('.popup-overlay');
  
  const orderId = data.id;
  console.log('RZScreen');
  // console.log(data);
  console.log(`order_id: ${orderId}`);
  console.log(`plan: ${plan}`);
  console.log(`amount: ${Amount}`);
  console.log(`coupon_applied: ${coupon_applied}`);
  try{
     await fetchEnvironmentVariables();
    // console.log(RZY_ID)
  }
  catch(error){
    console.error(error);
  }
  try {
    const userData = await getUserData();
    userName = userData.user.name;
    userEmail = userData.user.email;
    userMobile = userData.user.mobile;  
  } catch (error) {
    console.error(error);
  }
  // document.getElementById("processing-indicator").style.display = "none";
  // document.body.removeChild(popupOverlay);
  var script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.head.appendChild(script);
  document.getElementById("processing-indicator").style.display = "none";
  document.body.removeChild(popupOverlay);
  function handlePayment() {
    var options = {
      
      "key": `${RAZORPAY_id}`, // Enter your Razorpay Key ID
      // "amount": "50000", // Amount is in currency subunits (50000 paise = ₹500.00)
      "currency": "INR",
      "name": "Compounding Funda",
      "description": `Payment for ${plan} plan`,
      "image": "static/images/logo2.png",
      "order_id": `${orderId}`, // Replace with your actual Order ID
      "handler": function(response) {
        // Handle payment success
     
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);
        paymentConfirmation(response,plan,Amount,coupon_applied);
        
       
      },
      "prefill": {
        "name": `${userName}`,
        "email": `${userEmail}`,
        "contact": `${userMobile}`,
      },
      "notes": {
        "address": "company address"
      },
      "theme": {
        "color": "#3399cc"
      }
    };
    var rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      sweetAlert("Oops...", "Payment failed!", "error");
      // document.body.removeChild(popupOverlay);
    });
  

    rzp.open();
  
    
  };


  script.onload = handlePayment;
 
}

async function paymentConfirmation(paymentResponse, plan, Amount , coupon_applied) {
  const popupOverlay = document.createElement('div');
  popupOverlay.classList.add('popup-overlay');
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML =`
      <div class="processing-indicator" id="processing-indicator">
      <img src="static/images/loading-spinner.gif" alt="Processing...">
      <p>Processing...Please wait</p>`;
  document.body.appendChild(popupOverlay);
  popupOverlay.appendChild(popup);
  console.log('Payment Confirmation');
  console.log(paymentResponse.razorpay_order_id);
  const data = {
    payment_id: paymentResponse.razorpay_payment_id,
    orderId: paymentResponse.razorpay_order_id,
    signature: paymentResponse.razorpay_signature,
    plan: plan,
    coupon_applied: coupon_applied,
    Amount: Amount,
  }
  const responseFromServer = await fetch("/paymentconfirmation", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const serverResponse = await responseFromServer.json();
  console.log(serverResponse);
 
  if (responseFromServer.status == 200) {
    document.getElementById("processing-indicator").style.display = "none";
    document.body.removeChild(popupOverlay);
    await updateCouponStatus(coupon_applied);
    sweetAlert("Success!", "Payment successful!", "success");
    
    account();
  } else if (responseFromServer.status == 504) {
    document.getElementById("processing-indicator").style.display = "none";
    document.body.removeChild(popupOverlay);
    sweetAlert("Oops...", `Payment failed! \n ${serverResponse.status} \n Please wait before retry !!! confrim with us`, "error");
  } else {
    document.getElementById("processing-indicator").style.display = "none";
    document.body.removeChild(popupOverlay);
    sweetAlert("Oops...", "Payment failed!", "error");
  }

}

async function fetchsevercoupon(couponCode,plan){
  const data = {
    code: couponCode
  }
  const responseFromServer = await fetch("/checkcoupon", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const serverResponse = await responseFromServer.json();
  console.log(serverResponse);
  console.log(`Data from server ${serverResponse.data}`);
  return serverResponse;
  
}

async function updateCouponStatus(coupion_applied){
  const data = {
    couponused: coupion_applied
  }
  const responseFromServer = await fetch("/updatecoupon", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const serverResponse = await responseFromServer.json();
  console.log(serverResponse);
  return serverResponse;

}

async function fetchEnvironmentVariables() {
  try {
      const response = await fetch('/env');
      if (!response.ok) {
          throw new Error('Failed to fetch environment variables');
      }
      const data = await response.json();
      console.log(data);
      RAZORPAY_id = data // This will log the environment variables to the console
      return data;
      // Use the environment variables as needed in your JavaScript application
  } catch (error) {
      console.error('Error:', error);
  }
}

// Refer and Earn

const referAndEarn = async function () {
  const userfetch = await getUserData();
  const referralStatus = userfetch.user.referal;
  // console.log(referralStatus);
  if (referralStatus) {
    console.log("You are already signed up for referral");
    referralDetailspage();
  } else {
    referalSignUpPage();
  }
};

// Attach the event listener to the first refer & earn button
const sharebtn = document.querySelector('#refer-earn');
sharebtn.addEventListener('click', referAndEarn);

// Attach the event listener to the new refer & earn button
const anotherShareBtn = document.querySelector('#another-refer-earn');
anotherShareBtn.addEventListener('click', referAndEarn);

async function referalSignUpPage() {
  let content = document.querySelector(".content");
  htmlContent = `
  <div class="refral-container">
    
   <!--<h4 class="sub-heading-ref">Refer and Earn </h4>  -->
  <div class="text-para">
    <h4 class ="heading">Referal program</h4>
    <div class="text-artilce">
      <ul>
        <li>
          Join our referral program today and start earning for every friend you refer!
        </li>
        <li>
          Our referral program provides you with the opportunity to earn by referring others through the link.
        </li>
        <li>
          Please note that the referral program is only applicable when the referred user successfully subscribes to either:
          <ul>
            <li class="course">Champion's Club Membership</li>
            <li class="course">Achiever's Club Membership</li>
          </ul>
        </li>
        <li>
            For every membership successfully subscribed to under the mentioned plans, you'll receive a fixed 20% of the user's payment as a referral reward.
        </li>
        <li>
            Withdrawal of rewards will be available upon successful collection of payment on our end and can be initiated at the end of each month.
        </li>
        <li>
          Compounding Funda reserves all rights to change/withdraw/modify all the above conditions without any prior notice/information.
        </li>
        <li>
          By signing up, you are accepting all the terms and conditions applicable to the Referral Program.
        </li>
        
        <div class="enrol">
          <button class="enroll-button">Sign up</button>
        </div>
        
      </ul>
    </div>
    
  </div>
  </div>`

  content.innerHTML = "";
  content.innerHTML = htmlContent;
  const referralBtn = document.querySelector(".enroll-button");

referralBtn.addEventListener('click',async function(){
  currentUser = await getUserData();
  bankDetrailsPopup();  
})
}

async function referralDetailspage(){
  console.log("referalDetailspage called");
  refdata = await fetchReferralData();
  refdata = refdata;
  console.log(refdata);
  refReords = refdata.refRecord;
  console.log(refReords);
  let content = document.querySelector(".content");
  htmlContent = `
  <div class="refral-container">
    <div class="top-section">
      <h2>your referral link</h2>
      <div class="ref-link">
      <h2>
         https://www.learn.compoundingfunda.com/${refdata.user.uid}
      </h2>
      <button class="copy-btn" onClick="copyToClipboard()">
        <i class="fa-solid fa-copy"></i>
      </button>
      </div>
      <h3>copy and share link with other to open account</h3>
    </div>
    <div class="middle-section">
      <div class="first-middle-container">
        <h4>Total Ref</h4>
        <h5>${refReords.length}</h5>
      </div>
      <div class="second-middle-container">
        <h4>Paid ref</h4>
        <h5>0</h5>
      </div>
      <div class="third-middle-container">
        <h4>Ref Amount</h4>
        <h5>0</h5>
      </div>
      <div class="fourth-middle-container">
        <h4>Ref Paid</h4>
        <h5>0</h5>
      </div>
    </div>
    <div class="bottom-section">
      <section class="bottom-section-content">
      <table class="ref-table">
      <thead>
      <tr>
        <th>Sr.</th>
        <th>Name</th>
        <th>Subscription</th>
        <th>Coupon Code</th>
        <th>Amount</th>
        <th>Referral Earning</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
      </table>
      </section>
    </div>
</div>

    
  </div>
  `;
  content.innerHTML = "";
  content.innerHTML = htmlContent;
  tableBody = document.querySelector("tbody");
  let html = ``;
  refReords.forEach(function (item, index) {
    html += `<tr>
      <td>${index + 1}</td>
      <td class="td-name">${item.name}</td>
      <td>${item.subscriptionDetails.currentSubscription}</td>
      <td>${item.subscriptionDetails.coupon_applied}</td>
      <td>${item.subscriptionDetails.amountPaid}</td>
      <td>${item.subscriptionDetails.applicableRefferal}</td>
      <td>${index + 1}</td>

    </tr>`
  })
  tableBody.innerHTML = html;
}

function copyToClipboard() {
  // navigator.clipboard.writeText(`https://www.learn.compoundingfunda.com/${refdata.user.uid}`);
  // sweetAlert("Copied!", "Link copied to clipboard", "success");
  const referralLink = `https://www.learn.compoundingfunda.com/${refdata.user.uid}`;
        
        // Check if the Clipboard API is supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(referralLink).then(function() {
                // Show a notification that the link was copied
                sweetAlert("Copied!", "Referral Link copied", "success");
            }).catch(function(err) {
                console.error("Could not copy text: ", err);
            });
        } else {
            // Fallback for browsers that do not support the Clipboard API
            const tempTextarea = document.createElement("textarea");
            tempTextarea.value = referralLink;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand("copy");
            document.body.removeChild(tempTextarea);
            // Show a notification that the link was copied
            sweetAlert("Copied!", "Referral Link copied", "success");
        }
}
function bankDetrailsPopup() {
  // Create the popup elements
  // console.log("Bank details popup called");
  const popupOverlay = document.createElement('div');
  popupOverlay.classList.add('popup-bank-details');
  
  const popup = document.createElement('div');
  popup.classList.add('popup-bank-details-content');
  // console.log(plan, planAmount);

  popup.innerHTML = `
  <div class="bank-details-heading">
    <h2>Bank Details </h2>
  </div>
    <div class="form-group">
      <div class="bank-details">
      <label for="name">Name*:</label>
      <input type="text" id="name-on-bank"  placeholder="Name on Bank Account" required>
      </div>
      <div class="bank-details">
      <label for="bank-name">Bank Name*:</label>
      <input type="text" id="bank-name"  placeholder="Name of Bank Account" required>
      </div>
      <div class="bank-details">
      <label for="ifdcode">IFSC Code*:</label>
      <input type="text" id="ifdcode"  placeholder="IFSC Code" required>
      </div>
      <div class="bank-details">
      <label for="account-number">Account Number*:</label>
      <input type="text" id="account-number"  placeholder="Account Number" required>
      </div>
      <div class="bank-details">
      <label for="account-type">Account Type*:</label>
      <select id="account-type" required>
        <option value="SAVINGS">SAVINGS</option>
        <option value="CURRENT">CURRENT</option>
      </select>
      </div>
      <div class="terms-container">
        <input type="checkbox" id="terms" value="terms" name="terms" checked>
        <label for="terms">I agree to the <a href="#">terms and conditions</a>.</label><br>
      </div>

      <p class="terms-para">* please provide correct details,under any circumstances compounding funda will not be responsible for any misattribution, misrepresentation or misstatement</p>
      <div class="checkout-btn">
        <button id="bank-submit">submit</button>
      </div>
      <span class="close">&times;</span>
    </div>
    
  `;
  
  // Append the popup elements to the document body
  document.body.appendChild(popupOverlay);
  popupOverlay.appendChild(popup);

  const bankSubmit = document.getElementById('bank-submit');
  const terms = document.getElementById('terms').checked;
  bankSubmit.addEventListener('click', async function() {
    // console.log("Bank submit clicked");
    const nameOnBank = document.getElementById('name-on-bank').value;
    const bankName = document.getElementById('bank-name').value;
    const ifscCode = document.getElementById('ifdcode').value;
    const accountNumber = document.getElementById('account-number').value;
    const accountType = document.getElementById('account-type').value;
    const terms = document.getElementById('terms').checked;
    if(terms){
      if(nameOnBank != "" && bankName != "" && ifscCode != "" && accountNumber != "" && accountType != ""){
        let currentUser = await getUserData();
        referUserData = {
          nameOnBank: nameOnBank,
          bankName: bankName,
          ifscCode: ifscCode,
          accountNumber: accountNumber,
          accountType: accountType,
          terms: terms,
          uid:currentUser.user.uid
        }
         // Remove the popup elements when closed     
        // console.log(nameOnBank, bankName, ifscCode, accountNumber, accountType);
        response = userReferalRegistration(referUserData);
        document.body.removeChild(popupOverlay);
      }else{
        sweetAlert("Error", "Please fill all the details", "error");
      }
      }else{
        sweetAlert("Error", "Please accept terms and conditions to continue", "error");
      }
   
    })


     
  // Add event listener to close button
  const closeBtn = popup.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(popupOverlay); // Remove the popup elements when closed
  });
}


async function userReferalRegistration(data = referUserData){ {;
  const response = await fetch("/referral", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    });
      // console.log(response.status);
    if(response.status == 200){
    sweetAlert("Congratulations!", "You have successfully joined the referral program", "success");
    referralDetailspage();
    }else{
    sweetAlert("OOPS...", "Something went wrong", "error");
    }
    return response;
}}

async function fetchReferralData(){
  const response = await fetch("/api/fetchRefRecord");
  const data = await response.json();
  console.log(data);
  return data
}
