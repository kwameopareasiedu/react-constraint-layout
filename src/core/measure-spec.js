/** Represents layout requirements for width or height of a view */
export function MeasureSpec(spec, value) {
    this.spec = spec;
    this.value = value;
}

/** Indicates that a views dimension must be exactly a specified value */
MeasureSpec.EXACTLY = "EXACTLY";
/** Indicates that a views dimension may take any value */
MeasureSpec.UNSPECIFIED = "UNSPECIFIED";
