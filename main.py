@namespace
class SpriteKind:
    buy = SpriteKind.create()
    collider = SpriteKind.create()
# bh2
    upgrade_click = SpriteKind.create()
# /bh2

# variables
pizza_per_click = 1
pizza_per_second = 0
mouse_x = 0
mouse_y = 0
# bh5
buttons_to_reset: List[Sprite] = []
# /bh5
store_items: List[str] = [
    "NEW TOPPINGS",
    "MORE OVENS",
    "MORE WAITERS",
    "MORE CHEFS",
# bh4
    "MORE RESTAURANTS"
# /bh4
]
starting_cost = [
    10,
    100,
    1000,
    10000,
# bh4
    100000
# /bh4
]
passive_increase_values = [1, 2, 5, 10, 20] # bh4

# sprites
pizza_button = sprites.create(assets.image("pizza"), SpriteKind.player)
pizza_button.x = 143
pizza_per_second_sprite = textsprite.create(str(pizza_per_second), 3, 1)
pizza_per_second_sprite.set_border(2, 3)
pizza_per_second_sprite.y = 20
pizza_per_second_sprite.right = 162
# bh2
click_upgrade_button = sprites.create(assets.image("upgrade"), SpriteKind.upgrade_click)
click_upgrade_button.scale = 2
click_upgrade_button.set_position(143, 90)
sprites.set_data_number(click_upgrade_button, "cost", 100)
# /bh2

# setup
info.set_score(0)
scene.set_background_color(1)

# bh2
def make_click_upgrade_cost_display():
    if sprites.read_data_sprite(click_upgrade_button, "cost_display"):
        sprites.read_data_sprite(click_upgrade_button, "cost_display").destroy()
    cost = sprites.read_data_number(click_upgrade_button, "cost")
    click_upgrade_cost_display = textsprite.create(str(cost), 5, 2)
    click_upgrade_cost_display.set_position(143, 110)
make_click_upgrade_cost_display()
# /bh2

def make_quantity_display(button: Sprite):
    quantity = sprites.read_data_number(button, "quantity")
    quantity_text = textsprite.create(str(quantity), 5, 2)
    quantity_text.y = button.y + 10
    quantity_text.left = 5
    return quantity_text

def make_cost_display(button: Sprite):
    cost = sprites.read_data_number(button, "cost")
    cost_text = textsprite.create(str(cost), 5, 2)
    cost_text.y = button.y + 10
    cost_text.right = 80
    return cost_text

def setup_buttons():
    y = 10
    for i in range(len(store_items)):
        buy_button = textsprite.create(store_items[i], 5, 2)
        buy_button.set_kind(SpriteKind.buy)
        buy_button.set_flag(SpriteFlag.GHOST, False)
        buy_button.y = y
        buy_button.left = 5
        sprites.set_data_number(buy_button, "quantity", 0)
        sprites.set_data_number(buy_button, "cost", starting_cost[i])
        sprites.set_data_number(buy_button, "passive_increase_values", passive_increase_values[i])
        sprites.set_data_sprite(buy_button, "quantity_text", make_quantity_display(buy_button))
        sprites.set_data_sprite(buy_button, "cost_text", make_cost_display(buy_button))
        y += 20
setup_buttons()

def reigster_input(x, y):
    collider = sprites.create(image.create(2, 2), SpriteKind.collider)
    collider.set_position(x, y)
    collider.image.fill(1)
    collider.lifespan = 500
    collider.set_flag(SpriteFlag.INVISIBLE, True)
browserEvents.mouse_left.on_event(browserEvents.MouseButtonEvent.PRESSED, reigster_input)

# bh3
def animate_click(collider: Sprite):
    pizza = sprites.create(assets.image("pizza"))
    pizza.scale = 0.25
    pizza.set_position(collider.x + 5, collider.y)
    pizza.set_velocity(randint(-15, 15), -15)
    pizza.ay = 50
    pizza.lifespan = 1000
    increase = textsprite.create(str(pizza_per_click), 0, 15)
    increase.set_position(collider.x + randint(-8, 8), collider.y)
    increase.vy = -5
    increase.lifespan = 2000
# /bh3

# bh5
def mouse_over_button():
    temp_collider = sprites.create(image.create(1, 1))
    temp_collider.image.fill(1)
    temp_collider.set_position(mouse_x, mouse_y)
    if temp_collider.overlaps_with(pizza_button):
        pizza_button.scale = 1.1
        if not browserEvents.mouse_left.is_pressed():
            pizza_button.scale = 0.9
    else:
        pizza_button.scale = 1
    temp_collider.destroy()

def setup_mouse_over_loop():
    game.on_update(mouse_over_button)
timer.background(setup_mouse_over_loop)
# /bh5

def click_pizza(collider, pizza):
# bh3
    animate_click(collider)
# /bh3
    info.change_score_by(pizza_per_click)
    collider.destroy()
sprites.on_overlap(SpriteKind.collider, SpriteKind.player, click_pizza)

def buy_more(collider, button):
    global pizza_per_second
    cost = sprites.read_data_number(button, "cost")
    if cost > info.score():
        music.buzzer.play()
    else:
        music.ba_ding.play()
        info.change_score_by(-cost)
        sprites.change_data_number_by(button, "quantity", 1)
        sprites.read_data_sprite(button, "quantity_text").destroy()
        sprites.set_data_sprite(button, "quantity_text", make_quantity_display(button))
        sprites.change_data_number_by(button, "cost", (cost // 10) + 1)
        sprites.read_data_sprite(button, "cost_text").destroy()
        sprites.set_data_sprite(button, "cost_text", make_cost_display(button))
        pizza_per_second += sprites.read_data_number(button, "passive_increase_values")
        pizza_per_second_sprite.set_text(str(pizza_per_second))
        pizza_per_second_sprite.right = 162
    collider.destroy()
sprites.on_overlap(SpriteKind.collider, SpriteKind.buy, buy_more)

# bh2
def upgrade_click(collider, button):
    global pizza_per_click
    cost = sprites.read_data_number(button, "cost")
    if cost > info.score():
        music.buzzer.play()
    else:
        pizza_per_click *= 2
        sprites.set_data_number(button, "cost", cost * 10)
        make_click_upgrade_cost_display()
    collider.destroy()
sprites.on_overlap(SpriteKind.collider, SpriteKind.upgrade_click, upgrade_click)
# /bh2

def mouse_move(x, y):
    global mouse_x, mouse_y
    mouse_x = x
    mouse_y = y
browserEvents.on_mouse_move(mouse_move)

def passive_loop():
    info.change_score_by(pizza_per_second)
game.on_update_interval(1000, passive_loop)

# bh1
def falling_pizza():
    pizzas_to_spawn = Math.ceil(pizza_per_second / 1000)
    pizzas_to_spawn = Math.constrain(pizzas_to_spawn, 0, 50)
    for i in range(pizzas_to_spawn):
        pizza = sprites.create(assets.image("pizza"), SpriteKind.projectile)
        pizza.scale = 0.25
        pizza.bottom = 1
        pizza.x = randint(6, 154)
        pizza.z = -100
        pizza.vy = 5
        pizza.set_flag(SpriteFlag.AUTO_DESTROY, True)
game.on_update_interval(2000, falling_pizza)
# /bh1


# bh3 animate click
# bh1 pizza falling
# bh2 upgrade per click - could be the guided
# db? if not show how much a click is worth

# bh4 more things you can buy
# bh5 button affordance - the clicking is funky
# upgrade a type of thing you've bought
# achievements

# random star that flies in

