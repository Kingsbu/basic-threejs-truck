// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;

const textureLoader = new THREE.TextureLoader();
const nightTexture = textureLoader.load( 'textures/night_image.jpg' );
const dayTexture = textureLoader.load( 'textures/blue-sky-background.jpg' );
const truck1 = createTruck();
const truck2 = createTruck();
truck2.position.set(-30,-0.4,-1.8);
truck2.rotation.y = -4.70; 

const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
light.castShadow = true;
var check = {startandStop: false,direction: false, night: false, truckSpeed: 0.04, Zoom: 1 }

const amLight = new THREE.AmbientLight( 0x404040, 0.5 );
amLight.castShadow = true;

const rectLeftLight1 = new THREE.PointLight( 0xffffff, 1,400 );
rectLeftLight1.position.set( 26, -1.5, 1.2 );
rectLeftLight1.lookAt( -40, 0, 1.2 );



const rectRightLight1 = new THREE.PointLight( 0xffffff, 1, 400 );
rectRightLight1.position.set( 26, -1.5, 2.9 );
rectRightLight1.lookAt( -40, 0, 2.9 );

const rectLeftLight2 = new THREE.PointLight( 0xffffff, 1,400 );
rectLeftLight2.position.set( 26, -1.5, -1.8 );
rectLeftLight2.lookAt( -27, 0, -1.8 );



const rectRightLight2 = new THREE.PointLight( 0xffffff, 1, 400 );
rectRightLight2.position.set( 26, -1.5, -2.9 );
rectRightLight2.lookAt( 27, 0, -2.8 );
var gui = new dat.GUI();

gui.add(check, 'startandStop').onChange( function(){} );
gui.add(check,'direction').onChange( function(){});
gui.add(check, 'night').onChange( function(){});
gui.add(check, 'truckSpeed', 0.04, 0.50);
gui.add(check, 'Zoom', 1, 5);


function init() {

    
    // Get a reference to the container element that will hold our scene
    container = document.querySelector( '#scene-container' );

    // create a Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FBCD4 );

    // set up the options for a perspective camera
    const fov = 35; // fov = Field Of View
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene
    camera.position.set( 1, 10, 32 );
    camera.rotation.x = -0.4;

    controls = new THREE.OrbitControls(camera, container);
    controls.update();
    // Create a directional light
    
    // move the light back and up a bit
    light.position.set( -10, 10, 25 );
    
    scene.add(amLight);
    
    

    // remember to add the light to the scene
    truck1.castShadow = true;
    truck2.castShadow = true;
    scene.add( light );


    
    truck1.add(rectRightLight1,rectLeftLight1);
    truck2.add(rectLeftLight2, rectRightLight2);
    
    
    
    
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
  createPlane();

    
  // start the animation loop
  renderer.setAnimationLoop( () => {

    
    render();

  } );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  // increase the mesh's rotation each frame
  
}

// render, or 'draw a still image', of the scene
function render() {
    
    controls.update();
    renderer.render( scene, camera );
    
    
    if (check.startandStop){
      if (check.direction){
        scene.remove(truck1);
        scene.add(truck2);
        truck2.position.x += check.truckSpeed;
        if (truck2.position.x >= 41){
          truck2.position.x = -30;
        }
      }else {
      scene.remove(truck2);
      scene.add(truck1);
      truck1.position.x -= check.truckSpeed;
        if (truck1.position.x <= -40){
          truck1.position.x = 25;
        }
      }
    }

    if (check.night){
      if(truck1.visible){
      rectRightLight1.visible = true;
      rectLeftLight1.visible = true;
      }
      if(truck2.visible){
        rectLeftLight2.visible = true;
        rectRightLight2.visible = true;
      }
      scene.background = nightTexture;
      light.visible = false;
    }else{
      rectRightLight1.visible = false;
      rectLeftLight1.visible = false;
      rectLeftLight2.visible = false;
      rectRightLight2.visible = false;
      scene.background = dayTexture;
      light.visible = true;
    } 

    camera.zoom = check.Zoom;
    camera.updateProjectionMatrix();
}

