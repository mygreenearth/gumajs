class PrismPageSet extends PageSet {
	constructor(gumaReference, pageNames, pageContents, pageWidth, pageHeight, x, y, z) {
		super(gumaReference, x, y, z);
		
		this._pages = [];
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
			
			let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this._x, this._y, this._z);
			page.moveTo(this._x + x, this._y + y, this._z + z, page.rotation.x, iterAngle, page.rotation.z);
			
			pageActions.push(this._pageClick(iterAngle));
			page.element.onclick = pageActions[i];
			
			this._pages.push(page);
			
			iterAngle += this._rotateAngle;
		}

		this._menu = new GumaMenu(gumaReference, pageNames, /*pages(),*/ pageActions);
	}
	
	_pageClick(angle) {
		return () => {this._gumaReference.controls.rotateCamera(angle)};
	}
	
	/*_pageClick(index) {
		return () => {this._gumaReference.controls.scrollToPage(index)};
	}*/
	
	get pages() {
		return this._pages;
	}
}
