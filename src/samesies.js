function Result(referenceValue, value, message) {
    this.referenceValue = referenceValue;
    this.value = value;
    this.message = message;
}

class SamesiesComparator {
    constructor(options) {
        if (typeof options === "object") {
            this.options = options;
        } else {
            this.options = {};
        }
    }

    #assert(referenceValue, value) {
        console.error("Missing implementation of #assert.");
        return false;
    }

    compare(referenceValue, value) {
        if (this.assert(referenceValue, value)) {
            return true;
        } else {
            return new Result(referenceValue, value, this.message);
        }
    }
}

class SamesiesNumberComparator extends SamesiesComparator {
    tolerance = 0;

    constructor(options) {
        super(options);

        if(this.options.hasOwnProperty('tolerance')) {
            this.tolerance = this.options.tolerance;
        }

        this.message = "Number value outside the given tolerance (" + this.tolerance + ")";
    }

    assert(referenceValue, value) {
        return Math.abs(referenceValue-value) <= this.tolerance;
    }
}

class SamesiesRelativeNumberComparator extends SamesiesNumberComparator {
    assert(referenceValue, value) {
        return Math.abs(1- (referenceValue/value)) <= this.tolerance;
    }
}

class Samesies {
    primaryKey = null;
}

module.exports = {
    Samesies: Samesies,
    SamesiesNumberComparator: SamesiesNumberComparator,
    SamesiesRelativeNumberComparator: SamesiesRelativeNumberComparator,
}

