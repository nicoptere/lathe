import 'file-loader?name=[name].[ext]!./src/html/index.html';
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

function getMesh(){
    
    //create a 2D profile (x, y)
    let profile = [
        {x:0,   y:1},
        {x:.5,  y:0},
        {x:0,   y:-1},
    ]

    //perform the lathe
    let lathe = new Lathe(profile, 16)

    //create the geometry
    let g = new BufferGeometry()
    g.addAttribute("position", new BufferAttribute(lathe.vertices, 3, false))
    g.addAttribute("uv", new BufferAttribute(lathe.uvs, 2, true))
    g.addAttribute("normal", new BufferAttribute(lathe.normals, 3, true))
    g.setIndex(new Uint32BufferAttribute(lathe.indices, 1))

    return new Mesh(g, new ShaderMaterial({
        vertexShader: require("./src/glsl/quad_vs.glsl"),
        fragmentShader: require("./src/glsl/quad_fs.glsl"),
    }))
    
}


let mesh = getMesh()
scene.add(mesh)

function raf(){
    requestAnimationFrame(raf)
    mesh.rotateX( 0.01)
    mesh.rotateY( 0.02)
    renderer.render(scene, camera )
}
raf()

