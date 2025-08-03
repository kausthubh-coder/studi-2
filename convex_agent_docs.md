convec agent docs:

https://docs.convex.dev/agents/getting-started:
Getting Started with Agent

To install the agent component, you'll need an existing Convex project. New to Convex? Go through the tutorial.

Run npm create convex or follow any of the quickstarts to set one up.
Installation

Install the component package:

npm install @convex-dev/agent

Create a convex.config.ts file in your app's convex/ folder and install the component by calling use:

// convex/convex.config.ts
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();
app.use(agent);

export default app;

Then run npx convex dev to generate code for the component. This needs to successfully run once before you start defining Agents.
Defining your first Agent

import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
  name: "My Agent",
  chat: openai.chat("gpt-4o-mini"),
});

Using it:

import { action } from "./_generated/server";
import { v } from "convex/values";

export const helloWorld = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    // const userId = await getAuthUserId(ctx);
    const { thread } = await agent.createThread(ctx, { userId });
    const result = await thread.generateText({ prompt });
    return result.text;
  },
});

If you get type errors about components.agent, ensure you've run npx convex dev to generate code for the component.

That's it! Next check out creating Threads and Messages.
Customizing the agent

The agent by default only needs a chat model to be configured. However, for vector search, you'll need a textEmbedding model. A name is helpful to attribute each message to a specific agent. Other options are defaults that can be over-ridden at each LLM call-site.

import { tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Agent, createTool } from "@convex-dev/agent";
import { components } from "./_generated/api";

// Define an agent similarly to the AI SDK
const supportAgent = new Agent(components.agent, {
  // The chat completions model to use for the agent.
  chat: openai.chat("gpt-4o-mini"),
  // The default system prompt if not over-ridden.
  instructions: "You are a helpful assistant.",
  tools: {
    // Convex tool
    myConvexTool: createTool({
      description: "My Convex tool",
      args: z.object({...}),
      // Note: annotate the return type of the handler to avoid type cycles.
      handler: async (ctx, args): Promise<string> => {
        return "Hello, world!";
      },
    }),
    // Standard AI SDK tool
    myTool: tool({ description, parameters, execute: () => {}}),
  },
  // Embedding model to power vector search of message history (RAG).
  textEmbedding: openai.embedding("text-embedding-3-small"),
  // Used for fetching context messages. See https://docs.convex.dev/agents/context
  contextOptions,
  // Used for storing messages. See https://docs.convex.dev/agents/messages
  storageOptions,
  // Used for limiting the number of steps when tool calls are involved.
  // NOTE: if you want tool calls to happen automatically with a single call,
  // you need to set this to something greater than 1 (the default).
  maxSteps: 1,
  // Used for limiting the number of retries when a tool call fails. Default: 3.
  maxRetries: 3,
  // Used for tracking token usage. See https://docs.convex.dev/agents/usage-tracking
  usageHandler: async (ctx, { model, usage }) => {
    // ... log, save usage to your database, etc.
  },
});

https://docs.convex.dev/agents/threads:
Threads

Threads are a way to group messages together in a linear history. All messages saved in the Agent component are associated with a thread. When a message is generated based on a prompt, it saves the user message and generated agent message(s) automatically.

Threads can be associated with a user, and messages can each individually be associated with a user. By default, messages are associated with the thread's user.
Creating a thread

You can create a thread in a mutation or action. If you create it in an action, it will also return a thread (see below) and you can start calling LLMs and generating messages. If you specify a userId, the thread will be associated with that user and messages will be saved to the user's history.

const agent = new Agent(components.agent, { chat: chatModel });
//...
const { threadId } = await agent.createThread(ctx);

You may also pass in metadata to set on the thread:

const userId = await getAuthUserId(ctx);
const { thread } = await agent.createThread(ctx, {
  userId,
  title: "My thread",
  summary: "This is a summary of the thread",
});

Metadata may be provided as context to the agent automatically in the future, but for now it's a convenience that helps organize threads in the Playground.
Continuing a thread

You can continue a thread from an action in order to send more messages. Any agent can continue a thread created by any other agent.

export const generateReplyToPrompt = action({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    // await authorizeThreadAccess(ctx, threadId);
    const { thread } = await agent.continueThread(ctx, { threadId });
    const result = await thread.generateText({ prompt });
    return result.text;
  },
});

