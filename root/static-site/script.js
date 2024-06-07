const loggedUser = [];
let user = {};

user = {
    Id: "",
    Name: "",
    IsAdmin: false,
    CardPublicSelect: 0,
    CardPrivateSelect: 0
};

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

    ShowCardContentForAllPlayers(cardContentTextArea.value);

    var message = {
        type: "ShowCardContentForAllPlayers",
        content: cardContentTextArea.value,
        user: user
    };

    websocket.send(JSON.stringify(message))


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
            CardPublicSelect: 0,
            CardPrivateSelect: 0
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
            ShowUserRoomVotation(user.Name, user.CardPublicSelect, user.Id);
        };

        websocket.onerror = ErrorSocketConnect;
        websocket.onmessage = ReceiverSocketEvent;
        websocket.onclose = CloseSocketSendEvent;



    } catch (error) { alert(error) }
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
            CardPublicSelect: 0,
            CardPrivateSelect: 0
        };


        websocket = new WebSocket("ws://localhost:8181")
        websocket.onopen = () => {
            var message = {
                type: "EnterAsNormalPlayer",
                user: user
            };
            websocket.send(JSON.stringify(message))


            var plainningPokerMainDivInitElement = document.getElementById("plainning-poker-main-init");
            var plainningPokerMainDivElement = document.getElementById("plainning-poker-main");
            plainningPokerMainDivInitElement.style.display = 'none'
            plainningPokerMainDivElement.style.display = 'block'

            alert("Bem vindo " + playerName + " !");

            ShowUserRoomVotation(user.Name, user.CardPublicSelect, user.Id);

        };

        websocket.onerror = ErrorSocketConnect;
        websocket.onmessage = ReceiverSocketEvent;
        websocket.onclose = CloseSocketSendEvent;


    } catch (error) {
        alert(error)
    }
});

resetContentAddDescription.addEventListener("click", () => {
    document.getElementById('card-content-public').innerHTML = '';

    var message = {
        type: "ShowCardContentForAllPlayers",
        content: '',
        user: user
    };

    websocket.send(JSON.stringify(message))
});





//fuctions
function ShowUserRoomVotation(userName, cardSelect, userId) {

    var roomVotationElement = document.getElementById('room-votation');

    var result = `<div id="user-votation" name="user-votation-${userId}">
                                <h3>${userName}</h2>
                                <div id="user-votation-card-show"  name="user-votation-card-show-${userId}"><h1>${cardSelect}</h1></div>
                            </div>`;
    roomVotationElement.innerHTML += result

    return result;
}

function Vote(value) {

    user.CardPrivateSelect = value;

    console.log(user.Id);

    var name = `user-votation-${user.Id}`;
    var userVotationElement = document.getElementsByName(name)[0];
    userVotationElement.innerHTML = `<div id="user-votation" name="user-votation-${user.Id}">
                                <h3>${user.Name}</h2>
                                <div id="user-votation-card-show" name="user-votation-show-${user.Id}"><h1>${user.CardPrivateSelect}</h1></div>
                            </div>`


}

// function ConfirmVote(isCurrentUser, userReceiverId) {

//     var userId = "";

//     if (isCurrentUser)
//         userId = user.Id;
//     else
//         userId = userReceiverId

//     console.log(user.Id);

//     var roomVotation = document.getElementById('room-votation');
//     var name = `user-votation-show-${userId}`;
//     var queryName = `[name="${name}"]`;

//     var userVotationElement = document.getElementsByName(name);
//     var userVotationElement = roomVotation.querySelector(queryName);

//     if(userVotationElement == null){

//         var elementsByNameList = document.getElementsByName(`user-votation-${userId}`);
      
//         Array.from(elementsByNameList).forEach( function (input) {

//             if(input != null){


//                 userVotationElement = input.getElementsByClassName(name);


//             }
                
//         });
//     }

//     userVotationElement.style.backgroundColor = `lightgreen`;

//     var message = {
//         type: "ConfirmVoteForAll",
//         user: user
//     };

//     websocket.send(JSON.stringify(message));
// }


function ConfirmVote(isCurrentUser, userReceiverId) {
    var userId = isCurrentUser ? user.Id : userReceiverId;

    console.log(userId);

    var roomVotation = document.getElementById('room-votation');
    var name = `user-votation-show-${userId}`;
    var queryName = `[name="${name}"]`;

    // Use querySelector para encontrar o elemento dentro de roomVotation
    
    var userVotationElement = roomVotation.querySelector(`#user-votation-card-show[name="${name}"]`);

    if (!userVotationElement) {
        // Se não encontrar o elemento, use getElementsByName e iterar sobre eles
        var elementsByNameList = document.getElementsByName(`user-votation-${userId}`);

        Array.from(elementsByNameList).forEach(function(input) {
            if (input) {
                // Encontre o elemento com a classe específica dentro do input
                var foundElement = input.querySelector(`.${name}`);
                if (foundElement) {
                    userVotationElement = foundElement;
                }
            }
        });
    }

    if (userVotationElement) {
        userVotationElement.style.backgroundColor = 'lightgreen';
    } else {
        console.warn('Elemento de votação do usuário não encontrado');
    }

    var message = {
        type: "ConfirmVoteForAll",
        user: user
    };

    websocket.send(JSON.stringify(message));
}


const ReceiverSocketEvent = ({ data }) => {

    var dataObject = JSON.parse(data);
    var senderMessageUser = dataObject.user;

    switch (dataObject.type) {
        case "EnterAsAdmin":
        case "EnterAsNormalPlayer":

            if (user.Id != senderMessageUser.Id) {
                ShowUserRoomVotation(senderMessageUser.Name, senderMessageUser.CardPublicSelect, senderMessageUser.Id);

                var loadUserEvent = {
                    type: "LoadPlayer",
                    user: user
                };
                websocket.send(JSON.stringify(loadUserEvent))
            }
            break;
        case "LoadPlayer":
            if (user.Id != senderMessageUser.Id || user.Name != senderMessageUser.Id) {

                ShowUserRoomVotation(senderMessageUser.Name, senderMessageUser.CardPublicSelect, senderMessageUser.Id);
            }
            break;
        case "CloseSocketConnection":
            if (user.Id != senderMessageUser.Id) {
                var name = `user-votation-${senderMessageUser.Id}`;
                var userVotationElement = document.getElementsByName(name)[0];
                userVotationElement.remove();
            }

            break;
        case "ShowCardContentForAllPlayers":
            if (user.Id != senderMessageUser.Id)
                ShowCardContentForAllPlayers(dataObject.content)
            break;
        case "ConfirmVoteForAll":
            if (user.Id != senderMessageUser.Id)
                ConfirmVote(false, senderMessageUser.Id);
            break;
    };

};

const CloseSocketSendEvent = () => {

    var closeSocketEvent = {
        type: "CloseSocketConnection",
        user: user
    };

    websocket.send(JSON.stringify(closeSocketEvent))

}


const ErrorSocketConnect = () => {
    alert("Erro ao se connectar no servidor")
    return;
}

const ShowCardContentForAllPlayers = (content) => {
    var cardContentPublicElemnt = document.getElementById("card-content-public");
    var cardContentPublicElemntDisplayValue = window.getComputedStyle(cardContentPublicElemnt).display;

    if (cardContentPublicElemntDisplayValue == 'none')
        cardContentPublicElemnt.style.display = 'flex';

    cardContentPublicElemnt.innerText = content;
}