class MoveAction {
	constructor(gumaReference, element, moveSpeed, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxMoveSpeed = moveSpeed || 10;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		if (this._element.position.x < this._x) {
			this._element.position.x = Math.min(this._x, this._element.position.x + this._speedX);
		} else if (this._element.position.x > this._x) {
			this._element.position.x = Math.max(this._x, this._element.position.x - this._speedX);
		}
		
		if (this._element.position.y < this._y) {
			this._element.position.y = Math.min(this._y, this._element.position.y + this._speedY);
		} else if (this._element.position.y > this._y) {
			this._element.position.y = Math.max(this._y, this._element.position.y - this._speedY);
		}
		
		if (this._element.position.z < this._z) {
			this._element.position.z = Math.min(this._z, this._element.position.z + this._speedZ);
		} else if (this._element.position.z > this._z) {
			this._element.position.z = Math.max(this._z, this._element.position.z - this._speedZ);
		}
		
		this._element.rotation.x = Utils.getRotateStep(this._element.rotation.x, this._rotX, this._speedRotX);
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._rotY, this._speedRotY);
		this._element.rotation.z = Utils.getRotateStep(this._element.rotation.z, this._rotZ, this._speedRotZ);
	}
	
	_continueCondition() {
		return this._x != this._element.position.x
		|| this._y != this._element.position.y
		|| this._z != this._element.position.z
		|| this._rotX != this._element.rotation.x
		|| this._rotY != this._element.rotation.y
		|| this._rotZ != this._element.rotation.z;
	}
	
	_recalculateSpeeds() {
		let xDistance = Math.abs(this._x - this._element.position.x);
		let yDistance = Math.abs(this._y - this._element.position.y);
		let zDistance = Math.abs(this._z - this._element.position.z);
		let rotXDistance = Math.abs(this._rotX - this._element.rotation.x);
		let rotYDistance = Math.abs(this._rotY - this._element.rotation.y);
		let rotZDistance = Math.abs(this._rotZ - this._element.rotation.z);
		
		let xSteps = xDistance / this._maxMoveSpeed;
		let ySteps = yDistance / this._maxMoveSpeed;
		let zSteps = zDistance / this._maxMoveSpeed;
		let rotXSteps = rotXDistance / this._maxRotateSpeed;
		let rotYSteps = rotYDistance / this._maxRotateSpeed;
		let rotZSteps = rotZDistance / this._maxRotateSpeed;
		
		let maxSteps = Math.ceil(Math.max(xSteps, ySteps, zSteps, rotXSteps, rotYSteps, rotZSteps));

		this._speedX = xDistance / maxSteps;
		this._speedY = yDistance / maxSteps;
		this._speedZ = zDistance / maxSteps;
		this._speedRotX = rotXDistance / maxSteps;
		this._speedRotY = rotYDistance / maxSteps;
		this._speedRotZ = rotZDistance / maxSteps;
	}
	
	start(x, y, z, rotX, rotY, rotZ) {
		this._x = x || this._element.position.x;
		this._y = y || this._element.position.y;
		this._z = z || this._element.position.z;
		this._rotX = rotX || this._element.rotation.x;
		this._rotY = rotY || this._element.rotation.y;
		this._rotZ = rotZ || this._element.rotation.z;
		
		this._recalculateSpeeds();
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}
class MoveAndResizeAction {
	constructor(gumaReference, element, moveSpeed, resizeSpeed, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxMoveSpeed = moveSpeed || 10;
		this._maxResizeSpeedSpeed = resizeSpeed || 10;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		if (this._element.position.x < this._x) {
			this._element.position.x = Math.min(this._x, this._element.position.x + this._speedX);
		} else if (this._element.position.x > this._x) {
			this._element.position.x = Math.max(this._x, this._element.position.x - this._speedX);
		}
		
		if (this._element.position.y < this._y) {
			this._element.position.y = Math.min(this._y, this._element.position.y + this._speedY);
		} else if (this._element.position.y > this._y) {
			this._element.position.y = Math.max(this._y, this._element.position.y - this._speedY);
		}
		
		if (this._element.position.z < this._z) {
			this._element.position.z = Math.min(this._z, this._element.position.z + this._speedZ);
		} else if (this._element.position.z > this._z) {
			this._element.position.z = Math.max(this._z, this._element.position.z - this._speedZ);
		}

		if (this._element.width < this._width) {
			this._element.width = 
				Math.min(this._width, this._element.width + this._speedWidth);
		} else if (this._element.width > this._width) {
			this._element.width = 
				Math.max(this._width, this._element.width - this._speedWidth);
		}
		
		if (this._element.height < this._height) {
			this._element.height = 
				Math.min(this._height, this._element.height + this._speedHeight);
		} else if (this._element.height > this._height) {
			this._element.height = 
				Math.max(this._height, this._element.height - this._speedHeight);
		}
		
		this._element.rotation.x = Utils.getRotateStep(this._element.rotation.x, this._rotX, this._speedRotX);
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._rotY, this._speedRotY);
		this._element.rotation.z = Utils.getRotateStep(this._element.rotation.z, this._rotZ, this._speedRotZ);
	}
	
	_continueCondition() {
		return this._x != this._element.position.x
		|| this._y != this._element.position.y
		|| this._z != this._element.position.z
		|| this._width != this._element.width
		|| this._height != this._element.height
		|| this._rotX != this._element.rotation.x
		|| this._rotY != this._element.rotation.y
		|| this._rotZ != this._element.rotation.z;
	}
	
	_recalculateSpeeds() {
		let xDistance = Math.abs(this._x - this._element.position.x);
		let yDistance = Math.abs(this._y - this._element.position.y);
		let zDistance = Math.abs(this._z - this._element.position.z);
		let widthDistance = Math.abs(this._width - this._element.width);
		let heightDistance = Math.abs(this._height - this._element.height);
		let rotXDistance = Math.abs(this._rotX - this._element.rotation.x);
		let rotYDistance = Math.abs(this._rotY - this._element.rotation.y);
		let rotZDistance = Math.abs(this._rotZ - this._element.rotation.z);
		
		let xSteps = xDistance / this._maxMoveSpeed;
		let ySteps = yDistance / this._maxMoveSpeed;
		let zSteps = zDistance / this._maxMoveSpeed;
		let widthSteps = widthDistance / this._maxMoveSpeed;
		let heightSteps = heightDistance / this._maxMoveSpeed;
		let rotXSteps = rotXDistance / this._maxRotateSpeed;
		let rotYSteps = rotYDistance / this._maxRotateSpeed;
		let rotZSteps = rotZDistance / this._maxRotateSpeed;
		
		let maxSteps = Math.ceil(Math.max(xSteps, ySteps, zSteps, widthSteps, heightSteps, rotXSteps, rotYSteps, rotZSteps));

		this._speedX = xDistance / maxSteps;
		this._speedY = yDistance / maxSteps;
		this._speedZ = zDistance / maxSteps;
		this._speedWidth = widthDistance / maxSteps;
		this._speedHeight = heightDistance / maxSteps;
		this._speedRotX = rotXDistance / maxSteps;
		this._speedRotY = rotYDistance / maxSteps;
		this._speedRotZ = rotZDistance / maxSteps;
	}
	
	start(x, y, z, width, height, rotX, rotY, rotZ) {
		this._x = x || this._element.position.x;
		this._y = y || this._element.position.y;
		this._z = z || this._element.position.z;
		this._width = width || this._element.width;
		this._height = height || this._element.height;
		this._rotX = rotX || this._element.rotation.x;
		this._rotY = rotY || this._element.rotation.y;
		this._rotZ = rotZ || this._element.rotation.z;
		
		this._recalculateSpeeds();
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}

