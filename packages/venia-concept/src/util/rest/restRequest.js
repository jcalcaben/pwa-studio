import M2ApiResponseError from './M2ApiResponseError';

const headers = {
    'Content-type': 'application/json',
    Accept: 'application/json'
};
export default async function magentoRestRequest({ method, path, body }) {
    const fullPath = `/rest/V1/${path}`;
    const res = await fetch(fullPath, { method, headers, body });
    // The `res.ok` property is equivalent to
    // (res.status >= 200 && res.status <= 299).
    // According to https://developer.mozilla.org/en-US/docs/Web/API/Response#Browser_compatibility
    // it is not widely supported, but in all my mobile and desktop
    // tests, it works.
    if (!res.ok) {
        let bodyText;
        try {
            bodyText = await res.text();
        } catch (e) {
            bodyText = e.message;
        }
        throw new M2ApiResponseError({ method, path, res, bodyText });
    }
    return res.json();
}
