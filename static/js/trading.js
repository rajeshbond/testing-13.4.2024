
const fetchunRecouds = async () => {
  try {
    const response = await fetch("/fetchunregister");
    const data = await response.json();
    // console.log(response)
    // console.log(data.records)
    return data;
  } catch (error) {
    console.error(error);
  }
};

function popUp(item){
  console.log(`${item}`);
  var popHTML = `
  <div id="popDiv" class="popEffect">
  <button id="closeButton" class="closeButton">&times;</button>
  <p></p>
  <form id="inputForm">
    <label for="dateInput">Date:</label>
    <input type="date" id="dateInput" name="dateInput"><br><br>
    <label for="symbolInput">Symbol:</label>
    <input type="text" id="symbolInput" name="symbolInput"><br><br>
    <label for="symbol-price">BuyingPrice:</label>
    <input type="text" id="symbol-price" name="symbolInput" pattern="[0-9]*\.?[0-9]*" inputmode="numeric"><br><br>
    <label for="symbol-price">Buying Qty:</label>
    <input type="text" id="symbol-price-qty" name="symbolInput" pattern="[0-9]*" inputmode="numeric"><br><br>
    <button id="submit" ></button>
  </form>
</div>
  `;
  console.log(popHTML)
  // Append pop-up container HTML to document body
  document.body.innerHTML += popHTML;
  popHTML = "";
  // Add event listeners
  let submitButtonColor = document.querySelector("#submit")
  let popcss = document.querySelector(".popEffect");
  if(item == "Buy"){popcss.style.border = '1px solid green';
  submitButtonColor.style.backgroundColor ="green";
  submitButtonColor.textContent = "Buy"}
  else{popcss.style.border = '1px solid red';
  submitButtonColor.style.backgroundColor ="red";
  submitButtonColor.te = "Sell"}  

  document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get input values and perform submission logic
    let dateValue = document.getElementById('dateInput').value;
    let symbolValue = document.getElementById('symbolInput').value;
    let symbolPriceValue = document.getElementById('symbol-price').value;
    let symbolqtyValue = document.getElementById('symbol-price-qty').value;
    document.getElementById('popDiv').classList.remove('show');
    if(dateValue !="" && symbolValue !="", symbolPriceValue !="", symbolqtyValue !=""){
      tradeEntry(tyre = item, date = dateValue, symbol = symbolValue, price = symbolPriceValue , qty = symbolqtyValue);
      document.getElementById('popDiv').classList.remove('show');
      populateTable();
      }else{
        console.log("The Error")
    }
  });

  document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popDiv').classList.remove('show');
  });

  // Show the pop-up
  document.getElementById('popDiv').classList.add('show');
}


// Function to create and show the pop-up
// function showPopUpBuy() {
//   // Create pop-up container HTML
//   var popHTML = `
//   <div id="popDiv" class="popEffect">
//   <button id="closeButton" class="closeButton">&times;</button>
//   <p></p>
//   <form id="inputForm">
//     <label for="dateInput">Date:</label>
//     <input type="date" id="dateInput" name="dateInput"><br><br>
//     <label for="symbolInput">Symbol:</label>
//     <input type="text" id="symbolInput" name="symbolInput"><br><br>
//     <label for="symbol-price">BuyingPrice:</label>
//     <input type="text" id="symbol-price" name="symbolInput" pattern="[0-9]*\.?[0-9]*" inputmode="numeric"><br><br>
//     <label for="symbol-price">Buying Qty:</label>
//     <input type="text" id="symbol-price-qty" name="symbolInput" pattern="[0-9]*" inputmode="numeric"><br><br>
//     <button id="submit1" class="submit-btn">Buy</button>
//   </form>
// </div>
//   `;

//   // Append pop-up container HTML to document body
//   document.body.innerHTML += popHTML;

//   // Add event listeners
//   let submitButtonColor = document.querySelector("#submit1")
//   let popcss = document.querySelector(".popEffect");
//   popcss.style.border = '1px solid green';
//   submitButtonColor.style.backgroundColor ="green";
//   submitButtonColor.innerTEXT = "Buy"

