const _GAME = new Game('Klondike');

$(document).ready(function() {
  for(let i = 0; i < 7; i++) {
    switch(i) {
      case 0: _GAME.deck[0].position = 5; _GAME.deck[0].visible = true; break;
      case 1: for(let j = 1; j <= 2; j++) { _GAME.deck[j].position = i+5; if(j == 2) { _GAME.deck[j].visible = true; } } break;
      case 2: for(let j = 3; j <= 5; j++) { _GAME.deck[j].position = i+5; if(j == 5) { _GAME.deck[j].visible = true; } } break;
      case 3: for(let j = 6; j <= 9; j++) { _GAME.deck[j].position = i+5; if(j == 9) { _GAME.deck[j].visible = true; } } break;
      case 4: for(let j = 10; j <= 14; j++) { _GAME.deck[j].position = i+5; if(j == 14) { _GAME.deck[j].visible = true; } } break;
      case 5: for(let j = 15; j <= 20; j++) { _GAME.deck[j].position = i+5; if(j == 20) { _GAME.deck[j].visible = true; } } break;
      case 6: for(let j = 21; j <= 27; j++) { _GAME.deck[j].position = i+5; if(j == 27) { _GAME.deck[j].visible = true; } } break;
    }
  }
  _GAME.draw();
});
