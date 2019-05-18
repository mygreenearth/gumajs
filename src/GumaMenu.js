class GumaMenu {
    constructor(gumaReference, texts, actions, x, y, z) {
		this._gumaReference = gumaReference;
		this._items = [];
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;

		for (let i = 0; i < texts.length; i++) {
            this._items.push(new GumaMenuItem(gumaReference, texts[i], actions[i]));
		}
	}
}
