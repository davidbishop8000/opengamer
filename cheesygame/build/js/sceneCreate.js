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
      //scene.clearColor = new BABYLON.Color3(0, 0, 0);
      // var scMaterial = new BABYLON.StandardMaterial("sc", scene);
      // scMaterial.diffuseTexture = new BABYLON.Texture("space.jpg");
      // scene.material = scMaterial;

      // let hdrTexture = BABYLON.CubeTexture.diffuseTexture = new BABYLON.Texture("space.jpg");
      // scene.createDefaultSkybox(hdrTexture, true, 10, 3);





            // Skybox
      var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("texture/space", scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;







      var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2.5, Math.PI /3.2, 300, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);

      var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
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
      
      const b_center = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 3.3, depth: 3.3});
      b_center.position.y = 0.2;
      const b_centerMat = new BABYLON.StandardMaterial("b_centerMat");
      b_centerMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
      b_centerMat.alpha = 0.9;
      b_center.material = b_centerMat;
      const b_r = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9, depth: 9});
      b_r.position = new BABYLON.Vector3(7, 0.2, 7);
      const b_rMat = new BABYLON.StandardMaterial("b_rMat");
      b_rMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      b_rMat.alpha = 0.7;
      b_r.material = b_rMat;
      const b_g = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9, depth: 9});
      b_g.position = new BABYLON.Vector3(-7, 0.2, 7);
      const b_gMat = new BABYLON.StandardMaterial("b_gMat");
      b_gMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
      b_g.material = b_gMat;
      b_gMat.alpha = 0.7;
      const b_b = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9, depth: 9});
      b_b.position = new BABYLON.Vector3(-7, 0.2, -7);
      const b_bMat = new BABYLON.StandardMaterial("b_bMat");
      b_bMat.diffuseColor = new BABYLON.Color3(0, 0, 1);
      b_bMat.alpha = 0.7;
      b_b.material = b_bMat;
      const b_y = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 9, depth: 9});
      b_y.position = new BABYLON.Vector3(7, 0.2, -7);
      const b_yMat = new BABYLON.StandardMaterial("b_yMat");
      b_yMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
      b_yMat.alpha = 0.7;
      b_y.material = b_yMat;

      var prepareButton = function (mesh, color, light) {
        var goToColorAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", color, 1000, null, true);

        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(
            new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.Black(), 1000))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action. 
                goToColorAction,                                                 // First click: root action. Second click: child action. Third click: going back to root action and so on...   
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
            ]));
        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, mesh.material, "wireframe", true))
            .then(new BABYLON.DoNothingAction());
        mesh.actionManager.registerAction(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "off"))
            .then(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "on"));
      }

      var makeOverOut = function (mesh, color) {
        const Mat = new BABYLON.StandardMaterial("Mat");
        Mat.diffuseColor = color;
        mesh.material = Mat;
        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));
        mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
          function(){
            console.log(mesh.position.x, mesh.position.y, mesh.id);
          }
          ));
      }

      let arr_r = [];
      let arr_g = [];
      let arr_b = [];
      let arr_y = [];
      const cell_offset = 8;
      for (let i=0; i<cell_offset; i++)
      {
        arr_r[i] = BABYLON.MeshBuilder.CreateBox(i, {height: 0.1, width: 1, depth: 1});
        arr_r[i].position.x += (2.5 + i*1.2);
        arr_r[i].position.y = 0.2;
        arr_r[i+cell_offset] = BABYLON.MeshBuilder.CreateBox(i+cell_offset, {height: 0.1, width: 1, depth: 1});
        arr_r[i+cell_offset].position.x += (2.5 + i*1.2);
        arr_r[i+cell_offset].position.z = 1.2;
        arr_r[i+cell_offset].position.y = 0.2;
        arr_r[i+cell_offset*2] = BABYLON.MeshBuilder.CreateBox(i+cell_offset*2, {height: 0.1, width: 1, depth: 1});
        arr_r[i+cell_offset*2].position.x += (2.5 + i*1.2);
        arr_r[i+cell_offset*2].position.z = -1.2;
        arr_r[i+cell_offset*2].position.y = 0.2;
        makeOverOut(arr_r[i], new BABYLON.Color3.Red());
        makeOverOut(arr_r[i+cell_offset], new BABYLON.Color3(0.8, 0.8, 0.8));
        makeOverOut(arr_r[i+cell_offset*2], new BABYLON.Color3(0.8, 0.8, 0.8));

        arr_g[i] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*3, {height: 0.1, width: 1, depth: 1});
        arr_g[i].position.z += (2.5 + i*1.2);
        arr_g[i].position.y = 0.2;
        arr_g[i+cell_offset] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*4, {height: 0.1, width: 1, depth: 1});
        arr_g[i+cell_offset].position.z += (2.5 + i*1.2);
        arr_g[i+cell_offset].position.x = 1.2;
        arr_g[i+cell_offset].position.y = 0.2;
        arr_g[i+cell_offset*2] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*5, {height: 0.1, width: 1, depth: 1});
        arr_g[i+cell_offset*2].position.z += (2.5 + i*1.2);
        arr_g[i+cell_offset*2].position.x = -1.2;
        arr_g[i+cell_offset*2].position.y = 0.2;
        makeOverOut(arr_g[i], new BABYLON.Color3.Green());
        makeOverOut(arr_g[i+cell_offset], new BABYLON.Color3(0.8, 0.8, 0.8));
        makeOverOut(arr_g[i+cell_offset*2], new BABYLON.Color3(0.8, 0.8, 0.8));

        arr_b[i] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*6, {height: 0.1, width: 1, depth: 1});
        arr_b[i].position.x -= (2.5 + i*1.2);
        arr_b[i].position.y = 0.2;
        arr_b[i+cell_offset] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*7, {height: 0.1, width: 1, depth: 1});
        arr_b[i+cell_offset].position.x -= (2.5 + i*1.2);
        arr_b[i+cell_offset].position.z = 1.2;
        arr_b[i+cell_offset].position.y = 0.2;
        arr_b[i+cell_offset*2] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*8, {height: 0.1, width: 1, depth: 1});
        arr_b[i+cell_offset*2].position.x -= (2.5 + i*1.2);
        arr_b[i+cell_offset*2].position.z = -1.2;
        arr_b[i+cell_offset*2].position.y = 0.2;
        makeOverOut(arr_b[i], new BABYLON.Color3.Blue());
        makeOverOut(arr_b[i+cell_offset], new BABYLON.Color3(0.8, 0.8, 0.8));
        makeOverOut(arr_b[i+cell_offset*2], new BABYLON.Color3(0.8, 0.8, 0.8));

        arr_y[i] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*9, {height: 0.1, width: 1, depth: 1});
        arr_y[i].position.z -= (2.5 + i*1.2);
        arr_y[i].position.y = 0.2;
        arr_y[i+cell_offset] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*10, {height: 0.1, width: 1, depth: 1});
        arr_y[i+cell_offset].position.z -= (2.5 + i*1.2);
        arr_y[i+cell_offset].position.x = 1.2;
        arr_y[i+cell_offset].position.y = 0.2;
        arr_y[i+cell_offset*2] = BABYLON.MeshBuilder.CreateBox(i + cell_offset*11, {height: 0.1, width: 1, depth: 1});
        arr_y[i+cell_offset*2].position.z -= (2.5 + i*1.2);
        arr_y[i+cell_offset*2].position.x = -1.2;
        arr_y[i+cell_offset*2].position.y = 0.2;
        makeOverOut(arr_y[i], new BABYLON.Color3.Yellow());
        makeOverOut(arr_y[i+cell_offset], new BABYLON.Color3(0.8, 0.8, 0.8));
        makeOverOut(arr_y[i+cell_offset*2], new BABYLON.Color3(0.8, 0.8, 0.8));
      }


    /*


      //var normalMaterial = new BABYLON.NormalMaterial("normalMat", scene);
      var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 4 }, scene);
      //var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 6, diameter: 4 }, scene);
      sphere1.position.y = 10;
      sphere1.material = new BABYLON.StandardMaterial("mat1", scene);
      sphere1.material.diffuseColor = new BABYLON.Color3(1, 0, 0);//Red
      //sphere1.material.wireframe = true;



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
*/


    // var coreSphere = BABYLON.MeshBuilder.CreateSphere("coreSphere", {diameter: 2.01, segments: 64}, scene);
    // coreSphere.position = new BABYLON.Vector3(5, 5, 5);
    // var sunMat = new BABYLON.StandardMaterial("Sun");
    // sunMat.diffuseTexture = new BABYLON.FireProceduralTexture("fire", 256, scene);
    // coreSphere.material = sunMat;


    var coreSphere = BABYLON.MeshBuilder.CreateSphere("coreSphere", {diameter: 20, segments: 64}, scene);

    var sunMaterial = new BABYLON.StandardMaterial("sun", scene);
    sunMaterial.diffuseTexture = new BABYLON.Texture("texture/sun.png");
    coreSphere.position = new BABYLON.Vector3(140, 40, 140);

    coreSphere.material = sunMaterial;
    //coreSphere.rotate(new BABYLON.Vector3(1.0, 1.0, 0.5), Math.PI / 3.0, BABYLON.Space.Local);

    var moonSphere = BABYLON.MeshBuilder.CreateSphere("mooS", {diameter: 10, segments: 64}, scene);
    var moonMaterial = new BABYLON.StandardMaterial("moonM", scene);
    moonMaterial.diffuseTexture = new BABYLON.Texture("texture/titan.jpg");
    moonSphere.position = new BABYLON.Vector3(140, 20, 140);
    moonSphere.material = moonMaterial;

    var alpha = 0;
    scene.registerBeforeRender(function () {
      coreSphere.position.x = 140 * Math.cos(alpha);
      //coreSphere.position.y = 40;
      coreSphere.position.z = 140 * Math.sin(alpha);
      moonSphere.position.x = -200 *Math.cos(alpha/4);
      //coreSphere.position.y = 40;
      moonSphere.position.z = -200 * Math.sin(alpha/4);
      alpha += 0.001;
    });


      
      // return the scene object
      return scene;
    };
}());