function createPlane(){
    const texture = textureLoader.load( 'textures/ground_textures.jpg' );
    texture.encoding = THREE.sRGBEncoding;
    texture.mapping = THREE.CubeUVReflectionMapping;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 13, 13);
    texture.anisotropy = 16;

    const geometry = new THREE.PlaneBufferGeometry(75,30,2,1);
    const material = new THREE.MeshLambertMaterial({map: texture});
    material.side = THREE.DoubleSide;
    Mesh = new THREE.Mesh(geometry, material);
    Mesh.rotation.x = -0.5 * Math.PI;
    Mesh.position.x = 0.5;
    Mesh.position.y = -2.04;
    Mesh.receiveShadow = true;
    scene.add(Mesh);
    Mesh.rotation.z = 0.01;
    

    createRoad();
} 


function createRoad(){
    const texture = textureLoader.load( 'textures/Road_new.jpg')
    texture.encoding = THREE.sRGBEncoding;    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 8);
    texture.anisotropy = 16; 

    const roadGeo = new THREE.BoxBufferGeometry(8,0.1,75);
    const roadMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh.receiveShadow = true;
    Mesh = new THREE.Mesh(roadGeo, roadMat);
    
    Mesh.position.set(0.4 ,-2 , -0.2)
    Mesh.rotation.y = 4.72;
    scene.add(Mesh);
    roadYReflectors();
    const firstGReflector = roadGReflectors();
    const secondGReflector = roadGReflectors();
    secondGReflector.position.z = -6.9;
    scene.add(firstGReflector, secondGReflector);
}

function roadYReflectors(){
    const firstYReflector = reflectorY();
    firstYReflector.position.set(37.5, -2.0,-0.5);
    scene.add(firstYReflector);

    const secondYReflector = reflectorY();
    secondYReflector.position.set(28.5, -2.0, -0.5);
    scene.add(secondYReflector);

    const thirdYReflector = reflectorY();
    thirdYReflector.position.set(19.5, -2.0, -0.4);
    scene.add(thirdYReflector);

    const fourthYReflector = reflectorY();
    fourthYReflector.position.set(10.0, -2.0, -0.4);
    scene.add(fourthYReflector);

    const fithYReflector = reflectorY();
    fithYReflector.position.set(0.5, -2.0, -0.27);
    scene.add(fithYReflector);

    const sixthYRefelctor = reflectorY();
    sixthYRefelctor.position.set(-8.8, -2.0, -0.27);
    scene.add(sixthYRefelctor);

    const seventhYReflector = reflectorY();
    seventhYReflector.position.set(-18.2, -2.0, -0.27);
    scene.add(seventhYReflector);

    const eigthYReflectotr = reflectorY();
    eigthYReflectotr.position.set(-28, -2.0, -0.20);
    scene.add(eigthYReflectotr);
}

function roadGReflectors(){
  const greenRefGroup = new THREE.Group;
  const firstYReflector = reflectorG();
  firstYReflector.position.set(37.5, -2.0, 2.95);
  greenRefGroup.add(firstYReflector);

  const secondYReflector = reflectorG();
  secondYReflector.position.set(28.5, -2.0, 2.98);
  greenRefGroup.add(secondYReflector);

  const thirdYReflector = reflectorG();
  thirdYReflector.position.set(19.5, -2.0, 3.1);
  greenRefGroup.add(thirdYReflector);

  const fourthYReflector = reflectorG();
  fourthYReflector.position.set(10.0, -2.0, 3.15);
  greenRefGroup.add(fourthYReflector);

  const fithYReflector = reflectorG();
  fithYReflector.position.set(0.5, -2.0, 3.2);
  greenRefGroup.add(fithYReflector);

  const sixthYRefelctor = reflectorG();
  sixthYRefelctor.position.set(-8.8, -2.0, 3.3);
  greenRefGroup.add(sixthYRefelctor);

  const seventhYReflector = reflectorG();
  seventhYReflector.position.set(-18.2, -2.0, 3.4);
  greenRefGroup.add(seventhYReflector);

  const eigthYReflectotr = reflectorG();
  eigthYReflectotr.position.set(-28, -2.0, 3.5);
  greenRefGroup.add(eigthYReflectotr);

  return greenRefGroup;
}

