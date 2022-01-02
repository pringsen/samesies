function Result(referenceValue, value, message) {
    this.referenceValue = referenceValue;
    this.value = value;
    this.message = message;
}

function DeepResult(referenceObject, referenceField, compareObject, compareField, message) {
    this.referenceObject = referenceObject;
    this.referenceField = referenceField;
    this.referenceFieldValue = (referenceObject && referenceField)?referenceObject[referenceField]:null;
    this.compareObject = compareObject;
    this.compareField = compareField;
    this.compareFieldValue = (compareObject && compareField)?compareObject[compareField]:null;
    this.message = message;
}


class SamesiesComparator {
    constructor(options) {
        if (typeof options === "object") {
            this.options = options;
        } else {
            this.options = {};
        }

        this.message = "Value not equal to reference value";
    }

    assert(referenceValue, value) {
        return referenceValue === value;
    }

    examine(referenceValue, value) {
        if (!this.assert(referenceValue, value)) {
            return new Result(referenceValue, value, this.message);
        } else {
            return null;
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
    useDefaultComparator = true;
    primaryKey = null;

    comparatorList = [];
    defaultComparator = null;

    constructor(options) {
        if (typeof options === "object") {
            this.options = options;
        } else {
            this.options = {};
        }

        this.defaultComparator = new SamesiesComparator();

        if(this.options.hasOwnProperty('useDefaultComparator')) {
            this.defaultComparator = this.options.hasOwnProperty('useDefaultComparator');
        }
    }

    addComparator(referenceField, valueField, comparator){
        this.comparatorList.push({
            referenceField:referenceField,
            valueField:valueField,
            comparator:comparator
        });
    }

    examine(referenceObjects, compareObjects) {
        let result = [];

        for (let itemNumber = 0; itemNumber < Math.max(referenceObjects.length, compareObjects.length); itemNumber++) {

            let referenceObject = referenceObjects[itemNumber];
            let compareObject = compareObjects[itemNumber];

            if (!referenceObject) {
                result.push(new DeepResult(null,null, compareObject, null, "Compare object not found"));
            } else if (!compareObject) {
                result.push(new DeepResult(referenceObject,null, null, null, "Reference object not found"));
            } else {
                Object.keys(referenceObject).forEach(key => {
                    let compareResult = true;

                    if(this.comparatorList.hasOwnProperty(key)) {
                        compareResult = this.comparatorList[key].examine(referenceObject[key], compareObject[key]);
                    } else if (this.useDefaultComparator === true) {
                        compareResult = this.defaultComparator.examine(referenceObject[key], compareObject[key]);
                    }

                    if(compareResult !== null) {
                        result.push(new DeepResult(referenceObject,key, compareObject, key, compareResult.message));
                    }
                })
            }
        }

        if(result.length > 0) {
            return result;
        } else {
            return true;
        }
    }
}

module.exports = {
    Samesies: Samesies,
    SamesiesNumberComparator: SamesiesNumberComparator,
    SamesiesRelativeNumberComparator: SamesiesRelativeNumberComparator,
}

