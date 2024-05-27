
const getUserData = async () => {
  try {
    const response = await fetch("/getUsername");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
const getAllUserData = async () => {
  try {
    const response = await fetch("/testuser");
    const allUserData = await response.json();
    console.log(allUserData);
    return allUserData;
  } catch (error) {
    console.error(error);
  }
}

updateUsername();
async function updateUsername() {
  
  try {
    const userData = await getUserData();
    console.log(userData);
    const username = userData.user.name;
    const userStatus = userData.user.isSubscribed;
    document.querySelector("#username").innerText = username;
       } 
    catch (error) {
      console.error(error);
    }
  }
function maindashboard() {
  console.log("dashboard");
  try{
      window.location.href = "/dashboard"; 
  }catch(e){
      console.log(e);
  }
}
  

function logout() {
  // Perform logout operation here, such as calling logout API
  console.log("logout");
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

// user tab functions 

const usertab = document.querySelector("#user-control")
usertab.addEventListener('click', async()=>{
  let allData = await getAllUserData();
  pureUserData = allData.sucess;
  console.log(pureUserData);
  const content = document.querySelector('.content');
  let htmlContent = `<div class="option-strip">
  <div class="user-btn">
    <button class="top-button" id="all-users">All Users</button>
  </div>
  <div class="paid-btn">
    <button class="top-button" id="paid-user">Paid Users</button>
  </div>
  <div class="inactive-btn">
    <button class="top-button" id="inactive-user">Inatcive Users</button>
  </div>
  <div class="active-btn">
    <button class="top-button">Back End User</button>
  </div>
 </div>
 <div class="search-block">
  <span class="material-symbols-outlined">search</span>
  <input type="search" class="search-input" placeholder="user name...">
    <button class="search-button">Search</button>
  </div>
 </div>
 <div class="ref-user-table">
  <table class="user-table">
    <thead>
      <tr>
        <th>Sr</th>
        <th>Name</th>
        <th>Mobile No</th>
        <th>Current Plan</th>
        <th>Coupon used</th>
        <th>Amont Paid</th>
        <th>User Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody class="user-table-body">
    </tbody>

  </table>
 </div>`;
  content.innerHTML = ``;
  content.innerHTML = htmlContent;
  // display all users
  const displayall = document.querySelector('#all-users');
  displayall.addEventListener('click',()=>{
    let tablebody = document.querySelector(".user-table-body");
     let html = ``;
    pureUserData.forEach(function (item, index) {
      let amount = 0;
      if(item.razorpayconfimation){
        amount = item.razorpayconfimation.Amount
      }else{
        amount=0;
        date="N/A";
      }
      html += `<tr class="row-user">
      <td>${index+1}</td>
      <td class="user-name">
        ${item.name}
      </td>
      <td>${item.mobile}</td>
      <td>${item.subscriptionDetails.currentSubscription}</td>
      <td>${item.subscriptionDetails.coupon_applied}</td>
      <td>${amount}</td>
      <td>${item.subscriptionDetails.subscriptionStatus}</td>
      <td><button class="table-edit-button">Edit User</button></td>
      </tr>`
    })
    tablebody.innerHTML = html;
  });

  const paidUser = document.querySelector('#paid-user');
 
  paidUser.addEventListener('click',()=>{
    let tablebody = document.querySelector(".user-table-body");
    let html = ``;
    pureUserData.forEach(function(item, index){
      if(item.razorpayconfimation){
        html += `<tr>
      <td>${index+1}</td>
      <td class="user-name">
        ${item.name}
      </td>
      <td>${item.mobile}</td>
      <td>${item.subscriptionDetails.currentSubscription}</td>
      <td>${item.subscriptionDetails.coupon_applied}</td>
      <td>${item.razorpayconfimation.Amount}</td>
      <td>${item.subscriptionDetails.subscriptionStatus}</td>
      <td><button class="table-edit-button">Edit User</button></td>  
      </tr>` ;
      }
         
    })
    
    tablebody.innerHTML = html;
  });
  const inactiveUser = document.querySelector("#inactive-user");
  inactiveUser.addEventListener('click',()=>{
    console.log("Inactive user");
    let tablebody = document.querySelector(".user-table-body");
    let html = ``;
    pureUserData.forEach(function(item, index){
      if(item.subscriptionDetails.subscriptionStatus!= "Active"){
        let amount = 0;
        if(item.razorpayconfimation){
        amount = item.razorpayconfimation.Amount
        }else{
          amount=0;
        }
        html += `<tr>
        <td>${index+1}</td>
        <td class="user-name">
          ${item.name}
        </td>
        <td>${item.mobile}</td>
        <td>${item.subscriptionDetails.currentSubscription}</td>
        <td>${item.subscriptionDetails.coupon_applied}</td>
        <td>${amount}</td>
        <td>${item.subscriptionDetails.subscriptionStatus}</td>
        <td><button class="table-edit-button">Edit User</button></td>  
        </tr>`;
        }
      
      })
    
    tablebody.innerHTML = html;

  });
  

});


const couponControl = document.querySelector('#coupon-control');
console.log(couponControl);

couponControl.addEventListener('click',async ()=>{
  let allCoupons = await fetchallcoupon();
  let finalallCoupons = allCoupons.success;
  console.log(finalallCoupons);
  let content = document.querySelector(".content");
  let htmlContent = `<div class="content">
  <div class="coupon-head">
      <span>
          <button id="all-coupon">Active Coupon</button>
      </span>
   
      <span>
          <button id="create-coupon" onclick="createCoupon()">Create Coupon</button>
      </span>
  </div>
  <table class="coupon-table">
      <thead>
          <tr>
              <th>Sr</th>
              <th>Coupon Name</th> 
              <th>Applicable</th>
              <th>Applicable Plan</th>
              <th>Discount Flat</th>
              <th>Discount multiplier</th>
              <th>Valid till</th>
              <th>Delete</th>
          </tr>
      </thead>
      <tbody class="coupon-table-body">
          
      </tbody>
  </table>
  <div class="overlay"></div>
</div>`;
  content.innerHTML = ``;
  content.innerHTML = htmlContent;
  const displayall = document.querySelector('#all-coupon');
  displayall.addEventListener('click',()=>{
    let tablebody = document.querySelector(".coupon-table-body");
    let html = ``;
    finalallCoupons.forEach(function (item, index) {
      // console.log(item);
      html += `<tr class="row-user">
      <td>${index+1}</td>
      <td class="user-name">
        ${item.doc_id}
      </td>
      <td>${item.applicable}</td>
      <td>${item.applicablePlan}</td>
      <td>${item.discount_flat}</td>
      <td>${item.discount_multiplier}</td>
      <td>${item.valid}</td>
      <td><i class="fa-solid fa-trash delete-record"></i></td>
      </tr>`
    })
    tablebody.innerHTML = html;
  });
});

async function fetchallcoupon(){
  try {
    const response = await fetch("/coupondetails");
    const allUserData = await response.json();
    // console.log(allUserData);
    return allUserData;
  } catch (error) {
    console.error(error);
  }
}

async function createCoupon(){
  console.log("Create coupon called");
  let couponPOP = document.querySelector(".overlay");
  let htmlCoupon =`<div class="pop">
      <button id="close-btn-pop"><i class="fa-solid fa-xmark"></i></button>
      <div class="form">
          <form action="">
              <h2 class="pop-titile">Create Coupon</h2>
              <div class="input-box">
                  <label for="coupon-code">Coupon Code Name*:</label>
                  <input type="text" id="coupon-name" placeholder="Enter Coupon Code" required>
                 <div class="coupon-applicable">
                  <label for="account-type">Coupon Applicable*:</label>
                  <select id="account-type" required>
                  <option value="All plans">All PLANS</option>
                  <option value="champions_club">CHAMPIONS_CLUB</option>
                  <option value="achivers_club">ACHIVERS_CLUB</option>
                  <option value="market_club">MARKET_CLUB</option>
                  </select>
                 </div>
                 <div class="discount-flat">
                  <label for="discount-flat">Discount flat*:</label>
                  <input type="text" id="discount-flat" placeholder="ex. 200 or 20" required>
                 </div>
                 <div class="discount-percentage">
                  <label for="discount-percentage">Discount Percentage*:</label>
                  <input type="text" id="discount-percentage" placeholder=" Ex.0.1 / 0.2"  min="0" max="1" step="0.01" required>
                 </div>
                 <div class="valid-date">
                  <label for="valid-date">Valid Date*:</label>
                  <input id="vaild-date" type="date" required>
                 </div>
                 <div class="coupon-submit-btn">
                  <button id="create-coup">Create Coupon</button>
                 </div>
                 <!-- <div class="coupon-submit-btn">
                      <button id="create-coupon-btn" onclick="createCoupon()">Create</button>
                 </div> -->
          </form>
      </div>
     
  </div>`;
  couponPOP.innerHTML = ``;
  couponPOP.innerHTML = htmlCoupon;
  document.querySelector(".overlay").style.display = "flex";
  document.querySelector(".pop").style.display = "flex";

  const closeBtn = document.querySelector("#close-btn-pop");
  closeBtn.addEventListener('click',()=>{
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".pop").style.display = "none";
  });
  const createCouponBtn = document.querySelector('#create-coup');
  createCouponBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    console.log("Buttton Clicked");
    const couponName = document.querySelector('#coupon-name').value;
    const applicable = document.querySelector('#account-type').value;
    const discountFlat = document.querySelector('#discount-flat').value;
    const discountPercentage = document.querySelector('#discount-percentage').value;
    const validDate = document.querySelector('#vaild-date').value;
    if(couponName && applicable && discountFlat && discountPercentage && validDate){
      console.log(couponName,applicable,discountFlat,discountPercentage,validDate);
      createCouponData(couponName,applicable,discountFlat,discountPercentage,validDate);
      document.querySelector(".overlay").style.display = "none";
      document.querySelector(".pop").style.display = "none";
      }
    else{
      swal("Missing something", "I need all the fields", "error")
    }
      
  });

}// End of createCoupon  

function createCouponData (couponName,applicable,discountFlat,discountPercentage,validDate){
  console.log("Create coupon called");
  console.log(`coupon Name :- ${couponName}\n applicable:- ${applicable} \n discount flat:-${discountFlat} discount percentage:-${discountPercentage} \n valid date:- ${validDate}`);
}