The thread from continueThread or createThread (available in actions only) is a Thread object, which has convenience methods that are thread-specific:

    thread.getMetadata() to get the userId, title, summary etc.
    thread.updateMetadata({ patch: { title, summary, userId} }) to update the metadata
    thread.generateText({ prompt, ... }) - equivalent to agent.generateText(ctx, { threadId }, { prompt, ... })
    thread.streamText({ prompt, ... }) - equivalent to agent.streamText(ctx, { threadId }, { prompt, ... })
    thread.generateObject({ prompt, ... }) - equivalent to agent.generateObject(ctx, { threadId }, { prompt, ... })
    thread.streamObject({ prompt, ... }) - equivalent to agent.streamObject(ctx, { threadId }, { prompt, ... })

See Messages docs for more details on generating messages.
Overriding behavior with agent.continueThread

You can override a few things when using agent.continueThread:

const { thread } = await agent.continueThread(ctx, {
  threadId,
  userId, // Associates generated messages with this user.
  tools, // Replaces the agent's default tools
  usageHandler, // Replaces the agent's default usage handler
});

await thread.generateText({ prompt }); // Uses the thread-specific options.

Deleting threads

You can delete threads by their threadId.

Asynchronously (from a mutation or action):

await agent.deleteThreadAsync(ctx, { threadId });

Synchronously in batches (from an action):

await agent.deleteThreadSync(ctx, { threadId });

You can also delete all threads by a user by their userId.

await agent.deleteThreadsByUserId(ctx, { userId });

Getting all threads owned by a user

const threads = await ctx.runQuery(
  components.agent.threads.listThreadsByUserId,
  { userId, paginationOpts: args.paginationOpts },
);

Deleting all threads and messages associated with a user

Asynchronously (from a mutation or action):

await ctx.runMutation(components.agent.users.deleteAllForUserIdAsync, {
  userId,
});

Synchronously (from an action):

await ctx.runMutation(components.agent.users.deleteAllForUserId, { userId });

Getting messages in a thread

See messages.mdx for more details.

import { listMessages } from "@convex-dev/agent";

const messages = await listMessages(ctx, components.agent, {
  threadId,
  excludeToolMessages: true,
  paginationOpts: { cursor: null, numItems: 10 }, // null means start from the beginning
});

Creating a thread without an Agent

Note: if you're in an environment where you don't have access to the Agent, then you can create the thread more manually:

const { _id: threadId } = await ctx.runMutation(
  components.agent.threads.createThread,
  { userId, title, summary },
);

https://docs.convex.dev/agents/messages:
Messages

The Agent component stores message and thread history to enable conversations between humans and agents.

To see how humans can act as agents, see Human Agents.
Generating a message

To generate a message, you provide a prompt (as a string or a list of messages) to be used as context to generate one or more messages via an LLM, using calls like streamText or generateObject.

The message history will be provided by default as context. See LLM Context for details on configuring the context provided.

The arguments to generateText and others are the same as the AI SDK, except you don't have to provide a model. By default it will use the agent's chat model.

Note: authorizeThreadAccess referenced below is a function you would write to authenticate and authorize the user to access the thread. You can see an example implementation in threads.ts.

See chat/basic.ts or chat/streaming.ts for live code examples.
Basic approach (synchronous)

export const generateReplyToPrompt = action({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    // await authorizeThreadAccess(ctx, threadId);
    const result = await agent.generateText(ctx, { threadId }, { prompt });
    return result.text;
  },
});

Note: best practice is to not rely on returning data from the action.Instead, query for the thread messages via the useThreadMessages hook and receive the new message automatically. See below.
Saving the prompt then generating response(s) asynchronously

While the above approach is simple, generating responses asynchronously provide a few benefits:

    You can set up optimistic UI updates on mutations that are transactional, so the message will be shown optimistically on the client until the message is saved and present in your message query.
    You can save the message in the same mutation (transaction) as other writes to the database. This message can the be used and re-used in an action with retries, without duplicating the prompt message in the history. See workflows for more details.
    Thanks to the transactional nature of mutations, the client can safely retry mutations for days until they run exactly once. Actions can transiently fail.

Any clients listing the messages will automatically get the new messages as they are created asynchronously.

To generate responses asynchronously, you need to first save the message, then pass the messageId as promptMessageId to generate / stream text.

import { components, internal } from "./_generated/api";
import { saveMessage } from "@convex-dev/agent";
import { internalAction, mutation } from "./_generated/server";
import { v } from "convex/values";

// Step 1: Save a user message, and kick off an async response.
export const sendMessage = mutation({
  args: { threadId: v.id("threads"), prompt: v.string() },
  handler: async (ctx, { threadId, prompt }) => {
    const userId = await getUserId(ctx);
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      userId,
      prompt,
      skipEmbeddings: true,
    });
    await ctx.scheduler.runAfter(0, internal.example.generateResponseAsync, {
      threadId,
      promptMessageId: messageId,
    });
  },
});

