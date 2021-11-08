
class Shot:

    def __init__(self, x, y, variant):
        self.x = x
        self.y = y
        self.variant = variant

    def toDict(self):
        return self.__dict__