class MoveArcAction {
	constructor(gumaReference, element, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._angle, this._maxRotateSpeed);
		let angle = this._element.rotation.y;
		let x = this._radius * Math.sin(angle);
		let z = this._radius * Math.cos(angle);
		
		this._element.position.x = this._x + x; 
		this._element.position.z = this._z + z;
	}
	
	_continueCondition() {
		return this._element.rotation.y != this._angle;
	}
	
	start(x, z, angle) {
		this._x = x || this._element.position.x;
		this._z = z || this._element.position.z;
		this._angle = angle + this._element.rotation.y || 0;
		this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}
class OverspreadAction {
	constructor(gumaReference, element, children, moveSpeed, offset) {
		this._gumaReference = gumaReference;
		this._element = element || null;
		this._children = children || this._element.children;
		this._maxMoveSpeed = moveSpeed || 10;
		this._offset = offset || 10;
		this._task = null;
		this._hiddenItems = true;
		this._firstRun = true;
	}
	
	_run() {
		let screenWidth = window.innerWidth;
		let fullWidth = -4 * this._offset;
		let widthPrev = fullWidth;
	    let lineGroups = [];
	    let maxWidth = 0;
		let currentGroup = [];
		let oneLine = true;
		
		lineGroups.push(currentGroup);

		for (let entry of this._children) {
			widthPrev = fullWidth;
			
	        if (entry !== this._children[0]) {
		        fullWidth += entry.element.offsetWidth + this._offset;
	        }
			
	        if (currentGroup.length > 0 && fullWidth > screenWidth) {
	        	oneLine = false;
	        	maxWidth = Math.max(maxWidth, widthPrev);
	        	fullWidth = entry.element.offsetWidth;
	        	currentGroup = [];
	        	lineGroups.push(currentGroup);
	        } else {
	        	maxWidth = Math.max(maxWidth, fullWidth);
	        }
	        
	        currentGroup.push(entry);
		};

	    let y = 1000 / window.innerHeight + 250;
	    this._children[0].visible = !oneLine;
	    
		for (let entry of this._children) {
	        if (entry === this._children[0]) {
	            continue;
	        }
	        
	        entry.visible = oneLine || !this._hiddenItems;
	    };
	    
	    if (!oneLine && this._hiddenItems) {
	    	this._children[0].position.x = (- screenWidth + this._offset);
	    	this._children[0].position.y = y;
	    	
	    	return;
	    }

		maxWidth += oneLine ? 0 : (this._children[0].element.offsetWidth + this._offset);
		
		let start = oneLine ? - maxWidth / 2 : (- screenWidth + this._offset);

		for (let group of lineGroups) {
	        let iter = start;
	        
			for (let entry of group) {
	            if (entry === this._children[0] && oneLine) {
	            	continue;
	            }

	            let action = new MoveAction(this._gumaReference, entry, 4);
	            action.start(iter, y / 2);
	            //entry.position.x = iter;
	            //entry.position.y = y / 2;
	    		iter += entry.element.offsetWidth + this._offset;
			};
			
			y -= this._children[0].element.offsetHeight - this._offset;
		};
		
	}
	
