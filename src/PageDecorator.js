class PageDecorator {
	constructor(gumaReference, page, rotateSpeed, moveSpeed) {
		this._gumaReference = gumaReference;
		this._page = page;
		this._rotateSpeed = rotateSpeed || 0.1;
		this._moveSpeed = moveSpeed || 0.1; 
	}
	
	moveTo(x, y, z, rotX, rotY, rotZ) {
		// TODO
	}
}