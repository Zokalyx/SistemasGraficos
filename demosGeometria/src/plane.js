import * as THREE from 'three';

export function createPlane(width, height, widthSegments, heightSegments) {
    let geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i < heightSegments + 1; i++) {
        for (let j = 0; j < widthSegments + 1; j++) {
            positions.push(height * i / heightSegments - height / 2, 0, width * j / widthSegments - width / 2);
            normals.push(0, 1, 0);

            if (i !== heightSegments && j !== widthSegments) {
                const currentIndex = i * (widthSegments + 1) + j;
                let rightNeighbor = currentIndex + 1;
                const upperNeighbor = currentIndex + (widthSegments + 1);
                let diagonalNeighbor = upperNeighbor + 1;

                indices.push(currentIndex, rightNeighbor, diagonalNeighbor);
                indices.push(currentIndex, diagonalNeighbor, upperNeighbor);
            }
        }
    }


    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

    geometry.setIndex(indices);

    console.debug(geometry);
    return geometry;
}
