import { LitElement, html } from '@polymer/lit-element/lit-element.js';

class BlocklyGame extends LitElement {

  _handleKeyDown(e){
    e.preventDefault();

    var newHeading = -1;
    switch (e.which) {
      case 37:
        newHeading = 3;
        break; //LEFT

      case 38:
        newHeading = 0;
        break; //UP

      case 39:
        newHeading = 1;
        break; //RIGHT

      case 40:
        newHeading = 2;
        break; //DOWN
      default:
        return; //exit handler for other keys.
    }

    window.CLIENT.changeHeading(newHeading);
  }

  _handleTouchStart(e){
    e.preventDefault();
    this._xDown = e.touches[0].clientX;
    this._yDown = e.touches[0].clientY;
  }

  _handleTouchMove(e){
    e.preventDefault();

    if (!this._xDown || !this._yDown) {
      return;
    }
    var newHeading = -1;

    this._xUp = e.touches[0].clientX;
    this._yUp = e.touches[0].clientY;
    var xDiff = this._xDown - this._xUp;
    var yDiff = this._yDown - this._yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        newHeading = 3;
      } else {
        /* right swipe */
        newHeading = 1;
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        newHeading = 0;
      } else {
        /* down swipe */
        newHeading = 2;
      }
    }

    window.CLIENT.changeHeading(newHeading);

    /* reset values */
    setTimeout(() => {
      this._xDown = this._xUp;
      this._yDown = this._yUp;
    });
    this._xDown = null;
    this._yDown = null;
  }
  constructor() {
    super();

    this._name = window.localStorage.name || '';

    this._keyHandler = this._handleKeyDown.bind(this);
    this._touchStartHandler = this._handleTouchStart.bind(this);
    this._touchMoveHandler = this._handleTouchMove.bind(this);

    if (!window.WebSocket) {
      window.toast.text = "Your browser does not support WebSockets!";
      window.toast.show();
      return;
    }

    var success = false;
    var socket = io(`//${window.location.host}`, {
      forceNew: true,
      upgrade: false,
      transports: ['websocket']
    });

    socket.on('connect_error', function() {
      window.toast.text = "Cannot connect with server. This probably is due to misconfigured proxy server. (Try using a different browser)";
      window.toast.show();
    });
    socket.emit("checkConn", function() {
      success = true;
      socket.disconnect();
    });

  }
  _setupHandlers(){
    document.addEventListener('keydown', this._keyHandler);
    document.addEventListener('touchstart', this._touchStartHandler, false);
    document.addEventListener('touchmove', this._touchMoveHandler, false);
  }
  _removeHandlers(){
    document.removeEventListener('keydown', this._keyHandler);
    document.removeEventListener('touchstart', this._touchStartHandler);
    document.removeEventListener('touchmove', this._touchMoveHandler);
  }
  hide(){
    this.setAttribute('hidden','');
    this._setupHandlers();
  }
  show(){
    this.removeAttribute('hidden');
    this._removeHandlers();
  }
  _submitHandler(e){
    e.preventDefault();
    let name = e.target.name.value;
    if(!name){
      window.toast.text = 'Please enter a name.';
      window.toast.show();
      return;
    }
    let bot = e.target.bot.checked;
    window.requestAnimationFrame(()=>{
      let url = `//${window.location.host}`;
      window.CLIENT.connectGame(url, name)
        .then(msg => {
          this.hide();
          if(bot){
            this._runBot();
          }
        })
        .catch(msg => {
          window.toast.text = msg;
          window.toast.show();
        });
    });
  }
  static get properties(){
    return {
      _name: String
    }
  }
  _runBot(){
    let heading = -1;
    setInterval(()=>{
      if(heading === 3){
        heading = 0;
      } else {
        heading++;
      }
      window.CLIENT.changeHeading(heading);
    }, 500);
  }
  _saveName(e){

    window.localStorage.name = e.target.value;
  }
  render() {
    return html `
      <style>
        :host {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1;
          background: #fff;
          height: 100%;
          width: 100%;
        }
        :host([hidden]){
          display: none;
        }

        .error {
          color: red;
        }
        button {
          display: block;
          color: #444444;
          background: #F3F3F3;
          border: 1px #DADADA solid;
          padding: 5px 10px;
          border-radius: 2px;
          font-weight: bold;
          font-size: 9pt;
          outline: none;

          color: white;
          border: 1px solid #FB8F3D;
          background: -webkit-linear-gradient(top, #FDA251, #FB8F3D);
          background: -moz-linear-gradient(top, #FDA251, #FB8F3D);
          background: -ms-linear-gradient(top, #FDA251, #FB8F3D);
        }
        button:hover {
          border: 1px #C6C6C6 solid;
          box-shadow: 1px 1px 1px #EAEAEA;
          color: #333333;
          background: #F7F7F7;
        }

        button:active {
          box-shadow: inset 1px 1px 1px #DFDFDF;
        }
      </style>

      <h1>blockly io</h1>
      <form id="form" @submit="${this._submitHandler}">
        <div>
          <label for="name">Enter your name</label>
          <input autocomplete="off" id="name" autofocus @input="${this._saveName}" value="${this._name}">
        </div>
        <label for="bot">Bot <input type="checkbox" name="bot"></label>
        <button type="submit">Play</button>
      </form>
    `;
  }
}

window.customElements.define('blockly-game', BlocklyGame);
