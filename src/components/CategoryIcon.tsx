import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Film,
  HeartPulse,
  Zap,
  Tv,
  Layers,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Wallet,
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  HelpCircle,
  type LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'Banknote':
      return <Banknote {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
