class MoveArcAction {
	constructor(gumaReference, element, rotateSpeed, moveSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._maxMoveSpeed = moveSpeed || 10;
		this._task = null;
	}
	
	_moveAction() {
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._angle, this._maxRotateSpeed);
		let angle = this._element.rotation.y;
		let x = this._radius * Math.sin(angle);
		let z = this._radius * Math.cos(angle);
		
		this._element.position.x = this._x + x; 
		this._element.position.z = this._z + z;
	}
	
	_moveCondition() {
		return this._element.rotation.y != this._angle;
	}
	
	moveAroundVerticalLine(x, z, angle) {
		this._x = x || this._element.position.x;
		this._z = z || this._element.position.z;
		this._angle = angle + this._element.rotation.y || 0;
		this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._moveAction.bind(this), this._moveCondition.bind(this));
		}
	}
}