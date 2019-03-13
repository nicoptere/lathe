import 'file-loader?name=[name].[ext]!./src/html/multiple.html';
import {
    Scene,
    WebGLRenderer,
    Mesh,
    BufferGeometry,
    PerspectiveCamera,
    BufferAttribute,
    Uint32BufferAttribute,
    ShaderMaterial,
} from 'three';

/////////////////////////////////
import Lathe from "./src/Lathe"

// test scene
//////////////////////////////////////

let w = window.innerWidth
let h = window.innerHeight
const renderer = new WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
const scene = new Scene();
const camera = new PerspectiveCamera(60, w / h, 0.1, 1000);
camera.position.z = 5

//////////////////////////////////////

function getMesh(result){
    
    let g = new BufferGeometry()
    g.addAttribute("position", new BufferAttribute(result[0], 3, false))
    g.addAttribute("uv", new BufferAttribute(result[1], 2, true))
    g.addAttribute("normal", new BufferAttribute(result[2], 3, true))
    g.setIndex(new Uint32BufferAttribute(result[3], 1))

    return new Mesh(g, new ShaderMaterial({
        vertexShader: require("./src/glsl/quad_vs.glsl"),
        fragmentShader: require("./src/glsl/quad_fs.glsl"),
    }))
    
}

//perform the lathe
let lathe = new Lathe()
let meshes = []
let RAD = Math.PI / 180
for( let i = 0; i< 4; i++){

    for( let j = 0; j< 4; j++){
        
        let profile = []

        let step = RAD * (i + 1) * 20;
        for( let k = 0; k <= Math.PI; k+= step ){
            let r = Math.sin( k ) * .5
            profile.push( {
                x:Math.sin( k ) * r,
                y:Math.cos( k ) * r,
            })
        }

        let result = lathe.compute( profile, 3 * (j+1))

        let mesh = getMesh(result)
        mesh.position.x = i - 2 + .5;
        mesh.position.y = 4 - j - 2 - .5;
        scene.add(mesh)
        meshes.push( mesh )

    }
    
}

function raf(){
    requestAnimationFrame(raf)
    meshes.forEach((mesh)=>{
        mesh.rotateX( 0.01)
        mesh.rotateY( 0.02)
    })
    renderer.render(scene, camera )
}
raf()

