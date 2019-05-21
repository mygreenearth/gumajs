class RotateAction {
	constructor(gumaReference, element, rotateSpeed, moveSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._maxMoveSpeed = moveSpeed || 10;
		this._task = null;
	}
	
	_rotateAction() {
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._angle, this._maxRotateSpeed);
	}
	
	_rotateCondition() {
		return this._element.rotation.y != this._angle;
	}
	
	rotate(angle) {
		this._angle = angle - this._element.rotation.y || 0;
		//this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._rotateAction.bind(this), this._rotateCondition.bind(this));
		}
	}
}