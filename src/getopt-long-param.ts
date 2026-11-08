export type ParamTest = (
  value: any,
  key: string | undefined,
  parent: any,
  self: GetoptLongParam,
) => any;

export interface ParamOptions {
  parent?: any;
  description?: string;
  on?: (
    value: any,
    key: string | undefined,
    parent: any,
    self: GetoptLongParam,
  ) => void;
  test?: ParamTest | any[];
  paramName?: string;
  [key: string]: any;
}

export type ParamDetails = [string, ParamOptions];

function strSplit(str: string, match: string, limit: number): string[] {
  let split = str.split(match);
  let newSplit: string[] = [];
  let i = 0;

  while (i < limit - 1) {
    newSplit.push(split.shift() as string);
    i++;
  }
  newSplit.push(split.join(match));
  return newSplit;
}

function padToOrNewLine(str: string, max: number): string {
  if (str.length >= max) {
    return str + '\n' + padToOrNewLine('', max);
  }

  while (str.length < max) {
    str = str + ' ';
  }
  return str;
}

const testInt: ParamTest = (value, key, parent, self) => {
  if ('' + value === '' + parseInt(value, 10)) {
    return parseInt(value, 10);
  } else {
    throw '--' + self.name + ' must be an integer\n';
  }
};

const testFloat: ParamTest = (value, key, parent, self) => {
  if ('' + value === '' + parseFloat(value)) {
    return parseFloat(value);
  } else {
    throw '--' + self.name + ' must be an number\n';
  }
};

export class GetoptLongParam {
  //static VERSION = '0.4.0';

  test: Array<ParamTest | any[]> = [];
  possible: string[] = [];
  short: string[] = [];
  name = '';
  value: any = null;
  paramName: string | null = null;
  negatable = false;
  increment = false;
  parameter = false;
  autoNo = false;
  parent: any;
  description: string | undefined;
  on?: ParamOptions['on'];
  list?: boolean;
  object?: boolean;

  constructor(details: ParamDetails) {
    this.test = [];
    this.possible = [];
    this.short = [];
    this.name = '';
    this.value = null;
    this.paramName = null;
    this.negatable = false;
    this.increment = false;
    this.parameter = false;
    this.autoNo = false;
    this.setNames(details[0]);

    this.parent = details[1].parent;
    this.description = details[1].description;
    this.on = details[1].on;
    if (details[1].test) {
      this.test.push(details[1].test);
    }
    if (details[1].paramName) {
      this.paramName = details[1].paramName;
    } else if (details[1].test instanceof Array) {
      this.paramName = details[1].test.join('|');
    }
  }

  arrayTest(values: any[], value: any): any {
    for (var i = 0; i < values.length; i++) {
      if (values[i] === value) {
        return value;
      }
    }

    throw '--' + this.name + ' must be one of ' + values.join(', ') + '\n';
  }

  setNames(spec: string): void {
    var parts = spec.split(/(?=[!+=])/);
    var names = parts[0].split(/[|]/);

    this.name = names[0];
    this.possible = names;
    this.short = [];

    if (parts[1] === '!') {
      this.negatable = true;
    } else if (parts[1] === '+') {
      if (parts[2] === '+') {
        this.parameter = true;
        this.autoNo = true;
        this.paramName = 'int';

        this.test.push(testInt);
      } else {
        this.increment = true;
      }
    } else if (parts[1] && parts[1].substr(0, 1) === '=') {
      this.setValueParam(parts);
    }

    names.forEach((name) => {
      if (name.length === 1) {
        this.short.push(name);
      }
    });
  }

  setValueParam(parts: string[]): void {
    this.parameter = true;
    var type = parts[1].substr(1);

    if (type && type.substr(0, 1) === 'i') {
      this.test.push(testInt);
      type = type.substr(1);
      this.paramName = 'int';
    } else if (
      type &&
      (type.substr(0, 1) === 'd' || type.substr(0, 1) === 'f')
    ) {
      this.test.push(testFloat);
      type = type.substr(1);
      this.paramName = 'float';
    } else {
      this.paramName = 'string';
      type = type.length === 2 ? type.substr(1) : type;
    }

    if (type) {
      if (type === '@') {
        this.list = true;
        this.value = [];
      } else if (type === '%') {
        this.object = true;
        this.value = {};
      }
    }
  }

