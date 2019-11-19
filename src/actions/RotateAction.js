class RotateAction {
	constructor(gumaReference, element, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		/*for (let entry of this._element._pages) {// TODO should work generic, not only for pageset
			entry.rotation.y = Utils.getRotateStep(entry.rotation.y, this._angle, this._maxRotateSpeed);
		}*/
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