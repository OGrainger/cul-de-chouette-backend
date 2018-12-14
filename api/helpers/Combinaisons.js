/**
 * @return {number}
 */
function Generator()
{
    return Math.random()*6;
}

function LanceChouettes(gameIsPossible){
    var chouette1, chouette2 = 0;
    if (gameIsPossible===true) {
        chouette1 = Generator();
        chouette2 = Generator();
    } else {
        return error;
    }
}

function LanceCul(gameIsPossible){
    var cul = 0;
    if (gameIsPossible === true){
        cul = Generator();
    }
    else {
        return error();
    }
}

/**
 * @return {boolean}
 */
function Chouette(C1, C2, C3){
    return C1 === C2 || C1 === C3 || C2 === C3;
}

/**
 * @return {boolean}
 */
function Velute(C1, C2, C3){
    return C1 + C2 === C3 || C1 + C3 === C2 || C2 + C3 === C1;
}

/**
 * @return {function(*, *, *): boolean}
 */
function ChouetteVelute(){
    return Chouette && Velute;
}

/**
 * @return {boolean}
 */
function CuldeChouette(C1, C2, C3){
    return C1 === C2 === C3;
}

/**
 * @return {boolean}
 */
function Suite(C1, C2, C3){
    return C1 === C2-1 === C3-2 || C1 === C3-1 === C2-2 || C2 === C3-1 === C1-2 || C2 === C1-1 === C3-2 || C3 === C1-1 === C2-2 || C3 === C2-1 === C1-2;
}

/**
 * @return {boolean}
 */
function Neant () {
    return !Chouette && !Velute && !ChouetteVelute && !CuldeChouette && !Suite;
}