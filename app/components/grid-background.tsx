export default function GridBackground() {
  return (
    <div className="fixed top-[10%] bottom-[10%] left-[20%] right-[20%] -z-10 pointer-events-none">
      <div
        className="h-full w-full"
        style={{
          backgroundSize: "50px 50px",
          backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 60%)",
        }}
      />
    </div>
  );
}
