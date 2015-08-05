var app = (function(){

  "use strict";

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100000 );
  var effect;
  var controls = undefined;
  var clock = new THREE.Clock();

  var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 1 );
	scene.add( light );


  var urlPrefix = "textures/";
  var urls = [ urlPrefix + "miramar_ft.png", urlPrefix + "miramar_bk.png",
      urlPrefix + "miramar_up.png", urlPrefix + "miramar_dn.png",
    urlPrefix + "miramar_rt.png", urlPrefix + "miramar_lf.png"
    ];
  var textureCube = THREE.ImageUtils.loadTextureCube( urls );

  var shader = THREE.ShaderLib['cube'];
  var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  uniforms['tCube'].value = textureCube;   // textureCube has been init before
  var boxMaterial = new THREE.ShaderMaterial({
      fragmentShader    : shader.fragmentShader,
      vertexShader  : shader.vertexShader,
      uniforms  : uniforms
  });
  boxMaterial.side = THREE.BackSide;

  // build the skybox Mesh
  var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 1, 1, 1, null, true ), boxMaterial );
  // add it to the scene
  scene.add( skyboxMesh );



  var renderer = new THREE.WebGLRenderer();

  effect = new THREE.StereoEffect( renderer );
  effect.separation = 0.2;
  effect.targetDistance = 50;
  effect.setSize( window.innerWidth, window.innerHeight );

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var hasOrientation = function( evt ) {
		if ( !evt.alpha ) {
			return;
		}
		window.removeEventListener('deviceorientation', hasOrientation, false);
		controls = new THREE.DeviceOrientationControls( camera );
		controls.connect();
	};

  //var controls = new THREE.TrackballControls(camera);

  var geometry = new THREE.BoxGeometry( 2, 1, 1 );
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  controls = new THREE.FirstPersonControls( camera );

  window.addEventListener('deviceorientation', hasOrientation, false);
  window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize( window.innerWidth, window.innerHeight );
  }, false );

  camera.position.z = 5;
  camera.position.x = 5;
  camera.position.y = 0;

  camera.lookAt( scene.position );

  var animate = function () {
    requestAnimationFrame( animate );
    controls.update( clock.getDelta() );
    cube.rotation.z += 0.01;
    cube.rotation.y += 0.01;

    if ( controls.orientationQuaternion !== undefined ) {
			effect.render( scene, camera );
		} else {
      effect.render( scene, camera );
    }
  };
  animate();

})();
