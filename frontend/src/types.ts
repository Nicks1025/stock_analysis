export interface Issue {
  id: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'IMPROVEMENT';
  title: string;
  description: string;
  fileAffected: string;
  potentialFix: string;
  codeSnippetBg?: string;
}

export interface Dependency {
  name: string;
  version: string;
  status: 'INSTALLED' | 'MISSING' | 'UPGRADE_RECOMMENDED';
  type: 'production' | 'development';
  notes?: string;
}

export interface MissingFile {
  path: string;
  description: string;
  category: 'Services' | 'Stores' | 'Components' | 'Common' | 'Utilities';
}

export interface BuildStep {
  id: string;
  title: string;
  orderNum: string;
  description: string;
  filesToTouch: string[];
  instructions: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ScoreDimension {
  label: string;
  score: number;
  weight: number;
  notes: string;
}
