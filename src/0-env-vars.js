/** Get MB Session Token & Base URL from Script Environment.
 * Define @param token, @param url in > Project Settings > Script Properties
 */
/* exported token, baseUrl */
const scriptProperties = PropertiesService.getScriptProperties();
const token = scriptProperties.getProperty('token');
const baseUrl = scriptProperties.getProperty('url');
