import * as THREE from 'three';

export function createSphere(radius, radialSegments, heightSegments) {
    let geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i < heightSegments + 1; i++) {
        // Ángulo polar
        let theta = -Math.PI / 2 + Math.PI * i / heightSegments;

        for (let j = 0; j < radialSegments; j++) {
            // Ángulo azimutal
            let phi = 2 * Math.PI * j / radialSegments;

            // Coordenadas cilíndricas (como intermedio antes de cartesianas)
            let rho = radius * Math.cos(theta);
            let z = radius * Math.sin(theta);

            // Coordenadas cartesianas
            let x = rho * Math.cos(phi);
            let y = rho * Math.sin(phi);

            positions.push(x, -z, y);
            normals.push(x, -z, y);

            if (i !== heightSegments) {
                // Always except at the top
                const currentIndex = i * radialSegments + j;
                let rightNeighbor = currentIndex + 1;
                if (j === radialSegments - 1) {
                    rightNeighbor -= radialSegments;
                }
                const upperNeighbor = currentIndex + radialSegments;
                let diagonalNeighbor = upperNeighbor + 1;
                if (j === radialSegments - 1) {
                    diagonalNeighbor -= radialSegments;
                }

                indices.push(currentIndex, rightNeighbor, diagonalNeighbor);
                indices.push(currentIndex, diagonalNeighbor, upperNeighbor);
            }
        }
    }


    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

    geometry.setIndex(indices);

    return geometry;
}
