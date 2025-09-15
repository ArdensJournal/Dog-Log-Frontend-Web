import { MdWaterDrop, MdCircle } from 'react-icons/md';

interface PottyTypeIconProps {
  iconName: string;
  className?: string;
}

const ICON_MAP = {
  'MdWaterDrop': MdWaterDrop,
  'MdCircle': MdCircle,
};

export default function PottyTypeIcon({ iconName, className = "text-3xl" }: PottyTypeIconProps) {
  // Apply colors based on icon type
  if (iconName === 'MdWaterDrop') {
    return <MdWaterDrop className={`${className} text-yellow-500`} />;
  } else if (iconName === 'MdCircle') {
    return <MdCircle className={`${className} text-amber-800`} />;
  }
  
  const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
  
  if (!IconComponent) {
    return <span className={className}>?</span>;
  }
  
  return <IconComponent className={className} />;
}
