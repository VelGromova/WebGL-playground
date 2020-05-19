var vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;', // change to vec3 in order to make 3D - not 2D
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    ' fragColor = vertColor;',
    ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = 
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    ' gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');

var InitDemo = function () {
    console.log("this is working");

    var canvas = document.getElementById("game-surface");
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental WebGL');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support webGL:(');
    }

    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    // create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    };

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    };

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program', gl.getProgramInfoLog(program));
        return;
    };

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program', gl.getProgramInfoLog(program));
        return;
    };

    var triangleVertices = [
    //  X,   Y,   Z          R,   G,   B 

        // TOP
        -1.0, 1.0, -1.0,     0.54, 0.81, 0.94,
        -1.0, 1.0, 1.0,      0.54, 0.81, 0.94,
        1.0, 1.0, 1.0,       0.54, 0.81, 0.94,
        1.0, 1.0, -1.0,      0.54, 0.81, 0.94,

        // LEFT
        -1.0, 1.0, 1.0,      0.96, 0.76, 0.76,
        -1.0, -1.0, 1.0,     0.96, 0.76, 0.76,
        -1.0, -1.0, -1.0,    0.96, 0.76, 0.76,
        -1.0, 1.0, -1.0,     0.96, 0.76, 0.76,

        // RIGHT
        1.0, 1.0, 1.0,       0.13, 0.67, 0.8,
        1.0, -1.0, 1.0,      0.13, 0.67, 0.8,
        1.0, -1.0, -1.0,     0.13, 0.67, 0.8,
        1.0, 1.0, -1.0,      0.13, 0.67, 0.8,

        // FRONT
        1.0, 1.0, 1.0,       1.0, 0.88, 0.21,
        1.0, -1.0, 1.0,      1.0, 0.88, 0.21,
        -1.0, -1.0, 1.0,     1.0, 0.88, 0.21,
        -1.0, 1.0, 1.0,      1.0, 0.88, 0.21,

        // BACK
        1.0, 1.0, -1.0,      0.52, 0.52, 0.51,
        1.0, -1.0, -1.0,     0.52, 0.52, 0.51,
        -1.0, -1.0, -1.0,    0.52, 0.52, 0.51,
        -1.0, 1.0, -1.0,     0.52, 0.52, 0.51,

        // BOTTOM
        -1.0, -1.0, -1.0,    0.6, 0.47, 0.48,
        -1.0, -1.0, 1.0,     0.6, 0.47, 0.48,
        1.0, -1.0, 1.0,      0.6, 0.47, 0.48,
        1.0, -1.0, -1.0,     0.6, 0.47, 0.48,
    ];

    var boxIndices = [
        //Top
        0, 1, 2,
        0, 2, 3,

        //Left
        5, 4, 6,
        6, 4, 7,

        //Right
        8, 9, 10,
        8, 10, 11,

        //Front
        13, 12, 14,
        15, 14, 12,

        //Back
        16, 17, 18,
        16, 18, 19,

        //Bottom
        21, 20, 22,
        22, 20, 23,
    ];
    
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, //Attribute location
        3, //Number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        0 // offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, //Attribute location
        3, //Number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
    );
    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    //Tell openGL state machine which program should be active
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -7], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0, 0, 0, 0.05);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT); 
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};
