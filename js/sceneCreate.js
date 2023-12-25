(function() {
  'use strict';

  // link to, or create, namespace
  window.sceneNS = window.sceneNS || {};

  // scene creation function
  window.sceneNS.sceneCreate =
    /**
     * Create a Scene class instance and return it
     * @param  {Canvas} canvas [canvas element which will display the new Scene]
     * @param  {Engine} engine [Engine class instance used to create the Scene]
     * @return {Scene}         [newly created Scene instance]
     */
    function sceneCreate(canvas, engine) {

      // convenience alias for BABYLON namespace
      let BABYLON = window.BABYLON;



      // create scene object

      var scene = new BABYLON.Scene(engine);
      var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 40, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);

      var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
      light.intensity = 0.8;

      var skyMaterial = new BABYLON.GridMaterial("skyMaterial", scene);
      skyMaterial.majorUnitFrequency = 5;
      skyMaterial.minorUnitVisibility = 0.3;
      skyMaterial.gridRatio = 5;
      skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
      skyMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);	
      skyMaterial.backFaceCulling = false;

      var defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
      defaultGridMaterial.majorUnitFrequency = 50;
      defaultGridMaterial.gridRatio = 0.2;
      defaultGridMaterial.minorUnitVisibility = 0.45;
      defaultGridMaterial.gridRatio = 0.3;
      defaultGridMaterial.mainColor = new BABYLON.Color3(0, 0, 0);
      defaultGridMaterial.lineColor = new BABYLON.Color3(0.0, 1.0, 0.0);

      var ground = BABYLON.MeshBuilder.CreateGround("gd", {width: 40, height: 40, subdivsions: 4}, scene);
      ground.material = skyMaterial;

      var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 6, diameter: 4 }, scene);
      sphere1.position.y = 10;
      sphere1.material = new BABYLON.StandardMaterial("mat1", scene);
      sphere1.material.diffuseColor = new BABYLON.Color3(1, 0, 0);//Red
      sphere1.material.wireframe = true;



      const frameRate = 10;

      const ySlide = new BABYLON.Animation("ySlide", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      const yScale = new BABYLON.Animation("ySlide", "scaling.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      var keyFrames = [];      

      keyFrames.push({
        frame: 0,
        value: 10
      });

      keyFrames.push({
        frame: frameRate,
        value: 1
      });

      keyFrames.push({
        frame: frameRate + 2,
        value: 5
      });

      keyFrames.push({
        frame: frameRate + 4,
        value: 7
      });

      keyFrames.push({
        frame: 2 * frameRate,
        value: 10
      });

      ySlide.setKeys(keyFrames);

      //sphere1.animations.push(ySlide);
/////////////////////////////////////////////////////
      keyFrames = [];
      keyFrames.push({
        frame: 0,
        value: 1
      });

      keyFrames.push({
        frame: frameRate-1,
        value: 1
      });

      keyFrames.push({
        frame: frameRate,
        value: 0.4
      });

      keyFrames.push({
        frame: frameRate+2,
        value: 1
      });

      keyFrames.push({
        frame: 2 * frameRate,
        value: 1
      });

      yScale.setKeys(keyFrames);

      //sphere1.animations.push(yScale);

      //const myAnim = scene.beginAnimation(sphere1, 0, 9 * frameRate, true);


      var animationGroup = new BABYLON.AnimationGroup("my group");
      // Create the animation group
      animationGroup.addTargetedAnimation(ySlide, sphere1);
      animationGroup.addTargetedAnimation(yScale, sphere1);


      // Make sure to normalize animations to the same timeline
      //animationGroup.normalize(0, 100);
      animationGroup.play(true);

      //setTimeout(() => { myAnim.stop() }, 5000);


      // return the scene object
      return scene;
    };
}());
