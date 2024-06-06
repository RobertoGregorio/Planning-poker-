
let user = {};
let websocket;

var openCardDescriptionButton = document.getElementById('open-card-description-btn');
var cardContentAddDescription = document.getElementById('add-card-description-btn');
var resetContentAddDescription = document.getElementById('reset-card-description-btn');
var enterAsAdminPlayerButton = document.getElementById('enter-as-admin-player-button');
var enterAsNormalPlayerButton = document.getElementById('enter-as-normal-player-button');


openCardDescriptionButton.addEventListener("click", () => {

    try {


        var cardContentElement = document.getElementById('card-content');
        var cardContentElementDisplayValue = window.getComputedStyle(cardContentElement).display;


        if (cardContentElementDisplayValue == 'none') {
            cardContentElement.style.display = 'flex';
            openCardDescriptionButton.classList.toggle('btn-danger')
            openCardDescriptionButton.innerHTML = 'Close Card Description';
            cardContentAddDescription.style.display = 'inline'
        }
        if (cardContentElementDisplayValue == 'flex') {
            cardContentElement.style.display = 'none';
            openCardDescriptionButton.innerHTML = 'Open Card Description'
            openCardDescriptionButton.classList.toggle('btn-danger')
            cardContentAddDescription.style.display = 'none'
        }




    } catch (error) {
        console.error(error)
    }


});

cardContentAddDescription.addEventListener("click", () => {

    var cardContentTextArea = document.getElementById("card-content-textarea");

    console.log(cardContentTextArea.value)

    var cardContentPublicElemnt = document.getElementById("card-content-public");
    var cardContentPublicElemntDisplayValue = window.getComputedStyle(cardContentPublicElemnt).display;

    if (cardContentPublicElemntDisplayValue == 'none')
        cardContentPublicElemnt.style.display = 'flex';

    cardContentPublicElemnt.innerText = cardContentTextArea.value;


});

enterAsAdminPlayerButton.addEventListener("click", (event) => {

    try {

        event.preventDefault();

        var playerName = document.getElementById('player-name-input').value;

        if (playerName == '' || playerName == ' ') {
            alert('Informe seu nome')
            return;
        }

        user = {
            Id: crypto.randomUUID(),
            Name: playerName,
            IsAdmin: false,
            CardSelect: 0
        };



        websocket = new WebSocket("ws://localhost:8181")
        websocket.onopen = () => {
            var message = {
                type: "EnterAsAdmin",
                user: user
            };
            websocket.send(JSON.stringify(message))


            document.getElementById("plainning-poker-main-init").style.display = 'none';
            document.getElementById("plainning-poker-main").style.display = 'block';
            document.getElementById("manager-buttons").style.display = 'block';

            alert("Bem vindo " + playerName + " !");
            ShowUserRoomVotation(user.Name, user.CardSelect, user.id);
        };

        websocket.onerror = ErrorSocketConnect;
        websocket.onmessage = ReceiverSocketEvent;
        websocket.onclose = CloseSocketSendEvent;



    } catch (error) { alert(error) } a
});

enterAsNormalPlayerButton.addEventListener("click", () => {

    try {
        var playerName = document.getElementById('player-name-input').value;

        if (playerName == '' || playerName == ' ') {
            alert('Informe seu nome')
            return;
        }

        user = {
            Id: crypto.randomUUID(),
            Name: playerName,
            IsAdmin: true,
            CardSelect: 0
        };

        console.log(user)

        var plainningPokerMainDivInitElement = document.getElementById("plainning-poker-main-init");
        var plainningPokerMainDivElement = document.getElementById("plainning-poker-main");
        plainningPokerMainDivInitElement.style.display = 'none'
        plainningPokerMainDivElement.style.display = 'block'

        alert("Bem vindo " + playerName + " !");

        ShowUserRoomVotation(user.Name, user.CardSelect, user.id);
    } catch (error) {
        alert(error)
    }
});

resetContentAddDescription.addEventListener("click", () => {
    document.getElementById('card-content-public').innerHTML = '';
});





//fuctions
function ShowUserRoomVotation(userName, cardSelect, userId) {
    var roomVotationElement = document.getElementById('room-votation');
    roomVotationElement.innerHTML += `<div id="user-votation" name="user-votation-${userId}">
                                <h3>${userName}</h2>
                                <div id="user-votation-card-show"><h1>${cardSelect}</h1></div>
                            </div>`
}

function Vote(value) {

    user.CardSelect = value;

    var roomVotationElement = document.getElementById('room-votation');
    roomVotationElement.innerHTML = `<div id="user-votation">
                                <h3>${user.Name}</h2>
                                <div id="user-votation-card-show"><h1>${user.CardSelect}</h1></div>
                            </div>`


}

function ConfirmVote() {
    var userCardVotationShow = document.getElementById('user-votation-card-show');
    userCardVotationShow.style.backgroundColor = `lightgreen`;
}

const ReceiverSocketEvent = ({ data }) => {

    var dataObject = JSON.parse(data);
    var senderMessageUser = dataObject.user;

    switch (dataObject.type) {
        case "EnterAsAdmin":

            if (user.Id != senderMessageUser.Id) {
                ShowUserRoomVotation(senderMessageUser.Name, senderMessageUser.CardSelect, senderMessageUser.Id);

                var loadUserEvent = {
                    type: "LoadPlayer",
                    user: user
                };
                websocket.send(JSON.stringify(loadUserEvent))
            }
            break;
        case "LoadPlayer":
            if (user.Id != senderMessageUser.Id) {
                ShowUserRoomVotation(senderMessageUser.Name, senderMessageUser.CardSelect, senderMessageUser.Id);
            }
            break;
        case "CloseSocketConnection":
            if (user.Id != senderMessageUser.Id){
                var name = `user-votation-${senderMessageUser.Id}`;
                var userVotationElement = document.getElementsByName(name)[0];
                userVotationElement.remove();
            }
                
            break;
    };

};

const CloseSocketSendEvent = () => {

        var closeSocketEvent = {
            type: "CloseSocketConnection",
            user: user};
       
        websocket.send(JSON.stringify(closeSocketEvent))
    
}


const ErrorSocketConnect = () => {
    alert("Erro ao se connectar no servidor")
    return;
}