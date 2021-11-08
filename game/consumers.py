from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .game import create_party, get_party, add_player, init_party, remove_player
from .player import Player


class GameConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.party = None

    async def connect(self):
        await self.accept()

    async def disconnect(self, code):
        remove_player(self.channel_name)

    async def receive_json(self, content):
        if content["event"] == "finding":
            self.party = get_party(content["party_id"])
            if self.party == None:
                add_player(self.channel_name)
                self.party = init_party(self.channel_name)
                if self.party:
                    await self.channel_layer.send(self.party.get_opponent(self.channel_name).name, {
                        "type": "player.handshake",
                        "party_id": self.party.id,
                    })
                    await self.send_json(content={
                        "event": "connectOpponent",
                        "party_id": self.party.id,
                        "name": self.channel_name
                    })
            else:
                player = self.party.get_player(content["name"])
                player.name = self.channel_name
                await self.send_json(content={
                    "event": "connectOpponent",
                    "party_id": self.party.id,
                    "name": player.name
                })

        if content["event"] == "play":
            await self.send_json(content={
                "event": "play",
                "turn": self.party.is_turn(self.channel_name),
                "ships": self.party.get_ships(self.channel_name),
                "player_shots": self.party.get_opponent(self.channel_name).battlefield.shots,
                "opponent_shots": self.party.get_player(self.channel_name).battlefield.shots,
                "messages": self.party.chat
            })

        if content["event"] == "shot":
            if self.party.is_turn(self.channel_name):
                if not self.party.shoot(int(content["x"]), int(content["y"]), self.channel_name):
                    self.party.change_turn()
                await self.channel_layer.send(self.party.get_opponent(self.channel_name).name, {
                    "type": "player.shot",
                })
                await self.send_json(content={
                    "event": "player_shot",
                    "shots": self.party.get_opponent(self.channel_name).battlefield.shots,
                    "turn": self.party.is_turn(self.channel_name)
                })
                if self.party.game_over(self.channel_name):
                    await self.channel_layer.send(self.party.get_opponent(self.channel_name).name, {
                        "type": "player.win",
                    })
                    await self.send_json(content={
                        "event": "game_over",
                        "status": "winner"
                    })

        if content["event"] == "gaveup":
            await self.channel_layer.send(self.party.get_opponent(self.channel_name).name, {
                "type": "player.lose",
            })
            await self.send_json(content={
                "event": "game_over",
                "status": "loser"
            })

        if content["event"] == "chat_message":
            self.party.chat.append(content["message"])
            await self.channel_layer.send(self.party.get_opponent(self.channel_name).name, {
                "type": "chat.message",
            })
            await self.send_json(content={
                "event": "chat_message",
                "messages": self.party.chat
            })

    async def player_handshake(self, event):
        self.party = get_party(event["party_id"])
        await self.send_json(content={
            "event": "connectOpponent",
            "party_id": self.party.id,
            "name": self.channel_name
        })

    async def player_shot(self, event):
        await self.send_json(content={
            "event": "opponent_shot",
            "shots": self.party.get_player(self.channel_name).battlefield.shots,
            "turn": self.party.is_turn(self.channel_name)
        })

    async def player_win(self, event):
        await self.send_json(content={
            "event": "game_over",
            "status": "loser"
        })

    async def player_lose(self, event):
        await self.send_json(content={
            "event": "game_over",
            "status": "winner"
        })

    async def chat_message(self, event):
        await self.send_json(content={
            "event": "chat_message",
            "messages": self.party.chat
        })
