class MoveArcAction {
	constructor(gumaReference, element, rotateSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._task = null;
	}
	
	_doStep() {
		this._element.rotation.y = Utils.getRotateStep(this._element.rotation.y, this._desiredAngle, this._maxRotateSpeed);
		let angle = this._element.rotation.y;
		let x = this._radius * Math.sin(angle);
		let z = this._radius * Math.cos(angle);
		
		this._element.position.x = this._x + x; 
		this._element.position.z = this._z + z;
	}
	
	_continueCondition() {
		return this._element.rotation.y != this._desiredAngle;
	}
	
	start(x, z, angle) {
		this._x = x;
		this._z = z;
		this._desiredAngle = Utils.trimAngle(angle + this._element.rotation.y);
		this._radius = Math.sqrt(Math.pow(this._x - this._element.position.x, 2) + Math.pow(this._z - this._element.position.z, 2));
		
		if (this._task == null || !this._task.valid) {
			this._task = this._gumaReference.animationManager.addTask(this._doStep.bind(this), this._continueCondition.bind(this));
		}
	}
}