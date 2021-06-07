/*
 * Uses the jsdoc-to-markdown library to generate function docs
 */
const jsDocs = require('jsdoc-to-markdown');
const path = require('path');

let createFunctionDocs = ({ sourcePath, githubSource, childComponents = [] }) => {
    const files = [sourcePath, ...childComponents];
    const config = {
        files: files,
        partial: [
            path.join(__dirname,'templates','handlebars','link.hbs'),
            path.join(__dirname,'templates','handlebars','linked-type-list.hbs'),
            path.join(__dirname,'templates','handlebars','global-index-dl.hbs'),
            path.join(__dirname,'templates','handlebars','header.hbs'),
            path.join(__dirname,'templates','handlebars','defaultValue.hbs'),
            path.join(__dirname,'templates','handlebars','params-table.hbs'),
            path.join(__dirname,'templates','handlebars','properties-table.hbs'),
        ],
    }
    return jsDocs.render(config).then(content => {
        return new Promise((resolve, reject) => {
            if (!content) {
                reject(Error(`Could not generate content for ${sourcePath}`, sourcePath));
            } else {
                resolve(
                    `${content}\n\nFor implementation details [**View Source**](${githubSource}).`
                );
            }
        });
    });
};

module.exports = createFunctionDocs;
