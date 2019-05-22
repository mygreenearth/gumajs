class MoveAction {
	constructor(gumaReference, element, rotateSpeed, moveSpeed) {
		this._gumaReference = gumaReference;
		this._element = element;
		this._maxRotateSpeed = rotateSpeed || 0.04;
		this._maxMoveSpeed = moveSpeed || 10;
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