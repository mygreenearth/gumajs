'use strict';
class Guma {
	constructor() {
		this._scene = new THREE.Scene();
		
		this._renderer = new THREE.CSS3DRenderer();
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		this._renderer.domElement.style.position = 'absolute';
		this._renderer.domElement.style.top = 0;
		this._renderer.domElement.style.zIndex = 0;
        document.body.appendChild( this._renderer.domElement );
        
        window.addEventListener('resize', this._onWindowResize.bind(this), false);
        window.addEventListener('touchend', this._onWindowResize.bind(this), false);
	    
        this.cameraDistance = 2000;
        
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.set(0, 0, this.cameraDistance);
        
        this._pages = [];
        
        this.animationManager = new GumaAnimationManager();
        this.controls = new GumaControls(this);
        
        animate.bind(this)();

        function animate() {
            requestAnimationFrame(animate.bind(this));
            
            //this.controls.update();
            this.animationManager.update();
            
            this._renderer.render(this._scene, this.camera);
        }
        
        this._onWindowResize();
	}
	
	addPage(content, width, height, x, y, z) {
		let page = new GumaPage(this, content, width, height, x, y, z);
		
		this._scene.add(page);
		this._pages.push(page);
		
		return page;
	}
	
	addPrismPageSet(pageNames, pageContents, pageWidth, pageHeight, x, y, z) {
		let prismPageSet = new PrismPageSet(this, pageNames, pageContents, pageWidth, pageHeight, x, y, z);
		
		for (let page of prismPageSet.pages) {
			this._scene.add(page);
			this._pages.push(page);
		}
		
		return prismPageSet;
	}
	
	_onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

class GumaAnimationManager {
	constructor() {
		this._tasks = [];
	}
	
	addTask(action, condition) {
		let task = {
			action: action,
			condition: condition,
			valid: true
		};
		
		this._tasks.push(task);
		
		return task;
	}
	
	update() {
		this._tasks = this._tasks.filter(this._checkCondition);
		
		for (let t of this._tasks) {
			t.action();
		}
	}
	
	_checkCondition(element, index, array) {
		if (!element.condition()) {
			element.valid = false;
			return false;
		}
		
		return true; 
	}
}
class GumaControls {
	constructor(gumaReference, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._currentAngle = 0;
		this._moveToAngle = this._currentAngle;
		this.rotateSpeed = rotateSpeed || 0.1;
		this._task = null; 
	}
	
	_updateCondition() {
		return this._moveToAngle != this._currentAngle;
	}

	_updateAction() {
		if (Math.abs(this._moveToAngle - this._currentAngle) <= this.rotateSpeed) {
			this._currentAngle = this._moveToAngle;
		} else {
			let clockWise = false;
			
			if (Math.abs(this._moveToAngle - this._currentAngle) <= Math.PI) {
				clockWise = true;
			}
			
			if (this._moveToAngle < this._currentAngle) {
				clockWise = !clockWise;
			}
			
			this._currentAngle += clockWise ? this.rotateSpeed : -this.rotateSpeed;
			
			this._currentAngle = this._currentAngle < 0
			? this._currentAngle + 2 * Math.PI
					: this._currentAngle >= 2 * Math.PI
					? this._currentAngle - 2 * Math.PI
							: this._currentAngle;
		}
		
        this._gumaReference.camera.position.set(this._gumaReference.cameraDistance * Math.sin(this._currentAngle), 0, this._gumaReference.cameraDistance * Math.cos(this._currentAngle));
        this._gumaReference.camera.lookAt(0, 0, 0);
	}
	
	rotateCamera(angle) {
		this._moveToAngle = angle;

		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._updateAction.bind(this), this._updateCondition.bind(this));
		}
	}
}
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

