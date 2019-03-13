varying vec3 vnormal;
void main(){

    gl_FragColor = vec4( (.5 + vnormal * .5) , 1.);

}