	_doStep() {
		this._run();
		this._firstRun = false;
	}
	
	_continueCondition() {
		return this._firstRun;
	}
	
	start() {
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}
class RotateAction {
	constructor(gumaReference, element, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._angle, this._maxRotateSpeed);
	}
	
	_continueCondition() {
		return this._element.rotation.y != this._angle;
	}
	
	start(angle) {
		this._angle = angle - this._element.rotation.y || 0;
		//this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
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

class GumaMenuItem extends THREE.CSS3DObject {
	constructor(gumaReference, buttonText, action, x, y, z) {
		super(document.createElement('button'));
		
		this._gumaReference = gumaReference;
		
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.position.z = z || 0;

		this.element.innerHTML = buttonText;
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
            
            this._renderer.render(this._scene, this.camera);
            
            this.animationManager.update();
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
		
		for (let menuItem of prismPageSet.menu.items) {
			this._scene.add(menuItem);
		}
		
		let action = new OverspreadAction(this, prismPageSet.menu, prismPageSet.menu.items);
		action.start();

		this._scene.add(prismPageSet);
		
		return prismPageSet;
	}
	
	addWindowsSet(pageNames, pageContents, x, y, z, fullPageWidth, fullPageHeight, minPageWidth, minPageHeight) {
		let windowsSet = new WindowsSet(this, pageNames, pageContents, x, y, z, fullPageWidth, fullPageHeight, minPageWidth, minPageHeight);
		
		for (let page of windowsSet.pages) {
			this._scene.add(page);
			this._pages.push(page);
		}
		
		for (let menuItem of windowsSet.menu.items) {
			this._scene.add(menuItem);
		}
		
		let action = new OverspreadAction(this, windowsSet.menu, windowsSet.menu.items);
		action.start();

		this._scene.add(windowsSet);
		
		return windowsSet;
	}
	
	_onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

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
		
		this._pages = []; //TODO Three.Group???

		let pageActions = [];
		let iterAngle = 0;
		for (let i = 0; i < pageContents.length; i++) {
			let x = this._radius * Math.sin(iterAngle);
			let z = this._radius * Math.cos(iterAngle);
			
			let page = new GumaPage(this._gumaReference, pageContents[i], this._pageWidth, this._pageHeight, this.position.x, this.position.y, this.position.z);
			page.moveTo(this.position.x + x, this.position.y + y, this.position.z + z, page.rotation.x, iterAngle, page.rotation.z);
			
			pageActions.push(this._pageClick(-iterAngle));
			page.element.onclick = pageActions[i];
			
			//this.add(page);
			this._pages.push(page);
			
			iterAngle += this._rotateAngle;
		}

		this._menu = new GumaMenu(gumaReference, pageNames, /*pages(),*/ pageActions, x, y, z + this._radius * 2);
	}
	
	_pageClick(angle) {
		return () => {
			this._rotate(angle);
		};
	}
	
	_rotate(angle) {//TODO fix this. Problem with THREE.Group
		if (this.rotateAction == null) {
			this.rotateAction = new RotateAction(this._gumaReference, this);
		}
		
		this.rotateAction.start(angle);
	}
	
	get pages() {
		//return this.children;
		return this._pages;
	}
	
	get menu() {
		return this._menu;
	}
}

class WindowPage extends GumaPage {
	constructor(gumaReference, title, content, width, height, x, y, z, rotX, rotY, rotZ) {
		let header = '<div class="gumajs-window-header" style="width:100%; height:23px; line-height:23px; font-weight: bold; background:lightblue"><div style="padding:0 5px;">' + title + '</div></div>';
		content = '<div class="gumajs-window-content style="width:100%;">' + content + '</div>';
		super(gumaReference, header + content, width, height, x, y, z, rotX, rotY, rotZ);

		this._header = header;
		this._content = content;
	}
}

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
	
	static getStylePropValue(prop) {
		return parseInt(prop, 10);
	}
}