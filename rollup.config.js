import path from "path";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

module.exports = {
    input: path.resolve(__dirname, "./src/index.js"),
    output: {
        file: path.resolve(__dirname, "./dist/bundle.js"),
        exports: "named",
        format: "cjs"
    },
    plugins: [
        babel({ exclude: "node_modules/**" }),
        resolve({ extensions: [".js", ".jsx", ".scss", ".css"] }),
        commonjs({
            namedExports: { "node_modules/react-is/index.js": ["isValidElementType", "isContextConsumer"] }
        }),
        terser()
    ],
    watch: {
        chokidar: {
            usePolling: true
        }
    },
    external: ["react", "react-dom"]
};
