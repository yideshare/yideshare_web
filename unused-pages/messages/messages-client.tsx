//UNUSED

// "use client";

// import * as React from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

// const dummyConversations = [
//   { id: "conv1", name: "Aria Wang", lastMsg: "Leaving soon!" },
//   { id: "conv2", name: "Lena Qian", lastMsg: "Leaving soon!" },
// ];

// export default function MessagesClient() {
//   const [selectedConv, setSelectedConv] = React.useState<string | null>(null);
//   const [messages, setMessages] = React.useState<any[]>([]);
//   const [messageText, setMessageText] = React.useState("");
//   const { toast } = useToast();

//   function handleSelectConversation(id: string) {
//     setSelectedConv(id);
//     setMessages([
//       { sender: "Me", content: "Are you guys still at the airport?" },
//       { sender: "Them", content: "Leaving soon!" },
//     ]);
//   }

//   function handleSend() {
//     if (!messageText.trim()) return;
//     setMessages((prev) => [
//       ...prev,
//       { sender: "Me", content: messageText.trim() },
//     ]);
//     toast({ title: "Message sent", description: messageText.trim() });
//     setMessageText("");
//   }

//   return (
//     <div className="flex h-full min-h-[400px]">
//       {/* Left side: conversation list */}
//       <div className="w-64 border-r flex flex-col">
//         <div className="p-4 font-semibold">Conversations</div>
//         <ScrollArea className="flex-1">
//           <ul className="divide-y">
//             {dummyConversations.map((c) => (
//               <li
//                 key={c.id}
//                 onClick={() => handleSelectConversation(c.id)}
//                 className="p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
//               >
//                 <p className="text-sm font-medium">{c.name}</p>
//                 <p className="text-xs text-muted-foreground">{c.lastMsg}</p>
//               </li>
//             ))}
//           </ul>
//         </ScrollArea>
//       </div>

//       {/* Right side: chat area */}
//       <div className="flex-1 flex flex-col">
//         {selectedConv ? (
//           <>
//             <div className="h-12 border-b flex items-center px-4">
//               <h2 className="text-sm font-medium">
//                 Chat with{" "}
//                 {dummyConversations.find((c) => c.id === selectedConv)?.name}
//               </h2>
//             </div>

//             {/* If you want bigger spacing between messages, do “space-y-4” or “gap-4” */}
//             <ScrollArea className="flex-1 p-4 space-y-4">
//               {messages.map((m, i) => {
//                 const isMe = m.sender === "Me";
//                 return (
//                   <div
//                     key={i}
//                     className={`max-w-[70%] ${
//                       isMe ? "ml-auto text-right" : ""
//                     }`}
//                   >
//                     <span
//                       className={`inline-block rounded px-3 py-2 text-sm ${
//                         isMe
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-secondary"
//                       }`}
//                     >
//                       {m.content}
//                     </span>
//                   </div>
//                 );
//               })}
//             </ScrollArea>

//             <div className="h-12 border-t flex items-center p-2 gap-2">
//               <Input
//                 placeholder="Type a message..."
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     handleSend();
//                   }
//                 }}
//               />
//               <Button onClick={handleSend}>Send</Button>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
//             Select a conversation on the left
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
