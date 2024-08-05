
const getUserData = async () => {
  try {
    const response = await fetch("/api/getUsername");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
const getAllUserData = async () => {
  try {
    const response = await fetch("/fetch/testuser");
    const allUserData = await response.json();
    // console.log(allUserData);
    return allUserData;
  } catch (error) {
    console.error(error);
  }
}

updateUsername();
async function updateUsername() {
  
  try {
    const userData = await getUserData();
    // console.log(userData);
    const username = userData.user.name;
    const userStatus = userData.user.isSubscribed;
    document.querySelector("#username").innerText = username;
       } 
    catch (error) {
      console.error(error);
    }
  }
function maindashboard() {
  // console.log("dashboard");
  try{
      window.location.href = "/dashboard"; 
  }catch(e){
      console.log(e);
  }
}
  

function logout() {
  // Perform logout operation here, such as calling logout API
  // console.log("logout");
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
    <div class="over-lay"> 
    </div>
    <div class="edit-block">
    </div>
    <div class="overlay-1">
    </div>
  </table>
 </div>`;
  content.innerHTML = ``;
  content.innerHTML = htmlContent;
  // display all users
  const displayall = document.querySelector('#all-users');
  displayall.addEventListener('click',()=>{
    let tablebody = document.querySelector(".user-table-body");
    let html = ``;
    pureUserData.forEach(function(item, index){
   
      html += `<tr>
      <td>${index+1}</td>
      <td class="user-name">
        ${item.name}
      </td>
      <td>${item.mobile}</td>
      <td>${item.subscriptionDetails?item.subscriptionDetails.currentSubscription:"Free"}</td>
      <td>${item.subscriptionDetails?item.subscriptionDetails.coupon_applied:"-"}</td>
      <td>${item.razorpayconfimation?item.razorpayconfimation.Amount:0}</td>
      <td>${item.subscriptionDetails?item.subscriptionDetails.subscriptionStatus:"-"}</td>
      <td><button class="table-edit-button" id="edit-btn" data-index="${index}">Edit User</button></td>  
      </tr>` ;
         
    })
    
    tablebody.innerHTML = html;
    userEditButton = document.querySelectorAll("#edit-btn");
    userEditButton.forEach((button) => {
      button.addEventListener('click', (event) => {
        let index = event.target.getAttribute('data-index');
        // console.log(pureUserData[index].doc_id);
        // const userid = pureUserData[index].doc_id;
        const userid = pureUserData[index];
        // console.log(userid);       
        editUser(userid);
      });
    });
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
    // console.log("Inactive user");
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
        <td>${item.subscriptionDetails?item.subscriptionDetails.currentSubscription:"Free"}</td>
        <td>${item.subscriptionDetails?item.subscriptionDetails.coupon_applied:"-"}</td>
        <td>${item.razorpayconfimation?item.razorpayconfimation.Amount:0}</td>
        <td>${item.subscriptionDetails?item.subscriptionDetails.subscriptionStatus:"-"}</td>
        <td><button class="table-edit-button">Edit User</button></td>  
        </tr>`;
        }
      
      })
    
    tablebody.innerHTML = html;

  });
  

});


const couponControl = document.querySelector('#coupon-control');
// console.log(couponControl);

