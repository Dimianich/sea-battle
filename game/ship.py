
class Ship:

    def __init__(self, x, y, size, direction):
        self.x = x
        self.y = y
        self.size = size
        self.direction = direction
        self.coordinates = []

    def toDict(self):
        return self.__dict__
