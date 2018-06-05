var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);

var spx = 0;
var spy = 0;
var x = 0;
var pause = false;

var level = 0;
var levels = [];

var sphereNames;

var canvasGUI;

levels.push([0, 2*Math.PI, 2, 0.01]);//0
levels.push([Math.PI/2, 2*Math.PI/2, 2, 0.01]);//1
levels.push([0, 2*Math.PI, 2, 0.01]);//2
levels.push([Math.PI, 3*Math.PI/2, 2, 0.01]);//3
levels.push([0, Math.PI/4, 2, 0.01]);//4
levels.push([8*Math.PI/8, 9*Math.PI/8, 2, 0.01]);//5
levels.push([0, Math.PI/16, 2, 0.01]);//6
levels.push([Math.PI, 33*Math.PI/32, 2, 0.01]);//7
levels.push([45*Math.PI/64, 46*Math.PI/64, 2, 0.01]);//8

levels.push([0, 2*Math.PI, 2, 0.02]);//9
levels.push([0, 3*Math.PI/2, 2, 0.02]);//10
levels.push([0, Math.PI, 2, 0.02]);//11
levels.push([0, Math.PI/2, 2, 0.02]);//12
levels.push([0, Math.PI/4, 2, 0.02]);//13
levels.push([0, Math.PI/8, 2, 0.02]);//14
levels.push([0, Math.PI/16, 2, 0.02]);//15
levels.push([0, Math.PI/32, 2, 0.02]);//16
levels.push([0, Math.PI/64, 2, 0.02]);//17
levels.push([0, 2*Math.PI, 2, 0.03]);//18
var menuOn = false;

var shadowGenerator;

window.addEventListener('DOMContentLoaded', function(){
    var createScene = function(){
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.9);

        var camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(0, 8, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);
        camera.attachPostProcess(new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, true));

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, 0), scene);
        light2.position = new BABYLON.Vector3(0, 1, 0);
        light2.intensity = 0.8;

        var spotLight = new BABYLON.SpotLight("splight", new BABYLON.Vector3(0,3,0), new BABYLON.Vector3(0,-1,0), 0.2, 10, scene);

        var sphere = BABYLON.Mesh.CreateSphere('mainSphere', 32, 0.25, scene);
        sphere.material = new BABYLON.StandardMaterial('mainSphereMat', scene);
        //sphere.material.diffuseTexture = new BABYLON.Texture("images/sphereTextureBlueGradient.png", scene);
        sphere.material.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1);
        sphere.material.specularColor = new BABYLON.Color3(0, 0, 0);
        sphere.position.y = 1;
        sphere.convertToFlatShadedMesh();

        var ground = new BABYLON.Mesh.CreateGround('ground', 30, 10, 0, scene);
        ground.material = new BABYLON.StandardMaterial('groundMat', scene);
        ground.material.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.3);
        //ground.material.specularColor = new BABYLON.Color3(0,0,0);
        ground.material.specularPower = 2128;
        ground.position.y = 0;

        canvasGUI = createGUI(scene, window.innerWidth, window.innerHeight, 1);
        sphereNames = buildWinnerArea(levels[level][0], levels[level][1], levels[level][2], scene);

        shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.getShadowMap().renderList.push(sphere);
        for(var i = 0; i<sphereNames.length; i++){
          shadowGenerator.getShadowMap().renderList.push(scene.getMeshByID(sphereNames[i]));
        }
        shadowGenerator.useVarianceShadowMap = true;
        ground.receiveShadows = true;

        //var music = new BABYLON.Sound("beep_boop", "sound/beep_boop.wav", scene, null, {loop: true, autoplay: true});

        return scene;
    };

    var scene = createScene();
    var startScene = createStartScene();
    var frameSwitch = 0;
    console.log(scene);

    engine.runRenderLoop(function(){
      if(!pause){
        animate(scene);
        animateCamera(scene, x);

        if(frameSwitch === 10){
          colorificRandomness(scene, sphereNames);
          frameSwitch = 0;
        }
        frameSwitch++;
        scene.render();
      }
    });

    //////////////////////// CONTROLS //////////////////////////////////////////

    window.addEventListener('resize', function(){
        engine.resize();
    });

    window.addEventListener('contextmenu', function(evt){
      if(evt.button === 2){
        evt.preventDefault();
        return false;
      }
    }, false);

    window.addEventListener('keydown', function(evt){
      if(evt.keyCode === 27){
        if(!pause){pause = true;}else{pause = false;}
      }
    });

    window.addEventListener('mousedown', function(evt){
      if(evt.button === 0){
        if(!menuOn){
          if(x >= levels[level][0] && x <= levels[level][1]){
            console.log("Winner!");
            nextLevel(scene);
          }else{
            console.log("Loser!");
            previousLevel(scene);
          }
        }
      }

      if(evt.button === 2){
        console.log("right mouse");
      }
    });

    window.addEventListener('touchstart', function(evt){
      //console.log(evt);
    }, false);
});
////////////////////////////// UNORGANIZED FUNCTIONS ///////////////////////////