//   document.getElementById('inputForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     // Get input values and perform submission logic
//     let dateValue = document.getElementById('dateInput').value;
//     let symbolValue = document.getElementById('symbolInput').value;
//     let symbolPriceValue = document.getElementById('symbol-price').value;
//     let symbolqtyValue = document.getElementById('symbol-price-qty').value;
//     document.getElementById('popDiv').classList.remove('show');
//     if(dateValue !="" && symbolValue !="", symbolPriceValue !="", symbolqtyValue !=""){
//       tradeEntry(tyre = 'Buy', date = dateValue, symbol = symbolValue, price = symbolPriceValue , qty = symbolqtyValue);
//       document.getElementById('popDiv').classList.remove('show');
//       populateTable();
//       }else{
//         console.log("The Error")
//     }
//   });

  
 


//   document.getElementById('closeButton').addEventListener('click', function() {
//     document.getElementById('popDiv').classList.remove('show');
//   });

//   // Show the pop-up
//   document.getElementById('popDiv').classList.add('show');
// }

// Call the function to show the pop-up
// function showPopUpSell() {
//   console.log('sell')
//   // Create pop-up container HTML
//   var popHTML1 = `
//   <div id="popDiv" class="popEffect">
//   <button id="closeButton" class="closeButton">&times;</button>
//   <p></p>
//   <form id="inputForm">
//     <label for="dateInput">Date:</label>
//     <input type="date" id="dateInput" class="dateInput"name="dateInput"><br><br>
//     <label for="symbolInput">Symbol:</label>
//     <input type="text" id="symbolInput" class="symbolInput" name="symbolInput"><br><br>
//     <label for="symbol-price">BuyingPrice:</label>
//     <input type="text" id="symbol-price" class="symbol-price" name="symbolInput" pattern="[0-9]*\.?[0-9]*" inputmode="numeric"><br><br>
//     <label for="symbol-price">Buying Qty:</label>
//     <input type="text" id="symbol-price-qty" class="symbol-price-qty" name="symbolInput" pattern="[0-9]*" inputmode="numeric"><br><br>
//     <button id="submit2" class="submit-btn">Sell</button>
//   </form>
// </div>
//   `;
//   console.log(popHTML1);
//   // Append pop-up container HTML to document body
//   document.body.innerHTML += popHTML1;
//   // Add event listeners
//   let submitButtonColor = document.querySelector("#submit2")
//   let popcss = document.querySelector(".popEffect");
//   popcss.style.border = '1px solid red';
//   popcss.style.backgroundColor = 'white';
//   submitButtonColor.style.backgroundColor ="red";
//   // submitButtonColor.innerTEXT = "Sell"


//   document.getElementById('inputForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     // Get input values and perform submission logic
//     var dateValue = document.getElementById('dateInput').value;
//     var symbolValue = document.getElementById('symbolInput').value;
//     var symbolPriceValue = document.getElementById('symbol-price').value;
//     var symbolqtyValue = document.getElementById('symbol-price-qty').value;
//     if(dateValue !="" && symbolValue !="", symbolPriceValue !="", symbolqtyValue !=""){
//       tradeEntry(tyre = 'Sell', date = dateValue, symbol = symbolValue, price = symbolPriceValue , qty = symbolqtyValue);
//       document.getElementById('popDiv').classList.remove('show');
//       populateTable();
//       }else{
//         console.log("The Error")
//     }
//   });
//   document.getElementById('closeButton').addEventListener('click', function() {
//     document.getElementById('popDiv').classList.remove('show');
//   });

//   // Show the pop-up
//   document.getElementById('popDiv').classList.add('show');
// }


