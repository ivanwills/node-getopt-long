import { readFileSync } from 'fs';

import { GetoptLongParam, type ParamOptions } from './getopt-long-param';

export type ParameterDefinition = [string, string | ParamOptions];
export type ParameterList = ParameterDefinition[];

export interface GetoptLongConfig {
  VERSION?: string;
  ignoreCase?: boolean;
  bundle?: boolean;
  name?: string | null;
  helpSuffix?: string | null;
  helpPrefix?: string | null;
  commandVersion?: string | null;
  extraCommandArgs?: number;
  defaults?: Record<string, any>;
  argv?: string[] | null;
  subCommand?: boolean;
  [key: string]: any;
}

function clone<T extends Record<string, any>>(obj: T): T {
  var cloned = {} as T;

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      (cloned as Record<string, any>)[i] = obj[i];
    }
  }
  return cloned;
}

/**
 * @object: getoptLong
 * @param: config - array of argument configuration
 *
 * Object inspirecd by Perl's Getopt::Long library
 */
export class GetoptLong {
  parameters: GetoptLongParam[] = [];

  // record the version with the object
  VERSION = '0.2.5';
  // ignore case of options as entered
  ignoreCase = true;
  // allow bundling of short arguments eg -v -e can be written as -ve
  bundle = true;
  // use this as the script's name
  name: string | null = null;
  // append this text to the end of help
  helpSuffix: string | null = null;
  // append this text before options
  helpPrefix: string | null = null;
  // used for flagging the --version value
  commandVersion: string | null = null;
  // remove extra parameters before passing options
  extraCommandArgs = 2;
  // default option values
  defaults: Record<string, any> = {};
  // alternate argument list
  argv: string[] | null = null;
  // flag for running as part of a sub command
  subCommand = false;

  constructor(params?: ParameterList, config?: GetoptLongConfig) {
    this.parameters = [];

    if (params) {
      if (config !== undefined) {
        Object.keys(config).forEach((key) => {
          (this as Record<string, any>)[key] = (config as Record<string, any>)[
            key
          ];
        });
      }

      if (this.name === null) {
        this.name = process.argv[0].match(/node/)
          ? process.argv[1].replace(/^.*\//, '')
          : process.argv[0];
      }

      if (!this.commandVersion) {
        // try to get command version from package.json if it exists
        try {
          var pack = JSON.parse(readFileSync('package.json', 'utf8'));
          if (pack.version) {
            this.commandVersion = pack.version;
          }
        } catch {
          // No package.json is available, so leave the version unset.
        }
      }

      this.configure(params);
    }
  }

  /**
   * @param parameters (Array) list of parameter objects
   *
   * configures the accepted command line parameters
   */
  configure(parameters: ParameterList): this {
    for (var i in parameters) {
      if (parameters.hasOwnProperty(i)) {
        var parameter = parameters[i];
        var options: ParamOptions =
          typeof parameter[1] === 'object'
            ? clone(parameter[1] as Record<string, any>)
            : { description: parameter[1] as string };
        options.parent = this;
        var param = new GetoptLongParam([parameter[0], options]);
        this.parameters.push(param);
      }
    }

    // Extra default parameters
    // --help
    this.parameters.push(
      new GetoptLongParam([
        'help',
        {
          parent: this,
          description: 'Show this help message',
          on: () => {
            process.stdout.write(this.help());
            process.exit(1);
          },
        },
      ]),
    );

    // --version if this.commandVersion set
    if (this.commandVersion) {
      this.parameters.push(
        new GetoptLongParam([
          'version',
          {
            parent: this,
            description: 'Show the version of this command',
            on: () => {
              process.stdout.write(
                this.name + ' version ' + this.commandVersion + '\n',
              );
              process.exit(0);
            },
          },
        ]),
      );
    }

    return this;
  }

  /**
   * @param parameters (Array) list of parameter objects
   *
   * configures the accepted command line parameters
   */
  process(): Record<string, any> {
    var params: Record<string, any> = { ...this.defaults },
      extra: string[] = [],
      type = this.argv !== null ? 'local' : 'process',
      argv: string[] = this.argv !== null ? this.argv : process.argv;

    for (var j = 0; j < this.extraCommandArgs; j++) {
      extra.push(argv.shift() as string);
    }

    try {
      while (argv.length) {
        // store all non argument parameters in extra array
        if (!argv[0].match(/^-/)) {
          extra.push(argv.shift() as string);
          if (this.subCommand) {
            extra.push(...argv);
            break;
          }
          continue;
        }

        // check if we find argument terminator
        if (argv[0] === '--') {
          argv.shift();
          extra.push(...argv);
          // stop processing
          break;
        }

        var matched = false;
        for (var i = 0; i < this.parameters.length; i++) {
          var param = this.parameters[i];
          var match = param.process(argv[0], argv[1]);
          if (!match) {
            // skip non matching parameters
            continue;
          }

          params[param.name] = param.value;
          if (match > 1) {
            argv.shift();
            argv.shift();
            matched = true;
          } else if (match < 0) {
            argv[0] = argv[0].replace(/^-./, '-');
            matched = true;
          } else {
            argv.shift();
            matched = true;
          }

          i = this.parameters.length;
        }

        this._matched(matched, argv[0]);
      }
    } catch (error) {
      process.stderr.write(String(error));
      process.stdout.write(this.help());
      process.exit(2);
    }

    if (type === 'local') {
      this.argv = extra;
    } else {
      process.argv = extra;
    }

    return params;
  }

  /**
   * @param matched (bool) Truth of found parameters match
   *
   * Throws error if param has not matched its definition
   */
  _matched(matched: boolean, param: string): void {
    if (!matched) {
      throw 'Unknown argument ' + param + '\n';
    }
  }

  /**
   * @param parameters (Array) list of parameter objects
   *
   * configures the accepted command line parameters
   */
  help(): string {
    var help = '  ' + this.name + '\n';

    if (this.helpPrefix) {
      help = help + this.helpPrefix;
    } else {
      help = help + '\n';
    }

    help = help + ' Options:\n';

    for (var i in this.parameters) {
      if (typeof this.parameters[i].help === 'function') {
        help = help + this.parameters[i].help();
      }
    }

    if (this.helpSuffix) {
      help = help + '\n' + this.helpSuffix + '\n';
    }

    return help;
  }
}

const get = GetoptLong;
const configure = function (params?: ParameterList, config?: GetoptLongConfig) {
  return new GetoptLong(params, config);
};
const options = function (params?: ParameterList, config?: GetoptLongConfig) {
  return new GetoptLong(params, config).process();
};

export { get, configure, options };
export { GetoptLong as getoptLong };
export default { get, configure, options };
