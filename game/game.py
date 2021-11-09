import random

from .party import Party
from .player import Player

parties = []
waiting_players = []


def create_party(player1, player2):
    new_party = Party(player1, player2)
    parties.append(new_party)
    return new_party


def get_party(id):
    for party in parties:
        if party.id == id:
            return party
    return None


def add_player(name):
    waiting_players.append(name)


def remove_player(name):
    if player in waiting_players:        
            waiting_players.remove(player)


def init_party(name):
    if len(waiting_players) > 1:
        player1 = Player(name)
        waiting_players.remove(name)
        player2_name = waiting_players[random.randint(
            0, len(waiting_players) - 1)]
        player2 = Player(player2_name)
        waiting_players.remove(player2_name)
        return create_party(player1, player2)
    return None
