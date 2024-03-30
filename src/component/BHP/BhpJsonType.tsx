export type bhpConfigDataType = {
  modelInput: ModelInput;
  modelOutput: ModelOutput;
};

export type ModelInput = {
  pvtParameter: PvtParameter;
  productionData: ProductionData;
  wellboreConfig: WellboreConfig[];
  compute_options: ComputeOptions;
  settings: Settings;
};

type Settings = {
  pipe_segment: PipeSegment;
  flow_correlation: FlowCorrelation;
};

type FlowCorrelation = {
  payne_correction: boolean;
  friction_factor_method: string;
  max_iter: number;
  dp_grad_init: number;
};

type PipeSegment = {
  seg_max_length: number;
  seg_max_length_dZ: number;
  seg_max_length_offset: number;
  seg_max_angle_diff: number;
  seg_resolution_length: number;
};

type ComputeOptions = {
  flow_correlation: string;
  rod_pump_traverse_method?: string;
  annular_column_correlation?: string;
  annular_flow: boolean;
  skip_shutin: boolean;
  vectorize: boolean;
};

type WellboreConfig = {
  datetime: number;
  flow_correlation: string;
  lift_method: string;
  flow_type: string;
  casing: Casing;
  nodes: Nodes;
  tubing: Tubing;
  geothermal_gradient: GeothermalGradient;
  deviation_survey: DeviationSurvey;
  gaslift_valve?: GasliftValve;
};

type GasliftValve = {
  md: number[];
  delta_pres: number[];
};

type DeviationSurvey = {
  md: number[];
  tvd: number[];
};

type GeothermalGradient = {
  md: number[];
  tvd: number[];
  temp: number[];
};

type Tubing = {
  md: number[];
  d_inner: number[];
  d_outer: number[];
  rough_inner: number[];
  rough_outer: number[];
};

type Nodes = {
  name: string[];
  md: number[];
};

type Casing = {
  md: number[];
  d_inner: number[];
  rough_inner: number[];
};

type ProductionData = {
  datetime: number[];
  qo: number[];
  qw: number[];
  qg: number[];
  pres_casing: number[];
  pres_tubing: number[];
  measured_bhp: number[];
  qg_lift: number[];
  pwf: number[];
  uptime: number[];
  elapsed_time: number[];
};

type PvtParameter = {
  fluidType: string;
  pvt_type: string;
  isWaterChecked: boolean;
  fluidInput: FluidInput;
  refType: string;
  refInput: RefInput;
  correlations: Correlations;
};

type Correlations = {
  ppctpc: string;
  psat: string;
  z: string;
  bg: string;
  cg: string;
  deng: string;
  mug: string;
  rs: string;
  bo: string;
  co: string;
  muo: string;
  deno: string;
  rsw: string;
  bw: string;
  cw: string;
  muw: string;
  denw: string;
  sigma_go: string;
  sigma_gw: string;
  sigma_ow: string;
};

type RefInput = {
  pressure: Pressure;
  temperature: Temperature;
};

type Temperature = {
  min: number;
  max: number;
  increment: number;
  pres: number;
};

type Pressure = {
  min: number;
  max: number;
  increment: number;
  temp: number;
};
type ErrorMetrics = {
  medAPE: number;
  medAE: number;
  MAPE: number;
  MAE: number;
};

type FluidInput = {
  liveOil: LiveOil;
  dreadOil: LiveOil;
  dryGas: LiveOil;
};

type LiveOil = {
  oilGrav?: number;
  gasGrav?: number;
  rsi?: number;
  wat_salinity?: number;
  y_n2?: number;
  y_h2s?: number;
  y_co2?: number;
};
interface ModelOutput {
  input_node?: number;
  error_metrix?: ErrorMetrics;
  output_nodes?: string[];
  logs?: number[][];
  node_values?: Nodevalue[];
  traverses?: Nodevalue[];
  datetime?: number[];
  gas_lift_injection_depth?: (null | number)[];
}
interface Nodevalue {
  name?: string;
  md?: number[];
  liquid_holdup?: (null | number)[];
  pres?: (null | number)[];
  temp?: (null | number)[];
  velocity_mixture?: (null | number)[];
}
