export default class View {
  _data;

  /**
   * Renders the string to the _parentElement
   * @param {String} message to render
   */
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * clears the contents of the _parentElement
   */
  _clear() {
    this._parentElement.innerHTML = "";
  }

  /**
   * Renders the parent element according to markup
   * @param {Object | Object[]} data
   * @param {boolean} [render=true] returns markup string if false
   * @returns {undefined | string} A markup string is returned if render=false
   */
  render = function (data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  };

  /**
   * Updates only changed elements of the view
   * @param {Object | Object[]} data
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // creates a new virtual DOM in memory based on the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // turns each dom element into an array element
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    // gets the parent DOM from the page and turns them into array elements
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTED
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
}
