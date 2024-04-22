
let pNL = 0.0;
const fetchunRecords = async () => {
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
async function populateTable() {
  let recived = await fetchunRecords()
  let data = recived.records
  console.log(data)
 
 
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
        let tradeValue = ((item.EntryPrice)*(item.EntryQty)).toFixed(2);
        // console.log(`bgcolr = ${bgColorClass}`)
        // date = dateconverter(item.EntryDate)
      html += `<tr>
                  <td>${dateconverter(item.EntryDate)}</td>
                  <td>${item.EntryType}</td>
                  <td>${item.EntrySymbol}</td>
                  <td>${item.EntryPrice}</td>
                  <td>${item.EntryQty}</td>
                  <td> ₹ ${tradeValue}</td>
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
  container.innerHTML = '';
  var modalHTML = `
  <div class="modal">
    <div class="modal-header">
      <h4 class="header-h4"></h4>
      <button id="close-btn-id" class="close-btn-1"><i class="far fa-circle-xmark"></i></button>
    </div>
    <div class="modal-body">
      <form id="input-form">
        <label for="entry-date">Entry Date:</label>
        <input type="date" id="entry-date" class="entry-date-input" required><br><br>
        <label for="entry-stock-name">Stock Name:</label>
        <input type="text" id="entry-stock-name" class="symbol" placeholder="Stock Name" required><br><br>
        <label for="entry-stock-price">Entry Price:</label>
        <input type="text" id="entry-stock-price" class="symbol" placeholder="Stock Price" pattern="[0-9]*\.?[0-9]*" inputmode="numeric" required><br><br>
        <label for="entry-stock-qty">Enrty Qty:</label>
        <input type="text" id="entry-stock-qty" class="symbol" placeholder="Stock Qty" pattern="[0-9]*" inputmode="numeric" required><br><br>
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
    headerPOPh4.style.color="green";
  }else{
    modal.style.borderColor = 'red';
    submitButton.style.backgroundColor ="red";
    submitButton.style.color ='white';
    submitButton.textContent =tradeTpye;
    headerPOPh4.textContent =tradeTpye;
    headerPOPh4.style.color="red";
  }
  submitButton.addEventListener('click', function(event){
    event.preventDefault();
    var entryDateInput = document.querySelector('#entry-date');
    var stockNameInput = document.querySelector('#entry-stock-name');
    var stockPriceInput = document.querySelector('#entry-stock-price');
    var stockQtyInput = document.querySelector('#entry-stock-qty');
       // Extracting input values
    var entry
    var entryDate = entryDateInput.value;
    var stockName = stockNameInput.value;
    var stockPrice = stockPriceInput.value;
    var stockQty = stockQtyInput.value;
  
    if(entryDate!="" && stockName!="" && stockPrice!="" && stockQty!=""){
      tradeEntry(tyre = tradeTpye, date = entryDate, symbol = stockName, price = stockPrice , qty = stockQty);
      modal.classList.remove("active");
      populateTable();
    }
    
  });
  
  

  
}
function exitPOPup(item){
  
  console.log(item);

  var container = document.querySelector('.container');
  var entryType = item.EntryType;
  var stockSymbol = item.EntrySymbol;
  // var entryStockPr = item.EntryPrice;
  console.log(entryType)
  container.innerHTML = '';
  var modalHTML1 = `
  <div class="modal">
    <div class="modal-header">
      <h4 class="header-h4"></h4>
      <button id="close-btn-id" class="close-btn-1"><i class="far fa-circle-xmark"></i></button>
    </div>
    <div class="modal-body">
      <form id="input-form">
        <label for="exit-date">Exit Date:</label>
        <input type="date" id="exit-date" class="entry-date-input" required><br><br>
        <label for="exit-stock-name">Stock Name:</label>
        <input type="text" id="exit-stock-name" class="symbol" placeholder="Stock Name"><br><br>
        <label for="exit-stock-price">Entry Price:</label>
        <input type="text" id="entry-stock-price" class="symbol" placeholder="Entry Price" pattern="[0-9]*\.?[0-9]*" inputmode="numeric" required><br><br>
        <label for="exit-stock-price">Exit Price:</label>
        <input type="text" id="exit-stock-price" class="symbol" placeholder="Exit Stock Price" pattern="[0-9]*\.?[0-9]*" inputmode="numeric" required><br><br>
        <button id="submit3" class="submit-button"></button>
      </form>
    </div>
  </div>
  `;
  try{}
  catch (error){}
  // Insert the modal HTML content into the container
  container.innerHTML += modalHTML1;
  var exitDateInput = document.querySelector('#exit-date');
  var stockNameInput = document.querySelector('#exit-stock-name');
  var enrtyStockPriceInput = document.querySelector('#entry-stock-price');
  var exitStockPriceInput = document.querySelector('#exit-stock-price');
  let submitButton = document.querySelector('#submit3')

  stockNameInput.value = stockSymbol;
  enrtyStockPriceInput.value = item.EntryPrice;
  submitButton.addEventListener('click', function(event){
    event.preventDefault();
    var exitDate = exitDateInput.value;
    var stockName = stockNameInput.value;
    var enrtyStockPrice = enrtyStockPriceInput.value
    var exitstockPrice = exitStockPriceInput.value;
    if(exitDate != "" && exitstockPrice !=""){
      console.log(exitDate);
      console.log(stockName);
      console.log(exitstockPrice);
      modal.classList.remove("active");
      completeTrade(item=item, exitDate = exitDate, exitPrice = exitstockPrice);
      console.log("snumit button clicked");
    }else{
      console.log('error');
      

    }
    
  });


  // Get the modal element after it's inserted
  var modal = document.querySelector('.modal');
  document.querySelector("#close-btn-id").addEventListener('click', function(){
    modal.classList.remove("active");
  });
  // Add the 'active' class to show the modal
  modal.classList.add("active");
  const headerPOPh4 = document.querySelector(".modal .modal-header h4");
  // Change the border color
  if(item.EntryType === "Buy"){
    modal.style.borderColor = 'red';
    submitButton.style.backgroundColor ="red";
    submitButton.style.color ='white';
    submitButton.textContent ='Sell';
    headerPOPh4.textContent ='Sell';
    headerPOPh4.style.color="red";
  }else{
    modal.style.borderColor = 'green';
    submitButton.style.backgroundColor ="green";
    submitButton.style.color ='white';
    submitButton.textContent ='Buy';
    headerPOPh4.textContent ='Buy';
    headerPOPh4.style.color="green";
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
  // populateTable1();
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

 async function completeTrade(item = item,exitDate=exitDate,exitPrice = exitPrice ){
  
  try{
    const data = {
      type: item.EntryType,
      date:item.EntryDate ,
      symbol: item.EntrySymbol ,
      price: item.EntryPrice,
      qty: item.EntryQty,
      // doc_id:item.doc_id,
      exit_date: exitDate,
      exit_price: exitPrice
    }
    console.log(data)
    const response = await fetch("/ctentry", {
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
    deleteRecords(item.doc_id);
    console.log("Server response:", serverResponse);
   
  }
  catch(error){
    console.log(error)
  }
}

function pnlScreen(){
  console.log("inside pnl Screen")
  const pnlButton = document.querySelector("#bs-real-btn");
  const entryButton = document.querySelector("#bs-entry-btn");
  const pnlTable = document.querySelector(".table-container");
  const entryTable = document.querySelector(".table-container1");
  const buyButton = document.querySelector("#buy");
  const sellButton = document.querySelector("#sell");
  pnlButton.style.display = 'none';
  entryButton.style.display = 'block';
  entryTable.style.display = 'flex';
  pnlTable.style.display = "none";
  // buyButton.style.display = "none";
  // sellButton.style.display = "none";
  populatePNLTable();
}
function entryScreen(){
  console.log("inside entry screen")
  const pnlButton = document.querySelector("#bs-real-btn");
  const entryButton = document.querySelector("#bs-entry-btn");
  const pnlTable = document.querySelector(".table-container");
  const entryTable = document.querySelector(".table-container1");
  const buyButton = document.querySelector("#buy");
  const sellButton = document.querySelector("#sell");
  pnlButton.style.display = 'block';
  entryButton.style.display = 'none';
  entryTable.style.display = 'none';
  pnlTable.style.display = "flex";
  // buyButton.style.display = "block";
  // sellButton.style.display = "none";
}
const fetchpnlRecords = async () => {
  try {
    const response = await fetch("/fetchfilled");
    const data = await response.json();
    console.log(data.records)
    return data.records;
  } catch (error) {
    console.error(error);
  }
};
async function populatePNLTable(){
  let recived = await fetchpnlRecords()
  console.log(recived)
  // let data = recived.recordss
  // console.log(`recived-Data:${recived}`)
 
 
  let html = ``;
  let pnlTable = document.querySelector('#tableBody-realised');  
  pnlTable.innerHTML = html;

  // Loop through each data entry and create table rows
  recived.forEach((item, index) => {
      console.log(`item:${item.entry_symbol}`);
      exitPrice = item.exit_price;
      entryPrice = item.entry_price;
      qty = item.entry_qty;
      let localPnl = (exitPrice-entryPrice)*qty
      pNL += localPnl;
      console.log(`ExitPrice:${exitPrice}`);
      console.log(`EntryPrice:${entryPrice}`)
      console.log(`profit:${localPnl}`)
      console.log(`Qty:${qty}`)
      let pnlBgColor = '';
      let localpnl = (item.exit_price - item.entry_price)*item.entry_qty;
      if(localPnl < 0){
        pnlBgColor = 'losspnl';
      }else if (localPnl>0) {
        pnlBgColor = 'profitpnl';
      } else {
        pnlBgColor = 'default';
      }
      html += `<tr>
                  <td>${dateconverter(item.entry_date)}</td>
                  <td>${item.entry_type}</td>
                  <td>${item.entry_symbol}</td>
                  <td>${item.entry_price.toFixed(2)}	</td>
                  <td>${item.entry_qty}</td>
                  <td>${dateconverter(item.exit_date)}</td>
                  <td>${item.entry_price.toFixed(2)}</td>
                  <td class="${pnlBgColor}">${localPnl.toFixed(2)}</td>
                 
              </tr>`;
  });

  // console.log(html)
  // Set innerHTML of the table container
  pnlTable.innerHTML += html;

}

window.onload = populateTable;