class GumaPage extends THREE.CSS3DObject {
	constructor(gumaReference, content, width, height, x, y, z, rotX, rotY, rotZ) {
		super(document.createElement('div'));
		
		this._gumaReference = gumaReference;
		
		this.element.innerHTML = content;
		this.element.style.background = 'lightblue';
		//this.element.onclick = function() { alert('yep!') };
		
		this._width = width || 800;
		this._height = height || 600;
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;
		this.rotation.x = rotX || 0;
		this.rotation.y = rotY || 0;
		this.rotation.z = rotZ || 0;
		
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
}
