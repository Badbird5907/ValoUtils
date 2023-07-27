import moment from 'moment';
const formatUnixMillis = (millis?: number): string => {
    const date = moment(millis);
    return date.format("MM-DD-YYYY HH:mm:ss");
}
export default formatUnixMillis;