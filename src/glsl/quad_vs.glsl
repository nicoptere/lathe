varying vec3 vnormal;

void main(){
    vnormal=normalMatrix * normal;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}