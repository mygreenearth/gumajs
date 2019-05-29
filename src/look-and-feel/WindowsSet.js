class WindowsSet extends THREE.Group {
	constructor(gumaReference, pageNames, pageContents, x, y, z, fullPageWidth, fullPageHeight, minPageWidth, minPageHeight) {
		super();
		
		this._gumaReference = gumaReference;
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;
		
		this._columns = 4;
		this._pageOffset = 10;
		
		this._fullPageWidth = fullPageWidth || 800;
		this._fullPageHeight = fullPageHeight || 600;
		this._minPageWidth = minPageWidth || 200;
		this._minPageHeight = minPageHeight || 150;
		
		let fullWidth = this._columns * this._minPageWidth + (this._columns - 1) * this._pageOffset;
		let xStart = -fullWidth / 2;
		let yIter = 350;
		
		this._pages = []; //TODO Three.Group???
		this._frontPage = null;
		
		let pageActions = [];
		let colIndex = 0;
		let rowIndex = 0;
		for (let i = 0; i < pageContents.length; i++) {
			let x = xStart + colIndex * (this._minPageWidth + this._pageOffset);
			
			let page = new WindowPage(this._gumaReference, pageNames[i], pageContents[i], this._minPageWidth, this._minPageHeight, this.position.x, this.position.y, this.position.z);
			//let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this.position.x, this.position.y, this.position.z);
			page.moveTo(this.position.x + x, this.position.y + yIter);
			
			pageActions.push(this._pageClick(page, this));
			page.element.onclick = pageActions[i];
			
			//this.add(page);
			this._pages.push(page);
			
			colIndex++;
			if (colIndex == this._columns) {
				colIndex = 0;
				rowIndex++;
				
				yIter -= rowIndex * (this._minPageHeight + this._pageOffset);
			}
		}

		this._menu = new GumaMenu(gumaReference, pageNames, /*pages(),*/ pageActions, x, y, z + 1670);
	}
	
	_pageClick(page, caller) {
		return () => {
			if (!page.inFront) {
				if (caller._frontPage != null) {
					caller._frontPage.collapse();
				}
				
				page.popup();
				caller._frontPage = page;
			} else {
				page.collapse();
			}
		};
	}
	
	get pages() {
		//return this.children;
		return this._pages;
	}
	
	get menu() {
		return this._menu;
	}
}
