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