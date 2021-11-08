import random
import uuid


class Party:

    def __init__(self, player1, player2):
        self.player1 = player1
        self.player2 = player2
        self.id = uuid.uuid4().hex[:6].upper()
        self.turn = random.choice(["player1", "player2"])
        self.chat = []

    def change_turn(self):
        if self.turn == "player1":
            self.turn = "player2"
        else:
            self.turn = "player1"

    def is_turn(self, name):
        if self.player1.name == name and self.turn == "player1":
            return True
        if self.player2.name == name and self.turn == "player2":
            return True
        return False

    def get_player(self, name):
        if self.player1.name == name:
            return self.player1
        return self.player2

    def get_opponent(self, name):
        if self.get_player(name).name == self.player1.name:
            return self.player2
        return self.player1

    def get_ships(self, name):
        return self.get_player(name).battlefield.ships

    def shoot(self, x, y, name):
        return self.get_opponent(name).battlefield.add_shot(x, y)

    def game_over(self, name):
        if len(self.get_opponent(name).battlefield.ships_coord) == 0:
            return True
        return False
