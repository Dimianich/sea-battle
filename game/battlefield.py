import random

from .ship import Ship
from .shot import Shot


class Battlefield:

    def __init__(self):
        self.ships = []
        self.shots = []
        self.ships_coord = []
        self.random_set_ships()

    def random_set_ships(self):
        matrix = self.init_matrix()
        for size in range(4, 0, -1):
            for n in range(0, 5-size):
                direction = random.choice(["row", "column"])
                ship = Ship(0, 0, size, direction)
                placed = False                

                while not placed:
                    placed = True
                    ship.coordinates = []
                    ship.x = random.randint(0, 9)
                    ship.y = random.randint(0, 9)
                    dx = 1 if ship.direction == "row" else 0
                    dy = 1 if ship.direction == "column" else 0

                    for i in range(0, ship.size):
                        cx = ship.x + dx * i
                        cy = ship.y + dy * i

                        if not (0 <= cx and cx < 10 and 0 <= cy and cy < 10):
                            placed = False
                            break

                        if not matrix[cy][cx]:
                            placed = False
                            break
                    
                        ship.coordinates.append({"x": cx, "y": cy})

                matrix = self.set_matrix(matrix, ship)
                self.ships.append(ship.toDict())               
                self.ships_coord.extend(ship.coordinates)

    def init_matrix(self):
        matrix = []
        for y in range(0, 10):
            row = []
            for x in range(0, 10):
                cell = True
                row.append(cell)
            matrix.append(row)
        return matrix

    def set_matrix(self, matrix, ship):
        dx = 1 if ship.direction == "row" else 0
        dy = 1 if ship.direction == "column" else 0

        for i in range(0, ship.size):
            cx = ship.x + dx * i
            cy = ship.y + dy * i
            matrix[cy][cx] = False

        for y in range(ship.y - 1, ship.y + ship.size * dy + dx + 1):
            for x in range(ship.x - 1, ship.x + ship.size * dx + dy + 1):
                if 0 <= x and x < 10 and 0 <= y and y < 10:
                    matrix[y][x] = False

        return matrix

    def add_shot(self, x, y):                                
        new_shot = Shot(x, y, "missed")
        for shot in self.shots:
            if shot["x"] == x and shot["y"] == y:
                return False
        for coord in self.ships_coord:                        
            if coord["x"] == x and coord["y"] == y:                
                new_shot.variant = "wounded"
                self.ships_coord.remove(coord)
                self.shots.append(new_shot.toDict())
                self.is_killed()
                return True
        self.shots.append(new_shot.toDict())
        return False

    def is_killed(self):                        
        for ship in self.ships:
            wounded = []
            health = ship["size"]
            for shot in self.shots:
                if shot["variant"] == "wounded":
                    for coord in ship["coordinates"]:                
                        if shot["x"] == coord["x"] and shot["y"] == coord["y"]:
                            health -= 1
                            wounded.append(self.shots.index(shot))
            if health == 0:
                for i in wounded:
                   self.shots[i]["variant"] = "killed" 
             



