async function fetchall(){
  const response = await fetch("/test");
  const data = await response.json();
  // console.log(data.sucess[0]);
  let fdata = data.sucess;
  let html = "";
  
  console.log(fdata[0])
  try{

    fdata.forEach(function(item,index){
      console.log(item)
      html += `<tr>
        <div class="container-item">
          <td>${index+1}</td>      
          <td>${item.name}</td>
          <td>${item.mobile}</td>
          <td>${item.email}</td>
          <td>${item.subscriptionDetails.currentSubscription}</td>
        </div>
      </tr>
      `;
    })

  }catch(error){
    console.log(error);
  }
  document.querySelector('.container').innerHTML = html;

}

fetchall();