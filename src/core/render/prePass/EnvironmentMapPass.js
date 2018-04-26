(function() {
    var EnvironmentMapPass = function() {
        this.camera = new zen3d.Camera();

        this.targets = [
            new zen3d.Vector3( 1, 0, 0 ), new zen3d.Vector3( -1, 0, 0 ), new zen3d.Vector3( 0, 1, 0 ),
            new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ), new zen3d.Vector3( 0, 0, -1 )
        ];
        this.ups = [
            new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, 0, 1 ),
            new zen3d.Vector3( 0, 0, -1 ), new zen3d.Vector3( 0, -1, 0 ), new zen3d.Vector3( 0, -1, 0 )
        ];

        this.camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);

        this.position = new zen3d.Vector3();
        this.lookTarget = new zen3d.Vector3();

        this.renderTarget = new zen3d.RenderTargetCube(512, 512);
		this.renderTexture = this.renderTarget.texture;
        this.renderTexture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR;
        
        this.shadowMapPass = new zen3d.ShadowMapPass();
        this.forwardPass = new zen3d.ForwardPass();

        this.shadowAutoUpdate = true;
        this.shadowNeedsUpdate = false;
    }

    EnvironmentMapPass.prototype.render = function(glCore, scene) {
        this.camera.position.copy(this.position);

        if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
            this.shadowMapPass.render(glCore, scene);

            this.shadowNeedsUpdate = false;
        }

        for(var i = 0; i < 6; i++) {
            this.lookTarget.set(this.targets[i].x + this.camera.position.x, this.targets[i].y + this.camera.position.y, this.targets[i].z + this.camera.position.z);
            this.camera.setLookAt(this.lookTarget, this.ups[i]);

            this.camera.updateMatrix();

            this.renderTarget.activeCubeFace = i;

            glCore.texture.setRenderTarget(this.renderTarget);

            glCore.state.clearColor(0, 0, 0, 0);
            glCore.clear(true, true, true);

            this.forwardPass.render(glCore, scene, this.camera);

            glCore.texture.updateRenderTargetMipmap(this.renderTarget);
        }
    }

    zen3d.EnvironmentMapPass = EnvironmentMapPass;
})();