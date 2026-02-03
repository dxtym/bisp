"use client"

import { useRef, useState } from "react";
import { useChat } from '@ai-sdk/react';
import { MessageSquare, Lightbulb, Play } from "lucide-react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
  PromptInputTextarea
} from "@/components/ai-elements/prompt-input"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function Chat() {
  const [text, setText] = useState<string>('');
  const [table, setTable] = useState<Record<string, unknown>[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, status, sendMessage } = useChat();

  const getQuery = (): string => {
    const messagesByAgent = messages.filter((m) => m.role === 'assistant');
    const lastMessageByAgent = messagesByAgent[messagesByAgent.length - 1];
    const query = lastMessageByAgent?.parts.filter((part) => part.type === 'text') ?? [];
    return query.length > 0 ? query[query.length - 1].text : '';
  };

  const handleQuerySubmit = async () => {
    try {
      const query = getQuery();
      const response = await fetch('/api/clickhouse/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "SELECT * FROM orders;"
          // query: query,
        })
      });

      const result = await response.json();
      setTable(result.data.data); // TODO: adjust to a more proper structure
    } catch (error) {
      console.error('Query submit error:', error);
    }
  }

  // TODO: make this component smaller
  return (
    <div className="grid grid-rows-[1fr_auto] h-full">
      <div className="flex justify-center pt-8 px-50 overflow-y-auto">
        <Conversation>
          <ConversationContent className="h-full">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Hech qanday xabar yo'q"
                description="Suhbatni boshlash uchun savol bering."
                icon={<MessageSquare className="size-12" />}
              />
            ) : (
              messages.map((message) => (
                <>
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        return (
                          <MessageResponse key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                            {part.type === 'text' ? part.text : ""}
                          </MessageResponse>
                        );
                      })}
                    </MessageContent>
                  </Message>
                  {
                    status === 'ready' && message.role === 'assistant' && (
                      <div className="flex justify-start flex-col">
                        <Button variant="default" size="sm" className="rounded-full w-8 h-8 p-0" onClick={handleQuerySubmit}>
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    )
                  }
                  {/* TODO: shrink the table width to cover every column */}
                  {
                    table.length > 0 && message.role === 'assistant' && (
                      <div className="mt-4 border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(table[0]).map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.map((row, index) => (
                              <TableRow key={index}>
                                {Object.keys(table[0]).map((column) => (
                                  <TableCell key={column}>
                                    {String(row[column] ?? '')}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  }
                </>
              ))
            )}
            {(['streaming', 'submitted'].includes(status)) && (
              <Message from="assistant" key="thinking">
                <MessageContent>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="size-4" />
                    <span>Fikrlayapman...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <div className="flex items-end pb-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <PromptInput onSubmit={(message: PromptInputMessage) => {
            sendMessage(message);
            setText('');
          }} className="mt-4" globalDrop multiple>
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                ref={textareaRef}
                placeholder="Nima haqida bilmoqchisiz?"
                onChange={(e) => setText(e.target.value)}
              />
            </PromptInputBody>
            <PromptInputFooter className="flex justify-end">
              <PromptInputSubmit disabled={!text && !status} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
