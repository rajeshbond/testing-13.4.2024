// Function to set the source of the iframe to your Google Sheets document
// console.log("screener");


function setGoogleSheetIframeSource() {
    // Replace 'YOUR_EMBED_URL' with the embed URL of your Google Sheets document
    console.log("Google sheet");
    var embedUrl = 'https://docs.google.com/spreadsheets/d/1uqbCj754ZmtzetUnS7jrMOELNbbiayyBSTfR3mtTFpQ/edit#gid=0';
    document.getElementById('sheetFrame').src = embedUrl;
}
const getUserData = async () => {
    try {
      const response = await fetch("/getUsername");
      const data = await response.json();
    //   console.log(data);
    //   console.log(data.user.subscriptionDetails.free_trial_over);
      return data.user;
    } catch (error) {
      console.error(error);
    }
  };


// function callApi() {

//     fetch('https://final-scan.onrender.com/start')
//     .then(response => response.json())
//     .then(data => console.log(data)) // Handle API response as needed
//     .catch(error => console.error('Error:', error));
// }

// Function to refresh the iframe source every 5 minutes
// function refreshGoogleSheetData() {
//     setGoogleSheetIframeSource();
//     callApi();
//     setTimeout(refreshGoogleSheetData, 2 * 60 * 1000); // Refresh every 2 minutes (5 * 60 * 1000 milliseconds)
// }
function dashboard() {
    try{
        window.location.href = "/dashboard"; 
    }catch(e){
        console.log(e);
    }
}

async function showPopup() {
    const data = await getUserData();
    isPaid = data.subscriptionDetails.free_trial_over;
    exp_date = dateconverter(data.subscriptionDetails.subscriptionEndDate);
    exp = new Date(exp_date);
    console.log(exp);
   if(!isPaid){
    console.log("show popup");
    swal(`Hi ${data.name}`, `Your free trial is going to expire soon. \n Please upgrade to premium and enjoy the service seemlessly !!!`);
    setTimeout(showPopup, 10 * 60 * 1000);    
   }
    
}

function dateconverter(date) {
  const dateObj = new Date(date);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return dateObj.toLocaleDateString("en-GB", options).replace(/\//g, "-");
}


// Function to call the API and refresh Google Sheets data when the page loads
window.onload = function() {
    setGoogleSheetIframeSource();
    showPopup();
};
