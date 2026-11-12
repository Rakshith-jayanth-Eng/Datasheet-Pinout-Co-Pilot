import { DatasheetAnalysisResult } from '../types/datasheet';

export interface PresetDatasheet {
  id: string;
  name: string;
  subtitle: string;
  chipName: string;
  packageType: string;
  primaryInterface: string;
  rawExcerpt: string;
  verifiedResult: DatasheetAnalysisResult;
}

export const SX1278_PRESET: PresetDatasheet = {
  id: 'sx1278-lora',
  name: 'SX1278 LoRa Transceiver (137-1020MHz)',
  subtitle: 'Semtech SPI Transceiver with DIO0-DIO5 Interrupts',
  chipName: 'SX1278',
  packageType: 'QFN-28 (6x6mm) / SMD-16 Module',
  primaryInterface: 'SPI (Mode 0, up to 10 MHz)',
  rawExcerpt: `SEMTECH SX1276/77/78/79 - 137 MHz to 1020 MHz Low Power Long Range Transceiver
DATASHEET EXCERPT - PIN DESCRIPTION & ELECTRICAL CHARACTERISTICS

Table 1: Pin Description (Module 16-Pin / QFN-28 Package Breakdown)
Pin 1  | GND       | Ground reference
Pin 2  | DIO1      | Bidirectional digital I/O. Software configurable interrupt line (RxTimeout, FhssChangeChannel, CadDetected).
Pin 3  | DIO2      | Bidirectional digital I/O. Software configurable interrupt line (FhssChangeChannel, SyncAddress).
Pin 4  | DIO3      | Bidirectional digital I/O. Software configurable interrupt line (CadDone, ValidHeader, PayloadCrcError).
Pin 5  | RESET     | Active low reset input. Internally pulled up to VBAT. Requires 100ns minimum pulse to trigger.
Pin 6  | DIO0      | Bidirectional digital I/O. Software configurable interrupt (RxDone, TxDone, CadDone). Time-critical IRQ.
Pin 7  | DIO4      | Bidirectional digital I/O. Software configurable interrupt (CadDetected, PllLock).
Pin 8  | DIO5      | Bidirectional digital I/O. ModeReady, ClkOut, or PllLock.
Pin 9  | ANT / RFI | RF Input/Output antenna connection pin. Matched to 50 Ohm impedance network.
Pin 10 | GND       | Ground reference connection.
Pin 11 | DIO4/NC   | No internal connection or alternate GPIO.
Pin 12 | NSS / CS  | SPI Chip Select (Active Low). Must be driven high during power-up. Requires pull-up to prevent floating bus.
Pin 13 | SCK       | SPI Clock input (Max frequency 10 MHz). CPOL=0, CPHA=0 (SPI Mode 0).
Pin 14 | MOSI      | SPI Master-Output-Slave-Input serial data line.
Pin 15 | MISO      | SPI Master-Input-Slave-Output serial data line. High-impedance when NSS is high.
Pin 16 | 3.3V/VBAT | Positive supply voltage connection. 1.8V to 3.7V operating range.

ELECTRICAL SPECIFICATIONS & ABSOLUTE MAXIMUM RATINGS:
- Supply Voltage (VBAT): Min 1.8V, Typ 3.3V, Max 3.7V. WARNING: Applying 5.0V directly to VBAT will permanently damage the device.
- Digital Input Voltage (NSS, SCK, MOSI, RESET): -0.5V to VBAT + 0.3V (Max 3.7V). Non-5V tolerant! Level shifting required for 5V MCUs (e.g., Arduino Uno / ATmega328P).
- Maximum I/O pin sink/source current: 10 mA.
- Operating Temperature: -40°C to +85°C.
- Decoupling capacitors: Place 100nF and 10uF ceramic low-ESR capacitors as close to VBAT/GND as possible.
- Reset line notice: Floating RESET pin can trigger spurious resets under RF transmit bursts. Connect external 10k pull-up or leave floating only if strictly PCB-routed without RF coupling.
- RF Output (PA_BOOST / RFO): Never transmit without an attached 50Ω antenna or dummy load; reflected power will destroy internal RF power amplifier.`,
  verifiedResult: {
    chipName: 'SX1278',
    manufacturer: 'Semtech',
    description: 'Long-range low-power sub-GHz LoRa RF transceiver with SPI control and configurable DIO interrupts.',
    packageType: 'QFN-28 / SMD-16',
    totalPins: 16,
    primaryInterface: 'SPI (Mode 0, Max 10MHz)',
    electricalLimits: {
      minSupplyVoltage: 1.8,
      maxSupplyVoltage: 3.7,
      nominalVoltage: 3.3,
      maxIoVoltage: 3.7,
      maxIoCurrentMa: 10,
      operatingTempRange: '-40°C to +85°C',
      notes: 'NOT 5V tolerant. Digital inputs exceed maximum ratings if connected directly to 5V logic.'
    },
    pins: [
      {
        pinNumber: 1,
        name: 'GND',
        type: 'GND',
        direction: 'POWER',
        description: 'Common ground reference. Connect to main PCB ground plane.',
        voltageTolerance: '0.0V',
        pullConfig: 'None',
        alternateFunctions: ['RF Ground', 'Thermal Pad Return'],
        isCritical: false
      },
      {
        pinNumber: 2,
        name: 'DIO1',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Configurable digital IRQ line (RxTimeout, FhssChangeChannel, CadDetected).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'External 10k Pull-Down or MCU Floating Input',
        alternateFunctions: ['RxTimeout', 'FhssChangeChannel', 'CadDetected'],
        isCritical: false
      },
      {
        pinNumber: 3,
        name: 'DIO2',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Configurable digital IRQ (FhssChangeChannel, SyncAddress, Data continuous mode).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'None / MCU GPIO input',
        alternateFunctions: ['SyncAddress', 'FhssChangeChannel'],
        isCritical: false
      },
      {
        pinNumber: 4,
        name: 'DIO3',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Configurable digital IRQ (CadDone, ValidHeader, PayloadCrcError).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'None / MCU GPIO input',
        alternateFunctions: ['PayloadCrcError', 'CadDone', 'ValidHeader'],
        isCritical: false
      },
      {
        pinNumber: 5,
        name: 'RESET',
        type: 'RESET',
        direction: 'INPUT',
        description: 'Active-low hardware reset pin. Internal weak pull-up to VBAT.',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'Internal Weak Pull-up (Optional External 10k)',
        alternateFunctions: ['POR Override'],
        isCritical: true
      },
      {
        pinNumber: 6,
        name: 'DIO0',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Primary hardware interrupt pin (RxDone, TxDone, CadDone). Must connect to MCU EXTI pin.',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'External 10k Pull-Down or Direct to MCU EXTI',
        alternateFunctions: ['RxDone', 'TxDone', 'CadDone'],
        isCritical: true
      },
      {
        pinNumber: 7,
        name: 'DIO4',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Auxiliary digital interrupt (CadDetected, PllLock).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'None / Floating',
        alternateFunctions: ['CadDetected', 'PllLock'],
        isCritical: false
      },
      {
        pinNumber: 8,
        name: 'DIO5',
        type: 'INTERRUPT',
        direction: 'BIDIRECTIONAL',
        description: 'Auxiliary digital interrupt (ModeReady, ClkOut).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'None / Floating',
        alternateFunctions: ['ModeReady', 'ClkOut'],
        isCritical: false
      },
      {
        pinNumber: 9,
        name: 'ANT / RFO',
        type: 'RF',
        direction: 'BIDIRECTIONAL',
        description: 'RF antenna input/output port. Matched to 50 Ohm impedance network.',
        voltageTolerance: 'RF Power Rail dependent',
        pullConfig: 'None / DC isolated by series capacitor',
        alternateFunctions: ['PA_BOOST', 'RFI_LF', 'RFO_LF'],
        isCritical: true
      },
      {
        pinNumber: 10,
        name: 'GND',
        type: 'GND',
        direction: 'POWER',
        description: 'RF ground connection point.',
        voltageTolerance: '0.0V',
        pullConfig: 'None',
        alternateFunctions: ['Shield Ground'],
        isCritical: false
      },
      {
        pinNumber: 11,
        name: 'NC',
        type: 'NC',
        direction: 'INPUT',
        description: 'No connection / reserved pad.',
        voltageTolerance: 'N/A',
        pullConfig: 'Leave unconnected',
        alternateFunctions: [],
        isCritical: false
      },
      {
        pinNumber: 12,
        name: 'NSS',
        type: 'SPI',
        direction: 'INPUT',
        description: 'SPI Chip Select (Active Low). Controlled by MCU GPIO to frame commands.',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'External 10k Pull-Up recommended to prevent floating on boot',
        alternateFunctions: ['SPI_CS', 'Slave_Select'],
        isCritical: true
      },
      {
        pinNumber: 13,
        name: 'SCK',
        type: 'SPI',
        direction: 'INPUT',
        description: 'SPI Serial Clock input (Max 10 MHz, CPOL=0, CPHA=0).',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'MCU Push-Pull / External 100k Pull-Down',
        alternateFunctions: ['SPI_CLK'],
        isCritical: true
      },
      {
        pinNumber: 14,
        name: 'MOSI',
        type: 'SPI',
        direction: 'INPUT',
        description: 'SPI Master-Out-Slave-In data input line.',
        voltageTolerance: 'VBAT + 0.3V (3.7V Max)',
        pullConfig: 'MCU Driven Push-Pull',
        alternateFunctions: ['SPI_SIMO'],
        isCritical: true
      },
      {
        pinNumber: 15,
        name: 'MISO',
        type: 'SPI',
        direction: 'OUTPUT',
        description: 'SPI Master-In-Slave-Out data line. High impedance when NSS is high.',
        voltageTolerance: 'Driven to VBAT (3.3V)',
        pullConfig: 'Internal Tri-State when NSS=1',
        alternateFunctions: ['SPI_SOMI'],
        isCritical: true
      },
      {
        pinNumber: 16,
        name: 'VBAT',
        type: 'POWER',
        direction: 'POWER',
        description: 'Main DC power supply pin (1.8V to 3.7V). Place 100nF + 10uF bypass capacitors adjacent.',
        voltageTolerance: '1.8V - 3.7V Max (3.3V Nominal)',
        pullConfig: 'Regulated DC Power Rail',
        alternateFunctions: ['VCC', 'VDD'],
        isCritical: true
      }
    ],
    criticalWarnings: [
      {
        category: 'VOLTAGE',
        severity: 'CRITICAL',
        title: 'Strict 3.7V Maximum Voltage Limit (Non-5V Tolerant)',
        message: 'The SX1278 absolute maximum rating is 3.7V on both VBAT and all digital I/O lines (NSS, SCK, MOSI, RESET). Direct connection to 5V MCUs (e.g. Arduino Uno / ATmega328P 5V pins) will cause gate breakdown and destroy the silicon.',
        remediation: 'Power exclusively from a 3.3V low-dropout regulator (LDO). Use bidirectional logic level shifters (e.g. TXS0108E) or resistor divider networks (e.g. 2.2kΩ / 4.7kΩ) on all 5V MCU output lines.'
      },
      {
        category: 'RF_MATCHING',
        severity: 'CRITICAL',
        title: 'Destructive PA Damage Without 50Ω Antenna Load',
        message: 'Transmitting via PA_BOOST (+20 dBm / 100mW) without an impedance-matched antenna or 50Ω RF dummy load creates high voltage standing wave ratio (VSWR), reflecting RF power back into the output stage transistors.',
        remediation: 'Always screw on an SMA antenna or 50Ω load before initializing transmitter code in firmware.'
      },
      {
        category: 'STRAPPING',
        severity: 'WARNING',
        title: 'NSS Floating During Bootstrapping',
        message: 'During microcontroller reset/bootloader stages, GPIO pins default to high-impedance inputs. If NSS floats low, the SX1278 may interpret random bootloader clock signals on SCK as SPI commands.',
        remediation: 'Add a 10kΩ pull-up resistor from NSS (Pin 12) to 3.3V to ensure the chip remains in unselected idle mode during boot.'
      },
      {
        category: 'DECOUPLING',
        severity: 'WARNING',
        title: 'High Peak RF Current Drops',
        message: 'During RF transmission at +20dBm, the chip draws instantaneous current pulses up to 120-130 mA, which can cause supply voltage sagging and unintended brownout resets on weak power rails.',
        remediation: 'Place a 10uF tantalum or ceramic capacitor in parallel with a 100nF low-ESR ceramic capacitor directly adjacent to Pin 16 (VBAT).'
      },
      {
        category: 'RESET_TIMING',
        severity: 'INFO',
        title: 'Reset Active-Low Timing Pulse',
        message: 'To execute a full hardware reset, pull Pin 5 (RESET) low for a minimum of 100 microseconds, then release and wait at least 5 milliseconds before initiating SPI communications.',
        remediation: 'Implement a discrete delay routine: set RESET low, delay 1ms, set high, delay 10ms.'
      }
    ],
    platformCode: {
      stm32_hal: `/**
 * @file sx1278_hal_init.c
 * @brief STM32 HAL Modular Initialization for SX1278 LoRa Transceiver
 * Target: STM32F4 / STM32G4 / STM32L4 Series (3.3V Logic)
 */

#include "stm32f4xx_hal.h"
#include <stdbool.h>

/* --- Pin Assignments (Customizable for your board) --- */
#define SX1278_SPI_HANDLE       hspi1
#define SX1278_NSS_PORT         GPIOA
#define SX1278_NSS_PIN          GPIO_PIN_4
#define SX1278_RESET_PORT       GPIOC
#define SX1278_RESET_PIN        GPIO_PIN_4
#define SX1278_DIO0_PORT        GPIOB
#define SX1278_DIO0_PIN         GPIO_PIN_0
#define SX1278_DIO0_EXTI_IRQ    EXTI0_IRQn

extern SPI_HandleTypeDef SX1278_SPI_HANDLE;

/* --- GPIO Initialization --- */
void SX1278_GPIO_Init(void) {
    __HAL_RCC_GPIOA_CLK_ENABLE();
    __HAL_RCC_GPIOB_CLK_ENABLE();
    __HAL_RCC_GPIOC_CLK_ENABLE();

    GPIO_InitTypeDef GPIO_InitStruct = {0};

    /* NSS (Chip Select): Output Push-Pull, High Speed, Active Low (Default HIGH) */
    HAL_GPIO_WritePin(SX1278_NSS_PORT, SX1278_NSS_PIN, GPIO_PIN_SET);
    GPIO_InitStruct.Pin = SX1278_NSS_PIN;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    HAL_GPIO_Init(SX1278_NSS_PORT, &GPIO_InitStruct);

    /* RESET: Output Open-Drain or Push-Pull with Pull-Up */
    HAL_GPIO_WritePin(SX1278_RESET_PORT, SX1278_RESET_PIN, GPIO_PIN_SET);
    GPIO_InitStruct.Pin = SX1278_RESET_PIN;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(SX1278_RESET_PORT, &GPIO_InitStruct);

    /* DIO0: External Interrupt on Rising Edge (RxDone / TxDone) */
    GPIO_InitStruct.Pin = SX1278_DIO0_PIN;
    GPIO_InitStruct.Mode = GPIO_MODE_IT_RISING;
    GPIO_InitStruct.Pull = GPIO_PULLDOWN;
    HAL_GPIO_Init(SX1278_DIO0_PORT, &GPIO_InitStruct);

    /* EXTI Interrupt Priority Configuration */
    HAL_NVIC_SetPriority(SX1278_DIO0_EXTI_IRQ, 5, 0);
    HAL_NVIC_EnableIRQ(SX1278_DIO0_EXTI_IRQ);
}

/* --- Hardware Reset Pulse Routine --- */
void SX1278_HardwareReset(void) {
    HAL_GPIO_WritePin(SX1278_RESET_PORT, SX1278_RESET_PIN, GPIO_PIN_RESET);
    HAL_Delay(2); // Minimum 100us required
    HAL_GPIO_WritePin(SX1278_RESET_PORT, SX1278_RESET_PIN, GPIO_PIN_SET);
    HAL_Delay(10); // Wait 5-10ms for internal PLL stabilization
}

/* --- SPI Bus Transaction Wrappers --- */
uint8_t SX1278_ReadRegister(uint8_t reg) {
    uint8_t addr = reg & 0x7F; // Bit 7 = 0 for Read
    uint8_t val = 0;

    HAL_GPIO_WritePin(SX1278_NSS_PORT, SX1278_NSS_PIN, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&SX1278_SPI_HANDLE, &addr, 1, 100);
    HAL_SPI_Receive(&SX1278_SPI_HANDLE, &val, 1, 100);
    HAL_GPIO_WritePin(SX1278_NSS_PORT, SX1278_NSS_PIN, GPIO_PIN_SET);

    return val;
}

void SX1278_WriteRegister(uint8_t reg, uint8_t val) {
    uint8_t txData[2] = { (uint8_t)(reg | 0x80), val }; // Bit 7 = 1 for Write

    HAL_GPIO_WritePin(SX1278_NSS_PORT, SX1278_NSS_PIN, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&SX1278_SPI_HANDLE, txData, 2, 100);
    HAL_GPIO_WritePin(SX1278_NSS_PORT, SX1278_NSS_PIN, GPIO_PIN_SET);
}

/* --- Master Module Initializer & Verification --- */
bool SX1278_Init(void) {
    SX1278_GPIO_Init();
    SX1278_HardwareReset();

    // Verify Silicon Version Register (0x42 should return 0x12)
    uint8_t version = SX1278_ReadRegister(0x42);
    if (version != 0x12) {
        return false; // Communication failed or incorrect wiring
    }

    // Set Sleep Mode to configure LoRa Modulation
    SX1278_WriteRegister(0x01, 0x80); // RegOpMode = LongRangeMode (LoRa) | Sleep
    return true;
}`,
      esp_idf: `/**
 * @file sx1278_espidf_init.c
 * @brief ESP-IDF SPI & GPIO Driver Initialization for SX1278
 * Target: ESP32 / ESP32-S3 / ESP32-C3 / ESP32-C6 (Native 3.3V Logic)
 */

#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/spi_master.h"
#include "esp_log.h"

static const char *TAG = "SX1278";

/* --- GPIO Configuration --- */
#define PIN_NUM_MISO        GPIO_NUM_19
#define PIN_NUM_MOSI        GPIO_NUM_23
#define PIN_NUM_CLK         GPIO_NUM_18
#define PIN_NUM_CS          GPIO_NUM_5
#define PIN_NUM_RST         GPIO_NUM_14
#define PIN_NUM_DIO0        GPIO_NUM_26

static spi_device_handle_t sx1278_spi;

/* --- DIO0 ISR Handler --- */
static void IRAM_ATTR sx1278_dio0_isr_handler(void* arg) {
    // Notify task or queue event
}

/* --- Initialization Routine --- */
esp_err_t sx1278_init_hardware(void) {
    esp_err_t ret;

    // 1. Configure Reset and DIO0 GPIOs
    gpio_config_t io_conf = {
        .pin_bit_mask = (1ULL << PIN_NUM_RST),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };
    gpio_config(&io_conf);

    // DIO0 Interrupt on Rising Edge
    io_conf.pin_bit_mask = (1ULL << PIN_NUM_DIO0);
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pull_up_en = GPIO_PULLUP_DISABLE;
    io_conf.pull_down_en = GPIO_PULLDOWN_ENABLE;
    io_conf.intr_type = GPIO_INTR_POSEDGE;
    gpio_config(&io_conf);

    gpio_install_isr_service(0);
    gpio_isr_handler_add(PIN_NUM_DIO0, sx1278_dio0_isr_handler, NULL);

    // 2. Hardware Reset Cycle
    gpio_set_level(PIN_NUM_RST, 0);
    vTaskDelay(pdMS_TO_TICKS(5));
    gpio_set_level(PIN_NUM_RST, 1);
    vTaskDelay(pdMS_TO_TICKS(10));

    // 3. Initialize SPI2_HOST Bus
    spi_bus_config_t buscfg = {
        .miso_io_num = PIN_NUM_MISO,
        .mosi_io_num = PIN_NUM_MOSI,
        .sclk_io_num = PIN_NUM_CLK,
        .quadwp_io_num = -1,
        .quadhd_io_num = -1,
        .max_transfer_sz = 32
    };

    spi_device_interface_config_t devcfg = {
        .clock_speed_hz = 8 * 1000 * 1000, // 8 MHz clock (Max 10 MHz)
        .mode = 0,                         // SPI Mode 0 (CPOL=0, CPHA=0)
        .spics_io_num = PIN_NUM_CS,        // CS handled automatically by SPI driver
        .queue_size = 7
    };

    ret = spi_bus_initialize(SPI2_HOST, &buscfg, SPI_DMA_CH_AUTO);
    if (ret != ESP_OK) return ret;

    ret = spi_bus_add_device(SPI2_HOST, &devcfg, &sx1278_spi);
    if (ret != ESP_OK) return ret;

    ESP_LOGI(TAG, "SX1278 SPI Bus and Interrupts Initialized");
    return ESP_OK;
}`,
      arduino: `/**
 * @file SX1278_Arduino_Init.ino
 * @brief Arduino C++ Initialization for SX1278 LoRa Transceiver
 * Note: Use 3.3V logic MCU or level shifters on 5V boards (Uno/Nano)!
 */

#include <SPI.h>

// --- Pin Map Definitions ---
#if defined(ESP32)
  #define PIN_NSS    5
  #define PIN_RESET  14
  #define PIN_DIO0   26
#elif defined(ARDUINO_ARCH_RP2040)
  #define PIN_NSS    17
  #define PIN_RESET  20
  #define PIN_DIO0   21
#else // Standard AVR (Level Shifter Mandatory!)
  #define PIN_NSS    10
  #define PIN_RESET  9
  #define PIN_DIO0   2
#endif

// SPI Settings: Max 10MHz, MSBFIRST, SPI_MODE0
SPISettings sx1278SpiSettings(8000000, MSBFIRST, SPI_MODE0);

volatile bool packetReceived = false;

void IRAM_ATTR onDio0Interrupt() {
  packetReceived = true;
}

uint8_t readRegister(uint8_t address) {
  SPI.beginTransaction(sx1278SpiSettings);
  digitalWrite(PIN_NSS, LOW);
  SPI.transfer(address & 0x7F); // Read bit 7 = 0
  uint8_t response = SPI.transfer(0x00);
  digitalWrite(PIN_NSS, HIGH);
  SPI.endTransaction();
  return response;
}

void writeRegister(uint8_t address, uint8_t value) {
  SPI.beginTransaction(sx1278SpiSettings);
  digitalWrite(PIN_NSS, LOW);
  SPI.transfer(address | 0x80); // Write bit 7 = 1
  SPI.transfer(value);
  digitalWrite(PIN_NSS, HIGH);
  SPI.endTransaction();
}

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);

  Serial.println(F("[SX1278] Initializing Peripheral Pins..."));

  // 1. Configure Pin Modes
  pinMode(PIN_NSS, OUTPUT);
  digitalWrite(PIN_NSS, HIGH); // De-select initially

  pinMode(PIN_RESET, OUTPUT);
  pinMode(PIN_DIO0, INPUT);

  // 2. Hardware Reset Pulse
  digitalWrite(PIN_RESET, LOW);
  delay(2);
  digitalWrite(PIN_RESET, HIGH);
  delay(10);

  // 3. Start SPI
  SPI.begin();

  // 4. Verify Chip ID (RegVersion = 0x42)
  uint8_t version = readRegister(0x42);
  Serial.print(F("[SX1278] Silicon Revision Register: 0x"));
  Serial.println(version, HEX);

  if (version == 0x12) {
    Serial.println(F("[SX1278] Success: SX1278 verified and ready!"));
    attachInterrupt(digitalPinToInterrupt(PIN_DIO0), onDio0Interrupt, RISING);
  } else {
    Serial.println(F("[SX1278] ERROR: Check 3.3V power, SPI MOSI/MISO/SCK and level shifters."));
  }
}

void loop() {
  if (packetReceived) {
    packetReceived = false;
    Serial.println(F("[SX1278] Packet IRQ Triggered!"));
  }
  delay(500);
}`,
      rp2040_pico: `/**
 * @file sx1278_pico_init.c
 * @brief Raspberry Pi Pico (RP2040 / RP2350) C/C++ SDK Initialization
 * Compiler: pico-sdk with hardware_spi and hardware_gpio
 */

#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/spi.h"
#include "hardware/gpio.h"

// --- Pinout Configuration for Pico Header ---
#define SPI_PORT        spi0
#define PIN_SCK         18
#define PIN_MOSI        19
#define PIN_MISO        16
#define PIN_CS          17
#define PIN_RST         20
#define PIN_DIO0        21

static volatile bool rx_flag = false;

static void dio0_callback(uint gpio, uint32_t events) {
    if (gpio == PIN_DIO0) {
        rx_flag = true;
    }
}

static inline void cs_select(void) {
    asm volatile("nop \\n nop \\n nop");
    gpio_put(PIN_CS, 0);
    asm volatile("nop \\n nop \\n nop");
}

static inline void cs_deselect(void) {
    asm volatile("nop \\n nop \\n nop");
    gpio_put(PIN_CS, 1);
    asm volatile("nop \\n nop \\n nop");
}

uint8_t sx1278_read_reg(uint8_t reg) {
    uint8_t addr = reg & 0x7F;
    uint8_t val = 0;
    cs_select();
    spi_write_blocking(SPI_PORT, &addr, 1);
    spi_read_blocking(SPI_PORT, 0x00, &val, 1);
    cs_deselect();
    return val;
}

void sx1278_write_reg(uint8_t reg, uint8_t val) {
    uint8_t buf[2] = { (uint8_t)(reg | 0x80), val };
    cs_select();
    spi_write_blocking(SPI_PORT, buf, 2);
    cs_deselect();
}

int main(void) {
    stdio_init_all();
    sleep_ms(2000);
    printf("[SX1278 Pico] Starting bringup...\\n");

    // 1. SPI Interface Setup at 8 MHz
    spi_init(SPI_PORT, 8000 * 1000);
    gpio_set_function(PIN_SCK, GPIO_FUNC_SPI);
    gpio_set_function(PIN_MOSI, GPIO_FUNC_SPI);
    gpio_set_function(PIN_MISO, GPIO_FUNC_SPI);

    // 2. Chip Select Setup
    gpio_init(PIN_CS);
    gpio_set_dir(PIN_CS, GPIO_OUT);
    gpio_put(PIN_CS, 1);

    // 3. Reset Pin
    gpio_init(PIN_RST);
    gpio_set_dir(PIN_RST, GPIO_OUT);
    gpio_put(PIN_RST, 0);
    sleep_ms(5);
    gpio_put(PIN_RST, 1);
    sleep_ms(10);

    // 4. DIO0 Interrupt Setup
    gpio_init(PIN_DIO0);
    gpio_set_dir(PIN_DIO0, GPIO_IN);
    gpio_pull_down(PIN_DIO0);
    gpio_set_irq_enabled_with_callback(PIN_DIO0, GPIO_IRQ_EDGE_RISE, true, &dio0_callback);

    // 5. Query Silicon Version
    uint8_t ver = sx1278_read_reg(0x42);
    printf("[SX1278 Pico] Version read: 0x%02X (Expected: 0x12)\\n", ver);

    while (1) {
        if (rx_flag) {
            rx_flag = false;
            printf("[SX1278 Pico] DIO0 Event Fired!\\n");
        }
        sleep_ms(100);
    }
    return 0;
}`
    },
    wiringGuide: [
      { chipPinName: 'VBAT', chipPinNumber: 16, microcontrollerFunction: '3.3V VDD Rail', connectionNotes: 'Must supply clean 3.3V (150mA peak). Add 100nF + 10uF bypass caps.' },
      { chipPinName: 'GND', chipPinNumber: 1, microcontrollerFunction: 'Common Ground', connectionNotes: 'Low-impedance return path connected to MCU ground.' },
      { chipPinName: 'NSS', chipPinNumber: 12, microcontrollerFunction: 'SPI CS (GPIO Output)', connectionNotes: 'Active-low. Add 10k pull-up to 3.3V to prevent floating at reset.' },
      { chipPinName: 'SCK', chipPinNumber: 13, microcontrollerFunction: 'SPI Clock (SCK)', connectionNotes: 'Max 10 MHz. SPI Mode 0 (CPOL=0, CPHA=0).' },
      { chipPinName: 'MOSI', chipPinNumber: 14, microcontrollerFunction: 'SPI MOSI (Data In)', connectionNotes: 'MCU sends commands to transceiver.' },
      { chipPinName: 'MISO', chipPinNumber: 15, microcontrollerFunction: 'SPI MISO (Data Out)', connectionNotes: 'Transceiver streams registers back to MCU.' },
      { chipPinName: 'RESET', chipPinNumber: 5, microcontrollerFunction: 'GPIO Output (Active Low)', connectionNotes: 'Drive LOW for 1-2ms to hardware-reset chip.' },
      { chipPinName: 'DIO0', chipPinNumber: 6, microcontrollerFunction: 'EXTI Interrupt Pin', connectionNotes: 'Triggers on Rising Edge upon Packet Rx or Tx completion.' },
      { chipPinName: 'ANT', chipPinNumber: 9, microcontrollerFunction: '50Ω Antenna', connectionNotes: 'CRITICAL: Never transmit without an antenna connected!' }
    ]
  }
};

