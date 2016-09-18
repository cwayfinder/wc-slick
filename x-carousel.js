customElements.define('x-carousel', class XCarousel extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'closed' });
    this._root.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
        }
        
        #scrollable {
          flex: 1;
        }
      
        .nav-button {
          width: 32px;
          height: 32px;
          margin: 5px;
          border: 1px solid;
          border-radius: 50%;
          background: white;
          font-size: 18px;
        }
        
        ::slotted(*) {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid;
        }
      </style>
      
      <button id="prev" class="nav-button">←</button>
      <div id="scrollable">
        <slot id="content"></slot>
      </div>
      <button id="next" class="nav-button">→</button>
    `;
  }

  connectedCallback() {
    this._root.querySelector('#prev').addEventListener('click', () => this.prev());
    this._root.querySelector('#next').addEventListener('click', () => this.next());

    Array.from(this.children).forEach(item => item.hidden = true);

    this._currentIndex = 0;
    this.children[this._currentIndex].hidden = false;

    this.play();
  }

  play() {
    const delay = this.getAttribute('timeout') || 1;
    this._timer = setInterval(() => {
      this.next();
    }, delay * 1000);
    this.dispatchEvent(new CustomEvent('started', { bubbles: true, composed: true }));
  }

  pause() {
    clearInterval(this._timer);
    this.dispatchEvent(new CustomEvent('stopped', { bubbles: true, composed: true }));
  }

  next() {
    this.children[this._currentIndex].hidden = true;

    if (this._currentIndex < this.childElementCount - 1) {
      this._currentIndex++;
    } else {
      this._currentIndex = 0;
    }

    this.children[this._currentIndex].hidden = false;

    this._fireSlideChangeEvent();
  }

  prev() {
    this.children[this._currentIndex].hidden = true;

    if (this._currentIndex > 0) {
      this._currentIndex--;
    } else {
      this._currentIndex = this.childElementCount - 1;
    }

    this.children[this._currentIndex].hidden = false;

    this._fireSlideChangeEvent();
  }

  _fireSlideChangeEvent() {
    this.dispatchEvent(new CustomEvent('slidechange', {
      detail: { selected: this._currentIndex },
      bubbles: true,
      composed: true,
    }));
  }
});
