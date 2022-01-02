const {SamesiesRelativeNumberComparator} = require("./samesies");
const Samesies = require("./samesies.js").Samesies;
const SamesiesNumberComparator = require("./samesies.js").SamesiesNumberComparator;

test('SamesiesNumberComparator No Result equal values', () => {
    let numberComparison = new SamesiesNumberComparator();
    expect(numberComparison.assert(1,1)).toBe(true);
    expect(numberComparison.compare(1,1)).toBe(true);
});

test('SamesiesNumberComparator Result non-equal values', () => {
    let numberComparison = new SamesiesNumberComparator();
    expect(numberComparison.assert(1,2)).toBe(false);
    expect(numberComparison.compare(1,2)).toEqual({"message": "Number value outside the given tolerance (0)", "referenceValue": 1, "value": 2});
});

test('SamesiesNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:10});
    expect(numberComparison.assert(5,1)).toBe(true);
    expect(numberComparison.compare(5,1)).toBe(true);
});

test('SamesiesNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:10});
    expect(numberComparison.assert(1,5)).toBe(true);
    expect(numberComparison.compare(1,5)).toBe(true);
});

test('SamesiesNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:2});
    expect(numberComparison.assert(5,1)).toBe(false);
    expect(numberComparison.compare(5,1)).toEqual({"message": "Number value outside the given tolerance (2)", "referenceValue": 5, "value": 1});
});

test('SamesiesNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesNumberComparator({tolerance:2});
    expect(numberComparison.assert(1,5)).toBe(false);
    expect(numberComparison.compare(1,5)).toEqual({"message": "Number value outside the given tolerance (2)", "referenceValue": 1, "value": 5});
});

test('SamesiesRelativeNumberComparator No Result equal values', () => {
    let numberComparison = new SamesiesRelativeNumberComparator();
    expect(numberComparison.assert(1,1)).toBe(true);
    expect(numberComparison.compare(1,1)).toBe(true);
});

test('SamesiesRelativeNumberComparator Result non-equal values', () => {
    let numberComparison = new SamesiesRelativeNumberComparator();
    expect(numberComparison.assert(100,102)).toBe(false);
    expect(numberComparison.compare(100,102)).toEqual({"message": "Number value outside the given tolerance (0)", "referenceValue": 100, "value": 102});
});

test('SamesiesRelativeNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,105)).toBe(true);
    expect(numberComparison.compare(100,105)).toBe(true);
});

test('SamesiesRelativeNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(105,100)).toBe(true);
    expect(numberComparison.compare(105,100)).toBe(true);
});

test('SamesiesRelativeNumberComparator Negative difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,70)).toBe(false);
    expect(numberComparison.compare(100,70)).toEqual({"message": "Number value outside the given tolerance (0.1)", "referenceValue": 100, "value": 70});
});

test('SamesiesRelativeNumberComparator Positive difference outside tolerance', () => {
    let numberComparison = new SamesiesRelativeNumberComparator({tolerance:0.1});
    expect(numberComparison.assert(100,150)).toBe(false);
    expect(numberComparison.compare(100,150)).toEqual({"message": "Number value outside the given tolerance (0.1)", "referenceValue": 100, "value": 150});
});


