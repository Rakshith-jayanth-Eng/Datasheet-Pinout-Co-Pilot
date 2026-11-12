import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Datasheet Analysis Endpoint
app.post('/api/analyze-datasheet', async (req: Request, res: Response) => {
  try {
    const { datasheetText, customInstructions, preferredPlatform } = req.body;

    if (!datasheetText || typeof datasheetText !== 'string' || datasheetText.trim().length === 0) {
      res.status(400).json({
        error: 'Datasheet excerpt or text is required for analysis.',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your .env file or Settings > Secrets panel.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are an elite Senior Embedded Hardware and Firmware Systems Architect.
Your task is to exhaustively analyze semiconductor / microcontroller / sensor datasheet excerpts, schematics, and pinout tables.

You must extract precision technical data and return structured JSON matching the provided schema:
1. PINS:
   - Extract every pin number, signal name, primary and alternate functions.
   - Accurately categorize pin type: POWER, GND, SPI, I2C, UART, GPIO, INTERRUPT, RESET, ANALOG, RF, CRYSTAL, NC.
   - Determine direction: INPUT, OUTPUT, BIDIRECTIONAL, POWER.
   - Identify recommended pull-up / pull-down states (e.g., "10k external pull-up required", "Internal weak pull-up", "Pull-down", "None / Floating").
   - Explicitly note maximum voltage tolerance per pin (e.g. "VBAT + 0.3V (3.7V Max, NOT 5V tolerant)", "5V tolerant", etc.).
   - Mark isCritical=true for reset, chip selects, clock lines, high-frequency RF, or power pins.

2. CRITICAL HARDWARE WARNINGS:
   - Identify critical hazards: Overvoltage vulnerabilities (e.g. 3.3V chip exposed to 5V Arduino lines), bootstrapping pin conflicts (strapping pins that alter bootloader mode if pulled during reset), floating chip select / reset lines causing sporadic bus hangs or resets, bypass decoupling requirements (e.g., 100nF ceramic adjacent to pins), power amplifier transmission without matched antenna loads, and bus pull-up necessities.
   - For every warning, provide: category, severity (CRITICAL, WARNING, INFO), title, detailed explanation message, and actionable remediation instructions.

3. READY-TO-COMPILE C/C++ INITIALIZATION CODE:
   Generate modular, production-ready, clean C/C++ driver initialization code for ALL 4 platforms:
   - 'stm32_hal': STM32 HAL GPIO_InitTypeDef and SPI/I2C/UART handle configuration, pin #defines, hardware reset pulses, clock enables, and register read/write verification.
   - 'esp_idf': ESP-IDF driver code with gpio_config_t, spi_bus_config_t / spi_device_interface_config_t or i2c_config_t, ISR handlers, and FreeRTOS delays.
   - 'arduino': Clean Arduino C++ code with #define pin mappings, pinMode setup, hardware reset pulse, SPI/Wire setup, register check, and interrupts.
   - 'rp2040_pico': Raspberry Pi Pico C/C++ SDK code using hardware/gpio.h and hardware/spi.h (or hardware/i2c.h), gpio_init, gpio_set_function, spi_init, and callbacks.
   All code snippets must be complete, modular, compilable without placeholders, and include proper comments on voltage warnings.

4. WIRING GUIDE:
   Provide an intuitive pin-to-microcontroller connection mapping (chip pin -> MCU function -> hardware wiring note).`;

    const userPrompt = `Analyze the following datasheet excerpt:
---
${datasheetText.slice(0, 35000)}
---
Target Platform Focus: ${preferredPlatform || 'All Platforms (STM32 HAL, ESP-IDF, Arduino, Raspberry Pi Pico)'}
Additional Instructions: ${customInstructions || 'Provide full pinout, electrical limits, critical warnings, and modular C/C++ initialization code.'}`;

    function cleanErrorMessage(errorObj: unknown): string {
      if (errorObj instanceof Error) {
        try {
          const parsed = JSON.parse(errorObj.message);
          if (parsed.error?.message) {
            return parsed.error.message;
          }
        } catch {
          // not JSON, keep original message
        }
        return errorObj.message;
      }
      return 'An unexpected server error occurred.';
    }

    let response;
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                chipName: { type: Type.STRING, description: 'Component or IC model name' },
                manufacturer: { type: Type.STRING, description: 'Manufacturer company name' },
                description: { type: Type.STRING, description: 'Concise component function and summary' },
                packageType: { type: Type.STRING, description: 'IC package footprint (e.g., QFN-28, DIP-16, SOIC-8)' },
                totalPins: { type: Type.INTEGER, description: 'Total number of extracted pins' },
                primaryInterface: { type: Type.STRING, description: 'Primary bus interface (e.g., SPI, I2C, UART)' },
                electricalLimits: {
                  type: Type.OBJECT,
                  properties: {
                    minSupplyVoltage: { type: Type.NUMBER, description: 'Minimum operating voltage in Volts' },
                    maxSupplyVoltage: { type: Type.NUMBER, description: 'Maximum safe operating voltage in Volts' },
                    nominalVoltage: { type: Type.NUMBER, description: 'Nominal typical operating voltage in Volts' },
                    maxIoVoltage: { type: Type.NUMBER, description: 'Absolute maximum input/output pin voltage in Volts' },
                    maxIoCurrentMa: { type: Type.NUMBER, description: 'Max I/O current rating in mA' },
                    operatingTempRange: { type: Type.STRING, description: 'Temperature range (e.g. -40C to +85C)' },
                    notes: { type: Type.STRING, description: 'Critical electrical limit notes' },
                  },
                  required: ['minSupplyVoltage', 'maxSupplyVoltage', 'nominalVoltage', 'maxIoVoltage'],
                },
                pins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pinNumber: { type: Type.INTEGER, description: 'Physical pin number' },
                      name: { type: Type.STRING, description: 'Signal or pin name' },
                      type: {
                        type: Type.STRING,
                        description: 'Pin classification: POWER, GND, SPI, I2C, UART, GPIO, INTERRUPT, RESET, ANALOG, RF, CRYSTAL, NC',
                      },
                      direction: {
                        type: Type.STRING,
                        description: 'Direction: INPUT, OUTPUT, BIDIRECTIONAL, POWER',
                      },
                      description: { type: Type.STRING, description: 'Pin description and purpose' },
                      voltageTolerance: { type: Type.STRING, description: 'Voltage rating (e.g. 3.3V, 5V-tolerant)' },
                      pullConfig: { type: Type.STRING, description: 'Pull-up / pull-down recommendation' },
                      alternateFunctions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Multiplexed alternate functions',
                      },
                      isCritical: { type: Type.BOOLEAN, description: 'Flag for high-importance pins' },
                    },
                    required: ['pinNumber', 'name', 'type', 'direction', 'description', 'voltageTolerance', 'pullConfig'],
                  },
                },
                criticalWarnings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: {
                        type: Type.STRING,
                        description: 'Category: VOLTAGE, STRAPPING, DECOUPLING, RESET_TIMING, RF_MATCHING, COMMUNICATION, GENERAL',
                      },
                      severity: {
                        type: Type.STRING,
                        description: 'Severity level: CRITICAL, WARNING, INFO',
                      },
                      title: { type: Type.STRING, description: 'Short warning headline' },
                      message: { type: Type.STRING, description: 'Technical explanation of hazard' },
                      remediation: { type: Type.STRING, description: 'Hardware or firmware fix to prevent failure' },
                    },
                    required: ['category', 'severity', 'title', 'message', 'remediation'],
                  },
                },
                platformCode: {
                  type: Type.OBJECT,
                  properties: {
                    stm32_hal: { type: Type.STRING, description: 'Ready-to-compile STM32 HAL C initialization code' },
                    esp_idf: { type: Type.STRING, description: 'Ready-to-compile ESP-IDF C initialization code' },
                    arduino: { type: Type.STRING, description: 'Ready-to-compile Arduino C++ initialization sketch' },
                    rp2040_pico: { type: Type.STRING, description: 'Ready-to-compile Raspberry Pi Pico C/C++ SDK initialization code' },
                  },
                  required: ['stm32_hal', 'esp_idf', 'arduino', 'rp2040_pico'],
                },
                wiringGuide: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      chipPinName: { type: Type.STRING },
                      chipPinNumber: { type: Type.INTEGER },
                      microcontrollerFunction: { type: Type.STRING },
                      connectionNotes: { type: Type.STRING },
                    },
                    required: ['chipPinName', 'chipPinNumber', 'microcontrollerFunction', 'connectionNotes'],
                  },
                },
              },
              required: [
                'chipName',
                'manufacturer',
                'description',
                'packageType',
                'totalPins',
                'primaryInterface',
                'electricalLimits',
                'pins',
                'criticalWarnings',
                'platformCode',
                'wiringGuide',
              ],
            },
          },
        });
        break;
      } catch (err) {
        lastError = err;
        const errMsg = cleanErrorMessage(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED');

        if (attempt < 3 && isTransient) {
          console.warn(`Transient Gemini error (attempt ${attempt}/3). Retrying in ${attempt * 1500}ms...`);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
          continue;
        }
        throw err;
      }
    }

    if (!response) {
      throw lastError || new Error('Failed to obtain model response after retries.');
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini model returned an empty response.');
    }

    const parsedData = JSON.parse(responseText);
    parsedData.timestamp = new Date().toISOString();

    res.json(parsedData);
  } catch (err: unknown) {
    console.error('Error analyzing datasheet:', err);
    let errorMessage = 'Unknown server error';
    if (err instanceof Error) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error?.message) {
          errorMessage = parsed.error.message;
        } else {
          errorMessage = err.message;
        }
      } catch {
        errorMessage = err.message;
      }
    }
    res.status(500).json({
      error: errorMessage,
    });
  }
});

// Start dev or production server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Datasheet Pinout Co-Pilot running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
