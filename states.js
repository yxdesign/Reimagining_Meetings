// lip indices
const LIPS=[ 61, 146, 91, 181, 84, 17, 314, 405, 321, 375,291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,185, 40, 39, 37,0 ,267 ,269 ,270 ,409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78 ];
const LOWER_LIPS =[61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
const UPPER_LIPS=[ 185, 40, 39, 37,0 ,267 ,269 ,270 ,409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];
// Left eyes indices 
const LEFT_EYE =[ 362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385,384, 398 ];
// right eyes indices
const RIGHT_EYE=[ 33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161 , 246 ];

function CalculateStates(landmarks, blink_thresh=5.0, mouth_thresh=5.0){
    // blinks 
    // non-blink is around 2.5, blink is larger
    let l_blink = false;
    if(left_blink(landmarks) > blink_thresh)
        l_blink = true;
    let r_blink = false
    if (right_blink(landmarks) > blink_thresh)
        r_blink = true;
    
    // mouth open/close, open mouth is smaller value
    let mouth_value = mouth_open(landmarks)
    let mouth_state = false;
    if (mouth_value < mouth_thresh)
        mouth_state = true;

    // positions
    let positions = CalculatePositions(landmarks);

    return {
        'l_pos':positions.l_pos,
        'l_blink':l_blink,
        'r_pos':positions.r_pos,
        'r_blink':r_blink,
        'mouth_pos':positions.mouth_pos,
        'mouth':mouth_state,
        'mouth_val':mouth_value
        };
}

function CalculatePositions(landmarks){
    let l_pos = {
        'x':0,
        'y':0,
        'z':0
    }
    let r_pos = {
        'x':0,
        'y':0,
        'z':0
    }
    let mouth_pos = {
        'x':0,
        'y':0,
        'z':0
    }
    // left eye
    let left_eye = landmarks[LEFT_EYE[0]];
    l_pos.x = left_eye.x;
    l_pos.y = left_eye.y;
    l_pos.z = left_eye.z;
    // right eye
    let right_eye = landmarks[RIGHT_EYE[0]];
    r_pos.x = right_eye.x;
    r_pos.y = right_eye.y;
    r_pos.z = right_eye.z;
    // mouth
    let mouth = landmarks[LIPS[0]];
    mouth_pos.x = mouth.x;
    mouth_pos.y = mouth.y;
    mouth_pos.z = mouth.z;
    return {
        'l_pos':l_pos,
        'r_pos':r_pos,
        'mouth_pos':mouth_pos
    }
}

// EYES
function left_blink(landmarks){
    return blink_ratio(landmarks, LEFT_EYE);
}

function right_blink(landmarks){
    return blink_ratio(landmarks, RIGHT_EYE);
}

function blink_ratio(landmarks, eye){
    // horizontal
    const right = landmarks[eye[0]];
    const left = landmarks[eye[8]];
    // vertical
    const top = landmarks[eye[12]];
    const bottom = landmarks[eye[4]];
    
    return calc_ratio(top,bottom,left,right);
}

// MOUTH
function mouth_open(landmarks) {
    // horizontal
    const right = landmarks[LIPS[11]];
    const left = landmarks[LIPS[39]];
    // vertical
    const top = landmarks[LIPS[34]];
    const bottom = landmarks[LIPS[16]];

    return calc_ratio(top,bottom,left,right);
}

// RATIO
function calc_ratio(top,bottom,left,right){
    // distances
    let h_distance = distance(right, left);
    let v_distance = distance(top, bottom);
    // avoid div by zero
    if (v_distance == 0)
        v_distance = 0.01;
    
    return h_distance/v_distance;
}

// Euclidean distance 
function distance(start, end){
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;

    let dist = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    return dist;
}