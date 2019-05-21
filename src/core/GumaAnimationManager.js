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