// Step 2: Generate a response to a user message.
export const generateResponseAsync = internalAction({
  args: { threadId: v.string(), promptMessageId: v.string() },
  handler: async (ctx, { threadId, promptMessageId }) => {
    await agent.generateText(ctx, { threadId }, { promptMessageId });
  },
});

// This is a common enough need that there's a utility to save you some typing.
// Equivalent to the above.
export const generateResponseAsync = agent.asTextAction();

Note: when calling agent.saveMessage, embeddings are generated automatically when you save messages from an action and you have a text embedding model set. However, if you're saving messages in a mutation, where calling an LLM is not possible, it will generate them automatically when generateText receives a promptMessageId that lacks an embedding and you have a text embedding model configured. This is useful for workflows where you want to save messages in a mutation, but not generate them. In these cases, pass skipEmbeddings: true to agent.saveMessage to avoid the warning. If you're calling saveMessage directly, you need to provide the embedding yourself, so skipEmbeddings is not a parameter.
Streaming

Streaming follows the same pattern as the basic approach, but with a few differences, depending on the type of streaming you're doing.

The easiest way to stream is to pass { saveStreamDeltas: true } to streamText. This will save chunks of the response as deltas as they're generated, so all clients can subscribe to the stream and get live-updating text via normal Convex queries. See below for details on how to retrieve and display the stream.

const { thread } = await storyAgent.continueThread(ctx, { threadId });
const result = await thread.streamText({ prompt }, { saveStreamDeltas: true });
// We need to make sure the stream is finished - by awaiting each chunk or
// using this call to consume it all.
await result.consumeStream();

This can be done in an async function, where http streaming to a client is not possible. Under the hood it will chunk up the response and debounce saving the deltas to prevent excessive bandwidth usage. You can pass more options to saveStreamDeltas to configure the chunking and debouncing.

  { saveStreamDeltas: { chunking: "line", throttleMs: 1000 } },

    chunking can be "word", "line", a regex, or a custom function.
    throttleMs is how frequently the deltas are saved. This will send multiple chunks per delta, writes sequentially, and will not write faster than the throttleMs (single-flighted ).

You can also consume the stream in all the ways you can with the underlying AI SDK - for instance iterating over the content, or using result.toDataStreamResponse().

const result = await thread.streamText({ prompt });
// Note: if you do this, don't also call `.consumeStream()`.
for await (const textPart of result.textStream) {
  console.log(textPart);
}

See below for how to retrieve the stream deltas to a client.
Generating an object

Similar to the AI SDK, you can generate or stream an object. The same arguments apply, except you don't have to provide a model. It will use the agent's default chat model.

import { z } from "zod";

const result = await thread.generateObject({
  prompt: "Generate a plan based on the conversation so far",
  schema: z.object({...}),
});

Retrieving messages

For streaming, it will save deltas to the database, so all clients querying for messages will get the stream.

See chat/basic.ts for the server-side code, and chat/streaming.ts for the streaming example.

You have a function that both allows paginating over messages. To support streaming, you can also take in a streamArgs object and return the streams result from syncStreams.

import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { listMessages } from "@convex-dev/agent";
import { components } from "./_generated/api";

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { threadId, paginationOpts }) => {
    // await authorizeThreadAccess(ctx, threadId);

    const paginated = await listMessages(ctx, components.agent, {
      threadId,
      paginationOpts,
    });

    // Here you could filter out / modify the documents
    return paginated;
  },
});

Retrieving streamed deltas

To retrieve the stream deltas, you only have to make a few changes to the query:

 import { paginationOptsValidator } from "convex/server";
-import { listMessages } from "@convex-dev/agent";
+import { vStreamArgs, listMessages, syncStreams } from "@convex-dev/agent";
 import { components } from "./_generated/api";

 export const listThreadMessages = query({
   args: {
     threadId: v.string(),
     paginationOpts: paginationOptsValidator,
+    streamArgs: vStreamArgs,
   },
   handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {
     // await authorizeThreadAccess(ctx, threadId);

     const paginated = await listMessages(ctx, components.agent, {
       threadId,
       paginationOpts
     });
+    const streams = await syncStreams(ctx, components.agent, {
+      threadId,
+      streamArgs
+    });

     // Here you could filter out / modify the documents & stream deltas.
-    return paginated;
+    return { ...paginated, streams };
   },
 });

