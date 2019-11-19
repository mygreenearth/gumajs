class WindowsSet extends THREE.Group {
	constructor(gumaReference) {
		super();
		
		this._gumaReference = gumaReference;
	}
	
	init(pageNames, pageContents, x, y, z, fullPageWidth, fullPageHeight, minPageWidth, minPageHeight) {
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
		this._pageActions = [];
		
		let colIndex = 0;
		let rowIndex = 0;
		for (let i = 0; i < pageContents.length; i++) {
			let x = xStart + colIndex * (this._minPageWidth + this._pageOffset);
			
			let page = new WindowPage(this._gumaReference, pageNames[i], pageContents[i], this._minPageWidth, this._minPageHeight, this.position.x, this.position.y, this.position.z);
			//let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this.position.x, this.position.y, this.position.z);
			page.moveTo(this.position.x + x, this.position.y + yIter);
			
			this._pageActions.push(this._pageClick(page, this));
			page.element.onclick = this._pageActions[i];
			
			//this.add(page);
			this._pages.push(page);
			
			colIndex++;
			if (colIndex == this._columns) {
				colIndex = 0;
				rowIndex++;
				
				yIter -= rowIndex * (this._minPageHeight + this._pageOffset);
			}
		}

		this._menu = new GumaMenu(this._gumaReference, pageNames, /*pages(),*/ this._pageActions, x, y, z + 1670);
		
		// TODO private members of Guma used here
		for (let page of this._pages) {
			this._gumaReference._scene.add(page);
			this._gumaReference._pages.push(page);
		}
		
		for (let menuItem of this._menu.items) {
			this._gumaReference._scene.add(menuItem);
		}
		
		let action = new OverspreadAction(this._gumaReference, this._menu, this._menu.items);
		action.start();

		this._gumaReference._scene.add(this);

	}
	
	clickMenu(index) {
		this._doClick(this._pages[index], this);
	}
	
	_pageClick(page, caller) {
		return () => {
			caller._doClick(page, caller);
		};
	}
	
	_doClick(page, caller) {
		if (!page.inFront) {
			if (caller._frontPage != null) {
				caller._frontPage.collapse();
			}
			
			page.popup();
			caller._frontPage = page;
		} else {
			page.collapse();
		}
	}
	
	get pages() {
		//return this.children;
		return this._pages;
	}
	
	get menu() {
		return this._menu;
	}
}
