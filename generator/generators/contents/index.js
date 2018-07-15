const Generator = require('yeoman-generator');
const path = require('path');

const generator = class extends Generator{

    constructor(args, opts){
        super(args, opts);

        this.option('copy-from');

        if(!this.options['copyFrom'])
            this.argument('name', {type: String, required: true});
    }

    install(){

        if(this.options['copyFrom']){
            this._copy();
            return;
        }

        // Create empty content
        this._prompts();
    }

    _copy(){

        const copyFrom = this.options['copyFrom'];
        const {sourcePath = './'} = this.options;

        this.fs.copy(
            this.templatePath(`copy/${copyFrom}`),
            this.destinationPath(`${sourcePath}contents/${copyFrom}`)
        );
    }

    _prompts(){

        const _self = this;

        return this.prompt([{
            type    : 'input',
            name    : 'icon',
            message : 'Enter Icon name for Sidebar',
            default : 'Pages'
        }, {
            type    : 'input',
            name    : 'label',
            message : 'Enter label name you want to use',
            default : 'Label'
        }]).then((answers) => {
            _self.options = Object.assign({}, this.options, answers);
            _self._create();
        });
    }

    _create(){

       const _self = this;
       const {name, sourcePath = './'} = this.options;

       ['index', 'List', 'Edit', 'Create'].map( file => {
           _self.fs.copyTpl(
               _self.templatePath(`empty/${file}.js`),
               _self.destinationPath(`${sourcePath}contents/${name}/${file}.js`),
               this.options
          );
       })
    } 
};

module.exports = generator;