class GumaMenuItem extends THREE.CSS3DObject {
	constructor(gumaReference, buttonText, action, x, y, z) {
		super(document.createElement('button'));
		
		this._gumaReference = gumaReference;
		
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;

		this.element.value = buttonText;
		this.element.onclick = action;
	}
}

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
		
		this._moveAction.moveTo(x, y, z, rotX, rotY, rotZ);
	}
	
	rotate(rotX, rotY, rotZ) {
		 this.moveTo(this.position.x, this.position.y, this.position.z, rotX, rotY, rotZ);
	}
}

class MoveAction {
	constructor(gumaReference, element, rotateSpeed, moveSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._rotateSpeed = rotateSpeed || 0.01;
		this._moveSpeed = moveSpeed || 10;
		this._task = null;
	}
	
	_moveAction() {
		if (this._element.position.x < this._x) {
			this._element.position.x = Math.min(this._x, this._element.position.x + this._moveSpeed);
		} else if (this._element.position.x > this._x) {
			this._element.position.x = Math.max(this._x, this._element.position.x - this._moveSpeed);
		}
		
		if (this._element.position.y < this._y) {
			this._element.position.y = Math.min(this._y, this._element.position.y + this._moveSpeed);
		} else if (this._element.position.y > this._y) {
			this._element.position.y = Math.max(this._y, this._element.position.y - this._moveSpeed);
		}
		
		if (this._element.position.z < this._z) {
			this._element.position.z = Math.min(this._z, this._element.position.z + this._moveSpeed);
		} else if (this._element.position.z > this._z) {
			this._element.position.z = Math.max(this._z, this._element.position.z - this._moveSpeed);
		}
		
		this._element.rotation.x = Utils.getRotateStep(this._element.rotation.x, this._rotX, this._rotateSpeed);
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._rotY, this._rotateSpeed);
		this._element.rotation.z = Utils.getRotateStep(this._element.rotation.z, this._rotZ, this._rotateSpeed);
	}
	
	_moveCondition() {
		return this._x != this._element.position.x
		|| this._y != this._element.position.y
		|| this._z != this._element.position.z
		|| this._rotX != this._element.rotation.x
		|| this._rotY != this._element.rotation.y
		|| this._rotZ != this._element.rotation.z;
	}
	
	moveTo(x, y, z, rotX, rotY, rotZ) {
		this._x = x || this._element.position.x;
		this._y = y || this._element.position.y;
		this._z = z || this._element.position.z;
		this._rotX = rotX || this._element.rotation.x;
		this._rotY = rotY || this._element.rotation.y;
		this._rotZ = rotZ || this._element.rotation.z;
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._moveAction.bind(this), this._moveCondition.bind(this));
		}
	}
}
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
class PageSet {
	constructor(gumaReference, x, y, z) {
		this._gumaReference = gumaReference;
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
	}
}

class PrismPageRepresentation {
	constructor(gumaReference, pageNames, pageContents, pageWidth, pageHeight, x, y, z) {
		//super(gumaReference, x, y, z);
		
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
			
			let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this._x + x, this._y + y, this._z + z);
			page.rotation.y = iterAngle;
			pageActions.push(this._pageClick(page.rotation.y));
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

class Utils {
	static getRotateDirection(a1, a2) {
		if (a1 == a2) return 0;
		
		return a1 > a2 == Math.abs(a1 - a2) > Math.PI ? 1 : -1;
	}
	
	static trimAngle(angle) {
		if (angle < 0) return angle + 2 * Math.PI;
		
		if (angle >= 2 * Math.PI) return angle - 2 * Math.PI;
		
		return angle;
	}
	
	static getAngleDiff(a1, a2) {
		if (Math.abs(a1 - a2) > Math.PI) {
			if (a1 > a2) {
				a2 += 2 * Math.PI;
			} else {
				a1 += 2 * Math.PI;
			}
		}
		
		return Math.abs(a1 - a2);
	}
	
	static getRotateStep(angleFrom, angleTo, speed) {
		if (Utils.getAngleDiff(angleFrom, angleTo) <= speed) {
			return angleTo;
		}
		
		return Utils.trimAngle(angleFrom + Utils.getRotateDirection(angleFrom, angleTo) * speed);
	}
}