import { notFound } from "next/navigation";
import Link from "next/link";
import { LuArrowUpRight, LuBookOpen, LuBot } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/avatar";
import { ConversationRepository } from "@/lib/repository/conversation";
import { userRepository } from "@/lib/repository/user";
import { cn } from "@/lib/utils";

const AVATAR_SIZE = 32;
const repository = new ConversationRepository();

export default async function SharedConversationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const conversation = await repository.getByShareToken(token);
  if (!conversation) notFound();

  const owner = await userRepository.getById(conversation.userId);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-4">
          <Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold">
            <LuBookOpen className="h-5 w-5" />
            Kutoob
          </Link>
          <h1 className="flex-1 truncate text-center text-lg font-medium">
            {conversation.title}
          </h1>
          <Link href="/" className="shrink-0" aria-label="Sinash">
            <Button
              size="icon"
              className="group rounded-sm bg-neutral-900 text-white! hover:bg-black dark:bg-white dark:!text-black dark:hover:bg-neutral-100"
            >
              <LuArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-6 py-8">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            Suhbat bosh.
          </p>
        ) : (
          conversation.messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex items-start gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <div
                  className="flex shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-neutral-300 ring-offset-1 ring-offset-white dark:ring-white/20 dark:ring-offset-black"
                  style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                >
                  <LuBot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-md border px-4 py-3 text-sm",
                  m.role === "user"
                    ? "border-muted bg-muted/40"
                    : "border-border bg-background",
                )}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <UserAvatar name={owner?.name} image={owner?.image} size={AVATAR_SIZE} />
              )}
            </div>
          ))
        )}
      </main>
      <div className="sticky bottom-0 border-t bg-background">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground">
            Kutoob bilan oz malumotlaringizni tahlil qiling.
          </p>
          <p className="text-sms text-muted-foreground/80">{new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
