let RAZORPAY_id
const referbth = document.getElementById("refer");
const closeBtn = document.querySelector("#close-btn");
displayNone();

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
    // console.log(userData.user.name);
    // console.log(document.querySelector("#username"));
    const username = userData.user.name;
    const userStatus = userData.user.isSubscribed;
    const user = document.querySelector("#username").innerHTML  = `<i class="fa-solid fa-user"></i> ${username}`;
    // console.log(user);
  } catch (error) {
    console.error(error);
  }
}

// Account 
async function account() {
  await displayNone();
  let content = document.querySelector(".content");
  // console.log(content);
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
    // console.log(userData.user)
    isScreenerState = userData.user.screener_active
    userName = userData.user.name;
    userEmail = userData.user.email;
    subscriptionStatus = userData.user.subscriptionDetails.subscriptionStatus;
    currentSubscription = userData.user.subscriptionDetails.currentSubscription;
    couponUsed = userData.user.subscriptionDetails.coupon_applied;
  // console.log(`couponUsed: ${couponUsed}`);
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

async function subscribePlanDisplay() {
  await displayNone();
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
      // console.log(data);
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
  // console.log("Trading button clicked")
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
      // ShowDisclaimer("screener");
      achiversDashboard();
      
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




async function champDisplay() {
  // console.log("champDisplay Rajesh");
  try {
    const userData = await getUserData();
    current_state = userData.user.subscriptionDetails.currentSubscription;
    isScreenerState = userData.user.screener_active;
    // console.log(`screene ${isScreenerState} ${current_state}`);
    // console.log(`screene ${isScreenerState}`);
    if(isScreenerState && current_state == "Champions Club"){
      championsDashboard(); 
    
    }else{
      sweetAlert("OOPS...", `Your plan is ${current_state} \n Please upgrade to Champions Club`, "error");
      subscribePlanDisplay();
    }    
  } catch (error) {
    console.error(error);
  }
}

// Hprozontal menu Section
// Market OverView menu section
async function marketDisplay() {
  // Await the completion of displayNone
  await displayNone();

  const img = document.querySelector('.img-container img');


  const subMenuNavBar = document.querySelector('.sub-header-menu__nav1');
  if (subMenuNavBar) {
    subMenuNavBar.style.display = "flex";
  }

  let marketHTML = `
    <li><a href="#" onclick="marketinsights()">Marker Insights</a></li>
    <li><a href="#" onclick="marketsnapshot()">Market Snapshot</a></li>
   
    
  `;
  subMenuNavBar.innerHTML = marketHTML;
}


// Champions menu section
async function championsDashboard() {
  // Await the completion of displayNone
  await displayNone();

  const img = document.querySelector('.img-container img');
  // if (img) {
  //   img.style.display = "none";
  // }

  const subMenuNavBar = document.querySelector('.sub-header-menu__nav1');
  if (subMenuNavBar) {
    subMenuNavBar.style.display = "flex";
  }

  let champHTML = `
    <li><a href="#" onclick="traderboard()">Trader Board</a></li>
    <li><a href="#" onclick="investorboard()">Investor Board</a></li>
    <li><a href="#" onclick="advanceachivers()">Adv Achivers Board</a></li>
    
  `;
  subMenuNavBar.innerHTML = champHTML;
}


async function achiversDashboard() {
  // Await the completion of displayNone
  await displayNone();

  const img = document.querySelector('.img-container img');
  // if (img) {
  //   img.style.display = "none";
  // }

  const subMenuNavBar = document.querySelector('.sub-header-menu__nav1');
  if (subMenuNavBar) {
    subMenuNavBar.style.display = "flex";
  }

  let achiversHTML = `
    <li><a href="#" onclick="achiversboard()">Achivers Board</a></li>
  `;
  subMenuNavBar.innerHTML = achiversHTML;
}


async function traderboard() {
  // console.log("Traders Board");
  ShowDisclaimer("traderboard");
}
async function investorboard() {
  // console.log("Inverstor Board");

  ShowDisclaimer("investorboard");
}
async function advanceachivers(){
  console.log("advanceachivers");
  ShowDisclaimer("advaceAchivers");
}
async function achiversboard() {
  // console.log("Achivers Board");
  ShowDisclaimer("screener");
}
// Global Over view menu section 
async function globalOverview(){
  await displayNone();


  const img = document.querySelector('.img-container img');


  const subMenuNavBar = document.querySelector('.sub-header-menu__nav1');
  if (subMenuNavBar) {
    subMenuNavBar.style.display = "flex";
  }

  let globalHTML = `
    <li><a href="#" onclick="displayGlobalOverlay()">Global Indices</a></li>
    
  `;
  subMenuNavBar.innerHTML = globalHTML;
  // console.log("globalOverview");
  // await displayGlobalOverlay();

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
  // console.log("champions_club");
  plan = "Champions Club";
    planAmount = 24999;
    showPopup(plan=plan,planAmont = planAmount);
}
  // Achivers club
function achivers_club(){
  // console.log("achivers_club");
    plan = "Achivers Club";
    planAmount = 11999;
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
    // console.log(couponfetch);
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
      // console.log(`Checkout button clicked! ${coupon_applied}`);
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
    // console.log(server.data.id)
    rzscreen(server.data, plan,amount,coupon_applied);
  }catch (error) {
    console.log(error);
  }
}


async function rzscreen(data, plan , Amount, coupon_applied) {
  // Extract the order id from the data object
  var popupOverlay = document.querySelector('.popup-overlay');
  
  const orderId = data.id;
  // console.log('RZScreen');
  // console.log(data);
  // console.log(`order_id: ${orderId}`);
  // console.log(`plan: ${plan}`);
  // console.log(`amount: ${Amount}`);
  // console.log(`coupon_applied: ${coupon_applied}`);
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
     
        // console.log(response.razorpay_payment_id);
        // console.log(response.razorpay_order_id);
        // console.log(response.razorpay_signature);
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
  // console.log('Payment Confirmation');
  // console.log(paymentResponse.razorpay_order_id);
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
  // console.log(serverResponse);
 
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
  // console.log(serverResponse);
  // console.log(`Data from server ${serverResponse.data}`);
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
  // console.log(serverResponse);
  return serverResponse;

}

async function fetchEnvironmentVariables() {
  try {
      const response = await fetch('/env');
      if (!response.ok) {
          throw new Error('Failed to fetch environment variables');
      }
      const data = await response.json();
      // console.log(data);
      RAZORPAY_id = data // This will log the environment variables to the console
      return data;
      // Use the environment variables as needed in your JavaScript application
  } catch (error) {
      console.error('Error:', error);
  }
}

// Refer and Earn

const referAndEarn = async function () {
  displayNone
  const userfetch = await getUserData();
  const referralStatus = userfetch.user.referal;
  // console.log(referralStatus);
  if (referralStatus) {
    // console.log("You are already signed up for referral");
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
  // console.log("referalDetailspage called");
  refdata = await fetchReferralData();
  refdata = refdata;
  // console.log(refdata);
  refReords = refdata.refRecord;
  // console.log(refReords);
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


// mislenious functions
async function fetchReferralData(){
  const response = await fetch("/api/fetchRefRecord");
  const data = await response.json();
  // console.log(data);
  return data
}

// Make sure to use async/await correctly
async function displayNone() {
  let dash = document.querySelector('.content');
  document.querySelector('.sub-header-menu__nav1').style.display = "none";
  dash.innerHTML = ""; // Clear the content
  
  // Create a new img element
  const img = document.createElement('img');
  img.src = "static/images/logo2.png"; // Set image source
  img.alt = "COMPOUNDING FUNDA"; // Set alt text
  
  // Append the img element to the desired container
  dash.appendChild(img);
}



// Show notificaton 

function ShowDisclaimer(page){
  // console.log("disclaimer");
  swal({
    title: "Disclaimer",
    text: "The data provided herein is sourced from reliable and authorized data providers. However, users are advised to exercise due diligence and verify the accuracy and completeness of the data independently. Neither the data provider nor any associated entity shall be liable for any errors, omissions, or losses arising from the use of this data. Investors should consult their financial advisors and consider their risk tolerance before making any investment decisions based on this information.",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, I Agree!!!",
    closeOnConfirm: false
  }, function(){
    swal.close();
    // window.location.href = `/${page}`; 
    if (page == "traderboard") {
      window.location.href = `/${page}`;
    }
    else if (page == "investorboard") {
      window.location.href = `/${page}`;
      // window.location.href = `/${page}`;
    }
    else if (page == "screener") {
      window.location.href = `/${page}`;  
    }
    else if (page == "advaceAchivers") {
      console.log(`${page}`);
      window.location.href = `/${page}`;  
    }
    else{
      return;
    }
  });
  setTimeout(function() {
    var swalText = document.querySelector('.swal-text');
    if (swalText) {
      swalText.style.maxHeight = '100px';
      swalText.style.overflowY = 'scroll';
    }
  }, 0);
}

// injectued codes

// market over view section starts here



async function marketinsights(){
  await marketinStatic();
}

async function marketsnapshot(){
  await marketsnapstatic();
}

// Execution code 
async function marketinStatic(){
  let marketStructure = document.querySelector('.content');
  marketStructure.innerHTML = `
      <div class="main-container">
    <!-- Top Section starts here -->
    <div class="top-container">
      <!-- Bulk Deals Section -->
      <div class="bulk-deals">
        <div class="table-container">
          <div class = "bulkDealsTable">
            <table id="day-bulkDealsTable"> <!-- Corrected ID to match the JS selector -->
              <h4>Day's Block Deals</h4>
              <thead>
                <tr>
                  <th>Block Time</th>
                  <th>Session</th>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>Total Traded Volume</th>
                  <th>Total Traded Value (Cr.)</th>
                  
                </tr>
              </thead>
              <tbody>
                <!-- Data will be dynamically inserted here -->
              </tbody>
            </table>
          </div>
          <div class = "bulkDealsTable">
          
            <table id="bulkDealsTable"> <!-- Corrected ID to match the JS selector -->
              <h4>Block Deals in detail</h4>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Client Name</th>
                  <th>Buy/Sell</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                <!-- Data will be dynamically inserted here -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- FII/DII Charts -->
      <div class="chart-container">
        <h4>FII and DII Net Value</h4>
        <div id="fii-net-value-chart" class="chart"></div>
        <div id="dii-net-value-chart" class="chart"></div>
      </div>
    </div>
  </div>
  <!-- Top Section ends here -->

  <div class="ipo-section">

    <!-- IPO Table -->
    <div class="table-container">
      <h4>IPO Issue Details</h4>
      <table id="ipoTable">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company Name</th>
            <th>Series</th>
            <th>Issue Start Date</th>
            <th>Issue End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Data will be dynamically inserted here -->
        </tbody>
      </table>
    </div>
  </div>

  <div class="section-news">
    <h4>News</h4>
    <div class="container-news" id="cardContainer">
      <!-- News cards will be injected here dynamically -->
    </div>
  </div>

  <!-- Board Meetings Section -->
  <div class="section-news">
    <h4>Board Meetings</h4>
    <div class="container-news" id="meetingContainer">
      <!-- Board meeting cards will be injected here dynamically -->
    </div>
  </div>

  <p style="margin-left: 20px;">News credit: Stock Edge and NSE India</p>
  `;
  await marketinDynamic();
}

async function marketinDynamic() {

async function fetchData(endpoint, indexName, containerId) {
  try {
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ indexName: indexName })
      });

      const data = await response.json();
    //   console.log(data);
      displayData(data, containerId);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Display Data Function
function displayData(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return; // Exit if the container does not exist
  }
  
  container.innerHTML = ''; // Clear any existing content

  data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-news';

      if (containerId === 'cardContainer') {
          card.innerHTML = `
              <h3>${item.SecurityName}</h3>
              <p>${item.Description}</p>
              <div class="date">${item.Date}</div>
          `;
      } else if (containerId === 'meetingContainer') {
          const fileExtension = item.attachment.split('.').pop().toLowerCase();
          let iconSrc = '';
          
          switch (fileExtension) {
              case 'pdf':
                  iconSrc = 'https://img.icons8.com/ios-filled/50/000000/pdf.png';
                  break;
              case 'zip':
                  iconSrc = 'https://img.icons8.com/ios-filled/50/000000/zip.png';
                  break;
              case 'xml':
                  iconSrc = 'https://img.icons8.com/ios-filled/50/000000/xml.png';
                  break;
              default:
                  iconSrc = 'https://img.icons8.com/ios-filled/50/000000/download.png'; // Default icon
          }

          card.innerHTML = `
              <h2>${item.bm_symbol}</h2>
              <h3>${item.sm_name}</h3>
              <p><strong>Subject:</strong> ${item.bm_purpose}</p>
              <p><strong>Meeting Date:</strong> ${item.bm_date}</p>
              <p><strong>Details:</strong> ${item.bm_desc}</p>
              <p><strong>Broadcast Date/Time:</strong> ${item.bm_timestamp}</p>
              <div class="download">
                  <img src="${iconSrc}" alt="Download">
                  <a href="${item.attachment}" target="_blank">Download</a>
              </div>
          `;
      }

      container.appendChild(card);
  });
}