function reflectorY(){
    reflectorGeo = new THREE.SphereBufferGeometry(0.1, 30,0.1 , 15, 2* Math.PI, 0 ,0.5  * Math.PI);
    reflectorMat = new THREE.MeshPhongMaterial( {color: "yellow"} );
    var reflector = new THREE.Mesh( reflectorGeo, reflectorMat);
    reflector.castShadow = true;
    return reflector;
}


function reflectorG(){
  reflectorGeo = new THREE.SphereBufferGeometry(0.1, 30,0.1 , 15, 2* Math.PI, 0 ,0.5  * Math.PI);
  reflectorMat = new THREE.MeshPhongMaterial( {color: "lightgreen"} );
  var reflector = new THREE.Mesh( reflectorGeo, reflectorMat);
  reflector.castShadow = true;
  return reflector;
}
function truckHead(){
    const head = new THREE.Group;
    const texture = textureLoader.load( 'textures/red_what.jpg' );

    // set the "color space" of the texture
    texture.encoding = THREE.sRGBEncoding;

    // reduce blurring at glancing angles
    texture.anisotropy = 16; 
  
    const truckDoorSectionGeo = new THREE.BoxBufferGeometry(4,4,5.8);
    const truckDoorSectionMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh = new THREE.Mesh(truckDoorSectionGeo, truckDoorSectionMat);
    Mesh.position.set(0 ,-0.435 , -6.7)
    Mesh.castShadow = true;
    head.add(Mesh);

    const truckDoorSecTopGeo = new THREE.BoxBufferGeometry(4,0.35,4.5);
    const truckDoorSecTopMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh = new THREE.Mesh(truckDoorSecTopGeo, truckDoorSecTopMat);
    Mesh.position.set(0 ,4.3 , -7.4)
    Mesh.castShadow = true;
    head.add(Mesh);

    

    const backHeadGeo = new THREE.BoxBufferGeometry(7,7.5 ,3.5);
    const backHeadMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh = new THREE.Mesh(backHeadGeo, backHeadMat);
    Mesh.position.set(0 , 2 , -11.0)
    Mesh.castShadow = true;
    head.add(Mesh);
    
    const rightPillarGeo = new THREE.BoxBufferGeometry(0.25, 3.5, 0.25);
    const rightPillarMat = new THREE.MeshLambertMaterial( {map: texture});
    Mesh = new THREE.Mesh(rightPillarGeo, rightPillarMat);
    Mesh.position.set(1.8, 2.8 , -4.6);
    Mesh.rotation.x = -0.4;
    Mesh.castShadow = true;
    head.add(Mesh);

    const leftPillarGeo = new THREE.BoxBufferGeometry(0.25, 3.5, 0.25);
    const leftPillarMat = new THREE.MeshLambertMaterial( {map: texture});
    Mesh = new THREE.Mesh(leftPillarGeo, leftPillarMat);
    Mesh.position.set(-1.8, 2.8 , -4.6);
    Mesh.rotation.x = -0.4;
    Mesh.castShadow = true;
    head.add(Mesh);

    const truckNoseGeo = new THREE.BoxBufferGeometry( 4, 3, 6.9 );
    const truckNoseMat= new THREE.MeshStandardMaterial( {map: texture } );
    Mesh = new THREE.Mesh(truckNoseGeo , truckNoseMat );
    Mesh.position.z = - 0.39;
    Mesh.castShadow = true;
    head.add( Mesh );

    const sidePanelFrontGeo = new THREE.BoxBufferGeometry(8,3.5, 1);
    const sidePanelFrontMat = new THREE.MeshLambertMaterial({map: texture});
    Mesh = new THREE.Mesh(sidePanelFrontGeo,  sidePanelFrontMat);
    Mesh.position.set(0 ,-2.22, 2.6);
    Mesh.castShadow = true;
    head.add(Mesh);

    const wheelArcGeo = new THREE.BoxBufferGeometry(8, 0.25, 4.9);
    const wheelArcMat = new THREE.MeshLambertMaterial({map: texture});
    Mesh = new THREE.Mesh(wheelArcGeo, wheelArcMat );
    Mesh.position.set(0 ,-0.6 , -0.1);
    Mesh.castShadow = true;
    head.add(Mesh);

    const sidePanelBackGeo = new THREE.BoxBufferGeometry(8,3.5, 2);
    const sidePanelBackMat = new THREE.MeshLambertMaterial({map: texture});
    Mesh = new THREE.Mesh(sidePanelBackGeo,  sidePanelBackMat);
    Mesh.position.set(0 ,-2.22, -3.5);
    Mesh.castShadow = true;
    head.add(Mesh);

    const grillTexture = textureLoader.load( 'textures/truckfront-grill.jpg' );

    // set the "color space" of the texture
    grillTexture.encoding = THREE.sRGBEncoding;

    // reduce blurring at glancing angles
    grillTexture.anisotropy = 16; 
    
    const truckFrontGrillInGeo = new THREE.BoxBufferGeometry (3.5, 3.1 , 0.25);
    const truckFrontGrillInMat = new THREE.MeshStandardMaterial({map: grillTexture});
    Mesh = new THREE.Mesh(truckFrontGrillInGeo, truckFrontGrillInMat);
    Mesh.position.set(0, -0.36,3.22);
    Mesh.castShadow = true;
    head.add(Mesh);

    const chromeHeadbits = chromebits();
    
    const frontLightRight = truckLights();
    const frontLightLeft = truckLights();
    frontLightLeft.position.x= -3;
    head.add(frontLightLeft, frontLightRight, chromeHeadbits);

    return head;
}

