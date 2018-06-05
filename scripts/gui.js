var createGUI = function(scene, screenWidth, screenHeight, level){
  var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, {id: "ScreenCanvas"});

  var uiGroup = new BABYLON.Group2D({
    parent: canvas, id: "uiOverlay", children: [
      new BABYLON.Rectangle2D({
        id: "uiOverlayLevelRect", width: 60, height:60, x: screenWidth/2 - 30, y: screenHeight/2 - 30, fill: "#0a0a0a8F", children: [
          new BABYLON.Text2D(level.toString(), {
            id: "uiOverlayLevelText", marginAlignment:"h:center, v:center", fontName:"26px arial"
          })
        ]
      }),
      new BABYLON.Rectangle2D({
        id: "uiOverlayMenuRect", width: 50, height:50, x:0, y:0, fill:"#0a0a0a8F", children:[
          new BABYLON.Text2D("| | |", {
            id: "uiOverlayMenuText", marginAlignment:"h:center, v:center", fontName:"26px arial"
          })
        ]
      })
    ]
  });

  uiGroup.findById("uiOverlayMenuRect").pointerEventObservable.add(function(){
    console.log("menu clicked");
    menuOn = true;
  }, BABYLON.PrimitivePointerInfo.PointerDown);

  return canvas;
};

var createStartMenuGUI = function(scene, screenWidth, screenHeight){
  var canvas = new BABYLON.ScreenSpace2D(scene, {id:"MainMenuScreenCanvas"});

  var uiMenuGroup = new BABYLON.Group2D({
    parent: canvas, id:"MainMenuOverlay", children:[
      new BABYLON.Rectangle2D({id:"MainMenuOverlayRect", })
    ]
  });
};
