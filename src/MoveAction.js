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