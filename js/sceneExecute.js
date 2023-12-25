(function() {
  'use strict';

  // link to, or create, namespace
  window.sceneNS = window.sceneNS || {};

  // wait until the web page is fully loaded
  // before running this code block
  window.addEventListener('DOMContentLoaded', function(){

    // query the DOM and save a reference to the canvas html element
    let canvas = document.getElementById('renderCanvas');

    // load the Babylon 3D engine
    let engine = new window.BABYLON.Engine(canvas, true);

    // create a Scene instance
    let scene = window.sceneNS.sceneCreate(canvas, engine);

    // Register a render loop that repeatedly
    // renders the scene onto the canvas element
    engine.runRenderLoop(function() {
      scene.render();
    });

    // instantiate a handler for canvas/window resize events
    window.addEventListener('resize', function() {
      engine.resize();
    });
  });
}());