// Fetch IPO Data
async function fetchIpoData() {
  try {
      const response = await fetch('https://datafetch.compoundingfunda.com/live/api/ipo', {
          method: 'POST',
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "indexName": "ipo" })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const ipoData = await response.json();
      populateTable(ipoData);
  } catch (error) {
      console.error('Error fetching IPO data:', error);
  }
}

// Populate IPO Table
function populateTable(ipoData) {
  const tableBody = document.querySelector("#ipoTable tbody");
  if (!tableBody) {
      console.error('Table body not found.');
      return; // Exit if the table body does not exist
  }
  
  tableBody.innerHTML = '';

  ipoData.forEach((ipo) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td data-label="Symbol">${formatValue(ipo.symbol)}</td>
          <td data-label="Company Name">${formatValue(ipo.companyName)}</td>
          <td data-label="Series">${formatValue(ipo.series)}</td>
          <td data-label="Issue Start Date">${formatDate(ipo.issueStartDate)}</td>
          <td data-label="Issue End Date">${formatDate(ipo.issueEndDate)}</td>
          <td data-label="Status">${formatValue(ipo.status)}</td>
      `;
      tableBody.appendChild(row);
  });
}

// Format Value Function
function formatValue(value) {
  return value === null || value === '' ? '-' : value;
}

// Format Date Function
function formatDate(dateString) {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

// Fetch Bulk Deals Data
async function fetchBulkDealsData() {
    try {
        const response = await fetch('https://datafetch.compoundingfunda.com/live/api/block_deals', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "indexName": "done_block" })
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const blockData = await response.json();
        // console.log(blockData);
        populateBlockTable(blockData);
    } catch (error) {
        console.error('Error fetching bulk deals data:', error);
    }
}

// Populate Block Table
function populateBlockTable(blockData) {
  const tableBody = document.querySelector("#bulkDealsTable tbody"); // Corrected selector for tbody
//   console.log(tableBody);
  if (!tableBody) {
    console.error('Table body not found.');
    return; // Exit if the table body does not exist
  }
  if (!blockData || blockData.length === 0) {
    displayNoDataMessage();
    return;
 }
  

  tableBody.innerHTML = ''; // Clear previous rows if any

  blockData.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Date">${item.date}</td>
      <td data-label="Symbol">${item.symbol}</td>
      <td data-label="Name">${item.name}</td>
      <td data-label="Client Name">${item.clientName}</td>
      <td data-label="Buy/Sell">${item.buySell}</td>
      <td data-label="Quantity">${parseInt(item.qty).toLocaleString()}</td>
      <td data-label="Rate">${item.watp}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Fetch Days Block deatils

async function fetchDayBlockDealData() {
    try {
        const response = await fetch('https://datafetch.compoundingfunda.com/live/api/block_deals', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "indexName": "day_block" })
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const dayBlockData = await response.json();
        // console.log(dayBlockData);
        populateDayBlockTable(dayBlockData);
    } catch (error) {
        console.error('Error fetching bulk deals data:', error);
    }
}

// Populate Block Table
function populateDayBlockTable(dayBlockData) {
  const tableBody = document.querySelector("#day-bulkDealsTable tbody"); // Corrected selector for tbody
//   console.log(tableBody);
  if (!tableBody) {
    console.error('Table body not found.');
    return; // Exit if the table body does not exist
  }
  if (!dayBlockData || dayBlockData.length === 0) {
    displayNoDataMessage();
    return;
 }

  tableBody.innerHTML = ''; // Clear previous rows if any

  dayBlockData.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Last Update Time">${(item.lastUpdateTime)}</td>  
      <td data-label="Session">${item.session}</td>
      <td data-label="Symbol">${item.symbol}</td>
      <td data-label="Last Price">${item.lastPrice}</td>
      <td data-label="Total Traded Volume">${item.totalTradedVolume}</td>
      <td data-label="Total Traded Value">${(item.totalTradedValue / 10000000).toFixed(2)}</td>
      
    `;
    tableBody.appendChild(row);
  });
}
function displayNoDataMessage() {
    const tableBody = document.querySelector("#day-bulkDealsTable tbody");
    tableBody.innerHTML = '<tr><td colspan="14" class="no-data">No block deal found</td></tr>';
}


