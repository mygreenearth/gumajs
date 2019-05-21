'use strict';
class Guma {
	constructor() {
		this._scene = new THREE.Scene();
		
		this._renderer = new THREE.CSS3DRenderer();
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		this._renderer.domElement.style.position = 'absolute';
		this._renderer.domElement.style.top = 0;
		this._renderer.domElement.style.zIndex = 0;
        document.body.appendChild( this._renderer.domElement );
        
        window.addEventListener('resize', this._onWindowResize.bind(this), false);
        window.addEventListener('touchend', this._onWindowResize.bind(this), false);
	    
        this.cameraDistance = 2000;
        
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.set(0, 0, this.cameraDistance);
        
        this._pages = [];
        
        this.animationManager = new GumaAnimationManager();
        this.controls = new GumaControls(this);
        
        animate.bind(this)();

        function animate() {
            requestAnimationFrame(animate.bind(this));
            
            //this.controls.update();
            this.animationManager.update();
            
            this._renderer.render(this._scene, this.camera);
        }
        
        this._onWindowResize();
	}
	
	addPage(content, width, height, x, y, z) {
		let page = new GumaPage(this, content, width, height, x, y, z);
		
		this._scene.add(page);
		this._pages.push(page);
		
		return page;
	}
	
	addPrismPageSet(pageNames, pageContents, pageWidth, pageHeight, x, y, z) {
		let prismPageSet = new PrismPageSet(this, pageNames, pageContents, pageWidth, pageHeight, x, y, z);
		
		for (let page of prismPageSet.pages) {
			this._scene.add(page);
			this._pages.push(page);
		}
		
		for (let menuItem of prismPageSet.menu.items) {
			this._scene.add(menuItem);
		}

		this._scene.add(prismPageSet);

		return prismPageSet;
	}
	
	_onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
