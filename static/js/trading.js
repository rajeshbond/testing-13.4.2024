
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



// Function to create and show the pop-up
function showPopUpBuy() {
  // Create pop-up container HTML
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
    <button id="submit">Buy</button>
  </form>
</div>
  `;

  // Append pop-up container HTML to document body
  document.body.innerHTML += popHTML;

  // Add event listeners
  let submitButtonColor = document.querySelector("#submit")
  let popcss = document.querySelector(".popEffect");
  popcss.style.border = '1px solid green';
  submitButtonColor.style.backgroundColor ="green";

  document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get input values and perform submission logic
    let dateValue = document.getElementById('dateInput').value;
    let symbolValue = document.getElementById('symbolInput').value;
    let symbolPriceValue = document.getElementById('symbol-price').value;
    let symbolqtyValue = document.getElementById('symbol-price-qty').value;
    document.getElementById('popDiv').classList.remove('show');
    if(dateValue !="" && symbolValue !="", symbolPriceValue !="", symbolqtyValue !=""){
      tradeEntry(tyre = 'Buy', date = dateValue, symbol = symbolValue, price = symbolPriceValue , qty = symbolqtyValue);
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

// Call the function to show the pop-up
function showPopUpSell() {
  // Create pop-up container HTML
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
    <button id="submit">Sell</button>
  </form>
</div>
  `;

  // Append pop-up container HTML to document body
  document.body.innerHTML += popHTML;

  // Add event listeners
  let submitButtonColor = document.querySelector("#submit")
  let popcss = document.querySelector(".popEffect");
  popcss.style.border = '1px solid red';
  popcss.style.backgroundColor = 'white';
  submitButtonColor.style.backgroundColor ="red";


  document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get input values and perform submission logic
    var dateValue = document.getElementById('dateInput').value;
    var symbolValue = document.getElementById('symbolInput').value;
    var symbolPriceValue = document.getElementById('symbol-price').value;
    var symbolqtyValue = document.getElementById('symbol-price-qty').value;
    if(dateValue !="" && symbolValue !="", symbolPriceValue !="", symbolqtyValue !=""){
      tradeEntry(tyre = 'Sell', date = dateValue, symbol = symbolValue, price = symbolPriceValue , qty = symbolqtyValue);
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

      html += `<tr>
                  <td>${item.EntryDate}</td>
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
exitBtn.forEach(button1=>{
  button1.addEventListener('click', function(){
    let index = this.getAttribute('data-btn-index');
      // console.log(data[index])
      openPOPup(data[index])
      
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

function openPOPup(item){
  console.log("inside funtion")
  console.log(item);
  return;
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


window.onload = populateTable;