  process(arg1: string, arg2?: string): number {
    var value: any = undefined;
    var key: string | undefined = undefined;
    var possibleMatch = (name: string) => {
      if (this.parameter && arg1.match(/=/)) {
        return '--' + name === arg1.split(/=/, 2)[0];
      }
      return '--' + name === arg1;
    };
    var shortMatch = (name: string) => {
      return '-' + name === arg1.substr(0, 2);
    };

    var long = this.possible.reduce(function (prev, cur) {
      if (possibleMatch(cur)) {
        prev.push(cur);
      }
      return prev;
    }, [] as string[]).length;
    var short = this.short.reduce(function (prev, cur) {
      if (shortMatch(cur)) {
        prev.push(cur);
      }
      return prev;
    }, [] as string[]).length;
    var auto = this.autoNo ? arg1.match(/^-(\d+)$/) : false;

    if (long || short || auto) {
      var count = 1;
      if (this.increment) {
        this.value = this.value ? this.value + 1 : 1;
      } else if (this.parameter) {
        var valCount = this.extractValue(key, value, short, auto, arg1, arg2);
        value = valCount[0];
        if (valCount.length === 2) {
          count = valCount[1];
        }

        if (this.object) {
          var keyVal = strSplit(value, '=', 2);
          key = keyVal[0];
          value = keyVal[1];
        }

        this.runTests(key, value);

        this.setValue(key, value);
      } else {
        this.value = true;
      }

      if (short && !this.parameter && arg1.length > 2) {
        // flag that the bundled parameter should be removed
        count = -1;
      }

      if (this.on) {
        this.on(value, key, this.parent, this);
      }

      return count;
    } else if (
      this.negatable &&
      this.possible.reduce(function (prev, cur) {
        if ('--no-' + cur === arg1) {
          prev.push(cur);
        }
        return prev;
      }, [] as string[]).length
    ) {
      this.value = false;

      if (this.on) {
        this.on(value, key, this.parent, this);
      }

      return 1;
    }

    return 0;
  }

  extractValue(
    key: string | undefined,
    value: any,
    short: number,
    auto: RegExpMatchArray | false | null,
    arg1: string,
    arg2?: string,
  ): any[] {
    if (auto) {
      return [auto[1]];
    } else if (arg1.match(/=/)) {
      return [strSplit(arg1, '=', 2)[1]];
    } else if (short && arg1.length > 2) {
      return [arg1.substr(2)];
    } else if (arg2 !== undefined) {
      return [arg2, 2];
    }

    throw '--' + this.name + ' requires a value\n';
  }

  setValue(key: string | undefined, value: any): void {
    if (this.list) {
      this.value.push(value);
    } else if (this.object) {
      this.value[key as string] = value;
    } else {
      this.value = value;
    }
  }

  runTests(key: string | undefined, value: any): void {
    // run any value tests
    for (var j in this.test) {
      if (this.test[j] instanceof Function) {
        value = (this.test[j] as ParamTest)(value, key, this.parent, this);
      } else if (this.test[j] instanceof Array) {
        value = this.arrayTest(this.test[j] as any[], value);
      }
    }
  }

  help(): string {
    var help = this.short.length ? '  -' + this.short[0] : '    ';

    var last = this.possible.length - 1;
    while (this.possible[last] && this.possible[last].length === 1) {
      last--;
    }
    if (this.possible[last]) {
      help = help + ' --' + this.possible[last];
    }

    if (this.parameter) {
      help = help + '[=]' + this.paramName;
    }

    help = padToOrNewLine(help, 16);

    if (!this.negatable) {
      return help + this.description + '\n';
    }

    var nagative =
      padToOrNewLine('     --no-' + this.possible[last], 16) +
      'Turn off this option\n';
    return help + this.description + '\n' + nagative;
  }
}

const param = GetoptLongParam;

export { param };
export default GetoptLongParam;
