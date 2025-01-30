# n8n-nodes-bit-discord

This node utilizes a Discord bot to transmit or receive data from child processes when a node is executed. This node is an extension on `n8n-nodes-discord-trigger`, it provides a node with readonly bindings to all available [discord.js events](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class).


## Usage

To use this node:
1. Install it as a community node in your n8n instance.
2. Configure the required credentials.
3. Set up triggers for Discord messages based on your use case.

For more help on setting up n8n workflows, check the [Try it out documentation](https://docs.n8n.io/try-it-out/).

## Credentials
To send, listen to messages, or fetch the list of channels or roles, you need to set up a bot using the [Discord Developer Portal](https://discord.com/developers/applications).

1. Create a new application and set it up as a bot.
2. Enable the **Privileged Gateway Intents** for Message Intent.
3. Add the bot to your server with at least **read channel permissions**.

### Required Fields
You need to authenticate the node with the following credentials:
- **Client ID**: The OAuth2 client ID of the Discord App.
- **Bot Token**: The bot token of the Discord App.
- **n8n API Key**: The API key of your n8n server.
- **Base URL**: The API URL of your n8n instance (e.g., `https://n8n.example.com/api/v1`).

For more detailed information on how to set up and use Discord bots, refer to the [discord.js guide](https://discordjs.guide/).

## Events
With this node, you can listen to all types of events that are supported by [discord.js](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class).

Events List:
* [applicationCommandPermissionsUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#applicationCommandPermissionsUpdate)
* [autoModerationActionExecution](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#autoModerationActionExecution)
* [autoModerationRuleCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#autoModerationRuleCreate)
* [autoModerationRuleDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#autoModerationRuleDelete)
* [autoModerationRuleUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#autoModerationRuleUpdate)
* [channelCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#channelCreate)
* [channelDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#channelDelete)
* [channelPinsUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#channelPinsUpdate)
* [channelUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#channelUpdate)
* [debug](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#debug)
* [emojiCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#emojiCreate)
* [emojiDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#emojiDelete)
* [emojiUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#emojiUpdate)
* [entitlementCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#entitlementCreate)
* [entitlementDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#entitlementDelete)
* [entitlementUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#entitlementUpdate)
* [error](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#error)
* [guildAuditLogEntryCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildAuditLogEntryCreate)
* [guildAvailable](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildAvailable)
* [guildBanAdd](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildBanAdd)
* [guildBanRemove](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildBanRemove)
* [guildCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildCreate)
* [guildDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildDelete)
* [guildIntegrationsUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildIntegrationsUpdate)
* [guildMemberAdd](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildMemberAdd)
* [guildMemberAvailable](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildMemberAvailable)
* [guildMemberRemove](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildMemberRemove)
* [guildMembersChunk](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildMembersChunk)
* [guildMemberUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildMemberUpdate)
* [guildScheduledEventCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildScheduledEventCreate)
* [guildScheduledEventDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildScheduledEventDelete)
* [guildScheduledEventUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildScheduledEventUpdate)
* [guildScheduledEventUserAdd](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildScheduledEventUserAdd)
* [guildScheduledEventUserRemove](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildScheduledEventUserRemove)
* [guildUnavailable](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildUnavailable)
* [guildUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#guildUpdate)
* [interactionCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#interactionCreate)
* [inviteCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#inviteCreate)
* [inviteDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#inviteDelete)
* [messageCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageCreate)
* [messageDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageDelete)
* [messageDeleteBulk](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageDeleteBulk)
* [messagePollVoteAdd](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messagePollVoteAdd)
* [messagePollVoteRemove](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messagePollVoteRemove)
* [messageReactionAdd](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageReactionAdd)
* [messageReactionRemove](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageReactionRemove)
* [messageReactionRemoveAll](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageReactionRemoveAll)
* [messageReactionRemoveEmoji](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageReactionRemoveEmoji)
* [messageUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#messageUpdate)
* [presenceUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#presenceUpdate)
* [ready](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#ready)
* [roleCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#roleCreate)
* [roleDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#roleDelete)
* [roleUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#roleUpdate)
* [shardDisconnect](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#shardDisconnect)
* [shardError](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#shardError)
* [shardReady](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#shardReady)
* [shardReconnecting](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#shardReconnecting)
* [shardResume](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#shardResume)
* [stageInstanceCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stageInstanceCreate)
* [stageInstanceDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stageInstanceDelete)
* [stageInstanceUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stageInstanceUpdate)
* [stickerCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stickerCreate)
* [stickerDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stickerDelete)
* [stickerUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#stickerUpdate)
* [subscriptionCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#subscriptionCreate)
* [subscriptionDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#subscriptionDelete)
* [subscriptionUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#subscriptionUpdate)
* [threadCreate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadCreate)
* [threadDelete](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadDelete)
* [threadListSync](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadListSync)
* [threadMembersUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadMembersUpdate)
* [threadMemberUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadMemberUpdate)
* [threadUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#threadUpdate)
* [typingStart](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#typingStart)
* [userUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#userUpdate)
* [voiceChannelEffectSend](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#voiceChannelEffectSend)
* [voiceStateUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#voiceStateUpdate)
* [warn](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#warn)
* [webhooksUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#webhooksUpdate)
* [webhookUpdate](https://discord.js.org/docs/packages/discord.js/14.17.3/Client:Class#webhookUpdate)

## TODO's
* Refactor the entire codebase to be more modular and easily expandable.
* Dynamic Credentials.
 