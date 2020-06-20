import discord
import json
from termcolor import colored
import sys

with open("config.json") as fl:
    config = json.load(fl)

client = discord.Client()
exclude = config["exclude"]

@client.event
async def on_ready():
    print('logged in as {0.user}'.format(client))

    messages = {}

    guild = client.get_guild(config["server-id"])
    print(colored("Operating on server: "+guild.name, "cyan"))

    channels = guild.text_channels
    
    for username in config["users"]:
        print(colored("Initializing messages for user: "+username, "blue"))
        messages[username] = []

    for channel in channels:
        print(colored("\t#"+channel.name, "yellow"), end="...")
        sys.stdout.flush()
        if channel.name in exclude:
            print(colored("excluded", "red"))
            continue

        try:
            async for message in channel.history(limit=config["limit"]):
                for username in config["users"]:
                    if message.author.name == username:
                        messages[username].append(message.clean_content)
            print(colored("success", "green"))
        except discord.errors.Forbidden:
            print(colored("cannot read message history", "red"))
    
    for username in config["users"]:
        print(colored("Found "+str(len(messages[username]))+" total messages for "+username, "blue"))
    with open("messages.json", "w") as fl:
        json.dump({"messages": messages}, fl)
    print("done")

   

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')

client.run(config["discord-token"])