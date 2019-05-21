class GumaMenuItem extends THREE.CSS3DObject {
	constructor(gumaReference, buttonText, action, x, y, z) {
		super(document.createElement('button'));
		
		this._gumaReference = gumaReference;
		
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 1800;

		this.element.innerHTML = buttonText;
		this.element.onclick = action;
	}
}