// Fetch FII/DII Data
let baseURL = 'https://datafetch.compoundingfunda.com/';
let fiiLink = 'live/api/fii';
let fiiUrl = baseURL + fiiLink;

async function fetchFiiData() {
  try {
      const response = await fetch(fiiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      renderCharts(data);
  } catch (error) {
      console.error('Error fetching FII/DII data:', error);
  }
}

// Render Charts Function
function renderCharts(data) {
  data.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  const dates = data.map(row => row.Date);
  const fiiNetValues = data.map(row => parseFloat(row["FII Net Value"].replace(/,/g, '')));
  const diiNetValues = data.map(row => parseFloat(row["DII Net Value"].replace(/,/g, '')));

  const mostRecentIndex = dates.length - 1;
  const mostRecentFiiValue = fiiNetValues[mostRecentIndex];
  const mostRecentDiiValue = diiNetValues[mostRecentIndex];

  const fiiNetTrace = {
      x: dates,
      y: fiiNetValues,
      name: 'FII Net Value',
      type: 'bar',
      marker: { color: fiiNetValues.map(value => value >= 0 ? 'green' : 'red') }
  };

  const diiNetTrace = {
      x: dates,
      y: diiNetValues,
      name: 'DII Net Value',
      type: 'bar',
      marker: { color: diiNetValues.map(value => value >= 0 ? 'green' : 'red') }
  };

  const fiiNetLayout = {
      title: 'FII Net Value (CASH)',
      xaxis: { title: 'Date', tickangle: -45 },
      yaxis: { title: 'Net Value (₹ Crores)' },
      annotations: [{
          xref: 'x', yref: 'y', x: dates[mostRecentIndex],
          y: mostRecentFiiValue >= 0 ? fiiNetValues[mostRecentIndex] : fiiNetValues[mostRecentIndex] + mostRecentFiiValue * 0.1,
          text: `<b style="color:${mostRecentFiiValue >= 0 ? 'green' : 'red'}">₹${mostRecentFiiValue.toFixed(2)}</b>`,
          showarrow: false, font: { size: 12, color: 'black' }, align: 'center',
          xanchor: 'center', yanchor: mostRecentFiiValue >= 0 ? 'bottom' : 'top'
      }]
  };

  const diiNetLayout = {
      title: 'DII Net Value (CASH)',
      xaxis: { title: 'Date', tickangle: -45 },
      yaxis: { title: 'Net Value (₹ Crores)' },
      annotations: [{
          xref: 'x', yref: 'y', x: dates[mostRecentIndex],
          y: mostRecentDiiValue >= 0 ? diiNetValues[mostRecentIndex] : diiNetValues[mostRecentIndex] + mostRecentDiiValue * 0.1,
          text: `<b style="color:${mostRecentDiiValue >= 0 ? 'green' : 'red'}">₹${mostRecentDiiValue.toFixed(2)}</b>`,
          showarrow: false, font: { size: 12, color: 'black' }, align: 'center',
          xanchor: 'center', yanchor: mostRecentDiiValue >= 0 ? 'bottom' : 'top'
      }]
  };

  Plotly.newPlot('fii-net-value-chart', [fiiNetTrace], fiiNetLayout);
  Plotly.newPlot('dii-net-value-chart', [diiNetTrace], diiNetLayout);
}

const REFRESH_INTERVAL = 0.5 * 60 * 1000; // 5 minutes in milliseconds
  setInterval(() => {
      fetchData('https://datafetch.compoundingfunda.com/live/api/board_meeting', 'board_meetings', 'meetingContainer');
      fetchData('https://datafetch.compoundingfunda.com/live/api/news', 'new_top_news', 'cardContainer');
      fetchIpoData();
      fetchBulkDealsData();
      fetchDayBlockDealData();
      fetchFiiData();
  }, REFRESH_INTERVAL);

  // Initial data fetching
  fetchData('https://datafetch.compoundingfunda.com/live/api/news', 'new_top_news', 'cardContainer');
  fetchData('https://datafetch.compoundingfunda.com/live/api/board_meeting', 'board_meetings', 'meetingContainer');
  fetchIpoData();
  fetchBulkDealsData();
  fetchDayBlockDealData();
  fetchFiiData();

}

