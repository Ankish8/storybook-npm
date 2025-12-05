// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry

export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentDefinition {
  name: string
  description: string
  dependencies: string[]
  files: ComponentFile[]
  // Multi-file component properties (optional)
  internalDependencies?: string[]
  isMultiFile?: boolean
  directory?: string
  mainFile?: string
}

export type Registry = Record<string, ComponentDefinition>

export interface ComponentMeta {
  name: string
  description: string
  dependencies: string[]
  category: string
  internalDependencies?: string[]
}