function chromebits(){
    const chromeHead = new THREE.Group;
    const texture1 = textureLoader.load( 'textures/wheeltexture.jpg' );
    const texture2 = textureLoader.load( 'textures/stainless_perforat.jpg')
    
    texture1.encoding = THREE.sRGBEncoding;
    texture2.encoding = THREE.sRGBEncoding;
    
    
    texture1.anisotropy = 16; 
    texture2.anisotropy = 16;
     

    const truckStepsGeo = new THREE.BoxBufferGeometry(6,1.5, 3);
    const truckStepsMat = new THREE.MeshStandardMaterial({map: texture2});
    Mesh = new THREE.Mesh(truckStepsGeo, truckStepsMat);
    Mesh.position.set(0 ,-2.5 , -6.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const underStepsGeo = new THREE.BoxBufferGeometry(8,0.25, 3);
    const underStepsMat = new THREE.MeshStandardMaterial({map: texture2});
    Mesh = new THREE.Mesh(underStepsGeo, underStepsMat);
    Mesh.position.set(0 ,-3.4 , -6.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const petrolTankRightGeo = new THREE.CylinderBufferGeometry(1.2 ,1.2 ,3.2 , 20);
    const petrolTankRightMat = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(petrolTankRightGeo, petrolTankRightMat);
    Mesh.position.set(3 ,-2.3 , -10.2);
    Mesh.castShadow = true;
    Mesh.rotation.x = 4.740;
    chromeHead.add(Mesh);

    const petrolTankLeftGeo = new THREE.CylinderBufferGeometry(1.2 ,1.2 ,3.2 , 20);
    const petrolTankLeftMat = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(petrolTankLeftGeo, petrolTankLeftMat);
    Mesh.position.set(-3 ,-2.3 , -10.2);
    Mesh.castShadow = true;
    Mesh.rotation.x = 4.740;
    chromeHead.add(Mesh);

    const exhaustPipeRightGeo = new THREE.CylinderBufferGeometry(1.2 , 1.2, 5.9 , 20);
    const exhaustPipeRightMat  = new THREE.MeshStandardMaterial({map: texture2});
    Mesh = new THREE.Mesh(exhaustPipeRightGeo, exhaustPipeRightMat );
    Mesh.position.set(3 ,3 , -10.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const innerExhaustPipeRightGeo = new THREE.CylinderBufferGeometry(0.4 , 0.4, 5.9 , 20);
    const innerExhaustPipeRightMat  = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(innerExhaustPipeRightGeo, innerExhaustPipeRightMat );
    Mesh.position.set(3.5 ,5 , -10.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const innerExhaustPipeLeftGeo = new THREE.CylinderBufferGeometry(0.4 , 0.4, 5.9 , 20);
    const innerExhaustPipeLeftMat  = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(innerExhaustPipeLeftGeo, innerExhaustPipeLeftMat );
    Mesh.position.set(-3.5 ,5 , -10.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const exhaustPipeLeftGeo = new THREE.CylinderBufferGeometry(1.2 , 1.2, 5.9 , 20);
    const exhaustPipeLeftMat  = new THREE.MeshStandardMaterial({map: texture2});
    Mesh = new THREE.Mesh(exhaustPipeLeftGeo, exhaustPipeLeftMat );
    Mesh.position.set(-3 ,3 , -10.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    const truckFrontGrillOutGeo = new THREE.BoxBufferGeometry (4, 3.6 , 0.25);
    const truckFrontGrillOutMat = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(truckFrontGrillOutGeo, truckFrontGrillOutMat);
    Mesh.position.set(0, -0.36,3.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);


    const bottomGrillGeo = new THREE.BoxBufferGeometry (8.5 ,1.3 ,0.25);
    const bottomGrillMat = new THREE.MeshStandardMaterial({map: texture1});
    Mesh = new THREE.Mesh(bottomGrillGeo, bottomGrillMat);
    Mesh.position.set(0 ,-3 , 3.2);
    Mesh.castShadow = true;
    chromeHead.add(Mesh);

    return chromeHead;
}

function truckLights(){
    const texture = textureLoader.load( 'textures/8584.jpg' );
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
    
    
    const frontLightGeo =  new THREE.CylinderBufferGeometry(0.5 , 0.5, 0.25 , 20);
    const frontLightMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh = new THREE.Mesh(frontLightGeo, frontLightMat);
    Mesh.position.set(3 , -1.3 , 3.2);
    Mesh.rotation.x =4.72;
    
    return Mesh;
}


function createTrailer(){
    const trailer = new THREE.Group;
    
    const trailerbucket =  trailerBucket();
    const trailerchessi = trailerChessi();
    trailer.add(trailerbucket,trailerchessi);
    trailer.position.set(14,0 ,-22);
    
    return trailer;
}

function trailerChessi(){
    const trailerChessiObject = new THREE.Group;

    const mainBodyGeo = new THREE.BoxBufferGeometry( 3.5, 3, 15 );
    const mainBodyMat= new THREE.MeshStandardMaterial( {color: "black" } );
    Mesh = new THREE.Mesh(mainBodyGeo, mainBodyMat);
    Mesh.position.set(-14,-2.4,-10.2);
    trailerChessiObject.add( Mesh );

    const backFirstWheelAxelGeo = new THREE.CylinderBufferGeometry(0.5 , 0.5, 9.2 , 20);
    const backFirstWheelAxelMat  = new THREE.MeshStandardMaterial({color: "gray"});
    Mesh = new THREE.Mesh(backFirstWheelAxelGeo, backFirstWheelAxelMat);
    Mesh.position.set(-14,-3.2 , -15.3);
    Mesh.rotation.z =4.72;
    trailerChessiObject.add(Mesh);

    const backSecondWheelAxelGeo = new THREE.CylinderBufferGeometry(0.5 , 0.5, 9.2 , 20);
    const backSecondWheelAxelMat  = new THREE.MeshStandardMaterial({color: "gray"});
    Mesh = new THREE.Mesh(backSecondWheelAxelGeo, backSecondWheelAxelMat);
    Mesh.position.set(-14,-3.2 , -6.3);
    Mesh.rotation.z =4.72;
    trailerChessiObject.add(Mesh);

    backWheels = trailerWheels();
    backWheels.position.set(-14, 0, 6);
    trailerChessiObject.add(backWheels);

    frontWheels = trailerWheels();
    frontWheels.position.set(-14,0, 15);
    trailerChessiObject.add(backWheels, frontWheels);

    return trailerChessiObject;
}

function trailerWheels(){

  const trailerAllWheel = new THREE.Group;
  
  const backSecondRightWheelIn = truckWheel();
  backSecondRightWheelIn.position.set(-5.4, -3.2, -21.3);
  trailerAllWheel.add(backSecondRightWheelIn);

  const backSecondRightWheelOut = truckWheel();
  backSecondRightWheelOut.position.set(-4, -3.2, -21.3);
  trailerAllWheel.add(backSecondRightWheelOut);
  
  const backSecondLeftWheelIn = truckWheel();
  backSecondLeftWheelIn.position.set(-10.6, -3.2, -21.3);
  trailerAllWheel.add(backSecondLeftWheelIn);

  const backSecondLeftWheelOut = truckWheel();
  backSecondLeftWheelOut.position.set(-12, -3.2, -21.3);
  trailerAllWheel.add(backSecondLeftWheelOut);

  return trailerAllWheel;
}

function trailerBucket(){
  const texture = textureLoader.load( 'textures/wholebg.jpg' );
  
  texture.encoding = THREE.sRGBEncoding;
  
  texture.anisotropy = 16;

  const trailerObject = new THREE.Group;

  const bottomSheetGeo = new THREE.BoxBufferGeometry(8, 0.25, 22);
  const bottomSheetMat = new THREE.MeshLambertMaterial({map: texture});
  Mesh = new THREE.Mesh(bottomSheetGeo, bottomSheetMat );
  Mesh.position.set(-14 ,-0.78 , -8.0);
  trailerObject.add(Mesh);

  const sideLeftGeo = new THREE.BoxBufferGeometry(0.25, 4, 22);
  const sideLeftMat = new THREE.MeshLambertMaterial({map: texture});
  Mesh = new THREE.Mesh(sideLeftGeo, sideLeftMat);
  Mesh.position.set(-18 ,1 , -8.0);
  trailerObject.add(Mesh);

  const sideRigtGeo = new THREE.BoxBufferGeometry(0.25, 4, 22);
  const sideRightMat = new THREE.MeshLambertMaterial({map: texture});
  Mesh = new THREE.Mesh(sideRigtGeo, sideRightMat);
  Mesh.position.set(-10 ,1 , -8.0);
  trailerObject.add(Mesh);

  const backSheetGeo = new THREE.BoxBufferGeometry(8, 4, 0.25);
  const backSheetMat = new THREE.MeshLambertMaterial({map: texture});
  Mesh = new THREE.Mesh(backSheetGeo, backSheetMat );
  Mesh.position.set(-14 ,1 , -18.8);
  trailerObject.add(Mesh);

  const frontPanelGeo = new THREE.BoxBufferGeometry(8, 4, 0.25);
  const frontPanelMat = new THREE.MeshLambertMaterial({map: texture});
  Mesh = new THREE.Mesh(frontPanelGeo, frontPanelMat);
  Mesh.position.set(-14 ,1 , 2.8);
  trailerObject.add(Mesh);

  return trailerObject;
}

function chessiBody(){
    const chessi = new THREE.Group;

    const mainBodyGeo = new THREE.BoxBufferGeometry( 3.5, 3, 25 );
    const mainBodyMat= new THREE.MeshStandardMaterial( {color: "black" } );
    Mesh = new THREE.Mesh(mainBodyGeo, mainBodyMat);
    Mesh.position.set(0,-2.4,-10.2);
    chessi.add( Mesh );

    const frontWheelAxeltGeo = new THREE.CylinderBufferGeometry(0.5 , 0.5, 6.9 , 20);
    const frontWheelAxelMat  = new THREE.MeshStandardMaterial({color: "gray"});
    Mesh = new THREE.Mesh(frontWheelAxeltGeo,frontWheelAxelMat);
    Mesh.position.set(0,-3.2 , -0.3);
    Mesh.rotation.z =4.72;
    chessi.add(Mesh);

    const backFirstWheelAxelGeo = new THREE.CylinderBufferGeometry(0.5 , 0.5, 9.2 , 20);
    const backFirstWheelAxelMat  = new THREE.MeshStandardMaterial({color: "gray"});
    Mesh = new THREE.Mesh(backFirstWheelAxelGeo, backFirstWheelAxelMat);
    Mesh.position.set(0,-3.2 , -16.3);
    Mesh.rotation.z =4.72;
    chessi.add(Mesh);

    const backSecondWheelAxelGeo = new THREE.CylinderBufferGeometry(0.5 , 0.5, 9.2 , 20);
    const backSecondWheelAxelMat  = new THREE.MeshStandardMaterial({color: "gray"});
    Mesh = new THREE.Mesh(backSecondWheelAxelGeo, backSecondWheelAxelMat);
    Mesh.position.set(0,-3.2 , -21.3);
    Mesh.rotation.z =4.72;
    chessi.add(Mesh);

    return chessi;
}

function truckChessi(){
    const truckWheels = new THREE.Group;

    const frontRightWheel = truckWheel();
    frontRightWheel.position.set(-5, -3.2, -0.3);
    truckWheels.add(frontRightWheel);

    const frontLeftWheel = truckWheel();
    frontLeftWheel.position.set(-11, -3.2, -0.3);
    truckWheels.add(frontLeftWheel);

    const firstBackWheels = new trailerWheels();
    
    const secondBackWheels = new trailerWheels();
    secondBackWheels.position.set(0,0,5);
    truckWheels.add(firstBackWheels, secondBackWheels);

    return truckWheels;
    
}

function truckWheel(){

    const texture = textureLoader.load( 'textures/wheeltexture.jpg' );
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16; 
    const wheel = new THREE.Group; 
    const wheelRimGeo = new THREE.CylinderBufferGeometry(1 ,1 ,0.6 , 20);
    const wheelRimMat = new THREE.MeshStandardMaterial({map: texture});
    Mesh = new THREE.Mesh(wheelRimGeo, wheelRimMat);
    Mesh.position.set(8 ,0 , 0)
    Mesh.rotation.x = 4.740;
    Mesh.rotation.z = 4.7;
    wheel.add(Mesh);


    var geometry = new THREE.TorusBufferGeometry(1.5, 0.6, 20, 30 );
    var material = new THREE.MeshStandardMaterial( { color: 0x000000 } );
    var torus = new THREE.Mesh( geometry, material );
    torus.position.x = 8;
    torus.rotation.y = 4.7;
    wheel.add( torus );
    
    
    
    return wheel;
}

function createTruck(){
    const ctruck = new THREE.Group;
    const head = truckHead();
    const chessiB =chessiBody();
    const chessiWheels = truckChessi();
    const trailer = createTrailer();
  
    ctruck.add(head, chessiB, chessiWheels, trailer);
    ctruck.position.set(27,-0.4,2);
    ctruck.scale.set(0.3,0.3,0.3);
    ctruck.rotation.y = 4.75;
    return ctruck;
}
// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();
