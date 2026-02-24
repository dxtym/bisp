"use client"

import { useRef, useState, useCallback } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { ChatStatus } from "ai";

interface PromptProps {
  status: ChatStatus;
  onSubmit: (message: PromptInputMessage) => void;
}

export default function Prompt({ onSubmit, status }: PromptProps) {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((message: PromptInputMessage) => {
    if (!message.text) return;
    onSubmit(message);
    setText('');
  }, [onSubmit, setText]);

  return (
    <div className="flex my-3">
      <div className="w-full max-w-2xl mx-auto">
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={text}
              ref={textareaRef}
              placeholder="Nima haqida bilmoqchisiz?"
              onChange={(e) => setText(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter className="flex justify-end items-center">
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
