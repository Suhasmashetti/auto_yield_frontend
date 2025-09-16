interface AggregatorCardProps {
  name: string;
  description: string;
  icon: string;
}

export function AggregatorCard({ name, description,  icon }: AggregatorCardProps) {
  return (
    <div className="p-6 border-2 border-white bg-black hover:bg-white/60 hover:text-black transition-all duration-300 group">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white group-hover:bg-black rounded-full flex items-center justify-center transition-colors duration-300">
            {icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg') || icon.includes('.svg') ? (
              <img 
                src={icon} 
                alt={`${name} logo`} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-black group-hover:text-white font-bold text-sm">{icon}</span>
            )}
          </div>
          <div>
            <h4 className="text-white group-hover:text-black font-semibold transition-colors duration-300">{name}</h4>
            <p className="text-gray-400 group-hover:text-gray-600 text-sm transition-colors duration-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}