couponControl.addEventListener('click',async ()=>{
  let allCoupons = await fetchallcoupon();
  let finalallCoupons = allCoupons.success;
  // console.log(finalallCoupons);
  
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
  displayall.addEventListener('click',async ()=>{
    let tablebody = document.querySelector(".coupon-table-body");
  
    let html = ``;

    for (const [index, item] of finalallCoupons.entries()) {
      let applicable = item.applicable;
      console.log(applicable);
      if (applicable !== "all") {
        const serverData = await fetchTheUserData(applicable);
        applicable = serverData.name;
      }

      html += `
        <tr class="row-user">
          <td>${index + 1}</td>
          <td class="user-name">${item.doc_id}</td>
          <td>${applicable == "all" ? "All" : applicable}</td>
          <td>${item.applicablePlan}</td>
          <td>${item.discount_flat}</td>
          <td>${item.discount_multiplier}</td>
          <td>${item.valid}</td>
        </tr>`;
    }
    // Phased out not able to handle the asyc function
    // finalallCoupons.forEach(async function (item, index) {
    //   // console.log(item);
    //   let applicable = item.applicable;
    //   if (applicable != "All"){
    //     uid = applicable;
    //     // console.log(uid);
    //     const serverData = await fetchTheUserData(uid);
    //     console.log(serverData.name);
    //     applicable =serverData.name;
    //     console.log(applicable);
        
    //   }
     
      
    //   html += `<tr class="row-user">
    //   <td>${index+1}</td>
    //   <td class="user-name">
    //     ${item.doc_id}
    //   </td>
    //   <td>${applicable}</td>
    //   <td>${item.applicablePlan}</td>
    //   <td>${item.discount_flat}</td>
    //   <td>${item.discount_multiplier}</td>
    //   <td>${item.valid}</td>
      
    //   </tr>`
    // })

    tablebody.innerHTML = html;
  });
});

async function fetchallcoupon(){
  try {
    const response = await fetch("/api/coupondetails");
    const allUserData = await response.json();
    // console.log(allUserData);
    return allUserData;
  } catch (error) {
    console.error(error);
  }
}

async function createCoupon(){
  // console.log("Create coupon called");
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
    // console.log("Buttton Clicked");
    const couponName = document.querySelector('#coupon-name').value;
    const couponApplicable = document.querySelector('#account-type').value;
    const discountFlat = document.querySelector('#discount-flat').value;
    const discountPercentage = document.querySelector('#discount-percentage').value;
    const validDate = document.querySelector('#vaild-date').value;
    if(couponName && couponApplicable && discountFlat && discountPercentage && validDate){
      // console.log(couponName,couponApplicable,discountFlat,discountPercentage,validDate);
      createCouponData(couponName,couponApplicable,discountFlat,discountPercentage,validDate);
      document.querySelector(".overlay").style.display = "none";
      document.querySelector(".pop").style.display = "none";
      }
    else{
      swal("Missing something", "I need all the fields", "error")
    }
      
  });

}// End of createCoupon  

async function createCouponData (couponName,couponApplicable,discountFlat,discountPercentage,validDate){
  // console.log("Create coupon called");
  // console.log(`coupon Name :- ${couponName}\n applicable:- ${couponApplicable} \n discount flat:-${discountFlat} discount percentage:-${discountPercentage} \n valid date:- ${validDate}`);
  const data = {
    couponName: couponName,
    applicable: 'all',
    couponApplicable: couponApplicable,
    discountFlat: discountFlat,
    discountPercentage: discountPercentage,
    validDate: validDate
  }
  const response = await fetch("/createAllCoupon", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
});
const server = await response.json();
// console.log(server.status_code);
if(server.status_code == 200){
  swal("Coupon Created Successfully", "Coupon created", "success");
}
else{
    swal("Coupon Not Created", "Coupon not created", "error");}
}



async function createUserCouponData (couponName,couponApplicable,discountFlat,discountPercentage,validDate, userID){
  // console.log("Create coupon called");
  // console.log(`coupon Name :- ${couponName}\n applicable:- ${couponApplicable} \n discount flat:-${discountFlat} discount percentage:-${discountPercentage} \n valid date:- ${validDate}`);
  const data = {
    couponName: couponName,
    applicable: userID,
    couponApplicable: couponApplicable,
    discountFlat: discountFlat,
    discountPercentage: discountPercentage,
    validDate: validDate
  }
  const response = await fetch("/api/createUserCoupon", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
});
const server = await response.json();
// console.log(server.status_code);
if(server.status_code == 200){
  swal("Coupon Created Successfully", "Coupon created", "success");
}
else{
    swal("Coupon Not Created", "Coupon not created", "error");}
}

// Edit user 
function editUser(usedData){
  // console.log(`User id:- ${usedData.doc_id}`);
  openEditPOP(usedData.doc_id);
}


