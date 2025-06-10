export default function formatTime(time, inc) {
    if (time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        const formattedTime =
            (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0') +
            (inc && inc > 0 ? ' |+' + inc : '');

        return formattedTime;
    } else {
        return '00:00';
    }
}