You can then use the instructions below along with the useSmoothText hook to show the streaming text in a UI.
Showing messages in React

See ChatStreaming.tsx for a streaming example, or ChatBasic.tsx for a non-streaming example.
useThreadMessages hook

The crux is to use the useThreadMessages hook. For streaming, pass in stream: true to the hook.

import { api } from "../convex/_generated/api";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";

function MyComponent({ threadId }: { threadId: string }) {
  const messages = useThreadMessages(
    api.chat.streaming.listMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  );
  return (
    <div>
      {toUIMessages(messages.results ?? []).map((message) => (
        <div key={message.key}>{message.content}</div>
      ))}
    </div>
  );
}

toUIMessages helper

import { toUIMessages, type UIMessage } from "@convex-dev/agent/react";

toUIMessages is a helper function that transforms messages into AI SDK "UIMessage"s. This is a convenient data model for displaying messages:

    parts is an array of parts (e.g. "text", "file", "image", "toolCall", "toolResult")
    content is a string of the message content.
    role is the role of the message (e.g. "user", "assistant", "system").

The helper also adds some additional fields:

    key is a unique identifier for the message.
    order is the order of the message in the thread.
    stepOrder is the step order of the message in the thread.
    status is the status of the message (or "streaming").
    agentName is the name of the agent that generated the message.

To reference these, ensure you're importing UIMessage from @convex-dev/agent/react.
Text smoothing with the useSmoothText hook

The useSmoothText hook is a simple hook that smooths the text as it changes. It can work with any text, but is especially handy for streaming text.

import { useSmoothText } from "@convex-dev/agent/react";

// in the component
const [visibleText] = useSmoothText(message.content);

You can configure the initial characters per second. It will adapt over time to match the average speed of the text coming in.

By default it won't stream the first text it receives unless you pass in startStreaming: true. To start streaming immediately when you have a mix of streaming and non-streaming messages, do:

import { useSmoothText, type UIMessage } from "@convex-dev/agent/react";

function Message({ message }: { message: UIMessage }) {
  const [visibleText] = useSmoothText(message.content, {
    startStreaming: message.status === "streaming",
  });
  return <div>{visibleText}</div>;
}

Optimistic updates for sending messages

The optimisticallySendMessage function is a helper function for sending a message, so you can optimistically show a message in the message list until the mutation has completed on the server.

Pass in the query that you're using to list messages, and it will insert the ephemeral message at the top of the list.

const sendMessage = useMutation(
  api.streaming.streamStoryAsynchronously,
).withOptimisticUpdate(
  optimisticallySendMessage(api.streaming.listThreadMessages),
);

If your arguments don't include { threadId, prompt } then you can use it as a helper function in your optimistic update:

import { optimisticallySendMessage } from "@convex-dev/agent/react";

const sendMessage = useMutation(
  api.chatStreaming.streamStoryAsynchronously,
).withOptimisticUpdate(
  (store, args) => {
    optimisticallySendMessage(api.chatStreaming.listThreadMessages)(store, {
      threadId:
      prompt: /* change your args into the user prompt. */,
    })
  }
);

Saving messages manually

By default, the Agent will save messages to the database automatically when you provide them as a prompt, as well as all generated messages.

You can save messages to the database manually using saveMessage or saveMessages.

const { messageId } = await agent.saveMessage(ctx, {
  threadId,
  userId,
  prompt,
  metadata,
});

You can pass a prompt or a full message (CoreMessage type)

const { lastMessageId, messageIds} = await agent.saveMessages(ctx, {
  threadId, userId,
  messages: [{ role, content }],
  metadata: [{ reasoning, usage, ... }] // See MessageWithMetadata type
});

If you are saving the message in a mutation and you have a text embedding model set, pass skipEmbeddings: true. The embeddings for the message will be generated lazily if the message is used as a prompt. Or you can provide an embedding upfront if it's available, or later explicitly generate them using agent.generateEmbeddings.

The metadata argument is optional and allows you to provide more details, such as sources, reasoningDetails, usage, warnings, error, etc.
Configuring the storage of messages

Generally the defaults are fine, but if you want to pass in multiple messages and have them all saved (vs. just the last one), or avoid saving any input or output messages, you can pass in a storageOptions object, either to the Agent constructor or per-message.

The use-case for passing in multiple messages but not saving them is if you want to include some extra messages for context to the LLM, but only the last message is the user's actual request. e.g. messages = [...messagesFromRag, messageFromUser]. The default is to save the prompt and all output messages.