async function marketsnapstatic(){
  let marketStructure = document.querySelector('.content');
  marketStructure.innerHTML = `
    <div class="market-container">
      <!-- Market Indices -->
    <h2>Market Summary</h2>

    <h4>Nse Index</h4>
    <div id="market-container">
        
    </div>

    <!-- Heatmap Charts -->
    <div class="chart-container" id="nifty50-treemap"></div>
    <div class="chart-container" id="niftybank-treemap"></div>
    
    <!-- MCX Data -->
    <h4>MCX Index</h4>
    <div id="mcx-container">
        
    </div>

    </div>
    
  `;
  await marketsnapDynamic();
}

async function marketsnapDynamic() {
  let nifty50Chart, niftyBankChart;
        // const baseURL = 'http://127.0.0.1:8000/';
        const baseURL = 'https://datafetch.compoundingfunda.com/';
        const heatmapEndpoint = 'live/api/liveheat';
        const mcxEndpoint = 'live/api/commodity';
        const mcxUrl = `${baseURL}${mcxEndpoint}`;
        const heatmapUrl = `${baseURL}${heatmapEndpoint}`;
        const indexUrl = `${baseURL}live/api/indexfetch`;

        // Function to fetch heatmap data
        async function fetchHeatmapData(indexName, chart) {
            try {
                const response = await fetch(heatmapUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ indexName })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const stockData = await response.json();
                const seriesData = stockData.map(stock => ({
                    x: stock.symbol,
                    y: stock.pChange,
                    name: `${stock.symbol} - ${stock.lastPrice}`
                }));

                chart.updateSeries([{ data: seriesData }]);
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
            }
        }

        // Nifty 50 Chart Setup
        const nifty50Options = {
            series: [{ data: [] }],
            chart: { height: 350, type: 'treemap', toolbar: { show: false } },
            title: { text: 'NIFTY 50', align: 'center', style: { fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline' }},
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: true,
                    shadeIntensity: 0.5,
                    reverseNegativeShade: true,
                    colorScale: {
                        ranges: [
                            { from: -10, to: 0, color: '#f44336' },
                            { from: 0, to: 5, color: '#4caf50' },
                            { from: 5, to: 10, color: '#8bc34a' }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px', fontWeight: 'bold' },
                formatter: (text, op) => [text, `${op.value}%`]
            }
        };

        // Nifty Bank Chart Setup
        const niftyBankOptions = {
            series: [{ data: [] }],
            chart: { height: 350, type: 'treemap', toolbar: { show: false } },
            title: { text: 'NIFTY BANK', align: 'center', style: { fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline' }},
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: true,
                    shadeIntensity: 0.5,
                    reverseNegativeShade: true,
                    colorScale: {
                        ranges: [
                            { from: -10, to: 0, color: '#f44336' },
                            { from: 0, to: 5, color: '#4caf50' },
                            { from: 5, to: 10, color: '#8bc34a' }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px', fontWeight: 'bold' },
                formatter: (text, op) => [text, `${op.value}%`]
            }
        };

        // Create and render charts
        nifty50Chart = new ApexCharts(document.querySelector("#nifty50-treemap"), nifty50Options);
        nifty50Chart.render();
        niftyBankChart = new ApexCharts(document.querySelector("#niftybank-treemap"), niftyBankOptions);
        niftyBankChart.render();

        // Fetch initial data for both charts
        fetchHeatmapData('NIFTY 50', nifty50Chart);
        fetchHeatmapData('NIFTY BANK', niftyBankChart);


        // Refresh data every 30 seconds
        setInterval(() => {
            fetchHeatmapData('NIFTY 50', nifty50Chart);
            fetchHeatmapData('NIFTY BANK', niftyBankChart);
        }, 30000);

        // Function to fetch market indices data
        async function fetchIndexData() {
            try {
                const response = await fetch(indexUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ indexName: 'all_indices' })
                });

                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching market indices:', error);
                return [];
            }
        }

        // Function to fetch MCX data
        async function fetchMcxData() {
            try {
                const response = await fetch(mcxUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ indexName: 'all_indices' })
                });

                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching MCX data:', error);
                return [];
            }
        }

        // Function to create a card for each index
        function createCard(indexData) {
            const card = document.createElement('div');
            card.className = 'card';

            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = indexData.index;

            const price = document.createElement('div');
            price.className = 'price';
            price.textContent = indexData.last.toFixed(2);

            const percentChange = document.createElement('div');
            percentChange.className = 'percent_change';
            percentChange.textContent = `${indexData.percentChange}%`;
            percentChange.classList.add(indexData.percentChange > 0 ? 'positive' : 'negative');

            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(percentChange);

            return card;
        }

        // Function to display the market indices data in the container
        async function displayMarketIndices() {
            const container = document.getElementById('market-container');
            container.innerHTML = ''; // Clear existing content

            const indices = await fetchIndexData();
            indices.forEach(indexData => {
                const card = createCard(indexData);
                container.appendChild(card);
            });
        }

        // Function to display the MCX data
        async function displayMcx() {
    const container = document.getElementById('mcx-container');
    container.innerHTML = ''; // Clear existing content

    const indices = await fetchMcxData();
    indices.forEach(commodity => {
        const card = document.createElement('div');
        card.className = 'card';

        // Determine text color for market state
        const marketColor = commodity.market_state.toLowerCase() === 'open' ? '#008000' : '#ff0000'; // Green for open, red for closed

        card.innerHTML = `
            <div class="title">${commodity.id}</div>
            <div class="lastprice">₹${commodity.lastprice}</div>
            <div class="change ${commodity.percentchange > 0 ? 'positive' : 'negative'}">
                Change: ${commodity.percentchange}%
            </div>
            <div class="update">Last Update: ${commodity.lastupdate}</div>
            <div class="state" style="color: ${marketColor};">
                Market: ${commodity.market_state.charAt(0).toUpperCase() + commodity.market_state.slice(1)}
            </div>
        `;

        container.appendChild(card);
    });
}
            // Fetch and display market indices and MCX on page load

        // Refresh market indices and MCX data every 30 seconds
        setInterval(() => {
            displayMarketIndices();
            displayMcx();
        }, 30000);
        await displayMarketIndices();
        await displayMcx();
}





