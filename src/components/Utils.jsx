export function timeAgo(timestamp) {
    const now = Math.floor(Date.now() / 1000); // convert to Unix timestamp format
    const secondsAgo = now - timestamp;

    if (secondsAgo < 60) {
        return secondsAgo + " secs ago";
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return minutesAgo + (minutesAgo > 1? " mins ago": " min ago");
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return hoursAgo + " hours ago";
    } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return daysAgo + " days ago";
    }
}