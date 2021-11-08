from .battlefield import Battlefield


class Player:

    def __init__(self, name):
        self.battlefield = Battlefield()
        self.name = name