// async function marketinDynamic(){
//   console.log("marketinDynamic");
//   async function fetchData(endpoint, indexName, containerId) {
//     try {
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ indexName: indexName })
//         });
  
//         const data = await response.json();
//         displayData(data, containerId);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
//   }
  
//   // Display Data Function
//   function displayData(data, containerId) {
//     const container = document.getElementById(containerId);
//     if (!container) {
//         console.error(`Container with ID ${containerId} not found.`);
//         return; // Exit if the container does not exist
//     }
    
//     container.innerHTML = ''; // Clear any existing content
  
//     data.forEach(item => {
//         const card = document.createElement('div');
//         card.className = 'card-news';
  
//         if (containerId === 'cardContainer') {
//             card.innerHTML = `
//                 <h3>${item.SecurityName}</h3>
//                 <p>${item.Description}</p>
//                 <div class="date">${item.Date}</div>
//             `;
//         } else if (containerId === 'meetingContainer') {
//             const fileExtension = item.attachment.split('.').pop().toLowerCase();
//             let iconSrc = '';
            
//             switch (fileExtension) {
//                 case 'pdf':
//                     iconSrc = 'https://img.icons8.com/ios-filled/50/000000/pdf.png';
//                     break;
//                 case 'zip':
//                     iconSrc = 'https://img.icons8.com/ios-filled/50/000000/zip.png';
//                     break;
//                 case 'xml':
//                     iconSrc = 'https://img.icons8.com/ios-filled/50/000000/xml.png';
//                     break;
//                 default:
//                     iconSrc = 'https://img.icons8.com/ios-filled/50/000000/download.png'; // Default icon
//             }
  
