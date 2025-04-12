// src/models/version-history.ts
import { DatabaseAdapter, ModelData } from '../db/database-adapter.js';

export interface ModelVersion extends ModelData {
  versionNumber: number;
  createdAt: Date;
  createdBy: string;
  changeDescription?: string;
  tags?: string[];
}

export class ModelVersionService {
  private db: DatabaseAdapter;
  private versionHistory: Record<string, ModelVersion[]> = {};

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  /**
   * Initialize version history from existing models
   */
  async initialize(): Promise<void> {
    const models = await this.db.getAllModels();
    for (const model of models) {
      this.versionHistory[model.id] = [{
        ...model,
        versionNumber: 1,
        createdAt: model.createdAt || new Date(),
        createdBy: 'system',
        tags: ['initial']
      }];
    }
  }

  /**
   * Get version history for a model
   */
  async getVersionHistory(modelId: string): Promise<ModelVersion[]> {
    return this.versionHistory[modelId] || [];
  }

  /**
   * Get a specific version of a model
   */
  async getModelVersion(modelId: string, versionNumber: number): Promise<ModelVersion | null> {
    const versions = this.versionHistory[modelId] || [];
    return versions.find(v => v.versionNumber === versionNumber) || null;
  }

  /**
   * Create a new version for a model
   */
  async createVersion(
    modelId: string, 
    updatedModel: Partial<ModelData>, 
    userId: string,
    changeDescription?: string,
    tags?: string[]
  ): Promise<ModelVersion> {
    // Get current model
    const currentModel = await this.db.getModelById(modelId);
    if (!currentModel) {
      throw new Error(`Model with ID ${modelId} not found`);
    }

    // Get current versions
    const versions = this.versionHistory[modelId] || [];
    const latestVersion = versions.length > 0 ? versions[0].versionNumber : 0;
    const newVersionNumber = latestVersion + 1;

    // Create new version
    const newVersion: ModelVersion = {
      ...currentModel,
      ...updatedModel,
      versionNumber: newVersionNumber,
      createdAt: new Date(),
      createdBy: userId,
      changeDescription,
      tags
    };

    // Add to history (at beginning for chronological order)
    if (!this.versionHistory[modelId]) {
      this.versionHistory[modelId] = [];
    }
    this.versionHistory[modelId].unshift(newVersion);

    // Update the model in DB with new version number
    await this.db.updateModel(modelId, { 
      ...updatedModel,
      version: newVersionNumber
    });

    return newVersion;
  }

  /**
   * Roll back a model to a previous version
   */
  async rollbackToVersion(modelId: string, versionNumber: number, userId: string): Promise<ModelVersion> {
    const targetVersion = await this.getModelVersion(modelId, versionNumber);
    if (!targetVersion) {
      throw new Error(`Version ${versionNumber} for model ${modelId} not found`);
    }

    // Create a new version with the content of the target version
    const { versionNumber: _, createdAt: __, createdBy: ___, changeDescription: ____, tags: _____, ...modelData } = targetVersion;

    return this.createVersion(
      modelId,
      modelData,
      userId,
      `Rollback to version ${versionNumber}`,
      ['rollback', `from-v${versionNumber}`]
    );
  }

  /**
   * Add tags to a specific version
   */
  async tagVersion(modelId: string, versionNumber: number, tags: string[]): Promise<ModelVersion> {
    const versions = this.versionHistory[modelId] || [];
    const versionIndex = versions.findIndex(v => v.versionNumber === versionNumber);
    
    if (versionIndex === -1) {
      throw new Error(`Version ${versionNumber} for model ${modelId} not found`);
    }

    const version = versions[versionIndex];
    const updatedTags = [...new Set([...(version.tags || []), ...tags])];
    
    const updatedVersion = {
      ...version,
      tags: updatedTags
    };

    versions[versionIndex] = updatedVersion;
    return updatedVersion;
  }

  /**
   * Remove tags from a specific version
   */
  async removeTagFromVersion(modelId: string, versionNumber: number, tag: string): Promise<ModelVersion> {
    const versions = this.versionHistory[modelId] || [];
    const versionIndex = versions.findIndex(v => v.versionNumber === versionNumber);
    
    if (versionIndex === -1) {
      throw new Error(`Version ${versionNumber} for model ${modelId} not found`);
    }

    const version = versions[versionIndex];
    const updatedTags = (version.tags || []).filter(t => t !== tag);
    
    const updatedVersion = {
      ...version,
      tags: updatedTags
    };

    versions[versionIndex] = updatedVersion;
    return updatedVersion;
  }

  /**
   * Compare two versions of a model
   */
  async compareVersions(modelId: string, version1: number, version2: number): Promise<Record<string, any>> {
    const v1 = await this.getModelVersion(modelId, version1);
    const v2 = await this.getModelVersion(modelId, version2);
    
    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    const differences: Record<string, { before: any, after: any }> = {};

    // Compare all fields
    for (const key in v1) {
      if (key === 'versionNumber' || key === 'createdAt' || key === 'createdBy' || key === 'changeDescription' || key === 'tags') {
        continue; // Skip metadata fields
      }
      
      if (JSON.stringify(v1[key]) !== JSON.stringify(v2[key])) {
        differences[key] = {
          before: v2[key], // v2 is the older version
          after: v1[key]   // v1 is the newer version
        };
      }
    }

    return differences;
  }
}
