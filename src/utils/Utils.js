class Utils {
	static getRotateDirection(a1, a2) {
		a1 = Utils.trimAngle(a1);
		a2 = Utils.trimAngle(a2);

		if (a1 == a2) return 0;
		
		return (a1 > a2) == (Math.abs(a1 - a2) > Math.PI) ? 1 : -1;
	}
	
	static trimAngle(angle) {
		if (angle < 0) return angle + 2 * Math.PI;
		
		if (angle >= 2 * Math.PI) return angle - 2 * Math.PI;
		
		return angle;
	}
	
	static getAngleDiff(a1, a2) {
		a1 = Utils.trimAngle(a1);
		a2 = Utils.trimAngle(a2);

		if (Math.abs(a1 - a2) > Math.PI) {
			if (a1 > a2) {
				a2 += 2 * Math.PI;
			} else {
				a1 += 2 * Math.PI;
			}
		}
		
		return Math.abs(a1 - a2);
	}
	
	static getRotateStep(angleFrom, angleTo, speed) {
		if (Utils.getAngleDiff(angleFrom, angleTo) <= speed) {
			return Utils.trimAngle(angleTo);
		}
		
		return Utils.trimAngle(angleFrom + Utils.getRotateDirection(angleFrom, angleTo) * speed);
	}
}