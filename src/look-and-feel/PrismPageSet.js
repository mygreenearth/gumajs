class PrismPageSet extends THREE.Group {
	constructor(gumaReference, pageNames, pageContents, pageWidth, pageHeight, x, y, z) {
		super();
		
		this._gumaReference = gumaReference;
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;
		
		this._edges = pageContents.length;
		this._pageWidth = pageWidth || 800;
		this._pageHeight = pageHeight || 600;
		
		this._angle = (this._edges - 2) * Math.PI / this._edges;
		this._rotateAngle = 2 * Math.PI / this._edges;
		this._diameter = this._pageWidth * Math.tan(this._angle / 2);
		this._radius = this._diameter / 2;
		
		let pageActions = [];
		let iterAngle = 0;
		for (let i = 0; i < pageContents.length; i++) {
			let x = this._radius * Math.sin(iterAngle);
			let z = this._radius * Math.cos(iterAngle);
			
			//let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this._x + x, this._y + y, this._z + z);
			//page.rotation.y = iterAngle;
			
			let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this.position.x, this.position.y, this.position.z);
			page.moveTo(this.position.x + x, this.position.y + y, this.position.z + z, page.rotation.x, iterAngle, page.rotation.z);
			
			pageActions.push(this._pageClick(-iterAngle));
			page.element.onclick = pageActions[i];
			
			this.add(page);
			
			iterAngle += this._rotateAngle;
		}

		this._menu = new GumaMenu(gumaReference, pageNames, /*pages(),*/ pageActions, x, y, z + this._radius * 2);
	}
	
	_pageClick(angle) {
		return () => {
			//this._gumaReference.controls.rotateCamera(angle); // TODO rotate PrismPageSet
			this._rotate(angle);
		};
	}
	
	/*_pageClick(index) {
		return () => {this._gumaReference.controls.scrollToPage(index)};
	}*/
	
	_rotate(angle) {
		if (this.rotateAction == null) {
			this.rotateAction = new RotateAction(this._gumaReference, this);
		}
		
		this.rotateAction.start(angle);
		//this.rotation.y = angle;
		/*for (let i = 0; i < this.children.length; i++) {
			let page = this.children[i];
			
			if (page.moveArcAction == null) {
				this.moveArcAction = new MoveArcAction(this._gumaReference, page);
			}
			
			this.moveArcAction.moveAroundVerticalLine(this.position.x, this.position.z, angle);
		}*/
	}
	
	get pages() {
		return this.children;
	}
	
	get menu() {
		return this._menu;
	}
}
