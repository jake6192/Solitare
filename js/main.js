let _GAME;
$(document).ready(function() {
  _GAME = new Game('Klondike');
  for(let i = 0; i < 7; i++) {
    switch(i) {
      case 0: let card = _GAME.deck[0]; card.position = 5; card.visible = true; break;
      case 1: for(let j = 1; j <= 2; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-1; if(j == 2) { card.visible = true; } } break;
      case 2: for(let j = 3; j <= 5; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-3; if(j == 5) { card.visible = true; } } break;
      case 3: for(let j = 6; j <= 9; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-6; if(j == 9) { card.visible = true; } } break;
      case 4: for(let j = 10; j <= 14; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-10; if(j == 14) { card.visible = true; } } break;
      case 5: for(let j = 15; j <= 20; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-15; if(j == 20) { card.visible = true; } } break;
      case 6: for(let j = 21; j <= 27; j++) { let card = _GAME.deck[j]; card.position = i+5; card.positionIndex = j-21; if(j == 27) { card.visible = true; } } break;
    }
  }
  _GAME.draw();
});


let allowDrop = (event) => event.preventDefault();
let drag = (event) => {
  event.dataTransfer.setData("moveData", JSON.stringify({ "sourcePos": $(event.target.offsetParent).attr('class').split(' _')[1], "targetID": event.target.id }));
};
let drop = (event) => {
  event.preventDefault();
  let data = JSON.parse(event.dataTransfer.getData("moveData"));
  let sourceParentNode = $(`.pos._${data.sourcePos}`);
  let targetParentNode = $(event.target).attr('class').split(' _')[0]=='pos' ? event.target : event.target.parentNode;

  let oldPos = $(sourceParentNode).attr('class').split(' _')[1];
  let newPos = $(targetParentNode).attr('class').split(' _')[1];

  let card = _GAME.findCardInDeck(data.targetID);
  if(card.validatePlacement(newPos)) {
    card.position = +newPos;
    card.positionIndex = _GAME.deck.filter(e=>e.position==+newPos).length-1;
    $(targetParentNode).append(document.getElementById(data));

    let cardStackToMove = _GAME.deck.filter(e=>e.position==+oldPos&&e.visible).filter(e=>e.positionIndex>=card.positionIndex).sort((a, b)=>a.positionIndex - b.positionIndex);
    for(let i = 0; i < cardStackToMove.length; i++) {
      cardStackToMove[i].position = +newPos;
      cardStackToMove[i].positionIndex = card.positionIndex+i+1;
    }

    let oldStack = _GAME.deck.filter(e=>e.position==+oldPos).sort((a, b)=>a.position - b.position || a.positionIndex - b.positionIndex);
    let oldStackTopCard = oldStack.filter(e=>e.positionIndex==oldStack.length-1)[0];
    if(oldStackTopCard) if(!oldStackTopCard.visible) oldStackTopCard.visible = true;

    _GAME.draw();
  }
};