import { GetoptLongParam } from './getopt-long-param';
import { configure, get, getoptLong, options } from './getopt-long';

const param = GetoptLongParam;

export { configure, get, getoptLong, options, param, GetoptLongParam };
export type {
  GetoptLongConfig,
  ParameterDefinition,
  ParameterList,
} from './getopt-long';
export type {
  ParamDetails,
  ParamOptions,
  ParamTest,
} from './getopt-long-param';

export default { get, configure, options, param };
