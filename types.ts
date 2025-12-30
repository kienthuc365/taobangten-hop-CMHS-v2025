
export interface TagConfig {
  fontFamily: string;
  fontSize: number;
  color: string;
  yOffset: number;
  xOffset: number;
  fontWeight: 'normal' | 'bold';
  textTransform: 'none' | 'uppercase' | 'capitalize';
}

export interface Student {
  id: number;
  name: string;
}

export const DEFAULT_CONFIG: TagConfig = {
  fontFamily: 'Arial',
  fontSize: 40,
  color: '#000000',
  yOffset: 50,
  xOffset: 50,
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

export const FONT_OPTIONS = [
  'Arial',
  'Times New Roman',
  'Verdana',
  'Tahoma',
  'Georgia',
  'Courier New'
];
