class WindowPage extends GumaPage {
	constructor(gumaReference, title, content, width, height, x, y, z, rotX, rotY, rotZ) {
		let header = '<div class="gumajs-window-header" style="width:100%; height:23px; line-height:23px; font-weight: bold; background:lightblue"><div style="padding:0 5px;">' + title + '</div></div>';
		content = '<div class="gumajs-window-content style="width:100%;">' + content + '</div>';
		super(gumaReference, header + content, width, height, x, y, z, rotX, rotY, rotZ);

		this._header = header;
		this._content = content;
	}
}