function animate(scene){
  if(x<= 2*Math.PI){
    x += levels[level][3];
  }else{
    x = 0;
  }
  spx = levels[level][2]*Math.cos(x);
  spy = levels[level][2]*Math.sin(x);

  scene.getMeshByID("mainSphere").position.x = spx;
  scene.getMeshByID("mainSphere").position.z = spy;

  scene.lights[2].position.x = spx;
  scene.lights[2].position.z = spy;

  canvasGUI.findById("uiOverlayLevelText").text = Math.floor(x).toString();
}

function animateCamera(scene, t){
  scene.cameras[0].position.x = 0.25*Math.cos(t*2+Math.PI/2);
  scene.cameras[0].position.z = 0.25*Math.sin(t*2+Math.PI/2);
}

function buildWinnerArea(begin, end, radius, scene){
  var sphereNames = [];
  var p = 0;
  var count = 0;
  var t = radius*Math.cos(p);
  var s = radius*Math.sin(p);
  while(p <= 2*Math.PI){
    if(p >= begin && p <= end){
      var name = "sphere"+count;
      sphereNames.push(name);
      var sf = BABYLON.Mesh.CreateSphere(name, 16, 0.20, scene);
      sf.material = new BABYLON.StandardMaterial(name + "Mat", scene);
      sf.material.diffuseColor = new BABYLON.Color3((Math.random()*255)/255, (Math.random()*255)/255, (Math.random()*255)/255);
      sf.material.specularColor = new BABYLON.Color3(0, 0, 0);
      sf.position = new BABYLON.Vector3(t, 1, s);
      sf.convertToFlatShadedMesh();
      count++;
    }

    p += Math.PI/64;
    t = radius*Math.cos(p);
    s = radius*Math.sin(p);
  }

  return sphereNames;
}

function colorificRandomness(scene, names){
  for(var i = 0; i<names.length; i++){
    scene.getMeshByID(names[i]).material.diffuseColor = new BABYLON.Color3((Math.random()*255)/255, (Math.random()*255)/255, (Math.random()*255)/255);
  }
}

function disposeSpheres(scene, names){
  for(var i = 0; i<names.length; i++){
    scene.getMeshByID(names[i]).dispose();
  }
}

function nextLevel(scene){
  disposeSpheres(scene, sphereNames);
  sphereNames = [];
  spx = 0;
  spy = 0;
  level++;
  canvasGUI.findById("uiOverlayLevelText").text = level.toString();
  console.log(canvasGUI.findById("uiOverlayLevelText").text);
  sphereNames = buildWinnerArea(levels[level][0], levels[level][1], levels[level][2], scene);
  for(var i = 0; i<sphereNames.length; i++){
    shadowGenerator.getShadowMap().renderList.push(scene.getMeshByID(sphereNames[i]));
  }
}

function previousLevel(scene){
  disposeSpheres(scene, sphereNames);
  sphereNames = [];
  spx = 0;
  spy = 0;
  level--;
  canvasGUI.findById("uiOverlayLevelText").text = level.toString();
  sphereNames = buildWinnerArea(levels[level][0], levels[level][1], levels[level][2], scene);
  for(var i = 0; i<sphereNames.length; i++){
    shadowGenerator.getShadowMap().renderList.push(scene.getMeshByID(sphereNames[i]));
  }
}
