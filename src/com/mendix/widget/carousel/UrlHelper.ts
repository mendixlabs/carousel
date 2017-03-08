export class UrlHelper {
    static getAbsoluteUrl(url: string) {
        return this.startsWith(url, "data:") ? url : window.mx.appUrl + url;
    }

    static getStaticResourceUrlFromPath(t: string) {
        return this.getAbsoluteUrl(t);
    }

    static getStaticResourceUrl(url: string) {
        if (this.startsWith(url, "data:")) return url;

        if (!/^\w+:\/\//.test(url)) {
            url = this.getStaticResourceUrlFromPath(url);
        }
        const cacheBurst = window.mx.server.getCacheBust();
        if (this.startsWith(url, mx.appUrl) && !this.endsWith(url, cacheBurst)) {
            return url += (/\?/.test(url) ? "&" : "?") + cacheBurst;
        } else {
            return url;
        }
    }

    static getDynamicResourcePath(guid: string, changeDate: number, thumbnail: boolean) {
        let i = "file?" + [ "guid=" + guid, "changedDate=" + changeDate ].join("&");
        if (thumbnail)
            return i += "&thumb=true";
        else
            return i;
    }

    static getDynamicResourceUrl(guid: string, changeDate: number, thumbnail = false) {
        return this.getAbsoluteUrl(this.getDynamicResourcePath(guid, changeDate, thumbnail));
    }

    private static startsWith(searchString: string, prefix: string) {
        return 0 === searchString.indexOf(prefix);
    }

    private static endsWith(searchString: string, suffix: string) {
        return searchString.indexOf(suffix, searchString.length - suffix.length) !== -1;
    }
}
