

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
    var dateValue = document.getElementById('dateInput').value;
    var symbolValue = document.getElementById('symbolInput').value;
    var symbolPriceValue = document.getElementById('symbol-price').value;
    var symbolqtyValue = document.getElementById('symbol-price-qty').value;
    console.log('Date:', dateValue);
    console.log('Symbol:', symbolValue);
    console.log('Symbol Price:', symbolPriceValue);
    console.log('Symbol Price:', symbolqtyValue);
    document.getElementById('popDiv').classList.remove('show');
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
    console.log('Date:', dateValue);
    console.log('Symbol:', symbolValue);
    console.log('Symbol Price:', symbolPriceValue);
    console.log('Symbol Price:', symbolqtyValue);
    document.getElementById('popDiv').classList.remove('show');
  });
  document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('popDiv').classList.remove('show');
  });

  // Show the pop-up
  document.getElementById('popDiv').classList.add('show');
}

const data = [
  { date: '01-04-2024', symbol: 'Reliance', price: '150.00', qty: 10 },
  { date: '2024-04-01', symbol: 'SBIN', price: '-1200.00', qty: 5 },
  { date: '2024-04-01', symbol: 'INFY', price: '-1200.00', qty: 5 },
  { date: '2024-04-01', symbol: 'GOOGL', price: '1200.00', qty: 5 },
  { date: '2024-04-01', symbol: 'GOOGL', price: '-1200.00', qty: 5 }
  // More rows can be added here
];
function populateTable() {
 
  let html = ``;


  // Loop through each data entry and create table rows
  data.forEach(item => {
    let bgColorClass = '';
    let btnName = '';
        if (parseFloat(item.price) > 0) {
            bgColorClass = 'negative-price';
            btnName = 'Sell';
        } else if (parseFloat(item.price) < 0) {
            bgColorClass = 'positive-price';
            btnName = 'Buy';
        }
        console.log(`bgcolr = ${bgColorClass}`)

      html += `<tr>
                  <td>${item.date}</td>
                  <td>${item.symbol}</td>
                  <td>${item.price}</td>
                  <td>${item.qty}</td>
                  <td><button button class="buy-sell-btn ${bgColorClass}">${btnName}</button></td>
              </tr>`;
  });

  console.log(html)
  // Set innerHTML of the table container
  document.querySelector('#tableBody').innerHTML += html;
}

window.onload = populateTable;