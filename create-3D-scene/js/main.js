let camera;
let scene;
let renderer;

function init() {
    const stats = new initStats();

    /** Scene 객체
     * 렌더링할 모든 객체와 사용할 모든 광원을 저장하는데 쓰이는 컨테이너
     *  */
    scene = new THREE.Scene();

    // sphere 바운싱
    let step = 0;

    const controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    const gui = new dat.GUI();

    /** 카메라 정의
     * 장면을 렌더링 했을 때 어떻게 보여질 것인지 정의
     *  */
    camera = new THREE.PerspectiveCamera(
        45, // fov
        window.innerWidth / window.innerHeight, // aspect 
        0.1, // near
        1000 // far 
    );

    // 보조 축 추가
    // const axes = new THREE.AxesHelper(50);
    // scene.add(axes);

    /** renderer 정의
     * scene 객체가 camera객체의 각도에 따라 브라우제서 어떻게 보이는지
     * 산출하는 역할 담당
     * 
     * 장면을 렌더링 할 때 그래픽 카드를 사용하도록 WevGLRenderer 사용
     * 
     * 그림자의 렌더링은 컴퓨팅 파워가 많이 필요하기 때문에
     * Three.js 기본 설정으로 비활성화되어 있음
     * 그래서 활성화 해주는 작업을 해야함
     */
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 그림자 설정 활성화
    // 활성화를 한 후에는 각 객체에 명시적으로 그림자를 정의해줘야함
    renderer.shadowMapEnabled = true;

    /** Geometry 생성
     * 먼저 원하는 Geometry를 생성하고 각각 맞는 속성값을 설정
     * Material을 추가하여 색상이나 투명도 등을 설정
     * 
     * 이렇게 설정한 Geometry를 Mesh객체로 결합함
     * 
     * 이후 결합된 Mesh의 변수명으로 위치 등을 설정
     */

    const planeGeometry = new THREE.PlaneGeometry(60, 20); // 폭: 60, 높이: 20
    // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // 그림자 설정

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true; // 그림자 설정

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777FF, wireframe: true });
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777FF });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true; // 그림자 설정

    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    scene.add(sphere);

    // 카메라 위치 설정  
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position); // lookAt 메서드로 카메라의 방향 설정

    /** 물질과 광원, 그림자 추가
     * 광원을 추가해도 물질을 변경하지 않으면 아무런 변화가 없음
     * 빛의 영향을 받지 않는 MeshBasicMaterial에서 빛의 영향을 받는 것으로 변환해야함
    */
    const spotLight = new THREE.SpotLight(0xFF0000);

    // 그림자가 어느 광원에서 그릴지 정의해줘야해서 다음 코드 추가
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // spotLight 헬퍼
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    // const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    // scene.add(ambientLight);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "bouncingSpeed", 0, 0.5);

    renderScene();

    // 렌더링
    function renderScene() {
        stats.update();

        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;

        step += controls.bouncingSpeed; // 바운싱 속도
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    };

    function initStats() {
        // 통계치 초기화 함수
        let stats = new Stats();
        stats.setMode(0); // 0: 초당 프레임 수(fps) 측정, 1: 렌더링 시간 측정
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "0px";
        stats.domElement.style.top = "0px";
        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    };
};

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

window.addEventListener('resize', onResize, false);