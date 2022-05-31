const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const inquirer = require("inquirer");
const git = require("isomorphic-git");
const { exec } = require("child_process");
// eslint-disable-next-line no-undef
const cwd = process.cwd();

module.exports = () => {
    inquirer.prompt(require("./init-prompt")).then((answers) => {
        const t = "\t";
        let files = [];

        files[".toolbasedotdev"] = yaml.stringify({
            name: answers.name,
            description: answers.description,
            author: answers.author,
            version: "0.1",
            main: answers.main,
            layout: answers.layout,
            include: [],
        });

        files["README.md"] = `
            # ${answers.name} (${answers.type})
            Generated using toolbase.dev CLI

            * \`${answers.main}\`: Main logic
            * \`${answers.layout}\`: Input and layout definitions

            https://www.npmjs.com/package/@toolbasedotdev/cli
        `;

        files[answers.main] = `
            /**
             * Main logic
             * @param {object[]} inputs Input values
             */
            function main(inputs) {}
        `;

        files[answers.layout] = `
            /**
             * Creates tool layout
             * @returns {object} Layout object
             */
            function layout() {
            ${t}return {
            ${t}${t}elements: [],
            ${t}${t}areas: []
            ${t}}
            }
        `;

        createFiles(files);
        initGit(files);
    });
};

/**
 * Writes files to the tool directory
 * @param {object} files
 */
function createFiles(files) {
    console.log("\nInitializing project in " + cwd);

    for (let fileName in files) {
        try {
            console.log("Writing " + fileName);

            const filepath = path.join(cwd, fileName);
            let content = files[fileName];

            if (fileName != ".toolbasedotdev") {
                content = content.replace(/^ +/gm, "");
                content = content.substring(1, content.length - 1);
                content = content.replace(/\t/g, "    ");
            }

            fs.writeFileSync(filepath, content);
        } catch (err) {
            console.error(err);
        }
    }
}

/**
 * Initializes git in the project directory
 * and adds the files to tracking
 * @param {object} files
 */
async function initGit(files) {
    console.log("Initializing Git repository\n");
    await git.init({ fs, dir: cwd });

    for (let filepath in files) git.add({ fs, dir: cwd, filepath });

    console.log("$ git status");
    exec("git status", (error, stdout, stderr) => {
        if (error || stderr) return;
        console.log(stdout);
        console.log("\nPlease commit these changes.");
    });
}
