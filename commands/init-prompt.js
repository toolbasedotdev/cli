const path = require("path");

module.exports = [
    {
        name: "type",
        type: "list",
        message: "Type",
        choices: ["calculator", "converter", "graph", "generator"],
    },
    {
        name: "name",
        message: "Tool name",
        // eslint-disable-next-line no-undef
        default: toToolName(path.basename(process.cwd())),
    },
    {
        name: "description",
        message: "Description",
    },
    {
        name: "author",
        message: "Author",
    },
    {
        name: "main",
        message: "Main file",
        default: "tool.js",
    },
    {
        name: "layout",
        message: "Layout file",
        default: "layout.js",
    },
];

/**
 * Formats a string into a valid tool name
 * @param {string} name Raw name
 * @returns {string} Formatted name
 */
function toToolName(name) {
    return name
        .toLowerCase()
        .replace(/[_\s]/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
