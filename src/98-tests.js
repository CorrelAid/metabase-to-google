/* exported dummyTest, argsTest */

/** Example function returning a constant value.
 * @return {number} - The constant 42.
 */
function dummyTest() {
  return 42;
}

/** Example function illustrating variable number of arguments.
 * @params {Array.<number>} args - Array for collecting all input.
 * @return {string} - Json representation of the inputs.
 */
function argsTest(...args) {
  return JSON.stringify(args);
}
