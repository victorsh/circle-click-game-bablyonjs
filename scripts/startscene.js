var createStartScene = function(){
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);

    var camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(0, 10, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    camera.attachPostProcess(new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, true));

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 32, 0.25, scene);
    sphere.material = new BABYLON.StandardMaterial('sphereMat', scene);
    //sphere.material.diffuseColor = new BABYLON.Color3(0.1, 0.7, 0.1);
    //sphere.material.diffuseTexture = new BABYLON.Texture("images/sphereTextureBlueGradient.png", scene);
    sphere.material.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
    sphere.material.specularColor = new BABYLON.Color3(0, 0, 0);
    sphere.position.y = 1;
    sphere.convertToFlatShadedMesh();

    canvasGUI = createGUI(scene, window.innerWidth, window.innerHeight, 1);

    buildWinnerArea(0, 2*Math.PI, 2, scene);

    return scene;
};
