


document.getElementById("myFrame").addEventListener("load", () =>{
 alert('adad')
});



var openCardDescriptionButton = document.getElementById('open-card-description-btn');
var cardContentAddDescription = document.getElementById('add-card-description-btn')




openCardDescriptionButton.addEventListener("click", () =>{
    
    try{
       
            
            var cardContentElement = document.getElementById('card-content');
            var cardContentElementDisplayValue =  window.getComputedStyle(cardContentElement).display;
           
           
            if(cardContentElementDisplayValue == 'none'){
                cardContentElement.style.display = 'flex';
                openCardDescriptionButton.classList.toggle('btn-danger')
                openCardDescriptionButton.innerHTML = 'Close Card Description';
                cardContentAddDescription.style.display = 'inline'
            }
            if(cardContentElementDisplayValue == 'flex'){
                cardContentElement.style.display = 'none';
                openCardDescriptionButton.innerHTML = 'Open Card Description'
                openCardDescriptionButton.classList.toggle('btn-danger')
                cardContentAddDescription.style.display = 'none'
            }
            
           
          
        
    }catch(error){
        console.error(error)
    }
   
    
});

cardContentAddDescription.addEventListener("click", () => {
   
    var cardContentTextArea= document.getElementById("card-content-textarea");

    console.log(cardContentTextArea.value)

    var cardContentPublicElemnt = document.getElementById("card-content-public");
    var cardContentPublicElemntDisplayValue =  window.getComputedStyle(cardContentPublicElemnt).display;
   
    if(cardContentPublicElemntDisplayValue == 'none')
        cardContentPublicElemnt.style.display = 'flex';

    cardContentPublicElemnt.innerText = cardContentTextArea.value;

});
