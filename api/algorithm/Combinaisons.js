module.exports = {
    /**
     * @return {number}
     */
    Generator() {
        return Math.ceil(Math.random() * 6);
    },

    LanceChouettes() {
        return {
            chouette1: this.Generator(),
            chouette2: this.Generator()
        };
    },

    LanceCul() {
        return this.Generator();
    },

    Calc(C1, C2, C3) {
        if (this.CulDeChouette(C1, C2, C3)) {
            return {
                combinaison: 'CUL_DE_CHOUETTE',
                score: 40 + C1 * 10
            };
        } else if (this.Velute(C1, C2, C3)) {
            return {
                combinaison: 'VELUTE',
                score: 2 * (Math.max(C1, C2, C3)) * (Math.max(C1, C2, C3))
            };
        } else if (this.Chouette(C1, C2, C3)) {
            return {
                combinaison: 'CHOUETTE',
                score: C1 === C2 ? C1*C1 : C3*C3
            };
        }
        return {
            combinaison: 'NEANT',
            score: 0
        }
    },

    /**
     * @return {boolean}
     */
    Chouette(C1, C2, C3) {
        return C1 === C2 || C1 === C3 || C2 === C3;
    },

    /**
     * @return {boolean}
     */
    Velute(C1, C2, C3) {
        return C1 + C2 === C3 || C1 + C3 === C2 || C2 + C3 === C1;
    },

    /**
     * @return {function(*, *, *): boolean}
     */
    ChouetteVelute() {
        return Chouette && Velute;
    },

    /**
     * @return {boolean}
     */
    CulDeChouette(C1, C2, C3) {
        return C1 === C2 === C3;
    },

    /**
     * @return {boolean}
     */
    Suite(C1, C2, C3) {
        return C1 === C2 - 1 === C3 - 2 || C1 === C3 - 1 === C2 - 2 || C2 === C3 - 1 === C1 - 2 || C2 === C1 - 1 === C3 - 2 || C3 === C1 - 1 === C2 - 2 || C3 === C2 - 1 === C1 - 2;
    },

    /**
     * @return {boolean}
     */
    Neant() {
        return !Chouette && !Velute && !ChouetteVelute && !CulDeChouette && !Suite;
    }

};