import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';
export function Icon({
  name,
  size = 22,
  color = '#ad3e30',
  filled = false,
}: {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  const paths: Record<string, string> = {
    back: 'M20 12H4 m6-6-6 6 6 6',
    home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    bag: 'M6 7h12l2 14H4L6 7zm3 0V5a3 3 0 0 1 6 0v2',
    cart: 'm2 2 2 0 2.4 11.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 6H5 M10 21a1 1 0 1 0-2 0 1 1 0 0 0 2 0 M21 21a1 1 0 1 0-2 0 1 1 0 0 0 2 0',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    heart:
      'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z',
    leaf: 'M20 4c-8-2-16 1-16 8a6 6 0 0 0 6 6c7 0 10-6 10-14z M4 21 16 9',
    arrow: 'M4 12h16 m-6-6 6 6-6 6',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d={paths[name] || paths.bag} />
    </Svg>
  );
}
export function Pumpkin({ size = 36, color = '#ad3e30', paper = '#fffaf1' }) {
  return (
    <Svg width={size} height={(size * 54) / 54} viewBox="0 0 54 54" fill="none">
      <Path d="M27 17C25 9 30 5 35 5" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M27 14c5-7 12-4 12-4-1 5-7 8-12 4Z" fill={color} />
      <Ellipse cx={17} cy={32} rx={12} ry={16} stroke={color} strokeWidth={1.8} />
      <Ellipse cx={37} cy={32} rx={12} ry={16} stroke={color} strokeWidth={1.8} />
      <Ellipse cx={27} cy={32} rx={11} ry={18} fill={paper} stroke={color} strokeWidth={1.8} />
      <Path d="M27 15v34" stroke={color} strokeWidth={1.4} />
    </Svg>
  );
}