//             card.innerHTML = `
//                 <h2>${item.bm_symbol}</h2>
//                 <h3>${item.sm_name}</h3>
//                 <p><strong>Subject:</strong> ${item.bm_purpose}</p>
//                 <p><strong>Meeting Date:</strong> ${item.bm_date}</p>
//                 <p><strong>Details:</strong> ${item.bm_desc}</p>
//                 <p><strong>Broadcast Date/Time:</strong> ${item.bm_timestamp}</p>
//                 <div class="download">
//                     <img src="${iconSrc}" alt="Download">
//                     <a href="${item.attachment}" target="_blank">Download</a>
//                 </div>
//             `;
//         }
  
//         container.appendChild(card);
//     });
//   }
  
//   // Fetch IPO Data
//   async function fetchIpoData() {
//     try {
//         const response = await fetch('https://datafetch.compoundingfunda.com/live/api/ipo', {
//             method: 'POST',
//             headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ "indexName": "ipo" })
//         });
  
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
  
//         const ipoData = await response.json();
//         populateTable(ipoData);
//     } catch (error) {
//         console.error('Error fetching IPO data:', error);
//     }
//   }
  
//   // Populate IPO Table
//   function populateTable(ipoData) {
//     const tableBody = document.querySelector("#ipoTable tbody");
//     if (!tableBody) {
//         console.error('Table body not found.');
//         return; // Exit if the table body does not exist
//     }
    
//     tableBody.innerHTML = '';
  
//     ipoData.forEach((ipo) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td data-label="Symbol">${formatValue(ipo.symbol)}</td>
//             <td data-label="Company Name">${formatValue(ipo.companyName)}</td>
//             <td data-label="Series">${formatValue(ipo.series)}</td>
//             <td data-label="Issue Start Date">${formatDate(ipo.issueStartDate)}</td>
//             <td data-label="Issue End Date">${formatDate(ipo.issueEndDate)}</td>
//             <td data-label="Status">${formatValue(ipo.status)}</td>
//         `;
//         tableBody.appendChild(row);
//     });
//   }
  
//   // Format Value Function
//   function formatValue(value) {
//     return value === null || value === '' ? '-' : value;
//   }
  
//   // Format Date Function
//   function formatDate(dateString) {
//     if (!dateString) return '-';
//     const [year, month, day] = dateString.split('-');
//     return `${day}-${month}-${year}`;
//   }
  
//   // Fetch Bulk Deals Data
//   async function fetchBulkDealsData() {
//       try {
//           const response = await fetch('https://datafetch.compoundingfunda.com/live/api/block_deals', {
//               method: 'POST',
//               headers: {
//                   'accept': 'application/json',
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ "indexName": "done_block" })
//           });
    
//           if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//           }
    
//           const blockData = await response.json();
//           // console.log(blockData);
//           populateBlockTable(blockData);
//       } catch (error) {
//           console.error('Error fetching bulk deals data:', error);
//       }
//   }
  
//   // Populate Block Table
//   function populateBlockTable(blockData) {
//     const tableBody = document.querySelector("#bulkDealsTable tbody"); // Corrected selector for tbody
//   //   console.log(tableBody);
//     if (!tableBody) {
//       console.error('Table body not found.');
//       return; // Exit if the table body does not exist
//     }
//     if (!blockData || blockData.length === 0) {
//       displayNoDataMessage();
//       return;
//    }
    
  
//     tableBody.innerHTML = ''; // Clear previous rows if any
  
//     blockData.forEach((item) => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td data-label="Date">${item.date}</td>
//         <td data-label="Symbol">${item.symbol}</td>
//         <td data-label="Name">${item.name}</td>
//         <td data-label="Client Name">${item.clientName}</td>
//         <td data-label="Buy/Sell">${item.buySell}</td>
//         <td data-label="Quantity">${parseInt(item.qty).toLocaleString()}</td>
//         <td data-label="Rate">${item.watp}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//   }
  
//   // Fetch Days Block deatils
  
//   async function fetchDayBlockDealData() {
//       try {
//           const response = await fetch('https://datafetch.compoundingfunda.com/live/api/block_deals', {
//               method: 'POST',
//               headers: {
//                   'accept': 'application/json',
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ "indexName": "day_block" })
//           });
    
//           if (!response.ok) {
//               throw new Error(`HTTP error! status: ${response.status}`);
//           }
    
//           const dayBlockData = await response.json();
//           // console.log(dayBlockData);
//           populateDayBlockTable(dayBlockData);
//       } catch (error) {
//           console.error('Error fetching bulk deals data:', error);
//       }
//   }
  
//   // Populate Block Table
//   function populateDayBlockTable(dayBlockData) {
//     const tableBody = document.querySelector("#day-bulkDealsTable tbody"); // Corrected selector for tbody
//   //   console.log(tableBody);
//     if (!tableBody) {
//       console.error('Table body not found.');
//       return; // Exit if the table body does not exist
//     }
//     if (!dayBlockData || dayBlockData.length === 0) {
//       displayNoDataMessage();
//       return;
//    }
  
