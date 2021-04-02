class Game {
  constructor(i) {
    this.gameType = i, this.deck = [], this.mainStack = [], this.visibleStack = [];
    for(let i = 0, t = ["H", "S", "D", "C"]; i < 4; i++)
      for(let e = 1; e < 14; e++) {
        let s = new Card(t[i],e);
        this.deck.push(s)
      }
    this.deck.sort(()=> .5 - Math.random()),
    this.draw = function() {
      $(".container").html("");
      for(let i = 0; i < 12; i++) $(".container").append(`<div class="pos _${i}" ondrop="drop(event);" ondragover="allowDrop(event);"${0 == i ? 'onclick="_GAME.drawNextCard(event); _GAME.draw();"' : ""}></div>`);
      this.mainStack.length > 0 && $(".pos._0").append('<img class="card" id="deck" src="images/cards/gray_back.png" />'),
      this.deck.sort((i,t)=>i.position - t.position || i.positionIndex - t.positionIndex);
      for(let i = 0; i < this.deck.length; i++) {
        let t = this.deck[i];
        if(0 == t.position) {
          if(!t.visible) continue;
          $(".pos._0").append(`<img class="card visible" src="images/cards/${t.value}${t.suit}.png"  id="${t.value}${t.suit}" draggable="true" ondragstart="drag(event)" onclick="_GAME.findCardInDeck($(this).attr('id')).onClick();" />`)
        } else $(`div.pos._${t.position}`).append(`<img class="card" src="images/cards/${t.visible ? "" + t.value + t.suit : "gray_back"}.png" id="${t.value + t.suit}" draggable="${t.visible}" ondragstart="drag(event)" onclick="_GAME.findCardInDeck($(this).attr('id')).onClick();" />`)
      }
      for(let t = 5; t < 12; t++) {
        let e = $(`.pos._${t}`).children("img"), s = -1;
        for(var i = 0; i < e.length; i++) $(e[i]).css({ top: s }), s += 35
      }
    },
    this.findCardInDeck = function(i) {
      let t, e;
      try {
        t = 3 == i.length ? i.substr(0, 2) : i.split("")[0],
        e = 3 == i.length ? i.substr(2, 1) : i.split("")[1]
      } catch (t) {
        console.warn(t),
        console.log(i)
      }
      for(let i = 0; i < this.deck.length; i++) {
        let s = this.deck[i];
        if(s.suit == e && s.value == t) return s
      }
    },
    this.drawNextCard = (i=>{
      if($(i.target).hasClass("visible")) return;
      if(0 == this.mainStack.length) {
        this.mainStack = this.visibleStack, this.visibleStack = [];
        for(let i = 0; i < this.mainStack.length; i++) {
          let t = this.findCardInDeck(this.mainStack[i]);
          t.visible = !1, t.positionIndex = 0
        }
      }
      if(this.visibleStack.length > 0) {
        let i = this.findCardInDeck(this.visibleStack.slice(-1)[0]).getHTMLElement();
        $(i).attr({ draggable: !1 })
      }
      let t = this.findCardInDeck(this.mainStack.shift());
      t.visible = !0, t.positionIndex = this.visibleStack.length, this.visibleStack.push(`${t.value}${t.suit}`)
    })
  }
}
class Card {
  constructor(i, t) {
    if(this.suit = i, this.position = 0, this.positionIndex = 0, this.visible = !1, 1 == t) this.value = "A";
    else if(t <= 10) this.value = t;
    else switch(t) {
      case 11: this.value = "J"; break;
      case 12: this.value = "Q"; break;
      case 13: this.value = "K"
    }
    this.onClick = (()=>{
      let i, t = !1, e = this.position, s = this.positionIndex, a = _GAME.deck.filter(i=>i.positionIndex == _GAME.deck.filter(t=>t.position == i.position).length - 1 && 0 != i.position && (i.position < 5 ? i.suit == this.suit && parseCardValue(i.value) == parseCardValue(this.value) - 1 : parseCardValue(i.value) == parseCardValue(this.value) + 1 && (-1 != ["H", "D"].indexOf(this.suit) ? "S" == i.suit || "C" == i.suit : "D" == i.suit || "H" == i.suit)));
      if(a.length > 0) i = a[0].position, t = !0;
      else if(-1 != ["A", "K"].indexOf(this.value)) for(let e = "K" == this.value ? 5 : "A" == this.value ? 1 : 0; e < ("K" == this.value ? 12 : "A" == this.value ? 5 : 0); e++) if(0 == _GAME.deck.filter(i=>i.position == e).length) {
        i = e, t = !0;
        break
      }
      if(t) {
        let t = _GAME.deck.filter(i=>i.position == e), a = _GAME.deck.filter(t=>t.position == i).length, l = t.filter(i=>i.positionIndex >= s);
        for(let t = 0; t < l.length; t++) if(l[t].position = i, l[t].positionIndex = a + t, 0 == e) {
          _GAME.visibleStack.indexOf(`${this.value}${this.suit}`) == _GAME.visibleStack.length - 1 && _GAME.visibleStack.pop();
          break
        }
        let n = _GAME.deck.filter(i=>i.position == e).reverse()[0];
        n && (n.visible || (n.visible = !0)), 0 == e && _GAME.visibleStack.indexOf(`${this.value}${this.suit}`) == _GAME.visibleStack.length - 1 && _GAME.visibleStack.pop(), _GAME.draw()
      }
    }),
    this.getHTMLElement = (()=>$(`img.card#${this.value}${this.suit}`)),
    this.validatePlacement = (i=>{
      let t = _GAME.deck.filter(t=>t.position == i);
      if(-1 == [1, 2, 3, 4].indexOf(+i)) {
        if(0 == t.length) return "K" == this.value;
        {
          let i = t.filter(i=>i.positionIndex == t.length - 1)[0];
          switch(i.value) {
            case "K": if("Q" != this.value) return !1; break;
            case "Q": if("J" != this.value) return !1; break;
            case "J": if("10" != this.value) return !1; break;
            case 2: if("A" != this.value) return !1; break;
            case "A": return !1;
            default: if(+i.value != +this.value + 1) return !1
          }
          return -1 != ["H", "D"].indexOf(i.suit) && -1 != ["S", "C"].indexOf(this.suit) || -1 != ["S", "C"].indexOf(i.suit) && -1 != ["H", "D"].indexOf(this.suit)
        }
      }
      return 0 == t.length ? "A" == this.value : this.suit == t[0].suit ? parseCardValue(this.value) == parseCardValue(t.slice(-1)[0].value) + 1 : void 0
    })
  }
}
