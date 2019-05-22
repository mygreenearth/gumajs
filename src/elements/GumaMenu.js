class GumaMenu extends THREE.Group {
    constructor(gumaReference, texts, actions, x, y, z) {
    	super();
    	
		this._gumaReference = gumaReference;
		this._items = [];
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;

		let trippleBar = new GumaMenuItem(gumaReference, '\u2261', null);
		
        this._items.push(trippleBar);
        this.add(trippleBar);

        for (let i = 0; i < texts.length; i++) {
			let menuItem = new GumaMenuItem(gumaReference, texts[i], actions[i], x, y, z);
			
            this._items.push(menuItem);
            this.add(menuItem);
		}
	}
    
    get items() {
    	return this._items;
    }
}
