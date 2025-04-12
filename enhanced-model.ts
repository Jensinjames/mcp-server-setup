// src/models/enhanced-model.ts
import { z } from 'zod';

// Define the enhanced model schema with zod for validation
export const ModelSchema = z.object({
  // Basic fields
  id: z.string(),
  name: z.string().min(1),
  provider: z.string().min(1),
  parameters: z.number().positive(),
  
  // Version control
  version: z.number().positive().default(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable().optional(),
  createdBy: z.string().optional(),
  
  // Model architecture
  architecture: z.string().optional(),
  baseModel: z.string().optional(),
  fineTuned: z.boolean().default(false),
  
  // Training data
  trainingData: z.object({
    description: z.string().optional(),
    sources: z.array(z.string()).optional(),
    sizeTokens: z.number().optional(),
    domains: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    timeRange: z.object({
      start: z.string().optional(),
      end: z.string().optional()
    }).optional()
  }).optional(),
  
  // Performance metrics
  metrics: z.object({
    accuracy: z.number().min(0).max(1).optional(),
    f1Score: z.number().min(0).max(1).optional(),
    precision: z.number().min(0).max(1).optional(),
    recall: z.number().min(0).max(1).optional(),
    throughput: z.number().optional(), // tokens per second
    latency: z.number().optional(),    // milliseconds
    customMetrics: z.record(z.string(), z.any()).optional()
  }).optional(),
  
  // Hardware requirements
  hardware: z.object({
    minMemoryGB: z.number().optional(),
    recommendedMemoryGB: z.number().optional(),
    minGpuMemoryGB: z.number().optional(),
    recommendedGpuMemoryGB: z.number().optional(),
    quantization: z.string().optional()
  }).optional(),
  
  // Cost information
  pricing: z.object({
    inputCostPer1kTokens: z.number().optional(),
    outputCostPer1kTokens: z.number().optional(),
    currency: z.string().default('USD'),
    finetuningCostPerHour: z.number().optional(),
    bulkDiscounts: z.array(z.object({
      threshold: z.number(),
      discountPercent: z.number()
    })).optional()
  }).optional(),
  
  // Capabilities and limitations
  capabilities: z.object({
    contextWindow: z.number().optional(),
    outputTokenLimit: z.number().optional(),
    supportedLanguages: z.array(z.string()).optional(),
    toolUse: z.boolean().default(false),
    multimodal: z.boolean().default(false),
    modalities: z.array(z.string()).optional() // text, image, audio, video
  }).optional(),
  
  // I/O specification
  inputOutput: z.object({
    inputFormat: z.array(z.string()).optional(),
    outputFormat: z.array(z.string()).optional(),
    examples: z.array(z.object({
      input: z.any(),
      output: z.any(),
      description: z.string().optional()
    })).optional()
  }).optional(),
  
  // Compliance and governance
  compliance: z.object({
    certifications: z.array(z.string()).optional(),
    dataPrivacy: z.array(z.string()).optional(),
    auditReports: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional()
  }).optional(),
  
  // Deployment information
  deployment: z.object({
    availableRegions: z.array(z.string()).optional(),
    deploymentOptions: z.array(z.enum(['cloud', 'on-premise', 'hybrid', 'edge'])).optional(),
    scalability: z.object({
      minInstances: z.number().optional(),
      maxInstances: z.number().optional(),
      autoscaling: z.boolean().default(false)
    }).optional()
  }).optional(),
  
  // Additional metadata
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  documentation: z.string().url().optional(),
  releaseNotes: z.string().optional(),
  deprecated: z.boolean().default(false),
  recommendedAlternative: z.string().optional()
});

export type EnhancedModel = z.infer<typeof ModelSchema>;

/**
 * Convert a basic model to an enhanced model
 */
export function enhanceModel(baseModel: any): EnhancedModel {
  // Start with the base model data
  const enhancedData: Partial<EnhancedModel> = {
    ...baseModel
  };
  
  // Validate and return the enhanced model
  return ModelSchema.parse(enhancedData);
}

/**
 * Utility function to extract a simplified view of a model
 */
export function simplifyModel(model: EnhancedModel) {
  const { id, name, provider, parameters, version, createdAt, updatedAt } = model;
  return { id, name, provider, parameters, version, createdAt, updatedAt };
}