async function fetchTheUserData(uid){
  const data = {
    uid: uid
  }
  const response = await fetch("/api/getUserData", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
});
const server = await response.json();
// console.log(server.data.name);
return server.data;
}

// ***** Edit User ***** 
async function openEditPOP(uid){
  const userData = await fetchTheUserData(uid);
  // console.log(userData.uid);
  let edituserHtml = document.querySelector(".over-lay");
  let editpopHtml = `<div class="edit-pop">
    <button id="close-btn-pop-edit" onclick="closeEditUser()"><i class="fa-solid fa-xmark"></i></button>
    <div class="form">
      <form action="">
        <h2 class="pop-titile">Edit User Details</h2>
        <div class="input-title">
          <label for="edit-user-name">Name:</label>
          <input type="text" id="edit-user-name" class="edit-user" placeholder="Name" value = "${userData.name}"readonly><br><br>
          <label for="edit-user-email">Email:</label>
          <input type="text" id="edit-user-email" class="edit-user" placeholder="Email" value = "${userData.email}" readonly><br><br>
          <label for="edit-user-mobile">Mobile:</label>
          <input type="text" id="edit-user-mobile" class="edit-user" placeholder="Mobile" value="${userData.mobile}" readonly>
          <br><br>
          <label for="edit-user-plan">Current Plan:</label>
          <input type="text" id="edit-user-plan" class="edit-user" placeholder="Current Plan" value = "${userData.subscriptionDetails.currentSubscription}" readonly>
          <button type="button" onclick="editPlan()"><i class="fa-solid fa-pen-to-square small-btn"></i></button>
          <br><br>
          <div class="create-coupon1">
            <button type="button" id="create-coupon1" onclick="createCouponUser('${userData.uid}')"><i class="fa-solid fa-ticket"></i> User Coupon</button>
          </div>
          <br><br>
          <div class="conf">
            <button type="button" id="confirm-btn-pop-cancel" onclick="closeEditUser()">Cancel</button>
            <button type="button" id="confirm-btn-pop-edit" onclick="updateUser('${userData.uid}')">Update</button>
          </div>
          </div>
        </div>
      </form>
    </div>
  </div>`;
  edituserHtml.innerHTML = editpopHtml;
  
}

function closeEditUser(){
  // console.log("close edit button clicked");
  document.querySelector(".edit-pop").style.display = "none";
  document.querySelector(".edit-block").style.display = "none";
}

//  create user specific coupon UI

function createCouponUser(userUid){
  // console.log("create coupon clicked");
  // console.log(userUid);
  closeEditUser();
  let createCoupon = document.querySelector(".over-lay");
  let creareCouponHtml =`<div class="overlay-1">
        <div class="pop">
          <button id="close-btn-pop" onclick="closeCreateCoupon()"><i class="fa-solid fa-xmark"></i></button>
          <div class="form">
              <form action="">
                  <h2 class="pop-titile">Coupon for User</h2> 
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
                      <input type="number" id="discount-percentage" placeholder=" Ex.0.1"  min="0" max="1" step="0.01" required>
                     </div>
                     <div class="valid-date">
                      <label for="valid-date">Valid Date*:</label>
                      <input id="vaild-date" type="date" required>
                     </div>
                     <div class="coupon-submit-btn">
                      <button type ="button" id="create-coup" onclick="UserCoupon('${userUid}')">User Coupon</button>
                     </div>
              </form>
          </div>
         </div>
      </div>
  `;
  createCoupon.innerHTML = creareCouponHtml;

}

function closeCreateCoupon(){
  // console.log("close create coupon button clicked");
  document.querySelector(".pop").style.display = "none";
}

// Create specific user coupon code

