
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