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
    usePrimaryKey = false;
    primaryKeyReference = null;
    primaryKeyCompare = null;

    comparatorList = [];
    defaultComparator = null;

    constructor(options) {
        if (typeof options === "object") {
            this.options = options;
        } else {
            this.options = {};
        }

        this.defaultComparator = new SamesiesComparator();

        if(this.options.hasOwnProperty('primaryKey')) {
            this.usePrimaryKey = true;

            if(typeof this.options.primaryKey === 'string') {
                this.primaryKeyReference = this.primaryKeyCompare = this.options.primaryKey;
            } else {
                if(this.options.primaryKey.hasOwnProperty('reference')) {
                    this.primaryKeyReference = this.options.primaryKey;
                }
                if(this.options.primaryKey.hasOwnProperty('compare')) {
                    this.primaryKeyCompare = this.options.primaryKey;
                }
            }
        }

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

    examineElement(referenceObject, compareObject) {
        let result = [];
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
        return result;
    }

    examine(referenceObjects, compareObjects) {
        let result = [];

        let referenceObjectsKeys = new Set();
        let referenceObjectsDuplicateKeys = new Set();
        let compareObjectsKeys = new Set();
        let compareObjectsDuplicateKeys = new Set();

        let compareObjectsMapped = {};

        // Build up keys
        if(this.usePrimaryKey) {
            referenceObjects.forEach(item => {
                if(!referenceObjectsKeys.has(item[this.primaryKeyReference])) {
                    referenceObjectsKeys.add(item[this.primaryKeyReference]);
                } else {
                    result.push(new DeepResult(item,this.primaryKeyReference, null, null, "Duplicate primary key in reference list"));
                    referenceObjectsDuplicateKeys.add(item[this.primaryKeyReference]);
                }
            })
            compareObjects.forEach(item => {
                if(!compareObjectsKeys.has(item[this.primaryKeyCompare])) {
                    compareObjectsKeys.add(item[this.primaryKeyCompare]);

                    compareObjectsMapped[item[this.primaryKeyCompare]] = item;
                } else {
                    result.push(new DeepResult(null,null, item, this.primaryKeyCompare, "Duplicate primary key in compare list"));
                    compareObjectsDuplicateKeys.add(item[this.primaryKeyCompare]);
                }
            })
        }

        if (this.usePrimaryKey) {
            referenceObjects.forEach(referenceObject => {
                if(!referenceObjectsDuplicateKeys.has(referenceObject[this.primaryKeyReference])) {
                    if(compareObjectsKeys.has(referenceObject[this.primaryKeyReference])) {

                        let compareObject = compareObjectsMapped[referenceObject[this.primaryKeyReference]];

                        result = result.concat(this.examineElement(referenceObject, compareObject));
                        compareObjectsKeys.delete(compareObject[this.primaryKeyCompare]);
                    } else {
                        result.push(new DeepResult(referenceObject,this.primaryKeyReference, null, null, "Reference object not found"));
                    }
                }
            })
            compareObjectsKeys.forEach(primaryKey => {
                if(!referenceObjectsDuplicateKeys.has(primaryKey)) {
                    result.push(new DeepResult(null,null, compareObjectsMapped[primaryKey], this.primaryKeyCompare, "Compare object not found"));
                }
            });
        } else {
            // Compare all objects to each other
            for (let itemNumber = 0; itemNumber < Math.max(referenceObjects.length, compareObjects.length); itemNumber++) {

                let referenceObject = referenceObjects[itemNumber];
                let compareObject = compareObjects[itemNumber];

                if (!referenceObject) {
                    result.push(new DeepResult(null,null, compareObject, null, "Compare object not found"));
                } else if (!compareObject) {
                    result.push(new DeepResult(referenceObject,null, null, null, "Reference object not found"));
                } else {
                    result = result.concat(this.examineElement(referenceObject, compareObject));
                }
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

