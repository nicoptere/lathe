import Vector from "./Vector"

export default class Lathe{
    
    constructor(profile=[], sides = 3) {

        sides = Math.max( sides, 3 )
        if( profile.length > 0 ){
            
            let res = this.compute( profile, sides );
            this.vertices = res[0]
            this.uvs = res[1]
            this.normals = res[2]
            this.indices = res[3]

        }

    }
    
    compute(profile = [], sides = 3) {
        
        sides = Math.max(sides, 3)
        
        let PL = profile.length
        let count = PL * sides;

        //utils (to compute uv.y )
        let minmax = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
        profile.forEach((v) => {
            minmax[0] = Math.min(v.y, minmax[0])
            minmax[1] = Math.max(v.y, minmax[1])
        })
        let profileHeight = minmax[1] - minmax[0]

        let step = Math.PI * 2 / sides;
        let pid, id, angle, radius, point;

        //compute vertices and uvs
        let vertices = new Float32Array(count * 3)
        let uvs = new Float32Array(count * 2)
        let normals = new Float32Array(count * 3)
        for (let i = 0; i < sides; i++) {

            //sets the slice angle
            angle = i * step;

            //transform each point
            for (let j = 0; j < PL; j++) {

                //gets the curren tpoint
                point = profile[j]
                radius = point.x;

                //this is the index in the destination buffers
                pid = (i * PL + j)

                //add a vertex
                id = pid * 3
                vertices[id++] = Math.cos(angle) * radius
                vertices[id++] = point.y
                vertices[id++] = Math.sin(angle) * radius

                //add uvs
                id = pid * 2
                uvs[id++] = i / sides
                uvs[id++] = 1 - (point.y - minmax[0]) / profileHeight;

                //add a zeroed normal
                id = pid * 3
                normals[id++] = 0
                normals[id++] = 0
                normals[id++] = 0
            }
        }

        // compute faces indices
        let indices = []
        let a = new Vector()
        let b = new Vector()
        let c = new Vector()
        let d = new Vector()
        let u = new Vector()
        let v = new Vector()
        let nx, ny, nz
        for (let i = 0; i < sides; i++) {

            for (let j = 0; j < PL - 1; j++) {

                let i0 = i * PL + j
                let i1 = ((i + 1) % sides) * PL + j
                let i2 = i1 + 1
                let i3 = i0 + 1
                indices.push(i0, i1, i2, i0, i2, i3)

                // retrieve the vertices values
                id = i0 * 3
                a.set(vertices[id++], vertices[id++], vertices[id++])

                id = i1 * 3
                b.set(vertices[id++], vertices[id++], vertices[id++])

                id = i2 * 3
                c.set(vertices[id++], vertices[id++], vertices[id++])

                id = i3 * 3
                d.set(vertices[id++], vertices[id++], vertices[id++])

                // face A

                //compute normal for triangle A-B-C
                u.copy(b).sub(a)
                v.copy(c).sub(a)
                nx = (u.y * v.z) - (u.z * v.y);
                ny = (u.z * v.x) - (u.x * v.z);
                nz = (u.x * v.y) - (u.y * v.x);


                //for each vertex of the face A
                //add the normal values to the normals buffer
                [i0, i1, i2].forEach((faceVertexId) => {
                    let id = faceVertexId * 3
                    normals[id++] += nx
                    normals[id++] += ny
                    normals[id++] += nz
                })


                // face B

                //compute normal for  triangle A-C-D
                u.copy(c).sub(a)
                v.copy(d).sub(a)
                nx = (u.y * v.z) - (u.z * v.y);
                ny = (u.z * v.x) - (u.x * v.z);
                nz = (u.x * v.y) - (u.y * v.x);


                //for each vertex of the face B
                //add the normal values to the normals buffer
                [i0, i2, i3].forEach((faceVertexId) => {
                    let id = faceVertexId * 3
                    normals[id++] += nx
                    normals[id++] += ny
                    normals[id++] += nz
                })

            }
        }

        // nomalize the normals accumulated for all the faces
        let n = new Vector()
        for (let i = 0; i < normals.length; i += 3) {
            n.x = normals[i]
            n.y = normals[i + 1]
            n.z = normals[i + 2]
            n.normalize()
            normals[i] = n.x
            normals[i + 1] = n.y
            normals[i + 2] = n.z
        }

        //compute normals
        return [vertices, uvs, normals, indices]

    }
}