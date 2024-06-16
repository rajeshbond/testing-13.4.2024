function closePopup() {
    try{
        window.location.href = "/dashboard"; 
    }catch(e){
        console.log(e);
    }
    document.getElementById('overlay').style.display = 'none';
    
}