async function populateTable() {
  recived = await fetchunRecouds()
  data = recived.records
 
  // data.forEach((element, index) => {
  //   console.log(element);
  // });
  let html = ``;
  
  document.querySelector('#tableBody').innerHTML = html;

  // Loop through each data entry and create table rows
  data.forEach((item, index) => {
    let bgColorClass = '';
    let btnName = '';
    // console.log(item[index])
        if (item.EntryType == "Buy") {
            bgColorClass = 'negative-price';
            btnName = 'Sell';
        } else if (item.EntryType== "Sell") {
            bgColorClass = 'positive-price';
            btnName = 'Buy';
        }
        // console.log(`bgcolr = ${bgColorClass}`)
        // date = dateconverter(item.EntryDate)
      html += `<tr>
                  <td>${dateconverter(item.EntryDate)}</td>
                  <td>${item.EntryType}</td>
                  <td>${item.EntrySymbol}</td>
                  <td>${item.EntryPrice}</td>
                  <td>${item.EntryQty}</td>
                  <td><button class="buy-sell-btn ${bgColorClass}" data-btn-index="${index}">${btnName}</button>
                  <button class="record-cancel" " style="font-size: 24px;" data-index="${index}">&times</button>
                  </td>
              </tr>`;
  });

  // console.log(html)
  // Set innerHTML of the table container
  document.querySelector('#tableBody').innerHTML += html;
  // Handle button click

const exitBtn = document.querySelectorAll(".buy-sell-btn")
exitBtn.forEach(button=>{
  button.addEventListener('click', function(){
    let index = this.getAttribute('data-btn-index');
    exitPOPup(data[index]);
      
  });
})  
document.querySelectorAll('.record-cancel').forEach(button => {
  button.addEventListener('click', function() {
      let ind = this.getAttribute('data-index');
      console.log(data[ind].doc)
      deleteRecords(data[ind].doc_id);
    });

  });

}

