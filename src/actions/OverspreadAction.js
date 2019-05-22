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