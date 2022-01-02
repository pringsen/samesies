const {SamesiesRelativeNumberComparator} = require("./samesies");
const Samesies = require("./samesies.js").Samesies;
const SamesiesNumberComparator = require("./samesies.js").SamesiesNumberComparator;

test('SamesiesNumberComparator No Result equal values', () => {
    let numberComparison = new SamesiesNumberComparator();
    expect(numberComparison.assert(1,1)).toBe(true);
    expect(numberComparison.examine(1,1)).toBe(null);
});

test('SamesiesNumberComparator Result non-equal values', () => {
    let numberComparison = new SamesiesNumberComparator();
    expect(numberComparison.assert(1,2)).toBe(false);
    expect(numberComparison.examine(1,2)).toEqual({"message": "Number value outside the given tolerance (0)", "referenceValue": 1, "value": 2});
});

test('SamesiesNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:10});
    expect(numberComparison.assert(5,1)).toBe(true);
    expect(numberComparison.examine(5,1)).toBe(null);
});

test('SamesiesNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:10});
    expect(numberComparison.assert(1,5)).toBe(true);
    expect(numberComparison.examine(1,5)).toBe(null);
});

test('SamesiesNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:2});
    expect(numberComparison.assert(5,1)).toBe(false);
    expect(numberComparison.examine(5,1)).toEqual({"message": "Number value outside the given tolerance (2)", "referenceValue": 5, "value": 1});
});

test('SamesiesNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:2});
    expect(numberComparison.assert(1,5)).toBe(false);
    expect(numberComparison.examine(1,5)).toEqual({"message": "Number value outside the given tolerance (2)", "referenceValue": 1, "value": 5});
});

test('SamesiesRelativeNumberComparator No Result equal values', () => {
    let numberComparison = new SamesiesRelativeNumberComparator();
    expect(numberComparison.assert(1,1)).toBe(true);
    expect(numberComparison.examine(1,1)).toBe(null);
});

test('SamesiesRelativeNumberComparator Result non-equal values', () => {
    let numberComparison = new SamesiesRelativeNumberComparator();
    expect(numberComparison.assert(100,102)).toBe(false);
    expect(numberComparison.examine(100,102)).toEqual({"message": "Number value outside the given tolerance (0)", "referenceValue": 100, "value": 102});
});

test('SamesiesRelativeNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,105)).toBe(true);
    expect(numberComparison.examine(100,105)).toBe(null);
});

test('SamesiesRelativeNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(105,100)).toBe(true);
    expect(numberComparison.examine(105,100)).toBe(null);
});

test('SamesiesRelativeNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,70)).toBe(false);
    expect(numberComparison.examine(100,70)).toEqual({"message": "Number value outside the given tolerance (0.1)", "referenceValue": 100, "value": 70});
});

test('SamesiesRelativeNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,150)).toBe(false);
    expect(numberComparison.examine(100,150)).toEqual({"message": "Number value outside the given tolerance (0.1)", "referenceValue": 100, "value": 150});
});

test('Samesies same object zeroconfig', () => {
    let samesies = new Samesies();

    let reference = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
    ]
    let values = reference

    expect(samesies.examine(reference,values)).toEqual(true);
});
test('Samesies different objects zeroconfig', () => {
    let samesies = new Samesies();

    let reference = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
    ]
    let values = [
        {key1: 33, key2: 21},
        {key1: 44, key2: 22},
    ]

    expect(samesies.examine(reference,values)).toEqual([{"compareField": "key1", "compareFieldValue": 33, "compareObject": {"key1": 33, "key2": 21}, "message": "Value not equal to reference value", "referenceField": "key1", "referenceFieldValue": 11, "referenceObject": {"key1": 11, "key2": 21}}, {"compareField": "key1", "compareFieldValue": 44, "compareObject": {"key1": 44, "key2": 22}, "message": "Value not equal to reference value", "referenceField": "key1", "referenceFieldValue": 12, "referenceObject": {"key1": 12, "key2": 22}}]);
});

test('Samesies reference size bigger', () => {
    let samesies = new Samesies();

    let reference = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
        {key1: 13, key2: 33},
    ]
    let values = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
    ]

    expect(samesies.examine(reference,values)).toEqual([{"compareField": null, "compareFieldValue": null, "compareObject": null, "message": "Reference object not found", "referenceField": null, "referenceFieldValue": null, "referenceObject": {"key1": 13, "key2": 33}}]);
});

test('Samesies other size bigger than reference', () => {
    let samesies = new Samesies();

    let reference = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
    ]
    let values = [
        {key1: 11, key2: 21},
        {key1: 12, key2: 22},
        {key1: 13, key2: 33},
    ]

    expect(samesies.examine(reference,values)).toEqual([{"compareField": null, "compareFieldValue": null, "compareObject": {"key1": 13, "key2": 33}, "message": "Compare object not found", "referenceField": null, "referenceFieldValue": null, "referenceObject": null}]);
});

