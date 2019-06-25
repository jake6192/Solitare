class Game {
  constructor(gameType) {
    this.gameType = gameType;
    this.deck = [];
    this.mainStack = [];
    this.visibleStack = [];
    for(let x = 0, suits = ['H','S','D','C']; x < 4; x++) {
      for(let y = 1; y < 14; y++) {
        let card = new Card(suits[x], y);
        this.deck.push(card);
      }
    }
    this.deck.sort(function() { return 0.5 - Math.random() });
    this.draw = function() {
      $('.container').html('');
      for(let i = 0; i < 12; i++) $('.container').append(`<div class="pos _${i}" ondrop="drop(event);" ondragover="allowDrop(event);"${i==0 ? 'onclick="_GAME.drawNextCard(); _GAME.draw();"' : ''}></div>`);
      if(this.mainStack.length > 0) $(`.pos._0`).append(`<img class="card" id="deck" src="images/cards/gray_back.png" />`);
      this.deck.sort((a, b) => a.position - b.position || a.positionIndex - b.positionIndex);
      for(let i = 0; i < this.deck.length; i++) {
        let card = this.deck[i];
        if(card.position == 0) {
          if(!card.visible) continue;
          $(`.pos._0`).append(`<img class="card visible" src="images/cards/${card.value}${card.suit}.png"  id="${card.value}${card.suit}" draggable="true" ondragstart="drag(event)" />`);
        } else $(`div.pos._${card.position}`).append(`<img class="card" src="images/cards/${card.visible ? ''+card.value+card.suit : 'gray_back'}.png" id="${card.value+card.suit}" draggable="${card.visible}" ondragstart="drag(event)" />`);
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
      try {
        if(card.length == 3) {
          value = card.substr(0, 2);
          suit = card.substr(2, 1);
        } else {
          value = card.split('')[0];
          suit = card.split('')[1];
        }
      } catch(e) {
        console.warn(e);
        console.log(card);
      }
      for(let i = 0; i < this.deck.length; i++) {
        let x = this.deck[i];
        if(x.suit != suit) continue;
        if(x.value != value) continue;
        return x;
      }
    };
    this.drawNextCard = () => {
      if(this.mainStack.length == 0) {
        this.mainStack = this.visibleStack;
        this.visibleStack = [];
        for(let i = 0; i < this.mainStack.length; i++) {
          let card = this.findCardInDeck(this.mainStack[i]);
          card.visible = false;
          card.positionIndex = 0;
        }
      }
      if(this.visibleStack.length > 0) {
        let HTMLElement = this.findCardInDeck(this.visibleStack.slice(-1)[0]).getHTMLElement();
        $(HTMLElement).attr({ "draggable": false });
      }
      let nextCard = this.findCardInDeck(this.mainStack.shift());
      nextCard.visible = true;
      nextCard.positionIndex = this.visibleStack.length;
      this.visibleStack.push(`${nextCard.value}${nextCard.suit}`);
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
    this.getHTMLElement = () => $(`img.card#${this.value}${this.suit}`);
    this.validatePlacement = (targetPosition) => {
      let targetPostionStack = _GAME.deck.filter(e=>e.position==targetPosition);
      if([1,2,3,4].indexOf(+targetPosition) != -1) {
        if(targetPostionStack.length == 0) return this.value == 'A';
        else if(this.suit == targetPostionStack[0].suit) return parseCardValue(this.value) == parseCardValue(targetPostionStack.slice(-1)[0].value)+1;
      } else if(targetPostionStack.length == 0) return this.value == 'K';
      else {
        let topTargetCard = targetPostionStack.filter(e=>e.positionIndex==targetPostionStack.length-1)[0];
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
