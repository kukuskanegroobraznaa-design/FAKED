const { findByProps } = require("@vendetta/metro");
const { registerCommand } = require("@vendetta/commands");

const MessagesWrapper = findByProps("sendMessage", "receiveMessage");

let cmdUnregister;

function injectFakeMessage(channelId, author, content) {
  const fakeMessage = {
    id: String(Date.now()),
    channel_id: channelId,
    author: {
      id: "000000000000000000",
      username: author,
      discriminator: "0000",
      avatar: null,
      bot: false,
    },
    content: content,
    timestamp: new Date().toISOString(),
    edited_timestamp: null,
    attachments: [],
    embeds: [],
    mentions: [],
    mention_roles: [],
    pinned: false,
    mention_everyone: false,
    tts: false,
    type: 0,
  };

  MessagesWrapper.receiveMessage(channelId, fakeMessage);
}

module.exports.onLoad = () => {
  cmdUnregister = registerCommand({
    name: "fakemsg",
    displayName: "fakemsg",
    description: "Inject a fake local-only message",
    displayDescription: "Inject a fake local-only message",
    options: [
      { name: "author", description: "Fake username", type: 3, required: true },
      { name: "message", description: "Fake message content", type: 3, required: true },
    ],
    execute: (args, ctx) => {
      const author = args.find((a) => a.name === "author")?.value ?? "Someone";
      const content = args.find((a) => a.name === "message")?.value ?? "";
      injectFakeMessage(ctx.channel.id, author, content);
      return { content: "" };
    },
  });
};

module.exports.onUnload = () => {
  cmdUnregister?.();
};