//     tableBody.innerHTML = ''; // Clear previous rows if any
  
//     dayBlockData.forEach((item) => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td data-label="Last Update Time">${(item.lastUpdateTime)}</td>  
//         <td data-label="Session">${item.session}</td>
//         <td data-label="Symbol">${item.symbol}</td>
//         <td data-label="Last Price">${item.lastPrice}</td>
//         <td data-label="Total Traded Volume">${item.totalTradedVolume}</td>
//         <td data-label="Total Traded Value">${(item.totalTradedValue / 10000000).toFixed(2)}</td>
        
//       `;
//       tableBody.appendChild(row);
//     });
//   }
//   function displayNoDataMessage() {
//       const tableBody = document.querySelector("#day-bulkDealsTable tbody");
//       tableBody.innerHTML = '<tr><td colspan="14" class="no-data">No block deal found</td></tr>';
//   }
  
  
//   // Fetch FII/DII Data
//   let baseURL = 'https://datafetch.compoundingfunda.com/';
//   let fiiLink = 'live/api/fii';
//   let fiiUrl = baseURL + fiiLink;
  
//   async function fetchFiiData() {
//     try {
//         const response = await fetch(fiiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//         });
  
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
  
//         const data = await response.json();
//         renderCharts(data);
//     } catch (error) {
//         console.error('Error fetching FII/DII data:', error);
//     }
//   }
  
//   // Render Charts Function
//   function renderCharts(data) {
//     data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
  
//     const dates = data.map(row => row.Date);
//     const fiiNetValues = data.map(row => parseFloat(row["FII Net Value"].replace(/,/g, '')));
//     const diiNetValues = data.map(row => parseFloat(row["DII Net Value"].replace(/,/g, '')));
  
//     const mostRecentIndex = dates.length - 1;
//     const mostRecentFiiValue = fiiNetValues[mostRecentIndex];
//     const mostRecentDiiValue = diiNetValues[mostRecentIndex];
  
//     const fiiNetTrace = {
//         x: dates,
//         y: fiiNetValues,
//         name: 'FII Net Value',
//         type: 'bar',
//         marker: { color: fiiNetValues.map(value => value >= 0 ? 'green' : 'red') }
//     };
  
//     const diiNetTrace = {
//         x: dates,
//         y: diiNetValues,
//         name: 'DII Net Value',
//         type: 'bar',
//         marker: { color: diiNetValues.map(value => value >= 0 ? 'green' : 'red') }
//     };
  
//     const fiiNetLayout = {
//         title: 'FII Net Value (CASH)',
//         xaxis: { title: 'Date', tickangle: -45 },
//         yaxis: { title: 'Net Value (₹ Crores)' },
//         annotations: [{
//             xref: 'x', yref: 'y', x: dates[mostRecentIndex],
//             y: mostRecentFiiValue >= 0 ? fiiNetValues[mostRecentIndex] : fiiNetValues[mostRecentIndex] + mostRecentFiiValue * 0.1,
//             text: `<b style="color:${mostRecentFiiValue >= 0 ? 'green' : 'red'}">₹${mostRecentFiiValue.toFixed(2)}</b>`,
//             showarrow: false, font: { size: 12, color: 'black' }, align: 'center',
//             xanchor: 'center', yanchor: mostRecentFiiValue >= 0 ? 'bottom' : 'top'
//         }]
//     };
  
//     const diiNetLayout = {
//         title: 'DII Net Value (CASH)',
//         xaxis: { title: 'Date', tickangle: -45 },
//         yaxis: { title: 'Net Value (₹ Crores)' },
//         annotations: [{
//             xref: 'x', yref: 'y', x: dates[mostRecentIndex],
//             y: mostRecentDiiValue >= 0 ? diiNetValues[mostRecentIndex] : diiNetValues[mostRecentIndex] + mostRecentDiiValue * 0.1,
//             text: `<b style="color:${mostRecentDiiValue >= 0 ? 'green' : 'red'}">₹${mostRecentDiiValue.toFixed(2)}</b>`,
//             showarrow: false, font: { size: 12, color: 'black' }, align: 'center',
//             xanchor: 'center', yanchor: mostRecentDiiValue >= 0 ? 'bottom' : 'top'
//         }]
//     };
  
//     Plotly.newPlot('fii-net-value-chart', [fiiNetTrace], fiiNetLayout);
//     Plotly.newPlot('dii-net-value-chart', [diiNetTrace], diiNetLayout);
//   }
  
//   // Fetch data on page load
//   window.onload = async () => {
//     await fetchBulkDealsData();
//     await fetchDayBlockDealData();  
//     await fetchIpoData();
//     await fetchFiiData();
  
//     // Set interval for refreshing data every 30 seconds
//     setInterval(async () => {
//         await fetchBulkDealsData();
//         await fetchIpoData();
//         await fetchFiiData();
//     }, 30000); // 30 seconds
  
//     // Fetch news and meeting data
//     fetchData('https://datafetch.compoundingfunda.com/live/api/news', 'new_top_news', 'cardContainer');
//     fetchData('https://datafetch.compoundingfunda.com/live/api/board_meeting', 'board_meetings', 'meetingContainer');
    
//     setInterval(() => fetchData('https://datafetch.compoundingfunda.com/live/api/news', 'new_top_news', 'cardContainer'), 60 * 60 * 1000);
  
//     // Schedule fetch at 9 PM
//     scheduleFetchAtNinePM(); // Call the function
//   };
  
//   // Schedule function for fetching at 9 PM
//   function scheduleFetchAtNinePM() {
//     const now = new Date();
//     const ninePM = new Date();
//     ninePM.setHours(21, 0, 0, 0);
  
//     if (now > ninePM) {
//         ninePM.setDate(ninePM.getDate() + 1);
//     }
  