function entryPOPup(item){
  let tradeTpye = item;
  console.log(item)
  var container = document.querySelector('.container');
  var tradeType = item.EntryType;
  console.log(` Trade Tpye : ${tradeTpye}`)
  var modalHTML = `
  <div class="modal">
    <div class="modal-header">
      <h4 class="header-h4"></h4>
      <button id="close-btn-id" class="close-btn-1"><i class="far fa-circle-xmark"></i></button>
    </div>
    <div class="modal-body">
      <form id="input-form">
        <label for="exit-date">Exit Date:</label>
        <input type="date" id="exit-date" class="entry-date-input" required><br><br>
        <label for="stock-name">Stock Name:</label>
        <input type="text" id="stock-name" class="symbol" placeholder="Stock Name" required><br><br>
        <label for="stock-price">Buying Price:</label>
        <input type="text" id="stock-price" class="symbol" placeholder="Stock Price" pattern="[0-9]*\.?[0-9]*" inputmode="numeric" required><br><br>
        <label for="stock-qty">Buying Qty:</label>
        <input type="text" id="stock-qty" class="symbol" placeholder="Stock Qty" pattern="[0-9]*" inputmode="numeric" required><br><br>
        <button id="submit2" class="submit-button"></button>
      </form>
    </div>
  </div>
  `;

  // console.log(modalHTML);

  // Insert the modal HTML content into the container
  container.innerHTML += modalHTML;

  // Get the modal element after it's inserted
  var modal = document.querySelector('.modal');
  document.querySelector("#close-btn-id").addEventListener('click', function(){
    modal.classList.remove("active");
  });
  // Add the 'active' class to show the modal
  modal.classList.add("active");
  let submitButton = document.querySelector(".submit-button");
  const headerPOPh4 = document.querySelector(".modal .modal-header h4");
  // Change the border color
  if(tradeTpye === "Buy"){
    modal.style.borderColor = 'green';
    submitButton.style.backgroundColor ="green";
    submitButton.style.color ='white';
    submitButton.textContent =tradeTpye;
    headerPOPh4.textContent =tradeTpye;
  }else{
    modal.style.borderColor = 'red';
    submitButton.style.backgroundColor ="red";
    submitButton.style.color ='white';
    submitButton.textContent =tradeTpye;
    headerPOPh4.textContent =tradeTpye;
  }
  submitButton.addEventListener('click', function(event){
    event.preventDefault();
    var exitDateInput = document.querySelector('#exit-date');
    var stockNameInput = document.querySelector('#stock-name');
    var stockPriceInput = document.querySelector('#stock-price');
    var stockQtyInput = document.querySelector('#stock-qty');
       // Extracting input values
    var exitDate = exitDateInput.value;
    var stockName = stockNameInput.value;
    var stockPrice = stockPriceInput.value;
    var stockQty = stockQtyInput.value;
  
    if(exitDate!="" && stockName!="" && stockPrice!="" && stockQty!=""){
      console.log("Exit Date:", exitDate);
      console.log("Stock Name:", stockName);
      console.log("Stock Price:", stockPrice);
      console.log("Stock Qty:", stockQty);
      tradeEntry(tyre = tradeTpye, date = exitDate, symbol = stockName, price = stockPrice , qty = stockQty);
      modal.classList.remove("active");
      populateTable();
    }
    
  });
  
  

  
}
function exitPOPup(item){
  
  console.log(item);
  // alert(`${item.EntrySymbol}`);
  var container = document.querySelector('.container');
  var type = "Sell"
  var modalHTML = `
  <div class="modal">
    <div class="modal-header">
      <h4>${type}</h4>
      <button id="close-btn-id" class="close-btn-1"><i class="far fa-circle-xmark"></i></button>
    </div>
    <div class="modal-body">
      <form id="input-form">
        <label for="exit-date">Exit Date:</label>
        <input type="date" id="exit-date" class="entry-date-input" required><br><br>
        <label for="stock-name">Stock Name:</label>
        <input type="text" id="stock-name" class="symbol" placeholder="Stock Name" required><br><br>
        <label for="stock-price">Buying Price:</label>
        <input type="text" id="stock-price" class="symbol" placeholder="Stock Price" pattern="[0-9]*\.?[0-9]*" inputmode="numeric" required><br><br>
        <button id="submit3" class="submit-button">${type}</button>
      </form>
    </div>
  </div>
  `;

  // Insert the modal HTML content into the container
  container.innerHTML += modalHTML;
  modalHTML="";

  // Get the modal element after it's inserted
  var modal = document.querySelector('.modal');
  document.querySelector("#close-btn-id").addEventListener('click', function(){
    modal.classList.remove("active");
  });
  // Add the 'active' class to show the modal
  modal.classList.add("active");
  // Change the border color
  if(type =="Buy"){
    modal.style.borderColor = 'green';
    // document.querySelector(".close-btn").style.color = 'green';
    document.querySelector(".submit-button").style.backgroundColor ="green";
    document.querySelector(".submit-button").style.color ='white';
  }else{
    modal.style.borderColor = 'red';
  }
  

  
}
async function deleteRecords(doc_id){
  console.log(`docID ${doc_id}`)
  try {
    const response = await fetch(`/delete_record/${doc_id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const data = await response.json();
    // Optionally, reload the page or remove the row visually from the table
    // For example, if you want to remove the row without reloading:
    // document.querySelector(`button[data-index="${index}"]`).closest('tr').remove();
    populateTable(); 
} catch (error) {
    console.error('Error:', error);
}
}

async function tradeEntry(tyre = type, date = date, symbol = symbol, price = price , qty = qty){
  try{
    const data = {
      type: tyre,
      date: date,
      symbol: symbol,
      price: price,
      qty: qty
    }
      
    
  // console.log(data)
  const response = await fetch("/updateregentry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const serverResponse = await response.json();
  console.log("Server response:", serverResponse);
}
catch(error){
  console.log(error)
}

}

function dashboard1() {
  try{
      window.location.href = "/dashboard"; 
  }catch(e){
      console.log(e);
  }
}


function dateconverter(date) {
  const dateObj = new Date(date);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return dateObj.toLocaleDateString("en-GB", options).replace(/\//g, "-");
}


window.onload = populateTable;