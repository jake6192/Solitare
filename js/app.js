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
      $('.container').html('');
      for(let i = 0; i < 12; i++) $('.container').append(`<div class="pos _${i}" ondrop="drop(event);" ondragover="allowDrop(event);"></div>`);
      $(`.pos._0`).append(`<img class="card" src="images/cards/gray_back.png" onclick="_GAME.drawNextCard(); _GAME.draw();" />`);
      this.deck.sort((a, b) => a.position - b.position || a.positionIndex - b.positionIndex);
      for(let i = 0; i < this.deck.length; i++) {
        let card = this.deck[i];
        if(card.position == 0) {
          if(!card.visible) continue;
          $(`.pos._0`).append(`<img class="card visible" src="images/cards/${card.value}${card.suit}.png"  id="${card.value}${card.suit}" draggable="true" ondragstart="drag(event)" />`);
        } else $(`div.pos._${card.position}`).append(`<img class="card" src="images/cards/${card.visible ? ''+card.value+card.suit : 'gray_back'}.png" id="${''+card.value+card.suit}" draggable="true" ondragstart="drag(event)" />`);
      }
      for(let i = 5; i < 12; i++) {
        let cards = $(`.pos._${i}`).children('img'), bumper = -1;
        for(var j = 0; j < cards.length; j++) {
          $(cards[j]).css({ "top": bumper });
          bumper += 35;
        }
      }
    };
    this.findCardInDeck = function(card) {
      let value, suit;
      if(card.length == 3) {
        value = card.substr(0, 2);
        suit = card.substr(2, 1);
      } else {
        value = card.split('')[0];
        suit = card.split('')[1];
      }
      for(let i = 0; i < this.deck.length; i++) {
        let x = this.deck[i];
        if(x.suit != suit) continue;
        if(x.value != value) continue;
        return x;
      }
    };
    this.drawNextCard = () => {
      let cards = this.deck.filter(e=>e.position==0);
      let visibleCards = cards.filter(e=>e.visible);
      if(visibleCards.length == 0) cards[0].visible = true;
      else {
        let index = cards.indexOf(visibleCards[0]);
        cards[index].visible = false;
        if(index != cards.length-1) cards[index+1].visible = true;
      }
    };
  }
}


class Card {
  constructor(cardSuit, cardValue) {
    this.suit = cardSuit;
    this.position = 0;
    this.positionIndex = 0;
    this.visible = false;
    if(cardValue == 1) this.value = 'A';
    else if(cardValue <= 10) this.value = cardValue;
    else switch(cardValue) {
      case 11: this.value = 'J'; break;
      case 12: this.value = 'Q'; break;
      case 13: this.value = 'K'; break;
    }
    this.validatePlacement = function(targetPosition) {
      let targetPostionStack = _GAME.deck.filter(e=>e.position==targetPosition);
      if([1,2,3,4].indexOf(+targetPosition) != -1) {
        if(targetPostionStack.length == 0) return this.value == 'A';
        else if(this.suit == targetPostionStack[0].suit) return parseCardValue(this.value) == parseCardValue(targetPostionStack[targetPostionStack.length-1].value)+1;
      } else {
        let topTargetCard = targetPostionStack.filter(e=>e.positionIndex==targetPostionStack.length-1)[0];

        if(targetPostionStack.length == 0) return this.value == 'K';
        switch(topTargetCard.value) {
          case 'K': if(this.value != 'Q') return false; break;
          case 'Q': if(this.value != 'J') return false; break;
          case 'J': if(this.value != '10') return false; break;
          case  2 : if(this.value != 'A') return false; break;
          case 'A': return false; break;
          default: if(+topTargetCard.value != +this.value+1) return false; break;
        }
        return ((['H', 'D'].indexOf(topTargetCard.suit) != -1 && ['S', 'C'].indexOf(this.suit) != -1) || (['S', 'C'].indexOf(topTargetCard.suit) != -1 && ['H', 'D'].indexOf(this.suit) != -1));
      }
    };
  }
}
