/**  A reference to the current parent of a view */
export const PARENT = "_parent";

/** Generates a random unique view id */
export function generateRandomViewId() {
    const uniqueId = Math.random().toString();
    return `view-${uniqueId.replace(/\d\./g, "")}`;
}

/** Determines if a specified value is defined (I.e. not undefined or null) */
export function isDefined(value) {
    return ![undefined, null].includes(value);
}

/** For a list of arguments, it returns the first one defined (I.e. not undefined) */
export function firstDefinedOf(...values) {
    for (const v of values) {
        if (v !== undefined) return v;
    }

    return null;
}
