export type PinType =
  | 'POWER'
  | 'GND'
  | 'SPI'
  | 'I2C'
  | 'UART'
  | 'GPIO'
  | 'INTERRUPT'
  | 'RESET'
  | 'ANALOG'
  | 'RF'
  | 'CRYSTAL'
  | 'NC';

export type PinDirection = 'INPUT' | 'OUTPUT' | 'BIDIRECTIONAL' | 'POWER';

export interface PinDefinition {
  pinNumber: number;
  name: string;
  type: PinType;
  direction: PinDirection;
  description: string;
  voltageTolerance: string;
  pullConfig: string;
  alternateFunctions: string[];
  isCritical?: boolean;
}

export type WarningSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type WarningCategory =
  | 'VOLTAGE'
  | 'STRAPPING'
  | 'DECOUPLING'
  | 'RESET_TIMING'
  | 'RF_MATCHING'
  | 'COMMUNICATION'
  | 'GENERAL';

export interface HardwareWarning {
  category: WarningCategory;
  severity: WarningSeverity;
  title: string;
  message: string;
  remediation: string;
}

export interface ElectricalLimits {
  minSupplyVoltage: number;
  maxSupplyVoltage: number;
  nominalVoltage: number;
  maxIoVoltage: number;
  maxIoCurrentMa?: number;
  operatingTempRange?: string;
  notes?: string;
}

export interface WiringMapping {
  chipPinName: string;
  chipPinNumber: number;
  microcontrollerFunction: string;
  connectionNotes: string;
}

export type TargetPlatform = 'stm32_hal' | 'esp_idf' | 'arduino' | 'rp2040_pico';

export interface PlatformCodeBundle {
  stm32_hal: string;
  esp_idf: string;
  arduino: string;
  rp2040_pico: string;
}

export interface DatasheetAnalysisResult {
  chipName: string;
  manufacturer: string;
  description: string;
  packageType: string;
  totalPins: number;
  primaryInterface: string;
  electricalLimits: ElectricalLimits;
  pins: PinDefinition[];
  criticalWarnings: HardwareWarning[];
  platformCode: PlatformCodeBundle;
  wiringGuide: WiringMapping[];
  timestamp?: string;
}