function UserCoupon(applicable){
  // console.log("update user coupon button clicked");
  // console.log(`${applicable}`);
  const couponName = document.querySelector('#coupon-name').value;
    const couponApplicable = document.querySelector('#account-type').value;
    const discountFlat = document.querySelector('#discount-flat').value;
    const discountPercentage = document.querySelector('#discount-percentage').value;
    const validDate = document.querySelector('#vaild-date').value;

    // console.log(couponName,couponApplicable,discountFlat,discountPercentage,validDate);
    if(couponName && couponApplicable && discountFlat && discountPercentage && validDate){
      // console.log(applicable,couponName,couponApplicable,discountFlat,discountPercentage,validDate);
      // createCouponData(couponName,couponApplicable,discountFlat,discountPercentage,validDate);
      createUidCoupon(applicable,couponName,couponApplicable,discountFlat,discountPercentage,validDate);
      document.querySelector(".overlay-1").style.display = "none";
      document.querySelector(".pop").style.display = "none";
      }
    else{
      swal("Missing something", "I need all the fields", "error")
    }
}

//  Edit user code 

function editPlan(){
  console.log("edit plan button clicked");
  let editPlan = document.querySelector(".edit-block");
  document.querySelector(".edit-block").style.display = "block";
  const editPlanHtml =`<div class="sub-pop">
    <button id="close-btn-pop-edit2" onclick="closeEditPlan()"><i class="fa-solid fa-xmark"></i></button>
    <div class="form">
        <form action="">
          <div class="change-plan">
            <label for="account-type">Select New Plan*:</label>
            <select id="account-type" required>
            <option value="Market Talk Club">MARKET_CLUB</option>
            <option value="Achivers Club">ACHIVERS_CLUB</option>
            <option value="Champions Club">CHAMPIONS_CLUB</option>
            </select>
            <BUtton type="button" id="submit-btn-plan" onclick="newPlanSelected()">Submit</BUtton>
           </div>
        </form>
    </div>
  </div>`;
  editPlan.innerHTML = editPlanHtml; 
}

// update user plan logic 
function updateUser(uid){
  // console.log("update user button clicked");
  const selectedMobile = document.querySelector('#edit-user-mobile').value;
  const selectedPlan = document.querySelector('#edit-user-plan').value;
  // console.log(selectedMobile,selectedPlan,uid);
  updateNewPlan(uid,selectedPlan,selectedMobile);
  // closeEditUser();
}

function closeEditMobileNo(){
  // console.log("close edit mobile no button clicked"); 
  document.querySelector(".edit-block").style.display = "none";
}
function closeEditPlan(){
  // console.log("close edit plan button clicked");
  document.querySelector(".edit-block").style.display = "none";
}

// function validateMobile(){
//   console.log("validate mobile button clicked");
//   const selectedMobile = document.querySelector('#newMobile').value;
//   closeEditMobileNo();
//   document.querySelector('#edit-user-mobile').value = selectedMobile;
//   console.log(selectedMobile);
// }

async function newPlanSelected(){
  // console.log("new plan slected submit button clicked");
  const selectedPlan = document.querySelector('#account-type').value;
  document.querySelector('#edit-user-plan').value = selectedPlan;
  closeEditPlan();
  // console.log(selectedPlan);
  // await updateNewPlan(uid,selectedPlan,mobile);
}
async function createUidCoupon(applicable,couponName,couponApplicable,discountFlat,discountPercentage,validDate){
  data = {
    "applicable":applicable,
    "couponName":couponName,
    "couponApplicable":couponApplicable,
    "discountFlat":discountFlat,
    "discountPercentage":discountPercentage,
    "validDate":validDate
  }
  const response = await fetch('/api/createUserCoupon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (response.ok) {
    swal("Coupon Created Successfully", "Coupon created", "success");
  }
  else {
    swal("Error", "Something went wrong", "error");
  }
  // console.log(result);
}

async function updateNewPlan(uid,newPlan,mobile){
  data = {
    "uid":uid,
    "planToChange":newPlan,
  }
  const response = await fetch('/api/editUserSubscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (response.ok) {
    closeEditUser();
    swal("User Updated Successfully", "User updated", "success");
  }
  else {
    swal("Error", "Something went wrong", "error");
  }
  // console.log(result);
}