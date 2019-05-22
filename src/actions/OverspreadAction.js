class OverspreadAction {
	constructor(gumaReference, element, children, moveSpeed, offset) {
		this._gumaReference = gumaReference;
		this._element = element || null;
		this._children = children || this._element.children;
		this._maxMoveSpeed = moveSpeed || 10;
		this._offset = offset || 10;
		this._task = null;
		this._hiddenItems = true;
	}
	
	_update() {
		let constant = 1;//2.5
		let screenWidth = window.innerWidth / constant;
		let fullWidth = -5;
		let offset = 5;
		let widthPrev = fullWidth;
	    let lineGroups = [];
	    let maxWidth = 0;
		let currentGroup = [];
		let oneLine = true;
		
		lineGroups.push(currentGroup);
		
		for (let entry of this._children) {
			widthPrev = fullWidth;
			
	        fullWidth += entry.element.offsetWidth + offset;
			
	        if (currentGroup.length > 0 && fullWidth * constant > screenWidth) {
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

	    let y = window.innerHeight - 75;
	    this._children[0].visible = !oneLine;
	    //this._children[0].textElement.visible(!oneLine);
	    
		for (let entry of this._children) {
	        if (entry === this._children[0]) {
	            continue;
	        }
	        
	        entry.visible = oneLine || !this._hiddenItems;
	        //entry.textElement.visible(oneLine || !this._hiddenItems);
	    };
	    
	    if (!oneLine && this._hiddenItems) {
	    	this._children[0].position.x = (- screenWidth + offset) / 10;
	    	this._children[0].position.y = y / 25;
	    	
	    	return;
	    }

		maxWidth += oneLine ? 0 : (this._children[0].element.offsetWidth + offset);
		
		let start = oneLine ? - maxWidth * 2.25 : (- screenWidth + offset);

		for (let group of lineGroups) {
	        let iter = start;
	        
			for (let entry of group) {
	            if (entry == this._children[0] && oneLine) {
	            	continue;
	            }
	//alert(entry.positionX + ' ' + iter + ' ' + entry.positionY + ' ' + y);
	            entry.position.x = iter / 10;//alert(iter / 10 + ' ' + (y / 25));
	            entry.position.y = y / 25;
	            //entry.position.x = iter;
	            //entry.position.y = y;
	    		iter += (entry.element.offsetWidth + offset) * 5;
			};
			
			y -= (this._children[0].element.offsetHeight - offset) * 5;
		};
		
	}
    
	
	_doStep() {

		/*if (typeof this._TEST !== 'undefined')
		for (let menuItem of this._TEST.menu.items) {
			console.log( menuItem.element.innerHTML, menuItem.element.offsetWidth );
		}*/
	}
	
	_continueCondition() {
		this._update();
		return false;
		//return this._element.rotation.y != this._angle;
	}
	
	start() {
		//this._angle = angle - this._element.rotation.y || 0;
		//this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}