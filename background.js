// for using as URL filters from event listener fo webRequest.onBeforeRequest
const patterns = [
    "https://duckduckgo.com/?q=define *",
    "https://duckduckgo.com/?q=define+*",
    "https://duckduckgo.com/?q=define%20*"
]

// for finding a match against the requested URL
const searchablePatterns = [
    "https://duckduckgo.com/?q=define ",
    "https://duckduckgo.com/?q=define+",
    "https://duckduckgo.com/?q=define%20"
]

const findMatchingPattern = url => {
    for (let i = 0; i < searchablePatterns.length; i++) {
        let pattern = searchablePatterns[i];
        if (url.indexOf(pattern) === 0) return i;
    }
}

const redirect = requestDetails => {
    const { url } = requestDetails;
    const indexOfPattern = findMatchingPattern(url);
    if (indexOfPattern === -1) {
        throw new Error("No matching pattern was found for the URL: " + url);
    }
    const pattern = patterns[indexOfPattern];
    const query = url.substring(url.indexOf(pattern) + pattern.length);
    return {
        redirectUrl: "https://google.com/search?q=define+" + query
    };
}

chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {
        urls: patterns
    },
    ["blocking"]
)