const result = await thread.generateText({ messages }, {
  storageOptions: {
    saveMessages: "all" | "none" | "promptAndOutput";
  },
});

Message ordering

Each message has order and stepOrder fields, which are incrementing integers specific to a thread.

When saveMessage or generateText is called, the message is added to the thread's next order with a stepOrder of 0.

As response message(s) are generated in response to that message, they are added at the same order with the next stepOrder.

To associate a response message with a previous message, you can pass in the promptMessageId to generateText and others.

Note: if the promptMessageId is not the latest message in the thread, the context for the message generation will not include any messages following the promptMessageId.
Deleting messages

You can delete messages by their _id (returned from saveMessage or generateText) or order / stepOrder.

By ID:

await agent.deleteMessage(ctx, { messageId });
// batch delete
await agent.deleteMessages(ctx, { messageIds });

By order (start is inclusive, end is exclusive):

// Delete all messages with the same order as a given message:
await agent.deleteMessageRange(ctx, {
  threadId,
  startOrder: message.order,
  endOrder: message.order + 1,
});
// Delete all messages with order 1 or 2.
await agent.deleteMessageRange(ctx, { threadId, startOrder: 1, endOrder: 3 });
// Delete all messages with order 1 and stepOrder 2-4
await agent.deleteMessageRange(ctx, {
  threadId,
  startOrder: 1,
  startStepOrder: 2,
  endOrder: 2,
  endStepOrder: 5,
});

Other utilities:

import { ... } from "@convex-dev/agent";

    serializeDataOrUrl is a utility function that serializes an AI SDK DataContent or URL to a Convex-serializable format.
    filterOutOrphanedToolMessages is a utility function that filters out tool call messages that don't have a corresponding tool result message.
    extractText is a utility function that extracts text from a CoreMessage-like object.

Validators and types

There are types to validate and provide types for various values

import { ... } from "@convex-dev/agent";

    vMessage is a validator for a CoreMessage-like object (with a role and content field e.g.).
    MessageDoc and vMessageDoc are the types for a message (which includes a .message field with the vMessage type).
    Thread is the type of a thread returned from continueThread or createThread.
    ThreadDoc and vThreadDoc are the types for thread metadata.
    AgentComponent is the type of the installed component (e.g. components.agent).
    ToolCtx is the ctx type for calls to createTool tools.

https://docs.convex.dev/agents/tools:
Tools

The Agent component supports tool calls, which are a way to allow an LLM to call out to external services or functions. This can be useful for:

    Retrieving data from the database
    Writing or updating data in the database
    Searching the web for more context
    Calling an external API
    Requesting that a user takes an action before proceeding (human-in-the-loop)

Defining tools

You can provide tools at different times:

    Agent constructor: (new Agent(components.agent, { tools: {...} }))
    Creating a thread: createThread(ctx, { tools: {...} })
    Continuing a thread: continueThread(ctx, { tools: {...} })
    On thread functions: thread.generateText({ tools: {...} })
    Outside of a thread: supportAgent.generateText(ctx, {}, { tools: {...} })

Specifying tools at each layer will overwrite the defaults. The tools will be args.tools ?? thread.tools ?? agent.options.tools. This allows you to create tools in a context that is convenient.
Creating a tool with a Convex context

There are two ways to create a tool that has access to the Convex context.

    Use the createTool function, which is a wrapper around the AI SDK's tool function.

export const ideaSearch = createTool({
  description: "Search for ideas in the database",
  args: z.object({ query: z.string().describe("The query to search for") }),
  handler: async (ctx, args, options): Promise<Array<Idea>> => {
    // ctx has agent, userId, threadId, messageId
    // as well as ActionCtx properties like auth, storage, runMutation, and runAction
    const ideas = await ctx.runQuery(api.ideas.searchIdeas, {
      query: args.query,
    });
    console.log("found ideas", ideas);
    return ideas;
  },
});

    Define tools at runtime in a context with the variables you want to use.

async function createTool(ctx: ActionCtx, teamId: Id<"teams">) {
  const myTool = tool({
    description: "My tool",
    parameters: z.object({...}).describe("The arguments for the tool"),
    execute: async (args, options) => {
      return await ctx.runQuery(internal.foo.bar, args);
    },
  });
}

In both cases, the args and options match the underlying AI SDK's tool function.

Note: it's highly recommended to use zod with .describe to provide details about each parameter. This will be used to provide a description of the tool to the LLM.
Using tools

The Agent component will automatically handle tool calls if you pass maxSteps to the generateText or streamText functions.

The tool call and result will be stored as messages in the thread associated with the source message. See Messages for more details.