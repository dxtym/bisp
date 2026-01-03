import Chat from "@/pages/chat";

export default function Home() {
  return (
    <div className="grid h-screen grid-cols-[1fr_3fr_1fr]">
      <span></span>
      <div className="overflow-hidden">
        <Chat />
      </div>
      <span></span>
    </div>
  );
}
