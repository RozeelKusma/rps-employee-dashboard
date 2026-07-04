interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader = ({ size = 48, color = "border-blue-500" }: LoaderProps) => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-gray-200`}
        />

        {/* Animated Ring */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-transparent ${color} border-t-current animate-spin`}
        />

        {/* Center Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-current animate-ping text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