//     const timeUntilNinePM = ninePM.getTime() - now.getTime();
//     setTimeout(() => {
//         fetchData('https://datafetch.compoundingfunda.com/live/api/board_meeting', 'board_meetings', 'meetingContainer');
//         setInterval(() => fetchData('https://datafetch.compoundingfunda.com/live/api/board_meeting', 'board_meetings', 'meetingContainer'), 60 * 60 * 1000);
//         fetchBulkDealsData();
//     }, timeUntilNinePM);
//   }
  
// }



// market over view section Ends here 

// Global Over view section

async function displayGlobalOverlay() {
  globalStaticcode();
  await globalDynamiccode();
}

async function globalStaticcode() {
  let globalStructure = document.querySelector('.content');
  globalStructure.innerHTML = `
    <div class="go-container">
        <div class="heading">
            <h3>Global Index</h3>
        </div>
        <div class="card-container" id="market-container">
            <!-- Global index cards will be inserted here -->
        </div>
    </div>

    <!-- Container for ADR -->
    <div class="go-container">
        <div class="heading">
            <h3>Global ADR</h3>
        </div>
        <div class="card-container" id="adr-container">
            <!-- ADR cards will be inserted here -->
        </div>
    </div>

    <!-- Container for Global Currency -->
    <div class="go-container">
        <div class="heading">
            <h3>Global Currency</h3>
        </div>
        <div class="card-container" id="currency-container">
            <!-- Currency cards will be inserted here -->
        </div>
    </div>
  `;
  await globalDynamiccode();
}

async function globalDynamiccode() {
  // const baseURL = 'http://127.0.0.1:8000/';
const baseURL = 'https://datafetch.compoundingfunda.com/';
const gsLink = 'live/api/globalstatus';
const adrLink = 'live/api/ard';
const currencyLink = 'live/api/currency';
const gsUrl = baseURL + gsLink;
const adrUrl = baseURL + adrLink;
const currencyUrl = baseURL + currencyLink;

// Function to convert timestamp to readable time
function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleTimeString();
}

// Function to create a card for Global Index
function createIndexCard(indexData) {
    const card = document.createElement('div');
    card.className = 'card';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = indexData.name;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = indexData.price;

    const percentChange = document.createElement('div');
    percentChange.className = 'percent_change';
    percentChange.textContent = `${indexData.percent_change}%`;
    if (parseFloat(indexData.percent_change) > 0) {
        percentChange.classList.add('positive');
    } else {
        percentChange.classList.add('negative');
    }

    const lastUpdated = document.createElement('div');
    lastUpdated.className = 'last_updated';
    lastUpdated.textContent = formatTimestamp(indexData.last_updated);

    const state = document.createElement('div');
    state.className = `state ${indexData.state.toLowerCase()}`;
    state.textContent = indexData.state;

    const flag = document.createElement('img');
    flag.src = indexData.flag_url;
    flag.alt = `${indexData.name} Flag`;

    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(percentChange);
    card.appendChild(lastUpdated);
    card.appendChild(state);
    card.appendChild(flag);

    return card;
}

// Function to create a card for ADR
function createAdrCard(stock) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = stock.shortname;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `$${stock.lastprice}`;

    const change = document.createElement('div');
    change.className = 'change';
    change.textContent = `Change: ${stock.percentchange}%`;
    if (parseFloat(stock.percentchange) > 0) {
        change.classList.add('positive');
    } else {
        change.classList.add('negative');
    }

    const state = document.createElement('div');
    state.className = 'state';
    state.textContent = `Market: ${stock.market_state.charAt(0).toUpperCase() + stock.market_state.slice(1)}`;

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(change);
    card.appendChild(state);

    return card;
}

// Function to create a card for Currency
function createCurrencyCard(currency) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = currency.name;

    const ltp = document.createElement('div');
    ltp.className = 'price';
    ltp.textContent = `$${currency.ltp}`;

    const change = document.createElement('div');
    change.className = 'change';
    change.textContent = `Change: ${currency.chgper}%`;
    if (parseFloat(currency.chgper) > 0) {
        change.classList.add('positive');
    } else {
        change.classList.add('negative');
    }

    const state = document.createElement('div');
    state.className = 'state';
    state.textContent = `Market: ${currency.market_state.charAt(0).toUpperCase() + currency.market_state.slice(1)}`;

    card.appendChild(title);
    card.appendChild(ltp);
    card.appendChild(change);
    card.appendChild(state);

    return card;
}

// Fetch and render data for Global Indices
async function renderGlobalIndices() {
    try {
        const response = await fetch(gsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const marketContainer = document.getElementById('market-container');
        marketContainer.innerHTML = '';
        data.forEach(indexData => {
            const card = createIndexCard(indexData);
            marketContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching global indices:', error);
    }
}

// Fetch and render data for ADR
async function renderADR() {
    try {
        const response = await fetch(adrUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const adrContainer = document.getElementById('adr-container');
        adrContainer.innerHTML = '';
        data.forEach(stock => {
            const card = createAdrCard(stock);
            adrContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching ADR data:', error);
    }
}

// Fetch and render data for Global Currency
async function renderGlobalCurrency() {
    try {
        const response = await fetch(currencyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const currencyContainer = document.getElementById('currency-container');
        currencyContainer.innerHTML = '';
        data.forEach(currency => {
            const card = createCurrencyCard(currency);
            currencyContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching global currency data:', error);
    }
}

// Initial rendering
renderGlobalIndices();
renderADR();
renderGlobalCurrency();

// Auto-refresh every 60 seconds for each type of data
setInterval(renderGlobalIndices, 30000);
setInterval(renderADR, 60000);
setInterval(renderGlobalCurrency, 60000);

}


// Global Over view section ends
