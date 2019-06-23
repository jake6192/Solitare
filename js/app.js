class Game {
  constructor(gameType) {
    this.gameType = gameType;
    this.deck = [];
    for(let x = 0, suits = ['H','S','D','C']; x < 4; x++) {
      for(let y = 1; y < 14; y++) {
        let card = new Card(suits[x], y);
        this.deck.push(card);
      }
    }
    this.deck.sort(function() { return 0.5 - Math.random() });
    this.draw = function() {
      $(`.pos._0`).append(`<img class="card" src="images/cards/gray_back.png" />`);
      for(let i = 0; i < this.deck.length; i++) {
        let card = this.deck[i];
        if(card.position == 0) continue;
        $(`div.pos._${card.position}`).append(`<img class="card" src="images/cards/${card.visible ? ''+card.value+card.suit : 'gray_back'}.png" />`);
      }
      for(let i = 6; i < 12; i++) {
        let cards = $(`.pos._${i}`).children('img'), bumper = 0;
        for(var j = 0; j < cards.length; j++) {
          $(cards[j]).css({ "padding-top": bumper });
          bumper += 35;
        }
      }
    };
  }
}


class Card {
  constructor(cardSuit, cardValue) {
    this.suit = cardSuit;
    this.position = 0;
    this.visible = false;
    if(cardValue == 1) this.value = 'A';
    else if(cardValue <= 10) this.value = cardValue;
    else switch(cardValue) {
      case 11: this.value = 'J'; break;
      case 12: this.value = 'Q'; break;
      case 13: this.value = 'K'; break;
    }
  }
}
