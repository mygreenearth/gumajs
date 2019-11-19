class GumaPage extends THREE.CSS3DObject {
	constructor(gumaReference, content, width, height, x, y, z, rotX, rotY, rotZ) {
		super(document.createElement('div'));
		
		this._gumaReference = gumaReference;
		
		this.element.innerHTML = content;
		this.element.style.background = 'lightblue';
		this.element.style.overflowY = 'scroll';
		this.element.style.padding = '5px';
		//this.element.onclick = function() { alert('yep!') };
		
		this._width = width || 800;
		this._height = height || 600;
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;
		this.rotation.x = rotX || 0;
		this.rotation.y = rotY || 0;
		this.rotation.z = rotZ || 0;
		this.inFront = false;
		
		this.updateSize();
		
		this._moveAction = null;
	}
	
	updateSize() {
        this.element.style.width = this._width + 'px';
        this.element.style.height = this._height + 'px';		
	}
	
	moveTo(x, y, z, rotX, rotY, rotZ) {
		if (this._moveAction == null) {
			this._moveAction = new MoveAction(this._gumaReference, this);
		}
		
		this._moveAction.start(x, y, z, rotX, rotY, rotZ);
	}
	
	rotate(rotX, rotY, rotZ) {
		 this.moveTo(this.position.x, this.position.y, this.position.z, rotX, rotY, rotZ);
	}	
	
	popup() {
		this.setCollapsedCoors();
		
		if (this.moveAndResizeAction == null) {
			this.moveAndResizeAction = new MoveAndResizeAction(this._gumaReference, this);
		}
		
		this.moveAndResizeAction.start(-20, -25, this.position.z + 1200, 800, 600);
		this.inFront = true;
	}
	
	collapse() {
		if (this.moveAndResizeAction == null) {
			this.moveAndResizeAction = new MoveAndResizeAction(this._gumaReference, this);
		}
		
		this.moveAndResizeAction.start(this.colX, this.colY, this.colZ, this.colWidth, this.colHeight,
				this.colRotX, this.colRotY, this.colRotZ);
		this.inFront = false;
	}

	setCollapsedCoors(x, y, z, width, height, rotX, rotY, rotZ) {
		this.colX = x || this.position.x;
		this.colY = y || this.position.y;
		this.colZ = z || this.position.z;
		this.colWidth = width || this._width;
		this.colHeight = height || this._height;
		this.colRotX = rotX || this.rotation.x;
		this.colRotY = rotY || this.rotation.y;
		this.colRotZ = rotZ || this.rotation.z;
	}
	
	get width() {
		return this._width;
	}
	
	set width(width) {
		this._width = width;
		this.element.style.width = this._width + 'px';
	}
	
	get height() {
		return this._height;
	}
	
	set height(height) {
		this._height = height;
		this.element.style.height = this._height + 'px';
	}
}
