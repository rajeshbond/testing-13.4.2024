// const baseurl = 'http://127.0.0.1:8000/';
const baseurl = 'https://achivers.compoundingfunda.com/';
const dynamicurl = 'api/fetchScreener';
const url = baseurl + dynamicurl;
// console.log(url);
let count = 0;


async function fetchData(conditionName) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({conditionName: conditionName}),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array on error
  }
}

function generateStockTable(data, tableId) {
  const tableContainer = document.getElementById(tableId);
  if (!tableContainer) {
    console.error(`Table container with ID ${tableId} not found.`);
    return; // Exit the function if the container is not found
  }
  
  tableContainer.innerHTML = ''; // Clear existing table content

  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered');

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['NSECODE', 'CLOSE', '% Change'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.classList.add('custom-header');
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  data.forEach(item => {
    const row = document.createElement('tr');
    
    const nsecodeCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `https://www.tradingview.com/chart/?symbol=NSE%3A${item.nsecode}`;
    link.textContent = item.nsecode;
    link.target = '_blank';
    nsecodeCell.style.textAlign = 'left';
    nsecodeCell.appendChild(link);
    row.appendChild(nsecodeCell);

    const closeCell = document.createElement('td');
    closeCell.textContent = item.close;
    closeCell.style.textAlign = 'center';
    row.appendChild(closeCell);

    const perChgCell = document.createElement('td');
    perChgCell.textContent = `${item.per_chg}%`;
    if (item.per_chg > 0) {
      perChgCell.style.backgroundColor = '#c6f0c6';
    } else if (item.per_chg < 0) {
      perChgCell.style.backgroundColor = '#f8d7da';
    }
    perChgCell.style.textAlign = 'center';
    row.appendChild(perChgCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

async function fetchDataWithDelay(conditionName, tableId, delay) {
  await new Promise(resolve => setTimeout(resolve, delay));
  const data = await fetchData(conditionName);
  generateStockTable(data, tableId);
}

async function init() {
  await fetchDataWithDelay('ADVANCE', 'super_hero_advance-table', 50);
  // Uncomment these lines to fetch data for other conditions
  await fetchDataWithDelay('BULLISH CROSSOVER', 'super_hero_bullish_crossover-table', 10);
  await fetchDataWithDelay('REVERSAL STOCK', 'super_hero_reversal-table', 10);
  await fetchDataWithDelay('ACTIVE BY VOLUME', 'super_hero_bottom_support-table', 10);
  await fetchDataWithDelay('RANGE BREAKOUT', 'super_hero_pull_back-table', 10);
  count++;
  console.log(`------Count: ${count}-----`);
}

init();
setInterval(init, 10000); // Refresh every 20 seconds