export const BME280_PRESET: PresetDatasheet = {
  id: 'bme280-sensor',
  name: 'BME280 Sensor (Humidity, Pressure, Temp)',
  subtitle: 'Bosch Sensortec I2C/SPI Environmental Sensor',
  chipName: 'BME280',
  packageType: 'LGA-8 (2.5x2.5mm)',
  primaryInterface: 'I2C (0x76 or 0x77) / 4-Wire SPI (Mode 0/3)',
  rawExcerpt: `BOSCH SENSORTEC BME280 Combined humidity and pressure sensor
DATASHEET EXCERPT - PIN DESCRIPTION & ABSOLUTE RATINGS

Pin 1 | GND   | Ground reference
Pin 2 | CSB   | Chip Select (Active Low for SPI). For I2C mode: Connect to VDDIO (pull-up).
Pin 3 | SDI   | Serial Data In. In I2C mode: SDA (Bidirectional data). In SPI mode: MOSI.
Pin 4 | SCK   | Serial Clock. In I2C mode: SCL. In SPI mode: SCK (Max 10MHz).
Pin 5 | SDO   | Serial Data Out. In I2C mode: LSB address select (GND = 0x76, VDDIO = 0x77). In SPI mode: MISO.
Pin 6 | VDDIO | Digital interface supply voltage (1.2V to 3.6V).
Pin 7 | GND   | Ground reference
Pin 8 | VDD   | Main analog/sensor supply voltage (1.71V to 3.6V).

ELECTRICAL LIMITS:
- Absolute Max VDD: 4.25V (Operating Max: 3.6V). NOT 5V tolerant!
- Absolute Max VDDIO: 4.25V.
- DC Current into any pin: Max 5 mA.
- I2C Bus Pull-Ups: Requires 4.7k to 10k pull-up resistors to VDDIO on SDA (Pin 3) and SCL (Pin 4).
- Decoupling: Place 100nF ceramic capacitor between VDD and GND, and 100nF between VDDIO and GND.
- I2C Address strap: Leaving SDO floating can cause unpredictable I2C address flips between 0x76 and 0x77 under EMI.`,
  verifiedResult: {
    chipName: 'BME280',
    manufacturer: 'Bosch Sensortec',
    description: 'Precision digital humidity, pressure, and temperature sensor with dual I2C and SPI interfaces.',
    packageType: 'LGA-8',
    totalPins: 8,
    primaryInterface: 'I2C (Fast Mode 400kHz) / 4-Wire SPI',
    electricalLimits: {
      minSupplyVoltage: 1.71,
      maxSupplyVoltage: 3.6,
      nominalVoltage: 3.3,
      maxIoVoltage: 3.6,
      maxIoCurrentMa: 5,
      operatingTempRange: '-40°C to +85°C',
      notes: 'Strictly 3.3V/1.8V system. 5V logic lines will burn I/O protection diodes.'
    },
    pins: [
      { pinNumber: 1, name: 'GND', type: 'GND', direction: 'POWER', description: 'Ground connection', voltageTolerance: '0V', pullConfig: 'None', alternateFunctions: [] },
      { pinNumber: 2, name: 'CSB', type: 'SPI', direction: 'INPUT', description: 'Chip Select for SPI. Tie to VDDIO for I2C.', voltageTolerance: '3.6V Max', pullConfig: 'Pull-up to VDDIO for I2C mode', alternateFunctions: ['I2C_Enable'] },
      { pinNumber: 3, name: 'SDI / SDA', type: 'I2C', direction: 'BIDIRECTIONAL', description: 'I2C SDA data line or SPI MOSI', voltageTolerance: '3.6V Max', pullConfig: 'External 4.7k Pull-Up required in I2C', alternateFunctions: ['SPI_MOSI'] },
      { pinNumber: 4, name: 'SCK / SCL', type: 'I2C', direction: 'INPUT', description: 'I2C SCL clock line or SPI SCK', voltageTolerance: '3.6V Max', pullConfig: 'External 4.7k Pull-Up required in I2C', alternateFunctions: ['SPI_SCK'] },
      { pinNumber: 5, name: 'SDO / MISO', type: 'I2C', direction: 'BIDIRECTIONAL', description: 'I2C Address Select (GND=0x76, VDD=0x77) or SPI MISO', voltageTolerance: '3.6V Max', pullConfig: 'Hard tie to GND or VDDIO (Do not leave floating)', alternateFunctions: ['ADDR_SELECT', 'SPI_MISO'] },
      { pinNumber: 6, name: 'VDDIO', type: 'POWER', direction: 'POWER', description: 'Digital I/O supply rail (1.2V - 3.6V)', voltageTolerance: '1.2V - 3.6V', pullConfig: 'Bypass 100nF to GND', alternateFunctions: [] },
      { pinNumber: 7, name: 'GND', type: 'GND', direction: 'POWER', description: 'Analog Ground', voltageTolerance: '0V', pullConfig: 'None', alternateFunctions: [] },
      { pinNumber: 8, name: 'VDD', type: 'POWER', direction: 'POWER', description: 'Main sensor core power supply (1.71V - 3.6V)', voltageTolerance: '1.71V - 3.6V', pullConfig: 'Bypass 100nF to GND', alternateFunctions: [] }
    ],
    criticalWarnings: [
      {
        category: 'VOLTAGE',
        severity: 'CRITICAL',
        title: 'Non-5V Tolerant Sensor Core',
        message: 'Max operating voltage on VDD and VDDIO is 3.6V. Using with 5V Arduino without level shifters will destroy the internal ASIC.',
        remediation: 'Power with 3.3V rail. Use level translator on SCL and SDA if host MCU is 5V.'
      },
      {
        category: 'STRAPPING',
        severity: 'WARNING',
        title: 'SDO Floating Address Flap',
        message: 'SDO pin sets the I2C address bit (0x76 vs 0x77). If left floating, capacitive pickup will cause random communication timeout errors.',
        remediation: 'Firmly solder SDO to GND for address 0x76 or VDDIO for address 0x77.'
      },
      {
        category: 'COMMUNICATION',
        severity: 'INFO',
        title: 'I2C Mode Activation Via CSB High',
        message: 'The BME280 starts in SPI mode by default unless CSB is pulled high to VDDIO.',
        remediation: 'Connect CSB (Pin 2) directly to VDDIO with a pull-up resistor to permanently activate I2C communication.'
      }
    ],
    platformCode: {
      stm32_hal: `/**
 * @file bme280_stm32_init.c
 * @brief STM32 HAL I2C Init for BME280 (Address 0x76 << 1 = 0xEC)
 */
#include "stm32f4xx_hal.h"
#define BME280_I2C_ADDR (0x76 << 1)
extern I2C_HandleTypeDef hi2c1;

uint8_t BME280_ReadID(void) {
    uint8_t reg = 0xD0; // Chip ID register
    uint8_t chip_id = 0;
    HAL_I2C_Master_Transmit(&hi2c1, BME280_I2C_ADDR, &reg, 1, 100);
    HAL_I2C_Master_Receive(&hi2c1, BME280_I2C_ADDR, &chip_id, 1, 100);
    return chip_id; // Should return 0x60
}`,
      esp_idf: `/**
 * @file bme280_esp_init.c
 * @brief ESP-IDF I2C Driver Init for BME280
 */
#include "driver/i2c.h"
#define I2C_MASTER_SCL_IO 22
#define I2C_MASTER_SDA_IO 21
#define I2C_MASTER_NUM    I2C_NUM_0

esp_err_t bme280_i2c_init(void) {
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 400000
    };
    i2c_param_config(I2C_MASTER_NUM, &conf);
    return i2c_driver_install(I2C_MASTER_NUM, conf.mode, 0, 0, 0);
}`,
      arduino: `/**
 * @file bme280_arduino.ino
 * @brief Arduino Wire I2C Initialization for BME280
 */
#include <Wire.h>
#define BME280_I2C_ADDR 0x76

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Wire.beginTransmission(BME280_I2C_ADDR);
  Wire.write(0xD0); // ID reg
  Wire.endTransmission();
  Wire.requestFrom(BME280_I2C_ADDR, 1);
  if (Wire.available()) {
    byte id = Wire.read();
    Serial.print("BME280 Chip ID: 0x");
    Serial.println(id, HEX); // 0x60
  }
}
void loop() {}`,
      rp2040_pico: `/**
 * @file bme280_pico.c
 * @brief RP2040 Pico I2C Initialization
 */
#include "pico/stdlib.h"
#include "hardware/i2c.h"
#define I2C_PORT i2c0
#define PIN_SDA 4
#define PIN_SCL 5
#define BME280_ADDR 0x76

void bme280_pico_init(void) {
    i2c_init(I2C_PORT, 400 * 1000);
    gpio_set_function(PIN_SDA, GPIO_FUNC_I2C);
    gpio_set_function(PIN_SCL, GPIO_FUNC_I2C);
    gpio_pull_up(PIN_SDA);
    gpio_pull_up(PIN_SCL);
}`
    },
    wiringGuide: [
      { chipPinName: 'VDD', chipPinNumber: 8, microcontrollerFunction: '3.3V Power Out', connectionNotes: 'Power sensor core' },
      { chipPinName: 'VDDIO', chipPinNumber: 6, microcontrollerFunction: '3.3V Power Out', connectionNotes: 'Power logic interface' },
      { chipPinName: 'GND', chipPinNumber: 1, microcontrollerFunction: 'GND', connectionNotes: 'Common ground return' },
      { chipPinName: 'CSB', chipPinNumber: 2, microcontrollerFunction: 'Tied to 3.3V (VDDIO)', connectionNotes: 'Enables I2C protocol mode' },
      { chipPinName: 'SDI (SDA)', chipPinNumber: 3, microcontrollerFunction: 'I2C SDA', connectionNotes: 'Needs 4.7k pull-up to 3.3V' },
      { chipPinName: 'SCK (SCL)', chipPinNumber: 4, microcontrollerFunction: 'I2C SCL', connectionNotes: 'Needs 4.7k pull-up to 3.3V' },
      { chipPinName: 'SDO', chipPinNumber: 5, microcontrollerFunction: 'Tied to GND', connectionNotes: 'Configures I2C Address 0x76' }
    ]
  }
};

export const PRESET_LIST = [SX1278_PRESET, BME280_PRESET];
